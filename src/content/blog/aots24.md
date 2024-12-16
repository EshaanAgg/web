---
title: "Learning TypeScipt | Advent of TS '24"
description: A editorial-cum-educative blog teaching the basic features of typescripts, inspired by the Advent of TypeScript '24 exercise.
pubDate: 2023-12-20
tags: ["TypeScript", "2023"]
draft: false
---

I love the concept of Advent Calendars, and I am glad that there is one for TypeScript as well! 🎄

I first came to know about TypeScript in 2022, and since then TypeScript has become the first dependency that I add to any Node or JavaScript project that I work on. The developer experience and the tooling associated with the TS ecosystem is simply too good to pass on, specially as your project scales in size.

[Advent of TypeScript](https://adventofts.com/) is a yearly event that takes place in the month of December, where a new TypeScript concept is introduced each day. I decided to take part in the same this year, and I am going to document my learnings here.

You probably should have "some" idea of TypeScript to follow along, but even if you don't, thats fine. The whole point of events like Advent of TypeScript is to learn something new, and would encourage you to take part in the same! The blog has no rigid strcuture, and would alternate between breifly discussing the concepts involved in solving the days's problem and sharing resources to read about them, and the solution itself! All the solutions would be wrapped in a collapsible, so that you can try to solve the problem yourself before looking at the solution!

Do let me know if the blog was helpful to you, and if you would like me to continue with the same in the future!

PS. Do try solving the problems yourself before looking at the solutions. It is a great way to learn, that will not only teach TypeScript, but also teach you to read and debug TypeScript code, maming you a better problem solver and developer as a whole! 🚀

## [Day 1](https://www.adventofts.com/events/2024/1)

To define a type in typescript, you make use of the `type` keyword followed by the name of the type and its definition. There are many primitive types associated with TypeScript, such as `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, and `object`. You can also define custom types using the `type` keyword.

<details>
<summary> Solution </summary>

```typescript
type Demand = number;
```

</details>

## [Day 2](https://www.adventofts.com/events/2024/2)

The types are not well limited to "type"s, and you can even use numbers, strings and constants (declared with `const`) as types. This is useful when you want to limit the values that a variable can take.

<details>
<summary> Solution </summary>

```typescript
type Demand = 900000;
```

</details>

## [Day 3](https://www.adventofts.com/events/2024/3)

TypeScript can be used to annotate functions as well. You can define the types of the arguments that a function takes, as well as the type of the return value of the function. This is a major advantage of TypeScript over JavaScript, as it allows you to catch type errors at compile time itself, and helps to ensure that that all the expected values are passed to the function.

<details>
<summary> Solution </summary>

```typescript
const survivalRatio = (input: number) => {
  const data = annualData[input];
  if (!data) {
    throw new Error("Data not found");
  }
  return data.housingIndex / data.minimumWage;
};
```

</details>

## [Day 4](https://www.adventofts.com/events/2024/4)

You can use the concept of [type unions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) to define a type that can take multiple values. Think of the same as an `OR` operation, where the type can be either of the types defined in the union.

The `typeof` operator can be used to determine the type of a variable at runtime. This is useful when you want to perform different operations based on the type of the variable.

When using type unions, you can use conditionals to narrow the type assciated with the provided variable. TypeScript is smart enough to understand that if a variable is checked for a particular type, then it must be of that type in the subsequent code blocks.

<details>
<summary> Solution </summary>

```typescript
const survivalRatio = (input: number | string) => {
  const quarter = typeof input === "string" ? input : `${input} Q1`;
  const data = quarterlyData[quarter];
  if (!data) {
    throw new Error("Data not found");
  }
  return data.housingIndex / data.minimumWage;
};
```

</details>

## [Day 5](https://www.adventofts.com/events/2024/5)

[Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) are a powerful feature of TypeScript that allow you to define a type that can take multiple types as arguments. This is useful when you want to write a function or a class that can work with different types of data.

Generics are defined using the `<>` syntax, followed by the name of the type parameter. You can then use this type parameter as a placeholder for the actual type that will be passed to the function or class. This allows you to write more flexible and reusable code, as you can define the type of the data that the function or class will work with when you call it.

Generics can be thought of as variables for types. They allow you to write functions, classes, and interfaces that can work with any type of data, without having to specify the type explicitly, until you consume the function or class. They can be a bit tiresome to understand at first, but once you get the hang of them, they can be a powerful tool in your TypeScript arsenal.

<details>
<summary> Solution </summary>

```typescript
const createRoute = <T>(author: string, route: T): T => {
  console.log(`[createRoute] route created by ${author} at ${Date.now()}`);
  return route;
};
```

</details>

## [Day 6](https://www.adventofts.com/events/2024/6)

The [extends](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints) keyword can be used to define constraints on the type parameter of a generic function or class. This allows you to restrict the types that can be passed to the function or class, and helps to ensure that the function or class works correctly with the data that is passed to it.

<details>
<summary> Solution </summary>

```typescript
const createRoute = <Route extends number | string>(
  author: string,
  route: Route,
) => {
  console.log(`[createRoute] route created by ${author} at ${Date.now()}`);
  return route;
};
```

</details>

## [Day 7](https://www.adventofts.com/events/2024/7)

The [const](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints) keyword can be used to define a constant value in TypeScript. This is useful when you want to define a value that cannot be changed once it has been set. Constants are often used to define values that are used throughout your code, such as configuration settings or default values.

`const` is particularly useful for narrowing the type of a variable, as TypeScript can infer the type of a constant based on the value that is assigned to it.

<details>
<summary> Solution </summary>

```typescript
const createRoute = <const Route extends string[]>(
  author: string,
  route: Route,
) => ({
  author,
  route,
  createdAt: Date.now(),
});
```

</details>

## [Day 8](https://www.adventofts.com/events/2024/8)

NodeJS defines [global variables](https://nodejs.org/api/globals.html) that are available in all modules. These variables can be used to access information about the current module, such as the filename, directory name, and module exports, and do not need to be imported.

You can use the concept of TypeScipt [modules](https://www.typescriptlang.org/docs/handbook/2/modules.html) and [namespaces](https://www.typescriptlang.org/docs/handbook/2/namespaces.html) to not only to organize your code, but also to prevent naming conflicts and to make your code more readable and maintainable. These can also be used to extend the type definitions of third-party libraries, and even builtin NodeJS modules.

Today will also be a good day to brush on the concept of [interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html#interfaces) in TypeScript, which are used to define the shape of an object. Though interfaces and types are similar, interfaces are more commonly used to define the structure of an object and are "extendable" in nature, making them a better choice when you want to define the structure of an object that can be extended in the future by other users.

<details>
<summary> Solution </summary>

```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    MOOD_LIGHTS: "true";
    BATH_TEMPERATURE: "327.59";
    STRAWBERRIES: "chocolate";
  }
}
```

</details>

## [Day 9](https://www.adventofts.com/events/2024/9)

[Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html) can be used define types for NPM packages and external libraries as well. The use of the [export](https://www.typescriptlang.org/docs/handbook/2/modules.html#export) keyword allows you to export a type from a module, making it available to other modules that import it. This is particularly useful if you want to define some internal types in a module, that you do not want the other modules and consumers of your module to have access to.

<details>
<summary> Solution </summary>

```typescript
declare module "santas-special-list" {
  export type Status = "naughty" | "nice";
  export type Child = {
    name: string;
    status: Status;
  };
  export type List = Child[];
}
```

</details>

## [Day 10](https://www.adventofts.com/events/2024/10)

[Enums](https://www.typescriptlang.org/docs/handbook/enums.html) in TypeScript are a way to define a set of named constants, which can represent numeric or string values. By default, TypeScript enums are associated with numbers and auto-increment their values starting from `0`. For example:

```typescript
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}
```

The numbers assigned to the enum members can be explicitly defined, allowing you to customize the values or even skip certain numbers. Once a value is assigned to an enum member, the subsequent members continue auto-incrementing from that value:

```typescript
enum Direction {
  Up = 10, // 10
  Down, // 11
  Left = 20, // 20
  Right, // 21
}
```

You can also explicitly assign numbers to every member:

```typescript
enum StatusCode {
  OK = 200,
  BadRequest = 400,
  NotFound = 404,
}
```

You can access both the name and the number, as enums in TypeScript support reverse mapping:

```typescript
console.log(StatusCode.OK); // 200
console.log(StatusCode[200]); // "OK"
```

Enums can be changed or extended by assigning new numbers or values during their declaration. This flexibility makes them a powerful feature in TypeScript for managing sets of related constants.

<details>
<summary> Solution </summary>

Well the first thought is to create a simple enum with the required mappings, something like:

```typescript
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

