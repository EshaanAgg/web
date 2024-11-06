---
title: "Write Your Own"
description: Snippets for common implementation of standard library classes & templates that are frequently asked in interviews.
pubDate: 2024-12-01
pinned: false
requireLatex: true
draft: false
tags: ["placements", "2024", "cpp"]
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

---

# Smart Pointers

## General Smart Pointer

```cpp
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

### Problems with `AutoPtr`:

- When passed to function by value, the pointer is moved to the function and the memory would be freed when the function returns. Thus in the original function, this can lead to a dangling pointer.
- This deletes using the non-array `delete` operator, and thus if the pointer was allocated using `new[]`, it would lead to undefined behaviour.

Thus they were replaced by `std::unique_ptr`, `std::shared_ptr`, and `std::weak_ptr` in C++11.

## Unique Pointer

```cpp
template<typename T>
class UniquePtr {
  T *ptr;

public:
  UniquePtr(T* ptr = nullptr): ptr(ptr) {}
  ~UniquePtr() {
    delete ptr;
  }

  // Disable the copy assignment and copy constructor
  UniquePtr(UniquePtr &ptr) = delete;
  UniquePtr& operator=(UniquePtr &other) = delete;

  // Move constructor
  UniquePtr(UniquePtr &&other) {
    ptr = other.ptr;
    other.ptr = nullptr;
  }

  // Move assignment operator
  void operator=(UniquePtr &&other) {
    ptr = other.ptr;
    other.ptr = nullptr;
  }

  // Overloading Opertor
  T& operator*() const { return *this; }
  T* operator->() const {return this; }
};
```

## Shared Pointer

```cpp
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
