---
title: "Learning TypeScipt | Advent of TS '24"
description: A editorial-cum-educative blog teaching the basic features of typescripts, inspired by the Advent of TypeScript '24 exercise.
pubDate: 2023-12-20
tags: ["TypeScript", "2023"]
hero: "./images/aots24.png"
heroAlt: "Christmas background with caption 'Learn TS with Advent of TypeScript'"
draft: false
---

I love the concept of Advent Calendars, and I am glad there is one for TypeScript, too! 🎄

I first learned about TypeScript in 2022, and since then, TypeScript has become the first dependency I add to any Node or JavaScript project I work on. The developer experience and the tooling associated with the TS ecosystem are too good to pass on, especially as your project scales in size.

[The Advent of TypeScript](https://adventofts.com/) is a yearly event in December, during which a new TypeScript concept is introduced each day. I decided to participate in the same this year, and I will document what I have learned here.

You probably should have "some" idea of TypeScript to follow along, but even if you don't, that’s fine. The whole point of events like Advent of TypeScript is to learn something new, and I would encourage you to participate! The blog has no rigid structure and would alternate between briefly discussing the concepts involved in solving the day's problem and sharing resources to read about them and the solution itself! All the solutions would be wrapped in a collapsible, so you can try solving the problem yourself before looking at the solution!

Let me know if the blog was helpful to you and if you would like me to continue with it in the future!

PS. Try solving the problems yourself before looking for solutions. It is a great way to learn that will not only teach TypeScript but also teach you to read and debug TypeScript code, making you a better problem solver and developer! 🚀

---

## [Day 1](https://www.adventofts.com/events/2024/1)

To define a type in typescript, you use the `type` keyword followed by the name of the type and its definition. There are many primitive types associated with TypeScript, such as `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, and `object`. You can also define custom types using the `type` keyword.

### Solution

```typescript showLineNumbers
type Demand = number;
```

---

## [Day 2](https://www.adventofts.com/events/2024/2)

The types are not limited to "type"s; you can use numbers, strings, and constants (declared with `const`) as types. This is useful when you want to limit a variable's values.

### Solution

```typescript showLineNumbers
type Demand = 900000;
```

---

## [Day 3](https://www.adventofts.com/events/2024/3)

TypeScript can be used to annotate functions as well. You can define the types of arguments that a function takes and the type of the function's return value. This is a major advantage of TypeScript over JavaScript, as it allows you to catch type errors at compile time and helps ensure that all the expected values are passed to the function.

### Solution

```typescript showLineNumbers
const survivalRatio = (input: number) => {
  const data = annualData[input];
  if (!data) {
    throw new Error("Data not found");
  }
  return data.housingIndex / data.minimumWage;
};
```

---

## [Day 4](https://www.adventofts.com/events/2024/4)

You can use the concept of [type unions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) to define a type that can take multiple values. Think of the same as an `OR` operation, where the type can be either of the types defined in the union.

The `typeof` operator can be used to determine the type of a variable at runtime. This is useful when performing different operations based on the variable type.

When using type unions, you can use conditionals to narrow the type associated with the provided variable. TypeScript is smart enough to understand that if a variable is checked for a particular type, it must be of that type in the subsequent code blocks.

### Solution

```typescript showLineNumbers
const survivalRatio = (input: number | string) => {
  const quarter = typeof input === "string" ? input : `${input} Q1`;
  const data = quarterlyData[quarter];
  if (!data) {
    throw new Error("Data not found");
  }
  return data.housingIndex / data.minimumWage;
};
```

---

## [Day 5](https://www.adventofts.com/events/2024/5)

[Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) are a powerful feature of TypeScript that allows you to define a type that can take multiple types as arguments. This is useful when writing a function or a class that can work with different data types.

Generics are defined using the `<>` syntax, followed by the type parameter's name. You can then use this type parameter as a placeholder for the actual type that will be passed to the function or class. This allows you to write more flexible and reusable code, as you can define the type of data that the function or class will work with when you call it.

Generics can be thought of as variables for types. They allow you to write functions, classes, and interfaces that can work with any data without specifying the type explicitly until you consume the function or class. They can be a bit tiresome to understand at first, but once you get the hang of them, they can be a powerful tool in your TypeScript arsenal.

### Solution

```typescript showLineNumbers
const createRoute = <T>(author: string, route: T): T => {
  console.log(`[createRoute] route created by ${author} at ${Date.now()}`);
  return route;
};
```

---

## [Day 6](https://www.adventofts.com/events/2024/6)

The [extends](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints) keyword can be used to define constraints on the type parameter of a generic function or class. This allows you to restrict the types that can be passed to the function or class and helps to ensure that the function or class works correctly with the data passed to it.

### Solution

```typescript showLineNumbers
const createRoute = <Route extends number | string>(
  author: string,
  route: Route,
) => {
  console.log(`[createRoute] route created by ${author} at ${Date.now()}`);
  return route;
};
```

---

## [Day 7](https://www.adventofts.com/events/2024/7)

The [const](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints) keyword can define a constant value in TypeScript. This is useful when defining a value that cannot be changed once set. Constants often define values used throughout your code, such as configuration settings or default values.

`const` is particularly useful for narrowing the variable type, as TypeScript can infer the type of a constant based on the value assigned to it.

### Solution

```typescript showLineNumbers
const createRoute = <const Route extends string[]>(
  author: string,
  route: Route,
) => ({
  author,
  route,
  createdAt: Date.now(),
});
```

---

## [Day 8](https://www.adventofts.com/events/2024/8)

NodeJS defines [global variables](https://nodejs.org/api/globals.html) available in all modules. These variables can be used to access information about the current module, such as the filename, directory name, and module exports, and do not need to be imported.

You can use the concept of TypeScipt [modules](https://www.typescriptlang.org/docs/handbook/2/modules.html) and [namespaces](https://www.typescriptlang.org/docs/handbook/2/namespaces.html) to organize your code, prevent naming conflicts, and make your code more readable and maintainable. These can also be used to extend the type definitions of third-party libraries and even built-in NodeJS modules.

Today will also be a good day to brush up on the concept of [interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html#interfaces) in TypeScript, which are used to define the shape of an object. Though interfaces and types are similar, interfaces are more commonly used to define the structure of an object. They are "extendable" in nature, making them a better choice when you want to define an object's structure that other users can extend in the future.

### Solution

```typescript showLineNumbers
declare namespace NodeJS {
  interface ProcessEnv {
    MOOD_LIGHTS: "true";
    BATH_TEMPERATURE: "327.59";
    STRAWBERRIES: "chocolate";
  }
}
```

---

## [Day 9](https://www.adventofts.com/events/2024/9)

[Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html) can also define types for NPM packages and external libraries. Using the [export](https://www.typescriptlang.org/docs/handbook/2/modules.html#export) keyword allows you to export a type from a module, making it available to others that import it. This is particularly useful if you want to define some internal types in a module that you do not want your module's other modules and consumers to have access to.

### Solution

```typescript showLineNumbers
declare module "santas-special-list" {
  export type Status = "naughty" | "nice";
  export type Child = {
    name: string;
    status: Status;
  };
  export type List = Child[];
}
```

---

## [Day 10](https://www.adventofts.com/events/2024/10)

[Enums](https://www.typescriptlang.org/docs/handbook/enums.html) in TypeScript are a way to define a set of named constants, which can represent numeric or string values. By default, TypeScript enums are associated with numbers and auto-increment their values starting from `0`. For example:

```typescript showLineNumbers
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}
```

The numbers assigned to the enum members can be explicitly defined, allowing you to customize the values or skip certain numbers. Once a value is assigned to an enum member, the subsequent members continue auto-incrementing from that value:

```typescript showLineNumbers
enum Direction {
  Up = 10, // 10
  Down, // 11
  Left = 20, // 20
  Right, // 21
}
```

You can also explicitly assign numbers to every member:

```typescript showLineNumbers
enum StatusCode {
  OK = 200,
  BadRequest = 400,
  NotFound = 404,
}
```

You can access both the name and the number, as enums in TypeScript support reverse mapping:

```typescript showLineNumbers
console.log(StatusCode.OK); // 200
console.log(StatusCode[200]); // "OK"
```

Enums can be changed or extended by assigning new numbers or values during their declaration. This flexibility makes them a powerful feature in TypeScript for managing sets of related constants.

### Solution

Well, the first thought is to create a simple enum with the required mappings, something like:

```typescript showLineNumbers
enum Gift {
  Coal,
  Train,
  Bicycle,
  Traditional,
  SuccessorToTheNintendoSwitch,
  TikTokPremium = 8,
  Vape = 16,
  OnTheMove = 26,
  OnTheCouch = 28,
}
```

The same would satisfy all the constraints, but upon submitting, you get an error message about using invalid characters like `6`, `7`, `9`, etc. Looking at the note in the problem statement, we find the large note about NOT trying to copy the enum values from the problem statement. After looking at the huge hint, we do realize that we can make use of binary operators to solve the problem:

```typescript showLineNumbers
enum Gift {
  Coal,
  Train,
  Bicycle,
  Traditional,
  SuccessorToTheNintendoSwitch,
  TikTokPremium = SuccessorToTheNintendoSwitch << 1,
  Vape = TikTokPremium << 1,
  OnTheMove = Vape | TikTokPremium | Bicycle,
  OnTheCouch = Coal | TikTokPremium | Vape | SuccessorToTheNintendoSwitch,
}
```

---

## [Day 11](https://www.adventofts.com/events/2024/11)

The `new` keyword is used in JavaScript to call the constructors of any object in the object. You can also extend this concept to TypeScript, use the `new` keyword to create instances of classes and provide the required type definitions to the class's constructor.

```typescript showLineNumbers
type Gift = {
  name: string;
  price: number;
};