The same would satisfy all the constraints, but upon submitting you get an error message about using invalid characters like `6`, `7`, `9` etc. When we look at the note in the problem statement, we do indeed find the large note about NOT trying to just copy the enum values from the problem statement. After looking at the huge hint, we do relaise that we can make use of binary operators to solve the problem:

```typescript
enum Gift {
  Coal,
  Train,
  Bicycle,
  Traditional,
  SuccessorToTheNintendoSwitch,
  TikTokPremium = SuccessorToTheNintendoSwitch << 1,
  Vape = TikTokPremium << 1,
  OnTheMove = Vape | TikTokPremium | Bicycle,
  OnTheCouch = (OnTheMove & ~Bicycle) | SuccessorToTheNintendoSwitch,
}
```

</details>

## [Day 11](https://www.adventofts.com/events/2024/11)

The `new` keyword is used in JavaScript to call the constructors of any object in object. You can extend this concept to TypeScript as well, and use the `new` keyword to create instances of classes, and provide the required type definitions to the constructor of the class.

```typescript
type Gift = {
  name: string;
  price: number;
};

type GiftConstructor = new (name: string, price: number) => Gift;
```

You might also need to learn about [conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) to solve the problem. Conditional types are a powerful feature of TypeScript that allow you to define types based on a condition. This is useful when you want to create a type that depends on the value of another type, and helps to ensure that the type system is flexible and can adapt to different situations.

