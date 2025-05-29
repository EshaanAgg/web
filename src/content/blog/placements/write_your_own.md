---
title: "Write Your Own"
description: Snippets for common implementation of standard library classes & templates that are frequently asked in interviews.
pubDate: 2024-12-01
updatedDate: 2025-05-29
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
- [Reader \& Writer Problem](#reader--writer-problem)
  - [Without Condition Variables](#without-condition-variables-1)
  - [With Condition Variables](#with-condition-variables-1)
- [Dining Philosophers Problem](#dining-philosophers-problem)
  - [Naive Solution (Prone to Deadlock)](#naive-solution-prone-to-deadlock)
  - [Use Ordering](#use-ordering)
  - [Use a Semaphore to Limit Access](#use-a-semaphore-to-limit-access)
  - [Condition Variable to Avoid Starvation](#condition-variable-to-avoid-starvation)

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

  ~UniquePointer()
  {
    delete ptr;
  }

  // Disable the copy constructor and copy assignment
  UniquePointer(UniquePointer &other) = delete;
  UniquePointer &operator=(UniquePointer &other) = delete;

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
template <typename T>
class SharedPointer
{
  T *ptr;
  int *refCount;

  void _clean()
  {
    // If the SharedPointer was moved, then both
    // ptr and refCount will be nullptr.
    if (refCount == nullptr)
      return;

    // Decrease the reference count. If the same reaches
    // to zero, then there are no more observers of the
    // object, so we can delete it.
    if (--(*refCount) == 0)
    {
      delete ptr;
      delete refCount;
    }
  }

public:
  SharedPointer(T *p = nullptr) : ptr(p)
  {
    refCount = new int(1);
  }

  ~SharedPointer() { _clean(); }

  // Copy constructor
  SharedPointer(SharedPointer &other)
  {
    ptr = other.ptr;
    refCount = other.refCount;
    ++(*refCount);
  }

  // Copy assignment operator
  SharedPointer &operator=(SharedPointer &other)
  {
    // Check for self-assignment
    if (this == &other)
      return *this;

    // Release the current resources
    _clean();

    // Copy the resources from the other SharedPointer
    // and increase the reference count
    ptr = other.ptr;
    refCount = other.refCount;
    ++(*refCount);
  }

  // Move operator
  SharedPointer(SharedPointer &&other)
  {
    // Get the resources from the other SharedPointer
    // and set it's resources to nullptr
    ptr = other.ptr;
    refCount = other.refCount;

    other.ptr = nullptr;
    other.refCount = nullptr;
  }

  // Move assignment operator
  SharedPointer &operator=(SharedPointer &&other)
  {
    // Release current resources
    _clean();

    // Get the resources from the other SharedPointer
    // and set it's resources to nullptr
    ptr = other.ptr;
    refCount = other.refCount;

    other.ptr = nullptr;
    other.refCount = nullptr;
  }

  // Overloading operators
  T &operator*() { return *ptr; }
  T *operator->() { return ptr; }

  int use_count() { return *refCount; }
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

# Reader & Writer Problem

The readers-writers problem is a classic synchronization problem in computer science that deals with coordinating access to a shared resource among multiple concurrent processes or threads. You have a shared data structure (like a database, file, or memory location) that multiple threads want to access simultaneously. There are two types of operations:

- Readers: Only read the data without modifying it
- Writers: Modify/update the data

For the correctness of the implementation, we need to ensure the following:

- Multiple readers can read simultaneously - Since they don't change the data, concurrent reading is safe.
- Only one writer can write at a time - Writing must be exclusive to prevent data corruption.
- Readers and writers cannot access simultaneously - A writer needs exclusive access with no readers present.

## Without Condition Variables

This is a reader's preference version, where the writer may sufeer from starvation if readers continuously acquire the lock.

```cpp showLineNumbers
class ReadWriteLock
{
private:
  int reader_count = 0;
  mutex reader_mutex;
  binary_semaphore write_semaphore{1};

public:
  void reader_lock()
  {
    lock_guard lock(reader_mutex);

    reader_count++;
    // First reader blocks writers
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

The Dining Philosophers Problem is a classic concurrency problem that illustrates the challenges of **resource allocation** among multiple competing threads (philosophers).

- Five philosophers sit around a table.
- Each has a plate of food and needs two forks to eat: the fork on the left and the one on the right.
- Forks are shared between adjacent philosophers (i.e., philosopher `i` shares fork `i` with `i+1`, modulo 5).

Each philosopher alternates between **thinking** and **eating**. The challenge is to design a strategy that avoids deadlock and starvation while allowing all philosophers to eat.

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