type GiftConstructor = new (name: string, price: number) => Gift;
```

You might also need to learn about [conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) to solve the problem. Conditional types are a powerful feature of TypeScript that allows you to define types based on a condition. This is useful when you want to create a type that depends on another type's value and helps ensure the type system is flexible and can adapt to different situations.

Looping over the keys of an object can be done using the `keyof` operator, which returns a union of the object's keys. You can then access and perform operations on the object's properties using this union. It would also help to know about [template literals](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) to solve the problem.

PS. This is the beginning of the actual "hard" part of the Advent of TypeScript, and the problems scale very quickly from this onwards. The solutions use many advanced TypeScript features and would probably not strike you if you see them for the first time. Please do not get demotivated, and you can try solving the other [TypeHero](https://typehero.dev/) challenges to get a better hang of such problem-solving patterns.

### Solution

First, let us read through the provided tests and try to reason about what is happening. After a couple of glances, we realize that, indeed, the type `Excuse` is a constructor type in which we can pass any object with a key value, and then the final returned object from the constructor is a string of the form `${key}: ${value}.` We can break the solution into multiple parts and solve it piecewise:

```typescript showLineNumbers
type StringRecord = Record<string, string>;

type Stringify<T extends StringRecord> =
  `${keyof T extends string ? keyof T : ""}: ${T[keyof T]}`;

