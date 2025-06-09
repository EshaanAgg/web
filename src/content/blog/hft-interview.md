---
title: "Systems Interview at a HFT"
description: A collection of all the questions I was asked in a C++ interview at a prominent HFT firm.
pubDate: 2025-06-04
updatedDate: 2025-06-10
requireLatex: true
draft: false
pinned: true
tags: ["cpp", "2025"]
---

I had the opportunity to interview at a prominent HFT firm in $2025$, and I was asked a variety of questions that tested my understanding of C++ and systems programming. I decided to compile all the questions that I was asked during the interview, not only from my interview, but also from the experiences of my peers who interviewed at the same firm, and online sources like Glassdoor and LeetCode. In addition to these questions, I also was asked some primitives or common OS problems from [my other blog](./../placements/write_your_own), so do brush up on those as well.

<details>
<summary> Table of Contents </summary>

- [Question 1](#question-1)
- [Question 2](#question-2)
- [Question 3](#question-3)
- [Question 4](#question-4)
- [Question 5](#question-5)
- [Question 6](#question-6)
- [Question 7](#question-7)
- [Design Question](#design-question)
- [DSA Question](#dsa-question)
- [Descriptive Questions](#descriptive-questions)

</details>

---

## Question 1

Give the output of the following program.

```cpp
#include<bits/stdc++.h>
using namespace std;

void fun(int *p, int *q) {
  int *temp = p;
  q = p;
  p = temp;
  *temp = 2;
}

int main() {
  int r = 20, s = 30;
  int *p = &r, *q = &s;
  fun(p, q);

  cout << *p << " " << *q << "\n";
}
```

<br />

<details>
<summary> Answer </summary>

```
2 30
```

> Assuming memory addresses in the program and dry running the same with the interviewer might be a good idea to clarify any doubts, and to convey your thought process. It is also particularly helpful in debugging such tricky questions.

The key concept to keep in mind is that pointer values are passed by value in C++. Changes to pointer variables inside a function do not affect the original pointers, but changes to what they point to do affect the original data.

In the `fun` function:

1. The code swaps the pointers `p` and `q`, but since they are passed by value, the original pointers in `main` remain unchanged.
2. The line `*temp = 2;` modifies the value pointed to by `temp`, which is the same as `p` in `main`, changing the value of `r` to `2`.

</details>

## Question 2

What are the issues associated with the following code?

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1000000;

class A {
  char *str;

public:
  A() {
    str = new char[N];
  }

  A(int n) {
    str = new char[n];
  }

  ~A() {
    delete[] str;
  }
};


class B {
  A a;

public:
  B(int n) {
    a = A(n);
  }
}

int main() {
  B b(10);
  return 0;
};
```

<br />

<details>
<summary> Answer </summary>

> Bugs due to implicit copy constructors (or default constructors), memory leaks and double-frees are common concepts tested in such questions. If you find nothing "wrong" in the example, it might be worthwhile to explicitly think about these issues.

The above code contains two errors: a double free and a memory leak.

### 1. Double Free

```cpp
class B {
  A a;

public:
  B(int n) {
    a = A(n); // <-- problematic
  }
};
```

Here in the body of the constructor, first the parametrized constructor of `A` is called with `n` (due to the call `A(n)`), and the object is created. Next, when this object is assigned to the memeber `a`, the copy assignment operator (which was implicitly generated) is called. This assignment uses a shallow copy (as default behavior), so both `a` and the temporary `A(n)` now point to the same `str`. When the temporary `A(n)` is destroyed at the end of the expression, it's destructor frees `str`. Then, when `a` is destroyed in `main()`, it again tries to free the same `str`, leading to a double free — leading to undefined behavior.

### 2. Memory Leak

```cpp
class B {
  A a;
};
```

When `B` is constructed, the member `a` is first default-constructed via `A()` — which allocates `str = new char[N]`. Immediately afterward, `a = A(n)` assigns a new allocation to `a.str` without freeing the old one, and thus the original allocation (`new char[N]`) is now orphaned — there is no pointer pointing to it.

</details>

## Question 3

What is the output of the following code?

```cpp
#include<bits/stdc++.h>
using namespace std;

class A {
public:
  A() {
    cout << "A's constructor\n";
  }

  ~A() {
    cout << "A's destructor\n";
    throw runtime_error("Error in A's destructor");
  }
};

int main() {
  try {
    A a;
  } catch (const runtime_error &e) {
    cout << "Caught exception: " << e.what() << "\n";
  }
  return 0;
}
```

<br />

<details>
<summary> Answer </summary>

> Destuctors cannot throw exceptions in C++. Constructors can. If a constructor throws an exception, the destructor will not be called for that object.

```
Runtime error occurs after printing:
A's constructor
A's destructor
```

Destructors in C++ are not allowed to throw exceptions. If an exception is thrown from a destructor during stack unwinding (i.e., when an exception is already being handled), it leads to `std::terminate` being called, which results in program termination with a runtime error that cannot be caught. Destructor's default to `noexcept` behavior.

</details>

## Question 4

What is the output of the following code?

```cpp
#include<bits/stdc++.h>
using namespace std;

class A {
public:
  void fun() { cout << "A"; }
};

class B : public A {
public:
  void fun() { cout << "B"; }
};

class C : public B {
public:
  virtual void fun() { cout << "C"; }
};

class D : public C {
public:
  void fun() { cout << "D"; }
};

int main() {
  D d;

  A &a = d;
  a.fun();

  B &b = d;
  b.fun();

  C &c = d;
  c.fun();

  d.fun();

  return 0;
}
```

<br />
<details>
<summary> Answer </summary>

> Using references to upcast is the same concept as using pointers to upcast, and the whole process of creation of the virtual table and `vptr` is the same as well. The only difference is that references are not null, and they cannot be reassigned.

```
ABDD
```

In this code, we have a class hierarchy with virtual functions. Since A & B are not virtual, they will call the respective functions in their own class. However, since C is virtual, it will call the overridden function in D.

</details>

## Question 5

Give the output of the following code:

```cpp
#include <stdio.h>

char *c[] = {"Systems", "Placements", "IIT", "JEE(Advanced)"};
char **cp[] = {c + 3, c + 2, c + 1, c};
char ***cpp = cp;

int main() {
  printf("%s ", *(*++cpp - 1));
  printf("%s ", *(*++cpp));
  printf("%s ", *(*++cpp + 1));

  return 0;
}
```

<br />
<details>
<summary> Answer </summary>

> Wherever we create an array, the array name is a pointer to the first element of the array!

```
Placements Placements Placements
```

The code involves multiple levels of pointers and pointer arithmetic. Let's break it down:

1. `c` is an array of strings (character pointers).
2. `cp` is an array of pointers to pointers, where each element points to a specific string in `c`.
3. `cpp` is a pointer to the first element of `cp`.

In the `main` function:

- `*++cpp` increments `cpp` to point to the second element of `cp`, which is `c + 2` (pointing to "IIT") and returns the pointer `c + 2`. The `- 1` operation moves it back to `c + 1`, and when dereferenced, it gives the character pointer to "Placements".
- `*++cpp` increments `cpp` again to point to the third element of `cp`, which is `c + 1`. When redereferenced twice, it gives the character pointer to "Placements".
- `*++cpp + 1` increments `cpp` to point to the fourth element of `cp`, which is `c`. Adding `1` moves it to the next string, which is "Placements".

</details>

## Question 6

What is the output of the following code?

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
  char *str = "Welcome to C++";
  double *p = (double *)str;
  p++;
  cout << (char *)p << "\n";
  return 0;
}
```

<br />

<details>
<summary> Answer </summary>

```
to C++
```

This code demonstrates pointer arithmetic and type casting in C++. Here's a breakdown of what happens:

1. `char *str = "Welcome to C++";` initializes a pointer `str` to a string literal. The pinter `str` points to the first character of the string "Welcome to C++".
2. `double *p = (double *)str;` casts the `char *` pointer to a `double *`. This is a dangerous operation because it treats the memory address of the string as if it were pointing to a `double`, which typically has a size of 8 bytes on most systems.
3. `p++;` increments the pointer `p` by the size of a `double`, which is usually 8 bytes. This means `p` now points to the memory address that is 8 bytes ahead of the original string's starting address, and thus it points to the character 't' in the string "Welcome to C++".
4. `cout << (char *)p << "\n";` casts `p` back to a `char *` and prints the string starting from the new address. Since `p` now points to the character 't', it prints "to C++".

</details>

## Question 7

Identify the bug in the following code, and give the minimal and the best way to fix it.

```cpp
#include <bits/stdc++.h>
using namespace std;

class A {
public:
  int n;
  int *arr;

  A(): n(0), arr(nullptr) {}
  A(int n): n(n), arr(new int[n]) {}
};

class B {
public:
  A a;

  B() {}
  B(int n): a(n) {}
}

int main() {
  B b(10);
  b.a.arr[0] = 1;

  B b2 = b;
  b.a.arr[1] = 2;

  cout << b2.arr[0] << " " << b2.arr[1] << "\n";
}
```

## Design Question

There is a module `M` which needs to be provided with UDP packet data in an efficient and in order manner. The UDP packets are sequenced $1$, $2$, $3$ and so on. Since the data in from a UDP stream, it is possible that some of the packets are dropped in the transimission. You are required to implement a wrapper `W` around the module `M`, which can manage these drops and provide a reliable and in-order service to `M`.

To recover the dropped packets, you can contact the main exchange to request a snapshot of the last recorded data it has. This exchange takes over a line that is seperate from the UDP connection. The exchange responds with a packet, which has a last packet number field called $S$, and the data of all the packets from $1$ to $S$ sequence number in a compressed manner. The exchange updates the snapshot approximately every $30$ seconds, and increments the sequence number $S$ according.

The module `M` has two methods:

- `process(packet)` - which processes a packet with the given sequence number.
- `handleSnapshot(snapshot)` - which handles the snapshot data and processes all the packets from $1$ to $S$

The exchange has a method:

- `getSnapshot()` - which returns the latest snapshot data.

You need to design the wrapper `W` around the module `M` (give the pseudo-code), which can handle the UDP packets and the snapshots efficiently. Processing the snapshot is an expensive operation, so it should be done only when necessary. You can assume that the wrapper `W` can repeatedly poll the attached network interface to check for new UDP packets, and can also poll the exchange for the latest snapshot data.

<details>
<summary> Answer </summary>

```cpp
class Wrapper {
  map<int, Packet> packets; // Store received packets that were not sent yet
  int maxSeenSequence = 0;  // Track the highest sequence number seen
  int expectedPacket = 1;   // Track the next expected packet sequence number

  Module m;
  Exchange exchange;

  void run() {
    // Start the recovery process in a new thread
    thread recoveryThread(&Wrapper::recovery, this);

    while (true) {
      Packet packet = pollForUDPPacket();

      // Process the packet immediately if it's the expected one
      if (packet.seq == expectedPacket) {
        m.process(packet);
        expectedPacket++;
        processBufferedPackets(); // Process any buffered packets that are now in order
      } else if (packet.seq > expectedPacket) {
        // Buffer the packet for later processing
        packets[packet.seq] = packet;
        maxSeenSequence = max(maxSeenSequence, packet.seq);
      }
    }
  }

  void processBufferedPackets() {
    while (packets.find(expectedPacket) != packets.end()) {
      Packet nextPacket = packets[expectedPacket];
      m.process(nextPacket);
      packets.erase(expectedPacket);
      expectedPacket++;
    }
  }

  void recovery() {
    do {
      if (shouldRequestSnapshot()) {
        Snapshot snapshot = exchange.getSnapshot();
        if (snapshot.lastSeq > maxSeenSequence) {
          // Update expectedPacket to the next sequence number after the snapshot
          m.handleSnapshot(snapshot);
          expectedPacket = snapshot.lastSeq + 1;
          processBufferedPackets();
        }
      }
    } while (true);
  }

  bool shouldRequestSnapshot() {
    // Implement a sort of exponential backoff
    // or fixed interval to request snapshots checking if the snapshot
    // was different from the last one
  }
};
```

The code above implements a wrapper `W` around the module `M` that handles UDP packets and snapshots efficiently. The wrapper uses a map to buffer packets that arrive out of order, and it processes them in sequence as they become available. The recovery thread periodically checks for new snapshots from the exchange and processes a snapshot only when the snapshot contains the data for all the dropped packets till now. There would be a need for synchronization mechanisms (like mutexes) to ensure thread safety between the main thread and the recovery thread, especially when accessing shared data like `packets` and `expectedPacket`.

This problem alternatively can also be explained as a variant of the "Consumer-Producer" problem, where the main thread is the producer of packets (from the UDP stream) and the recovery thread is the consumer (which processes the snapshot data), and need to be synchronized properly to ensure that the packets along with the option to request a snapshot.

</details>

## DSA Question

You are given a undirected graph with $n$ nodes and $m$ edges. You need to the colour each node with one of colours $1$, $2$ or $3$ such that:

- For every edge $(u, v)$, $|colour(u) - colour(v)| = 1$.
- The number of nodes of each colour is equal.

Return the number of ways to colour the graph, or $0$ if it is not possible to colour the graph. Return the answer modulo $10^9 + 7$.

<details>
<summary> Answer </summary>

If the whole graph is connected, then it would be only possible to colour the graph if:

- The number of nodes $n$ is divisible by $3$.
- The graph is bipartite, i.e., it can be coloured with two colours such that no two adjacent nodes have the same colour.
- In the bipartite graph, let the number of nodes in the first part be $a$ and in the second part be $b$, such that $a \ge b$. Then, it must hold that $a = 2b$.

Then we can colour all the nodes in the smaller part with colour $2$, and the nodes in the larger part with colours $1$ and $3$ alternatively.

Now since the graph can be disconnected, the conditions change a bit:

- The number of nodes in the whole graph must be divisible by $3$ (and not in each component).
- Each component must be bipartite.
- In the final colouring, there must be $\frac{n}{3}$ nodes from the "smaller" part, and $\frac{2n}{3}$ nodes from the "larger" part. Thus the number of colourings can be calculated by choosing $\frac{n}{3}$ nodes from the "larger" part and colouring them with colour $1$, and the rest $\frac{n}{3}$ nodes with colour $3$. Thus the number of colourings would be $\binom{\frac{2n}{3}}{\frac{n}{3}}$.
- This would need to be multiplied by the number of ways to label each of the component parts as "smaller" or "larger" such that the sum condition holds. To calculate this, we can use dynamic programming to count the number of ways to choose the nodes from each component.

The overall time-complexity of the solution would be $O(n^2)$.

```cpp showLineNumbers
#include <bits/stdc++.h>
using namespace std;

#define ll long long
#define vi vector<int>
#define vvi vector<vector<int>>
#define vvll vector<vector<ll>>

const ll MOD = 1e9 + 7;

ll power(ll a, ll b) {
  ll res = 1;
  while (b > 0) {
    if (b & 1)
      res = (res * a) % MOD;
    a = (a * a) % MOD;
    b >>= 1;
  }
  return res;
}


// Returns nCr(2a, a)
ll getBinomial(ll a) {
  ll facA = 1;
  ll fac2A = 1;
  for (ll i = 2; i <= 2 * a; i++) {
    fac2A = (fac2A * i) % MOD;
    if (i == a)
      facA = fac2A;
  }

  ll dr = power(facA, MOD - 2);
  dr = (dr * dr) % MOD;
  return (fac2A * dr) % MOD;
}

// Assumes that node u is already coloured, and we need to colour
// it's neighbours with the other two colours.
// Also pushes the coloured nodes to col1 and col2 vectors.
bool isBipartite(int u, vvi &g, vi &col, vi &col1, vi &col2) {
  for (int v : g[u]) {
    if (col[v] == -1) {
      // Colour the neighbour with the other colour
      col[v] = 1 - col[u];
      if (col[v] == 0) col1.push_back(v);
      else col2.push_back(v);
      if (!isBipartite(v, g, col, col1, col2)) return false;
    } else if (col[v] == col[u]) {
      // If the neighbour has the same colour, then it's not bipartite
      return false;
    }
  }

  return true;
}

ll getWays(int idx, int tar, vi &a, vi &b, vvll &dp) {
  if (idx == a.size())
    return tar == 0;
  if (tar < 0)
    return 0;

  if (dp[idx][tar] != -1)
    return dp[idx][tar];

  ll res = getWays(idx + 1, tar - a[idx], a, b, dp);
  res += getWays(idx + 1, tar - b[idx], a, b, dp);
  res %= MOD;
  dp[idx][tar] = res;
  return res;
}

int main() {
  int n, m;
  cin >> n >> m;

  vvi g(n);
  for (int i = 0; i < m; i++) {
    int u, v;
    cin >> u >> v;
    g[u - 1].push_back(v - 1);
    g[v - 1].push_back(u - 1);
  }

  if (n % 3 != 0) {
    cout << 0 << "\n"; // Not possible to colour
    return 0;
  }

  vector<int> col(n, -1); // -1 means uncoloured
  vector<int> a, b;
  for (int i = 0; i < n; i++) {
    if (col[i] != -1)
      continue;
    vector<int> col1, col2;

    col[i] = 0;
    col1.push_back(i);
    if (!isBipartite(i, g, col, col1, col2)) {
      cout << 0 << "\n"; // Not bipartite
      return 0;
    }

    a.push_back(col1.size());
    b.push_back(col2.size());
  }

  int s = n / 3;
  vvll dp(a.size(), vector<ll>(s + 1, -1));
  ll ways = getWays(0, s, a, b, dp);

  cout << (ways * getBinomial(s)) % MOD << "\n";
  return 0;
}
```

</details>

## Descriptive Questions

1. What are virtual functions in C++? Why do we need them? Can static member functions be virtual?

2. What is 3-way handshake in TCP, and why is it necessary?

3. Why do we need both IP addresses and MAC addresses in networking? Since MAC addresses are unique to each device, why not just use them for routing?

4. If class `A` is a friend of class `B`, and class `C` is a derived class of `B`, then can you access the private members of `A` from `C`? (No)

5. What is the use of the `inline` keyword in C++? What are the advantages and disadvantages of using it?

   <details>
   <summary> Answer </summary>

   In C++, the `inline` keyword is a request to the compiler to replace a function call with the actual function body at the point of the call. The primary goal of the same is to reduce function call overhead, which includes the time taken to push arguments onto the stack, jump to the function's code, and return. Inline functions are most effective for small functions that are called frequently.

   The important fact to note that the `inline` keyword is a request, not a command. The compiler may choose not to inline a function based on various factors, like function size, complexity, or compiler settings. Excessive inlining can increase code size, potentially impacting performance due to increased instruction cache misses. `inline` functions are often defined in header files because the compiler needs the function's definition to perform inlining. Functions defined within a class definition are implicitly inline.

   Some functions cannot be inlined, such as recursive functions or functions with loops or switch statements. Since C++17, variables can also be declared inline, mainly to avoid multiple definitions in different translation units.

   </details>

6. Is `malloc` a system call?

   <details>
   <summary> Answer </summary>

   `malloc` is not a system call; it is a library function provided by the C standard library (or C++ standard library) `libc`. It allocates memory from the heap and returns a pointer to the allocated memory block. The actual memory allocation is typically done using system calls like `brk` or `mmap`, which are lower-level functions that interact directly with the operating system to manage memory.

   When you call `malloc`, it may internally use these system calls to request memory from the operating system, but `malloc` itself is not a system call. It is a higher-level abstraction that simplifies memory management for programmers.

   Examples of system calls include `read`, `write`, `open`, `close`, `fork`, and `exec`. These system calls provide a direct interface to the operating system's kernel, allowing programs to perform operations like file I/O, process management, and inter-process communication.

   </details>

7. Can function overloading be done based on the `const` qualifier?

   <details>
   <summary> Answer </summary>

   Yes, function overloading can be done based on the `const` qualifier in C++. This is particularly useful when you have member functions that behave differently depending on whether they are called on a `const` object or a non-`const` object.

   For example, consider the following code:

   ```cpp showLineNumbers
   class MyClass {
   public:
     void display() {
       std::cout << "Non-const display\n";
     }

     void display() const {
       std::cout << "Const display\n";
     }
   };

   int main() {
     MyClass obj;
     const MyClass constObj;
     obj.display();         // Calls non-const version
     constObj.display();    // Calls const version

     return 0;
   }
   ```

   You can also use `const` qualifiers in function parameters to overload functions. The same would only work for pointers or references, not for values (as values are always copied).

   ```cpp showLineNumbers
   void process(int &x) {
     std::cout << "Non-const reference: " << x << "\n";
   }
   void process(const int &x) {
     std::cout << "Const reference: " << x << "\n";
   }

   int main() {
     int a = 10;
     const int b = 20;
     process(a); // Calls non-const version
     process(b); // Calls const version

     return 0;
   }
   ```

   </details>

8. What is memory alignment in C++? Why is it necessary?

   <details>
   <summary> Answer </summary>

   Memory alignment refers to placing data at memory addresses that are multiples of their size. Proper alignment is crucial for performance as it affects cache line usage, prevents CPU pipeline stalls, and is required for certain SIMD operations. Misaligned access can cause performance penalties or crashes on some architectures.

   </details>

9. Explain the difference between paging and segmentation in detail. How do they relate to compilation and execution in C++?

   <details>
   <summary> Answer </summary>

   ### Paging

   Paging is a memory management technique used by operating systems where:

   - The logical address space (used by processes) is divided into fixed-size blocks called pages.
   - The physical memory (RAM) is divided into frames of the same size.
   - Pages are mapped to frames using a page table maintained by the OS. Often, a Translation Lookaside Buffer (TLB) is also used to speed up address translation.
   - It is related to the physical memory management, allowing processes to use more memory than physically available through swapping (as CPU works with virtual addresses).
   - It eliminates external fragmentation.

   ### Segmentation

   **Segmentation** is another technique which:

   - Divides memory into variable-sized segments based on logical divisions of a program.
   - Each segment has a base address and a limit, which defines its size.
   - It allows for more flexible memory management, as segments can grow or shrink independently.
   - The various examples of segments of a program can include:
     - Code segment (text)
     - Data segment
     - Stack segment
     - Heap segment
   - It is more abstract and logical, focusing on the structure of a program rather than physical memory management.
   - It can lead to external fragmentation, as segments can vary in size.

   ### Use in C++

   Many modern OS (like Linux, Windows) use both in layered ways, but:

   - Most modern x86 CPUs (in 64-bit mode) disable hardware segmentation.
   - They instead rely on **paging** for memory protection and isolation.

   In C++, you don't interact directly with segmentation or paging. But:

   - C++ code maps to segments:

     - **.text** → Code segment
     - **.data/.bss** → Static/global segment
     - **heap** → Managed via `new`/`malloc`
     - **stack** → Function call stack

     OS or executable format (like ELF) defines these segments during linking and loading.

   - C++ code is compiled to machine code, which is then loaded into memory by the OS. The OS uses paging to manage the memory of the process, mapping logical addresses used in the C++ code to physical addresses in RAM. You can also see it's more explicit effects during page faults or memory mapped files.

   </details>

10. What is the difference between `new` and `malloc` in C++? Discuss about the underlying memory management, intialization and metadata stored.

    <details>
    <summary> Answer </summary>

    - `malloc` is part of the C standard library, which is used to serve small allocations from an existing heap region.
    - It can make use of system calls like `brk()` or `mmap()` to allocate memory.
    - `malloc` implementations store a header before the actual memory block that contains metadata:

      - Size of the block
      - Allocation flags
      - Free/used state
      - Possibly pointers to adjacent blocks (for free list)

    ```
    [metadata][user data pointer returned by malloc]
    ```

    - On the other hand, `new` is a C++ operator that does more than just allocate memory. It:
      - Allocates memory for an object and then calls its constructor.
      - It returns a typed pointer to the object, not just a `void*`.
      - It can throw exceptions (like `std::bad_alloc`) if allocation fails, while `malloc` returns `NULL`.
    - The `new` operator can be overloaded for each class to customize memory allocation. No extra metadata is stored by the language itself, but your `operator new` implementation can store info (e.g., for debugging).
    - The compiler and runtime rely on object layout and virtual tables (vtable pointers) for polymorphic behavior, not on heap metadata.

    You can use the `strace` command to see the system calls made by `malloc` and `new` in a C++ program. For example, if you have a program called `your_program`, you can run:

    ```bash
    strace ./your_program
    ```

    You'll see calls like:

    ```bash
    brk(NULL)                = 0x555555758000
    brk(0x555555779000)      = 0x555555779000
    mmap(NULL, 4096, ...)    = 0x7ffff7fb4000
    ```

    While `malloc` and `free` are used for raw memory allocation and deallocation, `new` and `delete` are used for object-oriented memory management in C++. `new` is not necessarily slower than `malloc`, but it does additional work (like calling constructors and ensuring type safety), which can add overhead.

    </details>