Looping over the keys of an object can be done using the `keyof` operator, which returns a union of the keys of the object. You can then use this union to access the properties of the object, and perform operations on them. It would also be of help to know about [template literals](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) to solve the problem.

PS. This is the beginning of the actual "hard" part of Advent of TypeScript, and the problems scale very quickly from this onwards. The solutions make use of a lot of advanced TypeScript features, and would not probably strike you if you are seeing them for the first time. Please do not get demotivated, and you can try solving the other [TypeHero](https://typehero.dev/) challenges to get a better hang of such problem solving patterns.

<details>
<summary> Solution </summary>

First tell us read through the provided tests and try to reason about what is happening. After a couple of glances we realise that indeed the type `Excuse` is a constructor type, in which we can pass any object with a key-value, and then the final returned object from the constructor is a string of the form `${key}: ${value}`. We can break the solution into multiple parts and solve it piecewise:

```typescript
type StringRecord = Record<string, string>;

type Stringify<T extends StringRecord> =
  `${keyof T extends string ? keyof T : ""}: ${T[keyof T]}`;

type Excuse<T extends StringRecord> = new (obj: T) => Stringify<T>;
```

1. First we need to define a type guard that only allows the objects with both strings as key and values. For this we make use of the utility type `Record` provided by TypeScript, and create the type `StringRecord` that only allows objects with string keys and string values.

2. Next we work on defining the `Stringify` type which accepts a "string" object, and then converts it to the appropiate `${key}: ${value}` format. We make use of the template literal types to achieve the same.

   - The `keyof T` would return us an union of the keys of the object, and we can then use that to access the properties of the object as `T[keyof T]`.
   - The union CAN contain multiple keys (as we are not restricting the same), but we can be sure that the tests only pass objects with a single key-value pair, so we can safely assume that the union would only contain a single key, and we can access the keys and values as above.
   - Thus the template literal should be of the form `${keyof T}: ${T[keyof T]}`, but because the `keyof T` can contain types such as `symbol` and `undefined`, we need to ensure that we only consider the string keys, and thus we use the conditional operator to check if the key is a string, and then use the key and value to form the template literal.
   - Thus the final type would be of the form `${keyof T extends string ? keyof T : ""}: ${T[keyof T]}`.

3. In the last step, we define the `Excuse` type, which is a constructor type that accepts an object of type `T` and returns a string of the form `${key}: ${value}`. We make use of the `Stringify` type to ensure that the object passed to the constructor is of the correct type.

</details>

## [Day 12](https://www.adventofts.com/events/2024/12)

Using recursion in types is a powerful feature of TypeScript that allows you to define types that depend on themselves.

Let us try to solve a simple problem. Suppose we have a type representing list of strings like `["Alice", "Bob", "Charlie"]`, and you want to create a type that reverses the order of the list, so that it becomes `["Charlie", "Bob", "Alice"]`. You can use recursion to define a type that takes the first element of the list and appends it to the end of the reversed list, and then calls itself with the rest of the list. For this it is common to use variables like `Accumulator` and `Rest` to keep track of the reversed list and the remaining list respectively, and to use the `infer` keyword to infer the type of the first element of the list. TypeScript also supports destructurng of array types using `...` operator, and the concept of default type arguments.

```typescript
type Reverse<T extends any[], Accumulator extends any[] = []> = T extends [
  infer Head,
  ...infer Rest,
]
  ? Reverse<Rest, [Head, ...Accumulator]>
  : Accumulator;

type Original = ["Alice", "Bob", "Charlie"];
type Reversed = Reverse<Original>; // ["Charlie", "Bob", "Alice"]
```

This is a common recursive pattern! I would highly encourage you to first test out this recursive pattern on your own for today's problem (without seeing the hint), and then try thinking if the same can be improved upon to work with the humongous input provided in this day's tests!