type Excuse<T extends StringRecord> = new (obj: T) => Stringify<T>;
```

1. First, we need to define a type guard that only allows the objects with both strings as keys and values. For this, we use the utility type `Record` provided by TypeScript and create the type `StringRecord` that only allows objects with string keys and string values.

2. Next, we work on defining the `Stringify` type, which accepts a "string" object and then converts it to the appropriate `${key}: ${value}` format. We make use of the template literal types to achieve the same.

   - The `keyof T` would return us a union of the object's keys, and we can then use that to access the object's properties as `T[keyof T]`.
   - The union CAN contain multiple keys (as we are not restricting the same), but we can be sure that the tests only pass objects with a single key-value pair, so we can safely assume that the union would only contain a single key, and we can access the keys and values as above.
   - Thus, the template literal should be of the form `${keyof T}: ${T[keyof T]}`, but because the `keyof T` can contain types such as `symbol` and `undefined`, we need to ensure that we only consider the string keys. Thus, we use the conditional operator to check if the key is a string, and then we use the key and value to form the template literal.
   - Thus, the final type would be the form `${keyof T extends string ? keyof T : ""}: ${T[keyof T]}`.

3. In the last step, we define the `Excuse` type, a constructor type that accepts an object of type `T` and returns a string of the form `${key}: ${value}`. We make use of the `Stringify` type to ensure that the object passed to the constructor is of the correct type.

---

## [Day 12](https://www.adventofts.com/events/2024/12)

Using recursion in types is a powerful feature of TypeScript that allows you to define types that depend on themselves.

Let us try to solve a simple problem. Suppose we have a type representing a list of strings like `["Alice", "Bob", "Charlie"]`, and you want to create a type that reverses the order of the list so that it becomes `["Charlie", "Bob", "Alice"]`. You can use recursion to define a type that takes the first element of the list, appends it to the end of the reversed list, and then calls itself with the rest. For this, it is common to use variables like `Accumulator` and `Rest` to keep track of the reversed list and the remaining list, respectively, and to use the `infer` keyword to infer the type of the first element of the list. TypeScript also supports destructuring of array types using the `...` operator and the concept of default type arguments.

```typescript showLineNumbers
type Reverse<T extends any[], Accumulator extends any[] = []> = T extends [
  infer Head,
  ...infer Rest,
]
  ? Reverse<Rest, [Head, ...Accumulator]>
  : Accumulator;

