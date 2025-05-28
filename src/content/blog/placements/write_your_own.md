---
title: "Write Your Own"
description: Snippets for common implementation of standard library classes & templates that are frequently asked in interviews.
pubDate: 2024-12-01
updatedDate: 2025-05-28
requireLatex: true
pinned: true
draft: false
tags: ["placements", "2024", "cpp"]
series:
  name: "placements"
  part: 3
---

This is a collection of common C++ classes and templates that we often use, and thus are perfect opportunities for interviewers to quiz on to see if the candidate is comfortable with the language, can write clean code, and is aware about the internals of the language.

- [Smart Pointers](#smart-pointers)
  - [General Smart Pointer](#general-smart-pointer)
  - [Unique Pointer](#unique-pointer)
  - [Shared Pointer](#shared-pointer)
- [Hit Counter](#hit-counter)
  - [Base Variant](#base-variant)
  - [Unordered Timestamps](#unordered-timestamps)
  - [Concurrent Hit Counter](#concurrent-hit-counter)
  - [Infinite Timestamps in the Past](#infinite-timestamps-in-the-past)
- [Vector](#vector)
- [Mutex](#mutex)
- [Semaphore](#semaphore)
  - [With Condition Variables](#with-condition-variables)
  - [Without Condition Variables](#without-condition-variables)
- [Producer Consumer Problem](#producer-consumer-problem)
- [Singleton Design Pattern](#singleton-design-pattern)

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
#include <iostream>

template <typename T>
class UniquePtr
{
    T *ptr;

public:
    UniquePtr(T *ptr = nullptr) : ptr(ptr) {}
    ~UniquePtr()
    {
      delete ptr;
    }

    // Disable copy
    UniquePtr(const UniquePtr &) = delete;
    UniquePtr &operator=(const UniquePtr &) = delete;

    // Move constructor
    UniquePtr(UniquePtr &&other) : ptr(other.ptr)
    {
      other.ptr = nullptr;
    }

    // Move assignment
    UniquePtr &operator=(UniquePtr &&other)
    {
      // Check for self-assignment
      if (this != &other) {
          delete ptr;
          ptr = other.ptr;
          other.ptr = nullptr;
      }
      return *this;
    }

    // Overload operators
    T &operator*() const { return *ptr; }
    T *operator->() const { return ptr; }
};

int main()
{
    auto y = UniquePtr(new int(5));
    int v = *y;
    std::cout << v;
}
```

## Shared Pointer

A `std::shared_ptr` is a smart pointer that retains shared ownership of an object through a pointer. Several `std::shared_ptr` objects may own the same object. The object is destroyed and its memory deallocated when all `std::shared_ptr` objects that own it are destroyed or reset. The `std::shared_ptr` uses a reference count to keep track of the number of `std::shared_ptr` objects that own the object.

```cpp showLineNumbers
template<typename T>
class SharedPtr {
    T *ptr;
    int *count;

  void cleanUp() {
    (*count)--;
    if (*count == 0) {
      delete ptr;
      delete count;
    }
  }

  public:
    SharedPtr(T *ptr = nullptr): ptr(ptr) {
      if (ptr)
        count = new int(1);
      else
        count = new int(0);
    }

    ~SharedPtr() { cleanUp(); }

    // Copy constructor
    SharedPtr(SharedPtr &other) {
      ptr = other.ptr;
      count = other.count;
      if (ptr)
        (*count)++;
    }

    // Copy assignment operator
    SharedPtr& operator=(SharedPtr &other) {
      cleanUp();

      ptr = other.ptr;
      count = other.count;
      if (ptr)
        (*count)++;

      return *this;
    }

    // Move constructor
    SharedPtr(SharedPtr &&other) {
      ptr = other.ptr;
      count = other.count;
      other.ptr = nullptr;
      other.count = nullptr;
    }

    // Move assignment operator
    SharedPtr& operator=(SharedPtr &&other) {
      cleanUp();

      ptr = other.ptr;
      count = other.count;
      other.ptr = nullptr;
      other.count = nullptr;
    }

    // Overloading operators
    T& operator*() const { return *ptr; }
    T* operator->() const { return ptr; }
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

# Vector

The `std::vector` is a dynamic array that can grow and shrink in size. It is a sequence container that encapsulates dynamic size arrays. The storage of the vector is handled automatically, being expanded and contracted as needed. Vectors usually occupy more space than static arrays, because more memory is allocated to handle future growth. This way a vector does not need to reallocate each time an element is inserted, but only when the additional memory is exhausted.

For our implementation, we set the capacity of the vector to be powers of 2, so that the reallocation is done less frequently (though other exponential growth factors can be used as well). We will make use of templates to make the vector generic, and try to provide the same interface as the `std::vector`. We will also provide the `operator[]` to access the elements of the vector, and implement iterators to traverse the vector.

Note that in the following implementation, we have used `std:::move` to move the elements of the vector so that we can avoid copying the elements. To also provide support for `emplace_back`, we have used the `Args &&...args` to forward the arguments to the constructor of the object, and thus the template class needs an additional template parameter parameter `Args` which is vardiadic.

```cpp showLineNumbers
template <typename T, typename... Args>
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

# Mutex

A mutex (short for mutual exclusion) is a synchronization primitive that provides exclusive access to a shared resource. When one thread holds the mutex, other threads that try to acquire it will have to wait. This simple implementation uses busy-waiting (spinning) and the `compare-and-swap` (CAS) atomic primitive to ensure that only one thread can acquire the mutex at a time.

The two core operations are:

- `lock()` — Attempts to acquire the lock by atomically setting the internal state to "locked" (`1`).
- `unlock()` — Sets the internal state to "unlocked" (`0`), allowing another thread to acquire it.

This implementation uses `std::atomic` and avoids the need for condition variables or kernel-level blocking but can be inefficient under contention due to busy-waiting.

```cpp
#include <atomic>

class Mutex
{
  std::atomic<int> locked;

  public:
    Mutex() : locked(0) {}

  void lock()
  {
    int expected = 0;
    // Spin until we successfully change 0 -> 1
    while (!locked.compare_exchange_strong(expected, 1, std::memory_order_acquire)) {
      expected = 0; // Reset expected after failure
    }
  }

  void unlock()
  {
    locked.store(0, std::memory_order_release);
  }
};
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
  size_t avail;
  std::mutex mtx;
  std::condition_variable cv;

public:
  Semaphore(int avail = 1) : avail(avail){}

  void acquire() // P(x)
  {
    std::unique_lock<std::mutex> lk(mtx);
    // Wait until the lambda function returns true
    cv.wait(lk, [this](){
      return avail > 0;
    });
    avail--;
  }

  void release() // V(x)
  {
    std::unique_lock<std::mutex> lk(mtx);
    avail++;
    cv.notify_one();
  }
};
```

## Without Condition Variables

Since we are not using condition variables, we need to busy wait until the resource is available. This is not a good practice as it wastes CPU cycles, but it is useful to understand the concept of semaphores. We now make use of `std::atomic` to make the operations atomic, and a `std::mutex` to protect the critical section.

```cpp showLineNumbers
struct Semaphore {
  int size;
  atomic<int> count;
  mutex updateMutex;

  Semaphore(int n) : size(n) { count.store(0); }

  void aquire() {
    while (1) {
      while (count >= size) {}

      updateMutex.lock();
      if (count >= size) {
          updateMutex.unlock();
          continue;
      }
      ++count;
      updateMutex.unlock();
      break;
    }
  }

  void release() {
    updateMutex.lock();
    if (count > 0) {
        --count;
    } // Else log error or throw exception
    updateMutex.unlock();
  }
};
```

---

# Producer Consumer Problem

The infamous Producer-Consumer problem, also called the Bounded-Buffer problem, is one of the famous real-world scenarios of synchronization. The problem describes two processes, the producer and the consumer, who share a common, fixed-size buffer used as a queue. The producer's job is to generate data, put it into the buffer, and start again. At the same time, the consumer is consuming the data (i.e., removing it from the buffer), one piece at a time. The problem is to make sure that the producer won't try to add data into the buffer if it's full and that the consumer won't try to remove data from an empty buffer.

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

# Singleton Design Pattern

A singleton class is a class such that you can only have one instance of the class. This is useful when you want to have a single instance of a class that is shared across the application. The singleton class is implemented using a static member variable, and a static member function that returns the instance of the class.

Singletons are useful when we want to apply some functionalities to a "global" set of data, but we do not want to pass the object or the data/member functions around. Having the same encapsulated in a singleton class makes it easier to manage and use throughout the application. They can effectively be managed using namespaces as well, but the singleton class provides a more object-oriented approach.

Here are some good examples of a singleton class:

- Logger
- Configuration
- Random Number Generator
- Database Connection

```cpp
class Singleton {
public:
  static Singleton& get() {
    static Singleton instance;
    return instance;
  }

  void foo() {};

private:
  // Make the constructor private so that the class cannot be instantiated
  // from outside, and delete the other constructors to avoid copying
  Singleton() {}
  Singleton(const Singleton&) = delete;
  Singleton& operator=(const Singleton&) = delete;
};

int main() {
  Singleton &s = Singleton::get();
  s.foo();

  // Or equivalently
  Singleton::get().foo();

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
