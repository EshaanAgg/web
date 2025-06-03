---
title: "Write Your Own"
description: Snippets for common implementation of standard library classes & templates that are frequently asked in interviews.
pubDate: 2024-12-01
updatedDate: 2025-06-01
requireLatex: true
pinned: true
draft: false
tags: ["placements", "2024", "cpp"]
series:
  name: "placements"
  part: 3
---

This is a collection of common C++ classes and templates that we often use, and thus are perfect opportunities for interviewers to quiz on to see if the candidate is comfortable with the language, can write clean code, and is aware about the internals of the language.

<details>
<summary><b>Table of Contents</b></summary>
  
- [Smart Pointers](#smart-pointers)
  - [General Smart Pointer](#general-smart-pointer)
  - [Unique Pointer](#unique-pointer)
  - [Shared Pointer](#shared-pointer)
- [Hit Counter](#hit-counter)
  - [Base Variant](#base-variant)
  - [Unordered Timestamps](#unordered-timestamps)
  - [Concurrent Hit Counter](#concurrent-hit-counter)
  - [Infinite Timestamps in the Past](#infinite-timestamps-in-the-past)
- [Singleton Design Pattern](#singleton-design-pattern)
- [Vector](#vector)
- [Thread Pool Manager](#thread-pool-manager)
- [Versioned Queue](#versioned-queue)
  - [Requirements](#requirements)
  - [Solution](#solution)
- [Mutex](#mutex)
- [Semaphore](#semaphore)
  - [With Condition Variables](#with-condition-variables)
  - [Without Condition Variables](#without-condition-variables)
- [Producer Consumer Problem](#producer-consumer-problem)
  - [Without Condition Variables](#without-condition-variables-1)
  - [With Condition Variables](#with-condition-variables-1)
- [Reader \& Writer Problem](#reader--writer-problem)
  - [Without Condition Variables](#without-condition-variables-2)
  - [With Condition Variables](#with-condition-variables-2)
- [Dining Philosophers Problem](#dining-philosophers-problem)
  - [Naive Solution (Prone to Deadlock)](#naive-solution-prone-to-deadlock)
  - [Use Ordering](#use-ordering)
  - [Use a Semaphore to Limit Access](#use-a-semaphore-to-limit-access)
  - [Condition Variable to Avoid Starvation](#condition-variable-to-avoid-starvation)
- [Barbershop Problem](#barbershop-problem)
- [The Smoking Cigarettes Problem](#the-smoking-cigarettes-problem)
  - [Problem History](#problem-history)
  - [Solution](#solution-1)
- [Template Metaprogramming](#template-metaprogramming)
  - [GCD](#gcd)
  - [Array Dimensions](#array-dimensions)
  - [Remove Adjacent Duplicates](#remove-adjacent-duplicates)

</details>

---

# Smart Pointers

## General Smart Pointer

This is the general implementation of a smart pointer that manages the memory of the pointer. The smart pointer is a class that wraps a raw pointer and manages the memory of the raw pointer. The smart pointer is responsible for deleting the memory when the object goes out of scope. The smart pointer is an application of the RAII (Resource Acquisition Is Initialization) idiom, where the resource is acquired in the constructor and released in the destructor.

```cpp showLineNumbers
template <typename T>
class AutoPtr {
    T *ptr;

    AutoPtr(T *ptr = nullptr) : ptr(ptr) {}
    ~AutoPtr() {
      delete ptr;
    }

    // Copy constructor [Moves the pointer to self]
    AutoPtr(AutoPtr &other) {
      ptr = other.ptr;
      other.ptr = nullptr;
    }

    // Copy assignment operator [Moves the pointer to self]
    AutoPtr& operator=(AutoPtr &other) {
      if (this == &other)
        return *this;

      delete ptr; // Free any existing resource
      ptr = other.ptr;
      other.ptr = nullptr;
    }

    // Overloading the operators for convinience
    T& operator*() const { return *ptr; }
    T* operator->() const { return ptr; }

}
```

While this class is a good starting point, it has some limitations:

- When passed to function by value, the pointer is moved to the function and the memory would be freed when the function returns. Thus in the original function, this can lead to a dangling pointer.
- This deletes using the non-array `delete` operator, and thus if the pointer was allocated using `new[]`, it would lead to undefined behaviour.

Because of many more such reasons, the `AutoPtr` class was first introduced in `C++98`, but was later deprecated in `C++11`. It was replaced by `std::unique_ptr`, `std::shared_ptr`, and `std::weak_ptr`, which implement the move semantics and the copy semantics in a more robust way.

## Unique Pointer

A `std::unique_ptr` is a smart pointer that owns and manages another object through a pointer and disposes of that object when the `std::unique_ptr` goes out of scope. The `std::unique_ptr` is unique in the sense that it cannot be copied or assigned to another `std::unique_ptr`, and thus there is only one owner of the object (the owner can be transferred using the move semantics).

```cpp showLineNumbers
template <typename T>
class UniquePointer
{
  T *ptr;

public:
  UniquePointer(T *ptr = nullptr) : ptr(ptr) {}

  ~UniquePointer() { delete ptr; }

  // Disable the copy constructor and copy assignment
  UniquePointer(const UniquePointer &other) = delete;
  UniquePointer &operator=(const UniquePointer &other) = delete;

  UniquePointer(UniquePointer &&other)
  {
    ptr = other.ptr;
    other.ptr = nullptr;
  }

  UniquePointer &operator=(UniquePointer &&other)
  {
    if (this == other)
      return *this;

    ptr = other.ptr;
    other.ptr = nullptr;
  }

  // Overload operators
  T &operator*() const { return *ptr; }
  T *operator->() const { return ptr; }
};

int main()
{
  UniquePointer<int> uptr(new int(42));
  cout << "Value: " << *uptr << "\n"; // Should print 42

  UniquePointer<int> uptr2 = std::move(uptr);
  cout << "Value after move: " << *uptr2 << "\n"; // Should print 42

  return 0;
}
```

## Shared Pointer

A `std::shared_ptr` is a smart pointer that retains shared ownership of an object through a pointer. Several `std::shared_ptr` objects may own the same object. The object is destroyed and its memory deallocated when all `std::shared_ptr` objects that own it are destroyed or reset. The `std::shared_ptr` uses a reference count to keep track of the number of `std::shared_ptr` objects that own the object.

```cpp showLineNumbers
#include <iostream>

template <typename T>
class SharedPointer
{
  T *ptr;
  int *refCount;

  void _clean()
  {
    if (refCount == nullptr)
      return;

    if (--(*refCount) == 0)
    {
      delete ptr;
      delete refCount;
    }
  }

public:
  SharedPointer(T *p = nullptr) : ptr(p)
  {
    if (p == nullptr)
      refCount = nullptr;
    else
      // Initialize reference count to 1 if pointer is not null
      refCount = new int(1);
  }

  ~SharedPointer() { _clean(); }

  // Copy constructor
  SharedPointer(const SharedPointer &other)
  {
    ptr = other.ptr;
    refCount = other.refCount;
    if (refCount)
      ++(*refCount);
  }

  // Copy assignment operator
  SharedPointer &operator=(const SharedPointer &other)
  {
    if (this == &other)
      return *this;

    _clean();

    ptr = other.ptr;
    refCount = other.refCount;
    if (refCount)
      ++(*refCount);

    return *this;
  }

  // Move constructor
  SharedPointer(SharedPointer &&other) noexcept
  {
    ptr = other.ptr;
    refCount = other.refCount;

    other.ptr = nullptr;
    other.refCount = nullptr;
  }

  // Move assignment operator
  SharedPointer &operator=(SharedPointer &&other) noexcept
  {
    if (this == &other)
      return *this;

    _clean();

    ptr = other.ptr;
    refCount = other.refCount;

    other.ptr = nullptr;
    other.refCount = nullptr;

    return *this;
  }

  // Dereference operators
  T &operator*() const { return *ptr; }
  T *operator->() const { return ptr; }

  int use_count() const { return refCount ? *refCount : 0; }
  T *get() const { return ptr; }
};


int main()
{
  SharedPointer<int> sp1(new int(42));
  cout << "Value: " << *sp1 << ", Use count: " << sp1.use_count() << "\n";

  SharedPointer<int> sp2 = sp1;
  cout << "Value after copy: " << *sp2 << ", Use count: " << sp2.use_count() << "\n";

  SharedPointer<int> sp3 = std::move(sp2);
  cout << "Value after move: " << *sp3 << ", Use count: " << sp3.use_count() << "\n";

  return 0;
}
```

---

# Hit Counter

## Base Variant

You need to implement a `HitCounter` class that supports the following operations:

- `HitCounter()` Initializes the object of the class.
- `void hit(int timestamp)` Records a hit that happened at the given timestamp.
- `int getHits(int timestamp)` Returns the number of hits in the past 5 minutes.

Each function accepts a `timestamp` parameter (in seconds granularity) and you may assume that calls are being made to the system in chronological order (i.e. the timestamp is monotonically increasing).

```cpp showLineNumbers
class HitCounter {
  // Front of the queue will have the oldest timestamp
  // Monotonically increasing timestamps
  dequeue<pair<int, int>> hits;
  int curCnt;

  const int MAX_TIME = 5 * 60;

  void removeOldHits(int timestamp) {
    while (!hits.empty() && hits.front().first <= timestamp - MAX_TIME) {
      curCnt -= hits.front().second;
      hits.pop_front();
    }
  }

public:
  HitCounter(): curCnt(0) {}

  void hit(int timestamp) {
    removeOldHits(timestamp);
    if (!hits.empty() && hits.back().first == timestamp)
      hits.back().second++;
    else
      hits.push_back({timestamp, 1});
    curCnt++;
  }

  int getHits(int timestamp) {
    removeOldHits(timestamp);
    return curCnt;
  }
};
```

This function uses a `deque` to store the hits, and a `curCnt` to store the total number of hits. The `removeOldHits` function is used to remove the hits that are older than 5 minutes. One salient feature of this implementation is that it does not store the hits for each second, but rather stores the number of hits at each second, and thus this implementation would gracefully handle the case when there are multiple hits at the same second. If the same was not a requirement, we could have used a `queue` instead of a `deque` to store the hits.

- Time Complexity:
  - `hit`: $O(300)$
  - `getHits`: $O(300)$

## Unordered Timestamps

Implement the same interface as above, but now the timestamps are not guaranteed to be in order.

```cpp showLineNumbers
class HitCounter {
  map<int, int> hits;
  const int MAX_TIME = 5 * 60;

public:
  HitCounter() {}

  void hit(int timestamp) {
    hits[timestamp]++;
  }

  int getHits(int timestamp) {
    int cnt = 0;
    for (int time = timestamp - MAX_TIME + 1; time <= timestamp; time++) {
      if (hits.find(time) != hits.end())
        cnt += hits[time];
    }
    return cnt;
  }
};
```

- Time Complexity:

  - `hit`: $O(log(n))$
  - `getHits`: $O(300 \cdot log(n))$

  where $n$ is the number of unique timestamps

## Concurrent Hit Counter

Implement the same interface as above, but now the class needs to be thread-safe. You can assume that the threads would be calling the same in chronological order.

```cpp showLineNumbers
class HitCounter {
  mutex mtx;
  deque<pair<int, int>> hits;
  int curCnt;

  const int MAX_TIME = 5 * 60;

  void removeOldHits(int timestamp) {
    while (!hits.empty() && hits.front().first <= timestamp - MAX_TIME) {
      curCnt -= hits.front().second;
      hits.pop_front();
    }
  }

public:
  HitCounter(): curCnt(0) {}

  void hit(int timestamp) {
    lock_guard<mutex> lock(mtx);

    removeOldHits(timestamp);
    if (!hits.empty() && hits.back().first == timestamp)
      hits.back().second++;
    else
      hits.push_back({timestamp, 1});
    curCnt++;
  }

  int getHits(int timestamp) {
    lock_guard<mutex> lock(mtx);

    removeOldHits(timestamp);
    return curCnt;
  }
};
```

## Infinite Timestamps in the Past

In this variant, we want the hit counter to be able to answer queries of all the time in the past, and the solution should use constant memory. Some inaccuracy is allowed in the answer. To handle the same, we would make use of buckets of size of powers of 2, so that the older buckets store more points and are updated less frequently.

```cpp showLineNumbers
class HitCouter;

class Bucket
{
    int quantum;
    int cnt;
    int lastUpdate;

    friend class HitCouter;

public:
    Bucket(int p)
    {
        quantum = 1 << p;
        cnt = 0;
        lastUpdate = 0;
    }
};

class HitCouter
{
    int MAX_BUCKETS = 12;
    vector<Bucket> buckets;
    int curTime;

    void shiftBuckets(int deltaTime)
    {
        if (!deltaTime)
            return;

        // Last bucket represents liftime hits, and should not be shifted
        for (int i = 0; i < MAX_BUCKETS - 1; i++)
        {
            Bucket &b = buckets[i];
            if (curTime - b.lastUpdate >= b.quantum)
            {
                buckets[i + 1].cnt += b.cnt;
                buckets[i].lastUpdate = curTime;
                buckets[i].cnt = 0;
            }
        }
    }

    void update(int timestamp)
    {
        int deltaTime = timestamp - curTime;
        curTime = timestamp;
        shiftBuckets(deltaTime);
    }

public:
    HitCouter()
    {
        curTime = 0;
        for (int i = 0; i < MAX_BUCKETS; i++)
            buckets.emplace_back(i);
    }

    void hit(int timestamp)
    {
        update(timestamp);
        buckets[0].cnt++;
    }

    int getHits(int timestamp, int prevTime)
    {
        update(timestamp);

        int cnt = 0;
        int idx = 0;
        for (; idx < MAX_BUCKETS; idx++)
        {
            if (prevTime >= buckets[idx].quantum)
                cnt += buckets[idx].cnt;
            else
                break;
        }

        return cnt;
    }
};
```

---

# Singleton Design Pattern

A singleton class is a class such that you can only have one instance of the class. This is useful when you want to have a single instance of a class that is shared across the application. The singleton class is implemented using a static member variable, and a static member function that returns the instance of the class.

Singletons are useful when we want to apply some functionalities to a "global" set of data, but we do not want to pass the object or the data/member functions around. Having the same encapsulated in a singleton class makes it easier to manage and use throughout the application. They can effectively be managed using namespaces as well, but the singleton class provides a more object-oriented approach.

Here are some good examples of a singleton class:

- Logger
- Configuration
- Random Number Generator
- Database Connection

```cpp

class Singleton
{
  int state;

  Singleton() : state(0) {} // Private constructor to prevent instantiation

  // Delete constructors and assignment
  Singleton(const Singleton &other) = delete;
  Singleton(const Singleton &&other) = delete;
  Singleton &operator=(const Singleton &other) = delete;
  Singleton &operator=(const Singleton &&other) = delete;

public:
  static Singleton *getInstance()
  {
    static Singleton instance;
    return &instance;
  }

  int get()
  {
      return state;
  }

  int incr()
  {
      return ++state;
  }
};

int main()
{
  Singleton *a = Singleton::getInstance();
  Singleton *b = Singleton::getInstance();

  cout << "States: " << a->get() << " " << b->get() << "\n";
  cout << "Incr: " << a->incr() << " " << b->incr() << "\n";
  cout << "States: " << a->get() << " " << b->get() << "\n";

  cout << "Equal: " << (a == b) << "\n";
  cout << "Address: " << a << " " << b << "\n";

  return 0;
}
```

If you want to call the member functions directly on the class, you can make the member functions static as well with a bit of indirection.

```cpp
class Singleton {
public:
  static Singleton& get() {
    static Singleton instance;
    return instance;
  }

  static void foo() {
    get().IFoo();
  }

private:
  void IFoo() {
    // Implementation of foo
  }

  Singleton() {}
  Singleton(const Singleton&) = delete;
  Singleton& operator=(const Singleton&) = delete;
};

int main() {
  Singleton::foo();
  return 0;
}
```

---

# Vector

The `std::vector` is a dynamic array that can grow and shrink in size. It is a sequence container that encapsulates dynamic size arrays. The storage of the vector is handled automatically, being expanded and contracted as needed. Vectors usually occupy more space than static arrays, because more memory is allocated to handle future growth. This way a vector does not need to reallocate each time an element is inserted, but only when the additional memory is exhausted.

For our implementation, we set the capacity of the vector to be powers of 2, so that the reallocation is done less frequently (though other exponential growth factors can be used as well). We will make use of templates to make the vector generic, and try to provide the same interface as the `std::vector`. We will also provide the `operator[]` to access the elements of the vector, and implement iterators to traverse the vector.

Note that in the following implementation, we have used `std:::move` to move the elements of the vector so that we can avoid copying the elements. To also provide support for `emplace_back`, we have used the `Args &&...args` to forward the arguments to the constructor of the object, and thus the template class needs an additional template parameter parameter `Args` which is vardiadic.

```cpp showLineNumbers
template <typename T>
class Vector
{
public:
  typedef T *iterator;

  // Constructors
  Vector() : capacity(1), size(0) {
    arr = new T[capacity];
  }

  Vector(int cap) : capacity(cap), size(0) {
    arr = new T[capacity];
  }

  // Destructor
  ~Vector() {
    delete[] arr;
  }

  template <typename... Args>
  void emplace_back(Args &&...args)
  {
    push_back(T(std::forward<Args>(args)...));
  }

  void push_back(T &&val)
  {
    if (size == capacity)
      _resize();
    arr[size++] = move(val);
  }

  void pop_back()
  {
    if (size > 0)
      size--;
    if (size < capacity / 2)
      _shrink();
  }

  int len()
  {
    return size;
  }

  T front()
  {
    return arr[0];
  }

  T back()
  {
    return arr[size - 1];
  }

  // Iterators
  iterator begin()
  {
    return arr;
  }

  iterator end()
  {
    return arr + size;
  }

  // Overloading the operators
  T &operator[](int idx)
  {
    return arr[idx];
  }

private:
  int capacity;
  int size;
  T *arr;

  void _resize()
  {
    capacity *= 2;
    T *newArr = new T[capacity];
    for (int i = 0; i < size; i++)
        newArr[i] = move(arr[i]);
    delete[] arr;
    arr = newArr;
  }

  void _shrink()
  {
    capacity /= 2;
    T *newArr = new T[capacity];
    for (int i = 0; i < size; i++)
        newArr[i] = move(arr[i]);
    delete[] arr;
    arr = newArr;
  }
};
```

---

# Thread Pool Manager

Implement a thread pool class that manages a pool of worker threads to execute submitted tasks asynchronously. The thread pool should maintain a fixed number of threads and a task queue to handle incoming tasks.

The implementation should include:

- A constructor that creates a specified number of worker threads
- A `submit()` function that accepts a callable (function, lambda, etc.) and its arguments, returning a `std::future` for the result
- Proper cleanup of all threads when the pool is destroyed
- Support for tasks with different return types

Other key requirements that the implementation should follow:

- Tasks must be executed in the order they are submitted
- The thread pool must handle exceptions thrown by tasks
- The implementation should avoid race conditions and deadlocks

```cpp showLineNumbers
#include <bits/stdc++.h>
using namespace std;

using Task = function<void()>;

class ThreadPool
{
private:
  vector<thread> workers;
  queue<Task> tasks;

  mutex mtx;
  condition_variable cv;
  bool stop;

public:
  ThreadPool(size_t numThreads)
    : stop(false)
  {
    for (size_t i = 0; i < numThreads; ++i)
    {
      workers.emplace_back([this]() {
        do {
          Task task;

          {
            // Block the thread until a task is available or stop is true
            unique_lock lk(mtx);
            cv.wait(lk, [this]() {
              return stop || !tasks.empty();
            });

            if (stop && tasks.empty())
              return;

            // Get a task from the queue
            task = move(tasks.front());
            tasks.pop();
          }

          try {
            task(); // run the task
          } catch (const exception &e) {
            // Exceptions are handled in the future
            cerr << "Exception in thread: " << e.what() << endl;
          }
        } while (true);
      });
    }
  }

  ~ThreadPool()
  {
    {
      unique_lock lk(mtx);
      stop = true;
    }

    cv.notify_all();

    // Join all the threads to the main thread
    // so that the main thread waits for all threads to finish
    for (thread &worker : workers)
      if (worker.joinable())
        worker.join();
  }

  // Submit a task to the thread pool and get a future
  template <typename F, typename... Args>
  auto submit(F &&f, Args &&...args)
    -> future<invoke_result_t<F, Args...>>
  {
    using return_type = invoke_result_t<F, Args...>;

    auto task = make_shared<packaged_task<return_type()>>(
      bind(forward<F>(f), forward<Args>(args)...));

    future<return_type> res = task->get_future();

    {
      unique_lock lk(mtx);
      if (stop)
        throw runtime_error("submit on stopped ThreadPool");
      tasks.emplace([task]()
          { (*task)(); });
    }

    cv.notify_one(); // Notify one thread that a task is available
    return res;
  }

  // Delete the copy constructor and assignment operator
  ThreadPool(const ThreadPool &) = delete;
  ThreadPool &operator=(const ThreadPool &) = delete;
};
```

---

# Versioned Queue

## Requirements

You have to design a data stucture that supports the basic queue operations of `enqueue` and `deque`. In addition to the same, whenever one of these operations is called, the version that is associated with the data structure is also incremented by $1$ automatically. The `history` operation of the queue accepts an integer `version` and prints all the elements that were present in the queue at that version.

The data structure should be designed so that the total memory used by the data structure is $O(n)$, where $n$ is the total number of `enqueue` and `dequeue` operations that have been performed on the queue. The `history` operation should run in $O(n)$ time, where $n$ is the number of elements in the queue at that version.

## Solution

We will make use of a linked list to store the elements of the queue. We will also maintain an vector called `versionHistory`, which would contain the starting and the tail nodes of the queue (underlying linked list) at each version. The `enqueue` and `dequeue` operations will manage the current queue nodes approprately.

```cpp showLineNumbers
#include <iostream>
#include <vector>
using namespace std;

template <typename T>
class Queue;

template <typename T>
class Node
{
  T data;
  Node *next;
  friend class Queue<T>;

public:
  Node(T val, Node *next = nullptr) : data(val), next(next) {}
};

template <typename T>
class Queue
{
  Node<T> *head; // The starting node of the queue (head)
  Node<T> *tail; // The ending node of the queue (exclusive)
  int curVersion;
  vector<pair<Node<T> *, Node<T> *>> versionHistory;

public:
  Queue() : head(nullptr), tail(nullptr), curVersion(0) {}

  void enqueue(T val)
  {
    Node<T> *newNode = new Node<T>(val);
    curVersion++;

    if (!head)
    {
      // Initialize the queue with the current node
      head = newNode;
      tail = nullptr;
    }
    else
    {
      // Add the element as the head of the queue
      newNode->next = head;
      head = newNode;
    }

    versionHistory.push_back({head, tail});
  }

  T dequeue()
  {
    if (head == nullptr)
      throw runtime_error("Queue is empty");

    T data = head->data;

    curVersion++;
    head = head->next;
    versionHistory.push_back({head, tail});

    return data;
  }

  int getCurrentVersion() { return curVersion; }

  void printHistory(int version)
  {
    if (version <= 0 || version > curVersion)
      throw runtime_error("Invalid version number");

    cout << "Version " << version << ": ";
    auto [headNode, tailNode] = versionHistory[version - 1];
    while (headNode != tailNode)
    {
      cout << headNode->data << " ";
      headNode = headNode->next;
    }
    cout << "\n";
  }
};

int main()
{
  Queue<int> q;
  q.enqueue(1);
  q.enqueue(2);
  q.enqueue(3);
  q.enqueue(4);
  q.printHistory(3);
  q.printHistory(4);
  int x = q.dequeue();
  cout << "Dequeued: " << x << endl;
  x = q.dequeue();
  cout << "Dequeued: " << x << endl;
  q.printHistory(5);
  q.printHistory(6);
  q.enqueue(5);
  q.enqueue(6);
  q.printHistory(8);
}
```

---

# Mutex

A mutex (short for mutual exclusion) is a synchronization primitive that provides exclusive access to a shared resource. When one thread holds the mutex, other threads that try to acquire it will have to wait. This simple implementation uses busy-waiting (spinning) and the `compare-and-swap` (CAS) atomic primitive to ensure that only one thread can acquire the mutex at a time.

The two core operations are:

- `lock()` — Attempts to acquire the lock by atomically setting the internal state to "locked" (`1`).
- `unlock()` — Sets the internal state to "unlocked" (`0`), allowing another thread to acquire it.

This implementation uses `std::atomic` and avoids the need for condition variables or kernel-level blocking but can be inefficient under contention due to busy-waiting.

```cpp
class Mutex
{
  atomic<int> locked;

public:
  Mutex() { locked.store(0); }

  void lock()
  {
    int expected = 0;
    while (!locked.compare_exchange_strong(expected, 1, memory_order_acquire))
      expected = 0;
  }

  void unlock()
  {
    int expected = 1;
    if (!locked.compare_exchange_strong(expected, 0, memory_order_release))
      throw "unlock called without locking";
  }
};

int main()
{
  int cnt = 0;
  Mutex mtx;

  auto worker = [&cnt, &mtx](int id)
  {
    mtx.lock();
    cnt++;
    cout << "[" << id << "] Incremented cnt to " << cnt << "\n";
    mtx.unlock();
  };

  vector<thread> threads;
  for (int i = 1; i <= 5; i++)
    threads.emplace_back(worker, i);
  for (auto &t : threads)
    t.join();
}
```

`compare_exchange_strong(expected, desired)` atomically compares `locked` with `expected`. If they are equal, it sets `locked` to `desired` and returns `true`. Otherwise, it updates `expected` with the current value of `locked` and returns `false`. We also use `std::memory_order_acquire` on lock and `std::memory_order_release` on unlock to ensure proper ordering of memory operations across threads.

---

# Semaphore

A semaphore is a synchronization primitive that is used to control access to a shared resource. It is a variable that is used to control access to a shared resource by multiple processes in a concurrent system such that the resource is not used by more than a certain number of process at a time. The semaphore has two operations, `acquire` and `release`, which are also known as `P` and `V` operations respectively. The `acquire` function waits until the resource is available, and then decrements the available count. The `release` function increments the available count and notifies one of the waiting threads.

## With Condition Variables

This implementation uses a `std::mutex` and a `std::condition_variable` to implement the semaphore. A condition variable allows a thread to be signaled when something of interest to that thread occurs, which is useful to avoid busy waiting. Note the use of `std::unique_lock` to lock the mutex, instead of the usual `std::lock_guard`, as the `std::condition_variable` requires the mutex to be locked when calling `wait`.

```cpp showLineNumbers
class Semaphore
{
  // cnt denotes the number of available resources currently.
  // available denotes the maximum number of resources that can be acquired.
  // If cnt is 0, then the semaphore is locked.
  int cnt, available;
  mutex mtx;
  condition_variable cv;

public:
  Semaphore(int available = 1) : cnt(available), available(available) {}

  void acquire()
  {
    unique_lock lk(mtx);
    cv.wait(lk, [this]()
      { return cnt > 0; });
    cnt--;
  }

  void release()
  {
    unique_lock lk(mtx);
    cnt++;
    if (cnt > available)
      throw "release called without acquiring lock";
    cv.notify_one();
  }
};

int main()
{
  Semaphore sem(3);

  // Start multiple threads that sleep for a while after acquiring the semaphore
  auto worker = [&sem](int id)
  {
    cout << "[" << id << "] Trying to ACQ\n";
    sem.acquire();
    cout << "[" << id << "] ACQ success. Sleeping\n";
    this_thread::sleep_for(chrono::seconds(id));
    cout << "[" << id << "] Releasing\n";
    sem.release();
  };

  vector<thread> threads;
  for (int i = 1; i <= 5; i++)
    threads.emplace_back(worker, i);

  for (auto &t : threads)
    t.join();
  cout << "All threads completed.\n";
}
```

## Without Condition Variables

Since we are not using condition variables, we need to busy wait until the resource is available. This is not a good practice as it wastes CPU cycles, but it is useful to understand the concept of semaphores. We now make use of `std::atomic` to make the operations atomic, and a `std::mutex` to protect the critical section.

```cpp showLineNumbers

class SemaphorePrimitive
{
  // cnt denotes the number of available resources currently.
  // available denotes the maximum number of resources that can be acquired.
  // If cnt is 0, then the semaphore is locked.
  int available;
  atomic<int> cnt;
  mutex mtx;

public:
  SemaphorePrimitive(int maxCnt) : available(maxCnt)
  {
    cnt.store(maxCnt);
  }

  void acquire()
  {
    while (1)
    {
      while (cnt == 0) { }

      lock_guard lk(mtx);
      if (!cnt)
        continue;
      cnt--;
      return;
    }
  }

  void release()
  {
    lock_guard lk(mtx);
    cnt++;
    if (cnt > available)
      throw "release called without acquiring lock"S;
  }
};


int main()
{
  SemaphorePrimitive sem(3);

  // Start multiple threads that sleep for a while after acquiring the semaphore
  auto worker = [&sem](int id)
  {
    cout << "[" << id << "] Trying to ACQ\n";
    sem.acquire();
    cout << "[" << id << "] ACQ success. Sleeping\n";
    this_thread::sleep_for(chrono::seconds(id));
    cout << "[" << id << "] Releasing\n";
    sem.release();
  };

  vector<thread> threads;
  for (int i = 1; i <= 5; i++)
    threads.emplace_back(worker, i);

  for (auto &t : threads)
    t.join();
  cout << "All threads completed.\n";
}
```

---

# Producer Consumer Problem

The infamous Producer-Consumer problem, also called the Bounded-Buffer problem, is one of the famous real-world scenarios of synchronization. The problem describes two processes, the producer and the consumer, who share a common, fixed-size buffer used as a queue. The producer's job is to generate data, put it into the buffer, and start again. At the same time, the consumer is consuming the data (i.e., removing it from the buffer), one piece at a time. The problem is to make sure that the producer won't try to add data into the buffer if it's full and that the consumer won't try to remove data from an empty buffer.

## Without Condition Variables

We will make use of two semphores, `empty` and `full` to keep track of the number of empty and full slots in the buffer. The producer will wait on the `empty` semaphore before adding an item to the buffer, and the consumer will wait on the `full` semaphore before removing an item from the buffer. The `mutex` is used to protect the critical section, i.e., the buffer.

We will also use an additional `mutex` to protect the access to the buffer, and a `queue` to store the data. The producer will push data into the queue, and the consumer will pop data from the queue.

```cpp showLineNumbers
class ProducerConsumer {
  mutex mtx;
  queue <int> buffer;

  semaphore empty;
  semaphore full;

public:
  ProducerConsumer(int capacity):  {
    empty = semaphore(capacity); // The count of empty slots in the buffer
    full = semaphore(0); // The count of full slots in the buffer
  }

  void producer(int item) {
    empty.acquire(); // Wait for an empty slot

    mtx.lock(); // Lock the mutex to protect the buffer
    buffer.push(item);
    cout << "Produced: " << item << " | Buffer Size: " << buffer.size() << endl;
    mtx.unlock();

    full.release(); // Notify that there is a new item in the buffer
  }

  void consumer() {
    full.acquire(); // Wait for a full slot

    mtx.lock(); // Lock the mutex to protect the buffer
    int item = buffer.front();
    buffer.pop();
    cout << "Consumed: " << item << " | Buffer Size: " << buffer.size() << endl;
    mtx.unlock();

    empty.release(); // Notify that there is an empty slot in the buffer
  }
}
```

## With Condition Variables

We make use of the following classes to implement the producer-consumer problem:

- `std::mutex`: We use a mutex to protect the critical section, i.e., the buffer.
- `std::condition_variable`: We use a condition variable to notify the consumer when the buffer is not empty and the producer when the buffer is not full.
- `std::queue`: We use a queue to store the data.

In the main function, we create two threads, one for the producer and one for the consumer. The producer produces data and pushes it into the buffer, and the consumer consumes the data by popping it from the buffer. The producer waits if the buffer is full, and the consumer waits if the buffer is empty.

```cpp showLineNumbers
class ProducerConsumer {
  std::mutex mtx;
  std::condition_variable cv;
  std::queue<int> buffer;
  const unsigned int capacity = 10;

public:
  void producer(int item) {
    std::unique_lock<std::mutex> lk(mtx);
    cv.wait(lk, [this](){
      return buffer.size() < capacity;
    });

    buffer.push(item);
    std::cout << "Produced: " << item << " | Buffer Size: " << buffer.size() << std::endl;

    cv.notify_all();
  }

  void consumer() {
    std::unique_lock<std::mutex> lk(mtx);
    cv.wait(lk, [this](){
      return !buffer.empty();
    });

    int item = buffer.front();
    buffer.pop();
    std::cout << "Consumed: " << item << " | Buffer Size: " << buffer.size() << std::endl;

    cv.notify_all();
  }
};

int main() {
  ProducerConsumer pc;

  std::thread producer([&pc](){
    for (int i = 0; i < 100; i++)
      pc.producer(i);
  });

  std::thread consumer([&pc](){
    for (int i = 0; i < 100; i++)
      pc.consumer();
  });

  producer.join();
  consumer.join();

  return 0;
}
```

---

# Reader & Writer Problem

The readers-writers problem is a classic synchronization problem in computer science that deals with coordinating access to a shared resource among multiple concurrent processes or threads. You have a shared data structure (like a database, file, or memory location) that multiple threads want to access simultaneously. There are two types of processes:

- Readers: Only read the data without modifying it
- Writers: Modify/update the data

For the correctness of the implementation, we need to ensure the following:

- Multiple readers can read simultaneously - Since they don't change the data, concurrent reading is safe.
- Only one writer can write at a time - Writing must be exclusive to prevent data corruption.
- Readers and writers cannot access simultaneously - A writer needs exclusive access with no readers present.

## Without Condition Variables

This is a reader's preference version, where the writer may suffer from starvation if readers continuously acquire the lock.

We use a `binary_semaphore` to check if a writer is currently present or not. The `write_semaphore` is initialized to $1$, which means that the writer can acquire the lock if no readers are present. The mutex `reader_mutex` is used to protect concurrent access to the `reader_count` variable and to ensure that concurrent readers can increment or decrement the count safely.

```cpp showLineNumbers
class ReadWriteLock
{
private:
  int reader_count;
  mutex reader_mutex;
  binary_semaphore write_semaphore;

public:
  ReadWriteLock() : reader_count(0), write_semaphore(1) {}

  void reader_lock()
  {
    lock_guard lock(reader_mutex);

    reader_count++;
    // First reader blocks all the writer
    if (reader_count == 1)
      write_semaphore.acquire();
  }

  void reader_unlock()
  {
    lock_guard lock(reader_mutex);

    reader_count--;
    if (reader_count == 0)
      write_semaphore.release();
  }

  void writer_lock()
  {
    write_semaphore.acquire();
  }

  void writer_unlock()
  {
    write_semaphore.release();
  }
};
```

## With Condition Variables

Using conditions variables, we can addtionally provide preference to either reader or writer threads if the same is desired.

```cpp showLineNumbers
class ReadWriteLockCV
{
private:
  int reader_count = 0;
  int waiting_writers = 0;
  bool writer_active = false;

  condition_variable reader_cv;
  condition_variable writer_cv;
  mutex mtx;

public:
  void reader_lock()
  {
    unique_lock lock(mtx);
    reader_cv.wait(lock, [this]
      { return !writer_active && waiting_writers == 0; });

    reader_count++;
  }

  void reader_unlock()
  {
    unique_lock lock(mtx);
    reader_count--;
    if (reader_count == 0)
      writer_cv.notify_one();
  }

  void writer_lock()
  {
    unique_lock lock(mtx);
    waiting_writers++;
    writer_cv.wait(lock, [this]
      { return reader_count == 0 && !writer_active; });

    waiting_writers--;
    writer_active = true;
  }

  void writer_unlock()
  {
    unique_lock lock(mtx);
    writer_active = false;

    // Preference: writers first or readers first
    if (waiting_writers > 0)
      writer_cv.notify_one(); // Prefer writers
    else
      reader_cv.notify_all(); // Prefer readers
  }
};

```

---

# Dining Philosophers Problem

The Dining Philosophers Problem is a classic concurrency problem that illustrates the challenges of resource allocation among multiple competing threads (philosophers).

- Five philosophers sit around a table.
- Each has a plate of food and needs two forks to eat: the fork on the left and the one on the right.
- Forks are shared between adjacent philosophers (i.e., philosopher $i$ shares fork $i$ with $i+1$, modulo $5$).

Each philosopher alternates between thinking and eating. The challenge is to design a strategy that avoids deadlock and starvation while allowing all philosophers to eat.

## Naive Solution (Prone to Deadlock)

```cpp showLineNumbers
class DiningPhilosophersNaive
{
private:
  mutex forks[5];

public:
  void wants_to_eat(
    int philosopher,
    function<void()> pick_left_fork,
    function<void()> pick_right_fork,
    function<void()> eat,
    function<void()> put_left_fork,
    function<void()> put_right_fork
  ) {
    int left = philosopher;
    int right = (philosopher + 1) % 5;

    // Naively lock left then right fork
    lock_guard<mutex> left_lock(forks[left]);
    lock_guard<mutex> right_lock(forks[right]);

    pick_left_fork();
    pick_right_fork();
    eat();
    put_right_fork();
    put_left_fork();
  }
};
```

This can **deadlock** if all philosophers pick up their left fork at the same time.

## Use Ordering

Avoid circular wait by ensuring that not all philosophers try to pick up forks in the same order.

```cpp showLineNumbers
class DiningPhilosophersOrdered
{
private:
  mutex forks[5];

public:
  void wants_to_eat(
    int philosopher,
    function<void()> pick_left_fork,
    function<void()> pick_right_fork,
    function<void()> eat,
    function<void()> put_left_fork,
    function<void()> put_right_fork
  ) {
    int left = philosopher;
    int right = (philosopher + 1) % 5;

    if (philosopher % 2 == 0)
    {
      lock_guard<mutex> first_lock(forks[left]);
      lock_guard<mutex> second_lock(forks[right]);

      pick_left_fork();
      pick_right_fork();
      eat();
      put_right_fork();
      put_left_fork();
    }
    else
    {
      lock_guard<mutex> first_lock(forks[right]);
      lock_guard<mutex> second_lock(forks[left]);

      pick_right_fork();
      pick_left_fork();
      eat();
      put_left_fork();
      put_right_fork();
    }
  }
};
```

## Use a Semaphore to Limit Access

Use a semaphore to allow at most 4 philosophers to try to pick up forks at once.

```cpp showLineNumbers
class DiningPhilosophersSemaphore
{
private:
  mutex forks[5];
  // Only 4 philosophers can try to eat at once
  counting_semaphore<4> entry{4};

public:
  void wants_to_eat(
    int philosopher,
    function<void()> pick_left_fork,
    function<void()> pick_right_fork,
    function<void()> eat,
    function<void()> put_left_fork,
    function<void()> put_right_fork
  ) {
    entry.acquire();

    int left = philosopher;
    int right = (philosopher + 1) % 5;

    {
      lock_guard<mutex> left_lock(forks[left]);
      lock_guard<mutex> right_lock(forks[right]);

      pick_left_fork();
      pick_right_fork();
      eat();
      put_right_fork();
      put_left_fork();
    }

    entry.release();
  }
};
```

## Condition Variable to Avoid Starvation

```cpp showLineNumbers
class DiningPhilosophersCV
{
private:
  mutex mtx;
  condition_variable cv;
  bool forks[5] = {false, false, false, false, false};

public:
  void wants_to_eat(
    int philosopher,
    function<void()> pick_left_fork,
    function<void()> pick_right_fork,
    function<void()> eat,
    function<void()> put_left_fork,
    function<void()> put_right_fork
  ) {
    int left = philosopher;
    int right = (philosopher + 1) % 5;

    // Acquire both forks
    {
      unique_lock<mutex> lock(mtx);
      cv.wait(lock, [&]
        { return !forks[left] && !forks[right]; });

      forks[left] = true;
      forks[right] = true;
    }

    // Critical section (outside lock)
    pick_left_fork();
    pick_right_fork();
    eat();
    put_right_fork();
    put_left_fork();

    // Release both forks
    {
      lock_guard<mutex> lock(mtx);
      forks[left] = false;
      forks[right] = false;
      cv.notify_all(); // Notify all waiting philosophers
    }
  }
};
```

---

# Barbershop Problem

The Barbershop Problem is a classic synchronization problem that involves a barber, customers, and a waiting room. The operating rules of the barbershop are as follows:

- There is a single barber who cuts hair. The barber can only cut hair when there is a customer, and sleeps when there are no customers.
- There is a waiting room with a limited number of chairs.
- Customers arrive at random intervals. When they arrive and find the barber busy, they sit in the waiting room if there is space. If not, they leave.

We make use of the `counting_semaphore` to represent the number of available chairs in the waiting room, and two `binary_semaphore`s to signal between the barber and the customers. The barber will wait for a customer to be ready, and the customer will wait for the barber to be ready after they signal that they are ready for a haircut.

```cpp showLineNumbers
class Barbershop {
  counting_semaphore waiting_room;   // Represents number of available chairs
  binary_semaphore customer_ready{0};  // Customer signals barber
  binary_semaphore barber_ready{0};    // Barber signals customer

public:
  Barbershop(int chairs)
    :waiting_room(chairs) {}

  void customer(int id) {
    // Try to get a chair in the waiting room
    if (!waiting_room.try_acquire()) {
      cout << "Customer " << id << " left due to no available chairs." << endl;
      return;
    }

    customer_ready.release();   // Notify the barber
    barber_ready.acquire();     // Wait until the barber is ready
    waiting_room.release();     // Free the chair

    cout << "Customer " << id << " is getting a haircut." << endl;
  }

  void barber_work() {
    while (true) {
      customer_ready.acquire();  // Wait for customer

      this_thread::sleep_for(chrono::seconds(1)); // Haircut time
      barber_ready.release();    // Signal to customer that haircut is done

      cout << "Barber finished a haircut." << endl;
    }
  }
};
```

---

# The Smoking Cigarettes Problem

In this classic problem, there are three smokers, each with an infinite supply of one of the ingredients:

- Smoker $A$ has tobacco
- Smoker $B$ has paper
- Smoker $C$ has matches

An agent continously places two random ingredients on the table. The smoker who has the third item makes and smokes a cigarette. The agent waits until atleast one of the smokers has smoked a cigarette before placing the next two items.

If you try to solve this with no synchronization, then we run into a number of race conditions and deadlocks:

1. Multiple smokers might try to access the table at the same time.
2. A smoker might grab one of the ingredients, while other smokers grab the other ingredient, leading to a situation where no smoker can complete their cigarette. This would lead to a deadlock, as the agent would be waiting for a smoker to finish smoking before placing the next two items.

## Problem History

Intially proposed by Edsger Dijkstra in $1965$, the problem has been used to illustrate the challenges of synchronization in concurrent programming. It was first aimed to solve under two constraints:

1. The source code of the agent cannot be changed (analogous the source code of a OS allocating resources).
2. The smokers (processes) cannot use mutexes, semaphores, or condition variables to synchronize their actions.

It has been shown that the given problem is impossible to solve under these constraints. Thus it is proposed that the second constraint be relaxed, as it is an artificial constraint that does not reflect real-world scenarios. Processes and softwares do have access to synchronization primitives, which allow the problem to be solved.

## Solution

The solution involves using semaphores for synchronization, and makes use of "pusher" threads for each ingredient. The agent thread places two ingredients on the table, and the corresponding "pusher" threads signal the smokers when they can smoke. Each smoker waits for their ingredient to be available before smoking.

```cpp showLineNumbers
class SmokingCigarettes {
  // Table state and mutex to prevent access conflicts
  mutex mtx;
  bool tabacco_present = false, paper_present = false, matches_present = false;

  // Semaphores to signal when ingredients are ready
  // Used by AGENT
  binary_semaphore tobacco_ready, paper_ready, matches_ready;
  binary_semaphore agent_ready;

  // SMOKER semaphores to signal when a smoker is ready to smoke
  binary_semaphore tobacco_smoker, paper_smoker, matches_smoker;

public:
  SmokingCigarettes():
    tobacco_ready(0), paper_ready(0), matches_ready(0),
    agent_ready(1), tobacco_smoker(0), paper_smoker(0), matches_smoker(0) {}

  void agent() {
    while (true) {
      agent_ready.acquire(); // Wait for the agent to be ready

      // Randomly place two ingredients on the table
      int notRelease = rand() % 3;
      if (notRelease == 0) {
        tobacco_ready.release();
        paper_ready.release();
        cout << "Agent placed Tobacco and Paper on the table." << endl;
      } else if (notRelease == 1) {
        paper_ready.release();
        matches_ready.release();
        cout << "Agent placed Paper and Matches on the table." << endl;
      } else {
        matches_ready.release();
        tobacco_ready.release();
        cout << "Agent placed Matches and Tobacco on the table." << endl;
      }
    }
  }

  // There would be three "pusher" functions, one for each ingredient
  void pusher_tobacco() {
    while (true) {
      tobacco_ready.acquire(); // Wait for tobacco to be ready
      lock_guard<mutex> lock(mtx); // Acquire the mutex to access the table

      if (paper_present) {
        // Paper is present, that means the "pusher" for paper already ran
        // and placed matches on the table
        paper_present = false;
        // Paper & Tobacco are present, so the Matches smoker can smoke
        matches_smoker.release();
      } else if (matches_present) {
        matches_present = false;
        paper_smoker.release();
      } else {
        tobacco_present = true; // Place tobacco on the table
      }
    }
  }

  // There would be three such functions, one for each smoker
  // When a smoker is allowed to smoke by the pushers, it smokes the cigarette
  // and notifies the agent to place more ingredients
  void tobacco_smoke() {
    while (true) {
      tobacco_smoker.acquire();

      cout << "Tobacco smoker is smoking a cigarette." << endl;
      this_thread::sleep_for(chrono::seconds(1)); // Simulate smoking time

      agent_ready.release(); // Notify the agent to place more ingredients
    }
  }
}
```

This implementation skips some details for brevity, such as the actual implementation of the `pusher_paper` and `pusher_matches` functions, which would be similar to the `pusher_tobacco` function. In you want a runable CPP code, you can find the same here:

<details>
<summary>Click to view the complete code</summary>

Make sure you use `C++20` or later to compile this code, as it uses `std::binary_semaphore`. The `GCC` compilation command for the same would be:

```bash
g++ -std=c++20 -pthread smoking.cpp -o smoking
```

<br/>

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <semaphore>
#include <chrono>
#include <random>

using namespace std;

class SmokingCigarettes
{
  mutex mtx;
  bool tobacco_present = false, paper_present = false, matches_present = false;
  binary_semaphore tobacco_ready{0}, paper_ready{0}, matches_ready{0};
  binary_semaphore agent_ready{1};
  binary_semaphore tobacco_smoker{0}, paper_smoker{0}, matches_smoker{0};

public:
  void agent()
  {
    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<> dist(0, 2);

    while (true)
    {
      agent_ready.acquire();

      int notRelease = dist(gen);
      if (notRelease == 0)
      {
        tobacco_ready.release();
        paper_ready.release();
        cout << "Agent placed Tobacco and Paper on the table." << endl;
      }
      else if (notRelease == 1)
      {
        paper_ready.release();
        matches_ready.release();
        cout << "Agent placed Paper and Matches on the table." << endl;
      }
      else
      {
        matches_ready.release();
        tobacco_ready.release();
        cout << "Agent placed Matches and Tobacco on the table." << endl;
      }
    }
  }

  void pusher_tobacco()
  {
    while (true)
    {
      tobacco_ready.acquire();
      lock_guard lock(mtx);
      if (paper_present)
      {
        paper_present = false;
        matches_smoker.release();
      }
      else if (matches_present)
      {
        matches_present = false;
        paper_smoker.release();
      }
      else
        tobacco_present = true;
    }
  }

  void pusher_paper()
  {
    while (true)
    {
      paper_ready.acquire();
      lock_guard lock(mtx);
      if (tobacco_present)
      {
        tobacco_present = false;
        matches_smoker.release();
      }
      else if (matches_present)
      {
        matches_present = false;
        tobacco_smoker.release();
      }
      else
        paper_present = true;
    }
  }

  void pusher_matches()
  {
    while (true)
    {
      matches_ready.acquire();
      lock_guard lock(mtx);
      if (tobacco_present)
      {
        tobacco_present = false;
        paper_smoker.release();
      }
      else if (paper_present)
      {
        paper_present = false;
        tobacco_smoker.release();
      }
      else
        matches_present = true;
    }
  }

  void tobacco_smoke()
  {
    while (true)
    {
      tobacco_smoker.acquire();
      cout << "Tobacco smoker is smoking a cigarette." << endl;
      this_thread::sleep_for(chrono::seconds(1));
      agent_ready.release();
    }
  }

  void paper_smoke()
  {
    while (true)
    {
      paper_smoker.acquire();
      cout << "Paper smoker is smoking a cigarette." << endl;
      this_thread::sleep_for(chrono::seconds(1));
      agent_ready.release();
    }
  }

  void matches_smoke()
  {
    while (true)
    {
      matches_smoker.acquire();
      cout << "Matches smoker is smoking a cigarette." << endl;
      this_thread::sleep_for(chrono::seconds(1));
      agent_ready.release();
    }
  }
};

int main()
{
  SmokingCigarettes system;

  thread agent_thread(&SmokingCigarettes::agent, &system);

  thread pusher1(&SmokingCigarettes::pusher_tobacco, &system);
  thread pusher2(&SmokingCigarettes::pusher_paper, &system);
  thread pusher3(&SmokingCigarettes::pusher_matches, &system);

  thread smoker1(&SmokingCigarettes::tobacco_smoke, &system);
  thread smoker2(&SmokingCigarettes::paper_smoke, &system);
  thread smoker3(&SmokingCigarettes::matches_smoke, &system);

  agent_thread.join();
  pusher1.join();
  pusher2.join();
  pusher3.join();
  smoker1.join();
  smoker2.join();
  smoker3.join();

  return 0;
}
```

</details>

<br />

# Template Metaprogramming

Template metaprogramming is a powerful feature in C++ that allows you to perform computations at compile time using templates. It can be used to create generic algorithms, type traits, and even complex data structures that are resolved during compilation rather than at runtime.

Both `const` and `constexpr` are both used to declare constants in C++, but they differ in when and how their values are determined:

- `const` specifies that a variable's value is constant and cannot be modified after initialization. The initialization of a const variable can be deferred until runtime. The compiler may choose to initialize it at compile-time as an optimization, but it is not required.
- `constexpr` guarantees that a variable's value or a function's result can be evaluated at compile time. Since it must be initialized with a constant expression, and any implicit conversions must also be constant expressions.

Using `constexpr` along with template metaprogramming allows you to create compile-time constants and perform computations that can be evaluated during compilation, leading to more efficient code.

## GCD

The greatest common divisor (GCD) of two numbers can be computed at compile time using template metaprogramming. The Euclidean algorithm is a classic method for computing the GCD, and we can implement it using recursive templates.

```cpp showLineNumbers
// General template for GCD
template <int A, int B>
struct GCD // If both the templates need to be passed as is, then no need to declare here
{
  static constexpr int value = GCD<B, A % B>::value;
};

// Partial template specialization for the case when B is 0
template <int A>
struct GCD<A, 0>
{
  static constexpr int value = A;
};

// Helper type alias to simplify usage
template <int A, int B>
constexpr get_gcd = GCD<A, B>::value;

int main()
{
  static_assert(get_gcd<48, 18> == 6, "GCD of 48 and 18 should be 6");
  static_assert(get_gcd<56, 98> == 14, "GCD of 56 and 98 should be 14");
  static_assert(get_gcd<101, 10> == 1, "GCD of 101 and 10 should be 1");
}
```

## Array Dimensions

We want to implement a template metafunction that calculates the number of dimensions in an array type at compile time. We also expect the same to work for non-array types and return 0 dimensions.

```cpp showLineNumbers
// Base case for any type that is not an array
template <typename T>
struct ArrayDimensions
{
  static constexpr int value = 0;
};

// Recursive template specialization for array types
template <typename T, std::size_t N>
struct ArrayDimensions<T[N]>
{
  static constexpr int value = 1 + ArrayDimensions<T>::value; // Add 1 for the current dimension
};

template <typename T>
struct ArrayDimensions<T[]>
{
  static constexpr int value = 1 + ArrayDimensions<T>::value; // Handle dynamic arrays as well
};

// Helper type alias to simplify usage
template <typename T>
constexpr int get_array_dimensions = ArrayDimensions<T>::value;

int main()
{
  static_assert(get_array_dimensions<int> == 0, "int should have 0 dimensions");
  static_assert(get_array_dimensions<int[5]> == 1, "int[5] should have 1 dimension");
  static_assert(get_array_dimensions<int[3][4]> == 2, "int[3][4] should have 2 dimensions");
  static_assert(get_array_dimensions<int[2][3][4]> == 3, "int[2][3][4] should have 3 dimensions");
  static_assert(get_array_dimensions<int[]> == 1, "int[] should have 1 dimension");
  static_assert(get_array_dimensions<int[][6][7][8]> == 4, "int[][6][7][8] should have 4 dimensions");
}
```

## Remove Adjacent Duplicates

We want to implement a template metafunction that removes adjacent duplicates from a list of integers at compile time. For example, given the list `1, 2, 2, 3, 3, 3, 4`, the result should be `1, 2, 3, 4`. We would make use of the `Vector` type defined below to represent the list of integers.

```cpp showLineNumbers
// A simple type representing a vector of integers at compile-time
// Used as a container for list of integers
template <int... Ints>
struct Vector;

// Prepend is a metafunction that adds a new element to the front
// of an Vector at compile-time.
// Base Definition: Prepend takes an integer NewElement and another type Vec,
// which is expected to be a Vector.
template <int NewElement, typename Vec>
struct Prepend;

// Specialization of Prepend: adds NewElement at the front of Vector<Existing...>
template <int NewElement, int... Existing>
struct Prepend<NewElement, Vector<Existing...>>
{
  using type = Vector<NewElement, Existing...>;
};

// Primary template for RemoveAdjacentDuplicates
// Accepts a variable-length list of integers
template <int... Ints>
struct RemoveAdjacentDuplicates;

// === Base Cases ===
// For the base cases, we do not need to use the "typename" keyword
// because we are not using recursive templates here.

// Empty Vector
template <>
struct RemoveAdjacentDuplicates<>
{
  using type = Vector<>;
};

// Single Element Vector
template <int Only>
struct RemoveAdjacentDuplicates<Only>
{
  using type = Vector<Only>;
};

// === Recursive Cases ===
// For these cases, we will use recursion to process the elements.
// We would need to use the "typename" keyword to refer
// to types defined in the template.

// First element is the same as the second
template <int First, int... Rest>
struct RemoveAdjacentDuplicates<First, First, Rest...>
{
  using type = typename RemoveAdjacentDuplicates<First, Rest...>::type;
};

// First two elements are different
template <int First, int Second, int... Rest>
struct RemoveAdjacentDuplicates<First, Second, Rest...>
{
private:
  using TailResult = typename RemoveAdjacentDuplicates<Second, Rest...>::type;

public:
  using type = typename Prepend<First, TailResult>::type;
};
```

<br />

<details>
<summary> Testing your metafunction </summary>

If you want to test your implementation, you can paste your implementation before the following test runner code and check if it works as expected. Please make sure that the classes `Vector` and `RemoveAdjacentDuplicates` are defined with the same signature as shown above.

```cpp showLineNumbers
// Helper alias for easier usage around the RemoveAdjacentDuplicates template
template <int... Ints>
using RemoveAdjacentDuplicates_t = typename RemoveAdjacentDuplicates<Ints...>::type;

// Base definition for a type trait to compare two Vector types
// We expect both A and B to be Vector types.
template <typename A, typename B>
struct AreVectorSame;

template <>
struct AreVectorSame<Vector<>, Vector<>>
{
  static constexpr bool areSame = true;
};

template <int... Ints>
struct AreVectorSame<Vector<>, Vector<Ints...>>
{
  static constexpr bool areSame = false;
};

template <int... Ints>
struct AreVectorSame<Vector<Ints...>, Vector<>>
{
  static constexpr bool areSame = false;
};

template <int A, int B, int... Ints1, int... Ints2>
struct AreVectorSame<Vector<A, Ints1...>, Vector<B, Ints2...>>
{
  static constexpr bool areSame = false;
};

template <int A, int... Ints1, int... Ints2>
struct AreVectorSame<Vector<A, Ints1...>, Vector<A, Ints2...>>
{
  static constexpr bool areSame = AreVectorSame<Vector<Ints1...>, Vector<Ints2...>>::areSame;
};

// Test cases
int main()
{
  using R1 = RemoveAdjacentDuplicates_t<1, 1, 2, 3, 3, 4, 4, 5>;
  using E1 = Vector<1, 2, 3, 4, 5>;
  static_assert(AreVectorSame<R1, E1>::areSame, "Test 1 failed");

  using R2 = RemoveAdjacentDuplicates_t<1, 2, 3, 4, 5>;
  using E2 = Vector<1, 2, 3, 4, 5>;
  static_assert(AreVectorSame<R2, E2>::areSame, "Test 2 failed");

  using R3 = RemoveAdjacentDuplicates_t<1, 1, 1, 1, 1>;
  using E3 = Vector<1>;
  static_assert(AreVectorSame<R3, E3>::areSame, "Test 3 failed");

  using R4 = RemoveAdjacentDuplicates_t<>;
  using E4 = Vector<>;
  static_assert(AreVectorSame<R4, E4>::areSame, "Test 4 failed");

  using R5 = RemoveAdjacentDuplicates_t<1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8, 8>;
  using E5 = Vector<1, 2, 3, 4, 5, 6, 7, 8>;
  static_assert(AreVectorSame<R5, E5>::areSame, "Test 5 failed");
}
```

> If you carefully look at the implementation of `AreVectorSame`, you will notice that we default to all types being different. Thus to shorten the implementation, we can actually remove all the cases (base & recursive) where the output is `false`, and only keep the cases where the output is `true`! Pretty neat, right?

</details>

---