type Original = ["Alice", "Bob", "Charlie"];
type Reversed = Reverse<Original>; // ["Charlie", "Bob", "Alice"]
```

This is a common recursive pattern! I would highly encourage you to first test out this recursive pattern on your own for today's problem (without seeing the hint) and then try thinking if the same can be improved upon to work with the humongous input provided in this day's tests!

### Solution

Today's solution is a bit longer and has multiple moving parts. I have tried to break them into smaller parts and combine them to form the final solution.

```typescript showLineNumbers
type Rating = "naughty" | "nice";
type FlipRating<Cur extends Rating> = Cur extends "naughty"
  ? "nice"
  : "naughty";

type NaughtyOrNice<
  S extends string,
  Ty extends Rating = "naughty",
> = S extends `${infer _}${infer Rest}`
  ? NaughtyOrNice<Rest, FlipRating<Ty>>
  : Ty;

type ConvertToNum<S extends string> = S extends `${infer Num extends number}`
  ? Num
  : never;

type ObjectFromArray<Arr extends [string, string, string]> = {
  name: Arr[0];
  count: ConvertToNum<Arr[2]>;
  rating: NaughtyOrNice<Arr[0]>;
};
```

In the above utility types:

- `Rating` is a simple union type that can take the values "naughty" or "nice".
- `FlipRating` is a utility type that flips the value of the `Rating` type. If the input is "naughty", it returns "nice", and vice versa.
- `NaughtyOrNice` is a recursive utility type that takes a string and returns the rating of the string. It does so by iterating over the string and flipping the value of the `Ty` type for each character in the string.
- `ConvertToNum` is a utility type that converts a string to a number. It does so by checking if the string can be converted to a number, and if so, returns the number. If not, it returns `never`. We cleverly use the template literal types along with type constraints on the same to achieve this.
- `ObjectFromArray` is a utility type that takes an array of strings and returns an object with the name, count, and rating properties. It does so by extracting the elements of the array and converting them to the appropriate types.

Now, with all these utility types in place, we can define the final type to iterate over the provided array and convert it to the required array of objects:

```typescript showLineNumbers
type FormatNames<
  Arr extends [string, string, string][],
  Acc extends any[] = [],
> = Arr extends [
  infer Curr extends [string, string, string],
  ...infer Rest extends [string, string, string][],
]
  ? FormatNames<Rest, [...Acc, ObjectFromArray<Curr>]>
  : Acc;
