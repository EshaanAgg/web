---
title: "C++ (& Systems) Interview Questions"
description: Some tricky CPP (and other releated topics) questions that I have seen in interviews.
pubDate: 2025-06-04
requireLatex: true
tags: ["cpp", "2025"]
---

Here are some C++ interview questions that I have encountered in system and software engineering interviews as a final year student, or fresh graduate. Some of these questions are from prominent HFT firms and Quants, while others are from some industry leaders in general software based firms. Hopefully, these will help you prepare for your interviews!

In addition to these questions, I have been also asked multiple times to implement some common data structures, OS primitives or some scheduling problems, which I have covered in [my other blog](./../placements/write_your_own), so I won't be covering them here.

<details>
<summary> Table of Contents </summary>

- [Question 1](#question-1)
- [Question 2](#question-2)
- [Question 3](#question-3)
- [Question 4](#question-4)
- [Question 5](#question-5)
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
