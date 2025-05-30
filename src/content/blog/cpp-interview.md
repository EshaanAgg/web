---
title: "C++ (& Systems) Interview Questions"
description: Some tricky CPP (and other releated topics) questions that I have seen in interviews.
pubDate: 2025-05-30
requireLatex: false
draft: true
tags: ["cpp", "2025"]
---

Here are some C++ interview questions that I have encountered in system and software engineering interviews as a final year student, or fresh graduate. Some of these questions are from prominent HFT firms and Quants, while others are from some industry leaders in general software based firms. Hopefully, these will help you prepare for your interviews!

In addition to these questions, I have been also asked multiple times to implement some common data structures, OS primitives or some scheduling problems, which I have covered in [my other blog](./../placements/write_your_own), so I won't be covering them here. Please do refer the same too!

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

## Descriptive Questions

1. What are virtual functions in C++? Why do we need them? Can static member functions be virtual?

2. What is 3-way handshake in TCP, and why is it necessary?

3. Why do we need both IP addresses and MAC addresses in networking? Since MAC addresses are unique to each device, why not just use them for routing?