```

But, no surprise, the same does not work due to the large nature of the provided input, and we get the error of infinite possible nesting. To solve the same, we need to figure out a non-recursive way of looping over the array, and this is where [indexed types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) come into play (yes, they can be used to work with arrays as well!). We can make use of the `keyof` operator to iterate over the keys of the array (with would be the indexes associated with the elements), and then access the actual values as `Arr[K]` where `K` is the index (key). The actual solution would look something like:

```typescript showLineNumbers
type FormatNames<Arr extends [string, string, string][]> = {
  [K in keyof Arr]: ObjectFromArray<Arr[K]>;
};
```

This was indeed a lengthy day, but after this day, you should feel comfortable with all the common techniques and tricks that are used in what is effectively "advanced" TypeScript problem-solving.

PS. All the code I have shown you today can be compressed and typed in way fewer keystrokes (by inlining the types and removing some type constraints with `extends`), but I have tried to keep the code as verbose as possible to make it easier to understand. You can try to compress the code and see how much you can reduce the number of lines and characters in the code!

---

## [Day 13](https://www.adventofts.com/events/2024/13)

In TypeScript, variance describes how types relate to each other, particularly in generic types and function parameters.

- Covariant types allow substituting a more specific (subtype) type for a more general (supertype) type. For instance, arrays in TypeScript are covariant: `string[]` can safely be assigned to `readonly (string | number)[]` because `string` is a subtype of `string | number`.
- Contravariant types, however, allow substituting a more general type for a more specific one. Function parameters in TypeScript are contravariant under strict function checks: a function expecting a general parameter type can accept a function with a specific parameter type.
- Bivariant types allow both directions: more general or specific types can be substituted. This happens, for example, in event listeners or function parameters without strict function types enabled.
- Invariant types do not allow substitution in either direction. TypeScript's generics default to invariant, meaning you cannot assign `Foo<SubType>` to `Foo<SuperType>` or vice versa without explicit variance.

To ensure type safety, these distinctions matter when working with generic constraints, function types, and array-like structures. You can read about the same in detail [here](https://www.sandromaglione.com/articles/covariant-contravariant-and-invariant-in-typescript) and see how their implementations can be realized practically. The [variance annotations section from the official documentation](https://www.typescriptlang.org/docs/handbook/2/generics.html#variance-annotations) might also be a good reference for solving today's problem.

### Solution

The generic of `Demand` needs to be invariant to any types passed to it (it doesn't accept any more specific or vague types). We can use the `out` keyword so that only anything more specific can be passed to `T`, and the `in` keyword so that only anything more general can be passed to `T`.

```typescript showLineNumbers
type Demand<in out T> = {
  demand: T;
};
```

PS. This solution is exactly what the official documentation says you SHOULD NOT do! I couldn't figure out a better solution, and the provided tests were not very helpful in this case. If you have a better solution, do let me know!

---

## [Day 14](https://www.adventofts.com/events/2024/14)

In TypeScript, generators, and async generators have specialized type annotations to describe their input, output, and return types.

A generator function returns an iterator and uses the `Generator` type:

```typescript showLineNumbers
function* generatorFunc(): Generator<number, string, void> {
  yield 1;
  yield 2;
  return "Done"; // Return type: string
}

const gen = generatorFunc();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.return()); // { value: "Done", done: true }
```

Here, `Generator<Y, R, N>` represents:

- `Y`: Type of values yielded (e.g., `number`).
- `R`: Return type when the generator is done (e.g., `string`).
- `N`: Type of values passed to `next()` (e.g., `void` since there is no input).

An async generator works similarly but returns an asynchronous iterator using the `AsyncGenerator` type:

```typescript showLineNumbers
async function* asyncGenFunc(): AsyncGenerator<number, void, string> {
  const input = yield 1; // Input type: string
  console.log(input); // Logs input passed to `next()`
  yield 2; // Output type: number
}

(async () => {
  const asyncGen = asyncGenFunc();
  console.log(await asyncGen.next()); // { value: 1, done: false }
  console.log(await asyncGen.next("Hello")); // Logs "Hello", then { value: 2, done: false }
})();
```

Equipped with this knowledge, you can now try to solve today's problem!

### Solution

Today's challenge is easier than the previous ones, and it can be solved by studying the provided tests. In the tests, we use the `ReturnType` utility type to extract the return type of the provided generator function, which is equivalent to the `R` type in the `Generator` type.

Thus a simple `infer` and `extends` can be used to extract the return type of the generator function:

```typescript showLineNumbers
type PerfReview<T> =
  T extends AsyncGenerator<infer R, infer _, infer _> ? R : never;
```

---

## [Day 15](https://www.adventofts.com/events/2024/15)

TypeScript provides no method to work with numbers and basic arithmetic. However, we can use the length of arrays/tuples to perform basic arithmetic operations. For example, to add two numbers, you can create an array of the length of the first number and then concatenate it with an array of the length of the second number. The length of the resulting array will be the sum of the two numbers.

```typescript showLineNumbers
type Arr<Len extends number, Acc extends any[] = []> = Acc["length"] extends Len
  ? Acc
  : Arr<Len, [...Acc, 0]>;

