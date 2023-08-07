---
title: "Languages I Used to Know: Go"
description: A quick guide to Go syntax, features and conventions for the forgetful minds like me.
pubDate: 2023-08-15
draft: false
hero: "./images/go.png"
heroAlt: "The logo of Go"
---

I am not an honest person. I like to list a whole catalog of languages under my belt, and call myself procifient in every one of them. But the reality is, I am like a kid in a candy store, hopping from the lastest framework or language to the the next one. While this is very fun to do, the sad consequence of the same is, I often find myself forgetting and getting confused in frameworks I earlier worked with.

`Go` is no different. It was a language that I first picked up as a freshman, and after toying with it for a fornight, I just never looked back it. Now indeed, it is just [a language that I used to know](https://www.youtube.com/watch?v=8UVNT4wvIGY). This is a guide of dummies like me, who know a language, but need quick notes on syntax, to get back cracking at the same.

Full disclosure: This is `NOT` intended for beginners, and won't be explanatory in nature for the most part. It's not even going to be an article, but just code snippets and bullets listing things I feel are important! But I will try to have the right balance of conscise and detailed, covering all the essentials, and hopefully more!

Tweet at me to let me know what you find about it! Let's get started.

---

## About Go

#### Core Promises

- Efficient compilation
- Efficient execution
- Easy to code (Does not offer a lot of flexibility to developers in terms of how to write their code)

#### Characteristics

- Strong static type system
- C-inspired syntax (But definitely not a superset of C)
- Compiled
- Multi-paradigm
- Garbage collected
- Single binary compilation
- Knows the existence of network requests and concurrency execution
- Library-free experience for strings, network, compression, file management and testing
- Cross-platform and backwards compatible
- Can generate executable binaries for different platforms and OS. compile to WebAssembly and even transpile to frontend JavaScript (GopherJS)
- Powerful CLI
- Opiniated and concise

---

## Language Basics

#### About the language

- No styling freedom
- Case sensitive
- No classes, no exceptions
- Existence of semi-colons to separate sentences, but the best practise is `NOT` to use them
- No paranthesis needed for boolean conditions or values
- There is no ternary operator in Go
- No break statement is needed while working with `switch` in Go. However, you can `fallthrough` to the next case if needed.
- You can use the `switch` statement with conditions as cases as well.
- We can emulate a `while` loop just by using a boolean expression with the `for` loop itself.

#### Functions

- Function arguments can have default values
- Functions can return more than one value at once
- Funtions can return labelled variables
- Functions recieve arguments always by value, and thus we need to use pointers to pass memory addresses to make changes to references.
- There is no concept of function overloading (multiple declarations of funtions with the same name but different function signatures) in Go.
- `panic` is used to crash your program and halt it's entire execution.
- `defer` is used to delay the execution of a function to the end of the current function. It maintain's a stack, and thus the functions run in the reverse order of the order they were defered in (in the same scope).

#### Packages and Modules

- Every file must be within a package. Only one package (`main`) does not need to be a folder.
- A folder is a `package`. Packages can have simple names (services) or URLs (libraries). Files in the same folder belong to the same package.
- The `main` function acts like an entry point to a package.

- `Module` is a group of packages. It contains a `go.mod` file with configuration and metadata. CLI can be used to manipulate the module (`go mod init`, `go build`, `go run`, `go test` etc.)
- Each module must have atleast one file with any name, but with `package main` and a function called `main`.

- Functions and global (package) variables are shared between all the files in the same package. They can be used directly without being imported.
- Functions, variables and types that are `TitleCase` ARE exported to other packages, while others in `camelCase` can be only imported in the files of the package.

#### Code Examples

###### General Syntax

```go
package main

// Importing other packages
import "fmt"

func main() {
    // Variable Declarations
    var text string
    text = "Variables are nil by default."
    otherText := "The type for this variable is infered. Can be only used in functions."
    const fixedValue = "Constants can be only bool, string and numbers."

    val := 1
    increment(&val)  // Now val is 2

    fmt.Println(text)

    if message:="hello"; user != nil {
        // You can use multiple statements in the if block
        // The last expression is treated as the condiiton
    } else {
        // The defined variables in the if block (like "message") have scope in the if as well as all the else clauses
        // This is a unique feature not found in other languages
    }
}

func addAndSubtract (a int, b int) (int, int) {
    return a + b, a - b
}

func add (a int, b int) int {
    return a + b
}

// Increment the value of the variable x
func increment (x *int) {
    *x++;
}
```

<br />

###### Using Packages

```go title="main.go"
package main

// "cli" is the name of the current current module as defined in go.mod
import "cli/data"

func main() {
    print(data.Text)
}
```

<br />

```go title="data/constants.go"
package data

const Text = "This test is exported from the module."
```

#### Trivia

- When working with web and JSON, every number is converted to `float64`.
- Go offer functions like `print` and `println` which can be used to print and debug code. But the same are not guranteed to work on every platform. Thus using the `fmt` package is the industry standard.
- Strings are multi-line by default in Go.
- Go provides a default `init` function while is executed even before the `main` function, irrespective of the package or the file it is present it. Typically, it is used to initalise some values and variables.
- The same `.go` file can have multiple copies of the `init` function, and they would be executed in the order they appear in the file (definiton order).

---

## Collections

- `Arrays`: Fixed length (`[5] int`)
- `Slices`: Similar to dynmic length arrays, but they are actually chunks of arrays (`[]int`)
- `Maps`: Key-value dictonaries (`map[keyType]valueType`)
- Go also provides support for Generics from version 1.8 onwards.
- You can use the `{}` syntax like in C to initalise arrays.
- Collections are not objects (nothing is an object actually), so we use global functions to work with them, such as `len` and `cap`.

---

## Error's design pattern

Since we don't have exceptions in Go, this is the typical design pattern that we mostly follow for hndling errors.

```go
func readUser(id int) (user, err) {
    // ... we proceed with the reading and see a bool ok value
    if ok {
        return user, nil
    } else {
        return nil, errorDetails
    }
}

func main() {
    user, err := readUser(2)
}
```

---

## Closing Remarks

`Go` remains true to it's name, and let's you go at a super speed into developement first. It's wierd to not have classes, objects and enums (specially when now there are langauges like `Rust` which consider enums their core strength), and the `if err != nil` pattern in nothing short of a huge pain, but it all start's to make a bit of sense if you look and reason about the core promises it tries to uphold.

It's a fun language to work with, and it's utility in the modern development landscape speaks for it's efficiency and reliability. It's good to know Go, and hopefully this guide wouldn't let it become a stranger again.
