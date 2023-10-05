---
title: "Languages I Used to Know: Go"
description: A quick guide to Go syntax, features and conventions for the forgetful minds like me.
pubDate: 2023-08-09
updatedDate: 2023-08-30
draft: false
hero: "./images/go.png"
heroAlt: "Go Gopher with the heading 'Languages I Used to Know, Featuring Go Lang'"
tags: ["Go"]
pinned: true
external:
  link: https://blogs.copsiitbhu.co.in/languages-i-used-to-know-go
  platform: Hashnode
---

I am not an honest person. I like to list a whole catalog of languages under my belt and call myself proficient in every one of them. But the reality is, I am like a kid in a candy store, hopping from the latest framework and language to the next one. While this is very fun to do, the sad consequence of the same is, I often find myself forgetting and getting confused in frameworks I worked with earlier.

`Go` is no different. It was a language that I first picked up as a freshman, and after toying with it for a fortnight, I just never looked back on it. Now indeed, it is just [**a language that I used to know**](https://www.youtube.com/watch?v=8UVNT4wvIGY). This is a guide for dummies like me, who know a language, but need quick notes on syntax so that they get back to using the same.

**Full disclosure:** This is `NOT` intended for complete beginners who have no exposure to `Go`, and won’t be explanatory for the most part. It’s not even going to be an article, but just code snippets and bullets listing things I feel are essential! But I will try to have the right balance of concise and detailed, covering all the essentials, and hopefully more! It’s meant to serve as a guide, and cheat sheet to all the paradigms that Go relies on so that you can quickly dive head first into writing some Go with best practices by the community.

Tweet to let me know what you think about it! Let’s get started.

---

## **About Go**

#### **Core Promises**

- Efficient compilation
- Efficient execution
- Easy to code (Does not offer a lot of flexibility to developers in terms of how to write their code)

#### **Characteristics**

- Strong static type system
- C-inspired syntax (But definitely not a superset of C)
- Compiled
- Multi-paradigm
- Garbage collected
- Single binary compilation
- Knows the existence of network requests and concurrency execution
- Library-free experience for strings, network, compression, file management, and testing
- Cross-platform and backwards compatible
- Can generate executable binaries for different platforms and operating systems. Compile to WebAssembly and even transpile to frontend JavaScript (`GopherJS`)
- Powerful CLI for dependency management
- Opinionated and concise

---

## **Language Basics**

#### **About the language**

- No styling freedom
- Case sensitive
- No classes and exceptions
- Existence of semi-colons to separate sentences, but the best practice is `not` to use them unless required
- No parentheses are needed for boolean conditions or values
- No ternary operator
- No `break` statement is needed while working with `switch`. However, you can `fallthrough` to the next case if needed.
- You can use the `switch` statement with conditions as cases as well.
- We can emulate a `while` loop just by using a boolean expression with the `for` loop itself.

#### **Functions**

- Function arguments can have default values
- Functions can return more than one value at once
- Functions can return labelled variables
- Functions receive arguments always by value, and thus we need to use pointers to pass memory addresses to make changes to references.
- There is no concept of function overloading (multiple declarations of functions with the same name but different function signatures) in Go.
- `panic` is used to crash your program and halt its entire execution.
- `defer` is used to delay the execution of a function to the end of the current function. It maintains a stack, and thus the functions run in the reverse order of the order they were deferred in (in the same scope).

#### **Packages and Modules**

- Every file must be within a package. Only one package (`main`) does not need to be a folder.
- A folder is a `package`. Packages can have simple names (services) or URLs (libraries). Files in the same folder belong to the same package.
- The `main` function acts like an entry point to a package.
- The folder name and the package name mentioned in the files can be different (though it is highly recommended that you keep them the same!) But all the files in a folder must contain the same package name.
- `module` is a group of packages. It contains a `go.mod` file with configuration and metadata. CLI can be used to manipulate the module (`go mod init`, `go build`, `go run`, `go test` etc.)
- Each module must have at least one file with any name but with `package main` and a function called `main`.
- Functions and global (package) variables are shared between all the files in the same package. They can be used directly without being imported.
- Functions, variables, and types that are `TitleCase` are exported to other packages, while others in `camelCase` can be only imported into the files of the package.

#### **General Syntax**

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

#### Using Packages

```go
// File: main.go

package main

// "cli" is the name of the current current module as defined in go.mod
import "cli/data"

func main() {
    print(data.Text)
}
```

<br />

```go
// File: data/constants.go

package data

const Text = "This text is exported from the module."
```

---

## **Key Trivia**

- When working with web and JSON, every number is converted to `float64`.
- Offers functions like `print` and `println` which can be used to print and debug code. But the same are not guaranteed to work on every platform. Thus using the `fmt` package is the industry standard.
- Strings are multi-line by default.
- Does not support string templates. You can use the `fmt.Sprintf` which is a `printf` function, but instead of putting text on the console, it returns a string.
- Provides a default `init` function while is executed even before the `main` function, irrespective of the package or the file it is present in. Typically, it is used to initialize some values and variables.
- The same `.go` file can have multiple copies of the `init` function, and they would be executed in the order they appear in the file (definition order).
- Each variable type can be used as a global function to cast other variables to that type.

---

## **Collections**

- `Arrays`: Fixed length (`[5] int`)
- `Slices`: Similar to dynamic length arrays, but they are actually chunks of arrays (`[]int`)
- `Maps`: Key-value dictionaries (`map[keyType]valueType`)
- Provides support for Generics from version `1.8` onwards.
- You can use the `{}` syntax like in C to initialize arrays.
- Collections are not objects (nothing is an object actually), so we use global functions to work with them, such as `len` and `cap`.

---

## **Error Design Pattern**

Since we don’t have exceptions in Go, this is the typical design pattern that we mostly follow for handling errors.

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

## **Working with Types, Structures, and Interfaces**

You can create `alias` in Go by using the `type` keyboard along with the `=` operator. You can also create new types, which are first-class citizens in the language. They have an associated base type and can have other methods.

```go
package main

type distance float64
type distanceKm = float64 // This is just a type alias

// Method
func (miles distance) ToKm() distanceKm {
    return distanceKm(1.6093 * miles)
}

func main() {
    d := distance(4.5)
    print(d.ToKm())
}
```

**Structures** kind of replace the class idea in Go. It is a data type with strongly typed properties that have a default constructor. You can add methods to the same.

- We can’t have our own “custom constructor” for structs, but we typically use a factory for the same.
- To model inheritance, we use the “embedding” of one structure into the other.
- The properties of the ‘embedded’ struct are not accessible in the constructor of the ‘embedding’ struct. We can use a factory to initialize them properly.
- This is not precisely OOP, but some similarity is indeed present.
- If we embed a struct `A` into a struct `B` and they share a common property `X`, then by default we would be accessing `B`’s `X`. To access the other, we need to say explicitly `B.A.X`. (This is one of the things I loved about Go. Everything is so clear and there is no ambiguity. You have to be explicit about what you want so that you don’t get any runtime weirdness!)

**Interfaces** are a definition of methods. They emulate polymorphism from OOP. They have implicit implementation and can be embedded in other interfaces as well.

- You don’t need to declare manually that a struct is “implementing” an interface. Define the required methods on the struct, define the interface, and you are good to go!

```go
package main

import "fmt"

// Fancy name for list of methods that can be used as a type
type PrettyPrinted interface {
    PrettyPrint() string
}

type User struct {
    // Only properties with TitleCase name would be available in other packages
    id int
    name string
}

// Those this is not a method, but just a function. These are usually referred to as factory functions.
func NewUser (id int, name string) User {
    return User {id, name}
}

// A method on user
func (u User) PrettyPrint() string {
    return fmt.Sprint(u.id) + ": " + u.name
}

type Employee struct {
    employeeId int
    User // We have embedded the same into Employee. id and name would be accessible on it now
}

func NewEmployee (id int, name string, employeeId int) Employee {
    user := NewUser(id, name)
    return Employee {employeeId: employeeId, User: user}
}

func (e Employee) PrettyPrint() string {
    return fmt.Sprint(e.id) + ", " + fmt.Sprint(e.employeeId) + ": " + e.name
}

func main() {
    var u1 User
    // Each struct has two pre-built constructors, with and without name
    // While using the named constructor, you can either define all or some of the properties
    u1 = User {id: 1, name: "John"}
    u2 := User {2, "Doe"}
    msg := u2.PrettyPrint()
  fmt.Println(msg)

    emp := NewEmployee(1, "Harry", 1)
    fmt.Println(emp.id, emp.name, emp.employeeId)

    // Create an array of Users as well as Employee's
    humans := [3]PrettyPrinted {u1, u2, emp}
    for _, human := range humans {
        fmt.Println(human.PrettyPrint())
    }
}
```

- To change the way your struct is printed to the console with `fmt.Print` and related functions, you need to add a method called `String()` to the struct with a return type of `string`. The same would be used with the `%v` placeholder by the `fmt` library.
- Conversion from `int` to `string` in Go yields a string of one rune, not a string of digits. Thus to convert integers into strings, use `fmt.Sprint()`.

---

## **Goroutines and Channels**

A `goroutine` is the Go way of using threads. We can open a goroutine by just invoking any function with a `go` prefix. They can communicate through channels, which are a particular type of variable. A `channel` contains a value of any kind. A routine can define a value for a channel, and other routines can wait for that value. Channels can be buffered or not. To avoid deadlocks, you have to close the channels before ending the program with `close(chan)`.

```go
package main

import (
    "fmt",
    "time"
)

func printMessage(text string) {
    for i := 0, i < 2; i++ {
        fmt.Println(text)
        time.Sleep(800 * time.Millisecond)
    }
}

func main() {
    // Creating channels
    var m1 chan string
    m2 := make(chan string)

    m2 <- "hello"     // Assigning the value to channel
    message := <- m2  // Waiting for the value of the channel

    go printMessage("A")
    printMessage("B")

    /*
    * If we add go to both print statements, then our app would die without executing anything
    * This is because though we would have started 2 goroutines, the main goroutine would reach the end of it's lifetime and the main process would be dropped, thus killing the program.
    */

    // <- m2
    // Valid syntax to wait for the value of a channel

    // Creating buffers
    logs := make(chan string, 2)
    logs <- "hello"
    logs <- "world"
    fmt.Println(<-logs)
    fmt.Println(<-logs)
    // If there are multiple goroutines, then the channels would wait for the values to be put in the buffer

}
```

**Personal Opinion:** I hate threading. It’s always one of these things that I want to avoid at any cost. But Go actually simplifies the same to a great extent!

## **Closing Remarks**

`Go` remains true to its name and lets you go at a super speed into development first. It’s weird not to have classes, objects, and enums (especially when now there are languages like `Rust` which consider enums their core strength), and the `if err != nil` pattern is nothing short of a huge pain, but it all start’s to make a bit of sense if you look and reason about the core promises it tries to uphold. I hate title casing every property, variable, and function, but the simplicity it offers compensates for the same.

It’s a fun language to work with, and its utility in the modern development landscape speaks for its efficiency and reliability. It’s good to know Go, and hopefully, this guide wouldn’t let it become a stranger again.