type Add<A extends number, B extends number> = [...Arr<A>, ...Arr<B>]["length"];
```

Here the type `Arr` is a utility type that creates an array of the specified length, and the type `Add` is a utility type that adds two numbers by creating arrays of the specified lengths and concatenating them.

You can also use this technique to perform other arithmetic operations and get creative.

### Solution

The solution is a bit more complex than the previous ones but is easy to implement once you get the hang of the same:

```typescript showLineNumbers
type Process<
  Inp extends string,
  ParsingDashes extends boolean = true,
  CurName extends string = "",
  CurDashArr extends any[] = [],
> = Inp extends `${infer First}${infer Rest}`
  ? First extends "-"
    ? ParsingDashes extends true
      ? Process<Rest, true, CurName, [...CurDashArr, 1]>
      : [[CurName, CurDashArr["length"]], ...Process<Inp, true>]
    : Process<Rest, false, `${CurName}${First}`, CurDashArr>
  : [[CurName, CurDashArr["length"]]];

type TrimLeft<
  Str extends string,
  Char extends string,
> = Str extends `${Char}${infer Tail}` ? TrimLeft<Tail, Char> : Str;

type TrimRight<
  Str extends string,
  Char extends string,
> = Str extends `${infer Head}${Char}` ? TrimRight<Head, Char> : Str;

type Trim<Str extends string, Char extends string> = TrimLeft<
  TrimRight<Str, Char>,
  Char
>;

type GetRoute<S extends string> =
  Trim<S, "-"> extends "" ? [] : Process<Trim<S, "-">>;
```

The main crux of the solution is in the `Process` type, which takes the input string and processes it to extract the route and the number of dashes in the route. As each string is supposed to be of the type `A--B--C--D`, we wish to divide it into segments of the form `A`, `--B`, `--C`, `--D`. We do this by maintaining the following state variables:

- `Inp`: The input string that we are processing.
- `ParsingDashes`: A boolean that tells us if we are currently parsing the dashes or the actual route name. This is set to `true` initially, assuming that the first location, `A`, would not have any dashes.
- `CurName`: The current route name that we are parsing.
- `CurDashArr`: An array that keeps track of the number of dashes in each route name.

The type then iterates over the input string, dividing it into two parts: `First` representing the first character of the string and `Rest` representing the rest. If the first character is a dash, and we are currently parsing the dashes, we add the dash to the `CurDashArr`, otherwise it means that we have reached the end of a route segment (of the form `---B`) and thus we add the current route name and the number of dashes to the result array and start parsing the next route name. If the first character is not a dash, we add it to the `CurName` and continue parsing the route name.

The `TrimLeft`, `TrimRight`, and `Trim` types are utility types that trim the input string from the left, right, and both sides, respectively. This removes any leading or trailing dashes from the input string. These are necessary to handle edge cases like `---A--` or `----` that might be present in some of the test cases. Finally, the `GetRoute` type is a utility type that takes the input string and first trims it to remove the troublesome leading and trailing dashes and then processes it to extract the route and the number of dashes in each route name.

---

## [Day 16](https://www.adventofts.com/events/2024/16)

Currying is a technique in functional programming where a function with multiple arguments is transformed into a sequence of functions, each taking a single argument. This allows you to partially apply the function by passing some of the arguments and then apply the remaining arguments later. This way, you can create new functions by combining existing functions and build more complex functions from simpler ones.

In TypeScript, you can use generic and conditional types to create a curried function that takes multiple arguments and returns a sequence of functions. You can then use these functions to build more complex functions by combining them with other functions.

```typescript showLineNumbers
type Curry<T extends any[], R> = T extends [infer F, ...infer Rest]
  ? (arg: F) => Curry<Rest, R>
  : R;
```

Here, the `Curry` type is a utility type that takes an array of arguments `T` and a return type `R`, and returns a function sequence that takes the arguments individually and returns the final result. The type uses conditional types to recursively build the sequence of functions and the `infer` keyword to infer the types of the arguments and the return type. This type applies one argument at a time and returns a new function that takes the next argument until all the arguments have been applied and the final result is returned.

A simple implementation of a curried function that can add three numbers may be done as follows:

```typescript showLineNumbers
type AddThreeIntegers = Curry<[number, number, number], number>;

const addThree: AddThreeIntegers = (a) => (b) => (c) => a + b + c;

const add1 = addThree(1); // (b) => (c) => 1 + b + c
const add1And2 = add1(2); // (c) => 1 + 2 + c
const result = add1And2(3); // 1 + 2 + 3 = 6

console.log(result); // Output: 6
console.log(addThree(1)(2)(3)); // Output: 6

// @ts-expect-error - Too few arguments
addThree(1)();
// @ts-expect-error - Incorrect argument type
addThree(1)("two");
// @ts-expect-error - Too many arguments
addThree(1)(2, 3);
```

Can you use this technique to solve today's problem? (Hint: The number of arguments you apply in each step is not fixed and can vary based on the input. Thus, you might need to define a union of all possible invocations!).

### Solution

This is one of the days where seeing the solution first and then trying to reason about it might be a better approach.

```typescript showLineNumbers
type Curry<Args extends unknown[], Return> = {
  <Provided extends unknown[]>(
    ...args: Provided
  ): Provided extends Args
    ? Return
    : Args extends [...Provided, ...infer Remaining]
      ? Curry<Remaining, Return>
      : never;
};

declare function DynamicParamsCurrying<Args extends unknown[], Ret>(
  fn: (...args: Args) => Ret,
): Curry<Args, Ret>;
```

As you can see here, the definition of the `Curry` type has been modified to be a type union:

- In line 2, we define a function signature whose arguments are of the type `Provided` (where `Provided` is generic with respect to the current function call).
- In line 4, we check if the `Provided` arguments match the `Args` type. If they do, we return the `Return` type as we can be sure that the complete set of arguments has been provided.
- If not, in line 6, we check if the `Args` type can be split into the `Provided` and the `Remaining` arguments. If it can, we return a new `Curry` type with the `Remaining` arguments and the `Return` type.

This clever use of conditional types, recursion, and generics to define a currying function can enumerate all possible invocations and return the final result when all the arguments have been provided.

Finally, we provide the `DynamicParamsCurrying` function that takes a function and returns a curried version of the function. This function uses the `Curry` type to define the curried version of the function and can be used to curry any function with any number of arguments.

You can also use the `Parameters` and `ReturnType` utility types to extract the parameters and return type of the function!

```typescript showLineNumbers
declare function DynamicParamsCurrying<Fn extends (...args: any[]) => any>(
  fn: Fn,
): Curry<Parameters<Fn>, ReturnType<Fn>>;
```

---

## [Day 17](https://www.adventofts.com/events/2024/17)

TypeScript provides several [utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html) that can be used to manipulate and transform types. These utility types can create new types from existing types and help simplify complex type definitions in common workflows!

Read about them, and even try implementing them yourself to better understand the power of the TypeScript ecosystem!

### Solution

This day was a bit trickier than usual, as getting the types correct for the utility functions was an underestimated task. The final solution would look something like:

```typescript showLineNumbers
const compose =
  <A, B, C, D>(f: (x: A) => B, g: (x: B) => C, h: (x: C) => D) =>
  (a: A): D =>
    h(g(f(a)));

const upperCase = <T extends string>(x: T) => x.toUpperCase() as Uppercase<T>;
const lowerCase = <T extends string>(x: T) => x.toLowerCase() as Lowercase<T>;
const firstChar = <T extends string>(x: T) =>
  x[0] as T extends `${infer F}${infer _}` ? F : never;
const firstItem = <T extends string[]>(x: T) => x[0] as T[0];
const makeTuple = <T extends string>(x: T): [T] => [x];
const makeBox = <T>(value: T): { value: T } => ({ value });
```

For the `compose` function, we make use of 4 type parameters, where `A` is the input type, `B` is the type of the first function's output, `C` is the type of the second function's output, and `D` is the final output type. Defining these variables allowed us to correctly constrain the signatures of the intermediate functions `f`, `g`, and `h`. We could also have used the TypeScipt utility type `ReturnType` to extract the return type and `Parameters` to extract the parameters of the functions, but the same was not required in this case.

To define the types of the utility functions, we make use of utility types such as `Lowercase` and `Uppercase`, along with typecasting with the [as](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) keyword to ensure that the return types are of the correct type. We also use template literal types to extract a string's first character and an array's first item.

---
