---
title: "Placements '24: Assesments"
description: A brief of all the online assessments that I witnessed during the season of 2024.
pubDate: 2024-09-29
updateDate: 2024-10-03
draft: true
pinned: true
tags: ["placements", "2024"]
---

Sitting was placements is a huge rollercoster ride, but having some idea of what to expect can make the ride a bit smoother. Here is a brief of all the online assessments (patterns, questions & tips) that I either personally gave or heard about from my peers during the season of 2024.

- [GreyOrange](#greyorange)
- [Squarepoint Capital](#squarepoint-capital)
- [AQR Capital](#aqr-capital)
- [Graviton Research Capital](#graviton-research-capital)

In addition to reading about the questions from here, please do search for the companies on Leetcode Discuss or Job Overflow. People even post about the questions in Codeforces blogs many a times, so a bit of time searching about PYQs and questions on different campuses can be very beneficial.

---

# GreyOrange

- 45 min test with 60 MCQs and 2 coding questions
- MCQs based on basic C++ and OOPS

## Coding Questions

- Print a 2D matrix
- Print the second greatest element of array

---

# Squarepoint Capital

- The company had came for three roles on our campus:
  1.  Quant Desk Analyst
  2.  Software Developer
  3.  Infrastructure Engineer

## Quant Desk Analyst

Two coding questions were asked which were same for all the students were asked.

1. A simple implementation of two pointers was to be done, which was described in the question itself. Brute approach needed. LC Easy level.
2. You are given a matrix of size $100 X 100$ with values between $1$ and $50$. In one operation, you can choose any one element, and delete all the elements with the same value in the row and column of the picked element (along with the element itself). Give the minimum number of operations to delete all the elements.

<details>
<summary>Spoiler</summary>

You can read about [question 2](https://leetcode.com/discuss/interview-question/5846629/SquarePoint-OA-Desk-Quant) here. The question actually turns out to be NP Complete, and thus the best you can do is brute force and try all orderings. In the OA to pass the questions, you had to use the (incorrect) greedy approach, where you would always choose the element whose deletion would result in the maximum number of deletions. To solve it in actual constraints, you can [try this](https://codeforces.com/gym/101246/problem/C) on Codeforces.

</details>

## Software Developer

Everyone had different questions, but most of them were LC Easy or Medium. The questions often had vague wording so a lot of hit and trial was required to pass the test cases. Questions from the previous years were repeated. Only 2 programming questions were present for one student.

1. You are given a list of words and a search word. For each prefix in the search word (let's say $X$), you need to find at max 3 lexicographically smallest words from the dictionary that have the same prefix X.

- Number of dictionary words $\leq 10^5$
- Length of dictionary word: $\leq 10^4$
- Sum(Length of all dictionary words) $\leq 10^5$
- Length of search word: $\leq 10^3$

You can try it out [here](https://leetcode.com/problems/search-suggestions-system/description/).

2. A question involving generating unique usernames for all the users on a platform was asked. Only basic string processing was needed, but having vague test descriptions made it difficult to pass the test cases. I had used the debug console to print out the testcases and then tried to guess the output the testcases were expecting. Nasty tricks like trailing whitespaces and wierd ASCII characters were used to make the testcases fail, so you had to be very careful with the output.

## Infrastructure Engineer

The test had two sections, one based on Python and two based on Linux.

### Linux Section

Remote machines were provided to us, and we had to write the Bash scripts to perform the following tasks. Having access to the server allowed to experiment with the commands and test the scripts before submitting them. The evaluation would happen after the contest, where the script would be used on a similar but new server, and check if all the objectives were met.

1. You need to run a `nginx` Docker container and bind it's default port to the server's port $8000$.
2. You were given a file with the first names and the last name of some users. You need to do the following:

- Read the file
- Create a new user for each user in the file with the username as `F_LastName` where `F` is the first letter of the first name and `LastName` is the last name.
- Assign all the users to a group named `users`.
- Ensure that the users are asked to change their password on the first login.

```
John Doe
Jane Doe
John Smith
```

### Python Section

A mock API endpoint was provided, to which we had to make an API call to fetch the data. The response needed to be manipulated and some basic processing of the data items was needed. The response was paginated, so we had to make multiple requests to get all the data. Only basic working experience with Python, and the `requests` library was needed for this section.

---

# AQR Capital

- The test pattern is more or less constant across the years.
- 20 MCQs & 2 coding questions
- MCQs are based on Java, OOPS, DBMS and other core CS concepts.
- There is slightly more preference given to Java questions and OOPS.

The coding questions are relatively easy as compared to other companies, but the MCQs are a bit tricky and time-consuming. I would highly recommend practicing MCQs from GeeksforGeeks and other platforms before giving the test. SQL is one of the most important topics for AQR, so make sure you are well-versed with it.

Also, AQR is known for having wierd (more often that not) atleast one wrong test-case in their OAs, so if you finish early and are stuck on the last test-case, it might be better to skip it! In both my intern as well as placement exams, one test-case was wrong in one of the questions. AQR also does not run the same number of test-cases for everyone, so it's possible that you might get a different number of test-cases than your friend.

### PYQs

1. There is a river from point $0$ to $L$. You need to cross the river by stepping on stones. There are $n$ stones present in the river at the points $arr[i]$. During your journey, if the max jump that you make is $k$, and the number of jumps that you make is $x$, then the cost associated with the journey is equal to $k^2 + cx$ where $c$ is fixed constant. Calculate the minimum cost to cross the river.

- $arr[i]$, $L \leq 10^9$
- $n \leq 1000$
- $c \leq 10^5$

1. Given a DAG with atmost $1000$ nodes, print the two largest strongly connected components in the graph. Also print the shortest path between the two components. If there are multiple shortest paths, you need to print the path that with "extreme" vertices for the component. (Proper clarifications on the meaning of the "extreme" vertices was not given)

2. MCQ questions based on the following topics were given:
   - Marker & Functional Interfaces in Java
   - Type of Relationships: `IS`, `HAS` & `USES`

### Online Assessment

1. MCQs (18) and Fill-in-the-blanks (2) were asked. The primary topics of the same were:

   - SQL
   - Java
     - Assertions & Exceptions
     - Break & Skip Statements
     - `Stream` & `ParallelStream` in Java
     - Static members and methods
   - Design Principles
     - Single Responsibility Principle (SRP)
     - Open-Closed Principle (OCP)
     - Liskov Substitution Principle (LSP)
     - Interface Segregation Principle (ISP)
   - OOPS
     - Inheritance
     - Polymorphism
     - Encapsulation
     - Abstraction

2. You are given an an array of scores $arr[i]$ of $n$ students. You need to arrange them such that the highest score is the middle, the second highest score is to the left of the highest score, the third highest score is to the right of the highest score, the fourth highest score is to the left of the second highest score, and so on.

Example:

```
Input: [1, 2, 3, 4, 5]
Output: [2, 4, 5, 3, 1]
```

3. The question involved around calculating the sum of the nodes of a binary tree which had exactly two children. The tree nodes were given in a non-convental way (as a string of `L` and `R` characters denoting the path that you need to take to reach the node from the root).

---

# Graviton Research Capital

Graviton is known for it's subjective tests. It did not visit our campus, but I had a few friends who gave the test. Each test had 3-4 questions, and partial & step marking was present.

## PYQs

### Software Developer

1. Modify the code snippet to remove all branches (`if` statements):

```cpp
int m = 1 << 15;

int data[m];
for (int i = 0; i < m; i++)
    data[i] = rand() % 256;

int sum = 0;
for (int i = 0; i < m; i++)
  if (data[i] >= 128)
    sum += data[i];

cout << sum << endl;
```

2. There are $n$ datapoints given, each with coordinates $(x, y)$. Each data point can spread upto a max distance of $r$ units. What is the minimum value of $r$ so that all the datapoints can talk to each other? (Two datapoints can talk to each other if the distance between them is less than or equal to $r$. Datapoints can talk in a chain, i.e. if $A$ can talk to $B$ and $B$ can talk to $C$, then $A$ can talk to $C$)

Constraints:

- $n \leq 1000$
- $x$, $y \leq 25000$

3. There are $n$ players in a game, each with a certain number of gold chips denoted by $arr[i]$. The maximum number of gold chips that a player can have is denoted by $capacity[i]$. Initially, you have $arr[0]$ gold chips. You can give your gold chips to other players to improve your rank. If a player has more gold chips than its capacity, then that player disqualifies and your rank improves. Find an algorithm to get your best rank.

4. Build a transaction fucntion that may run parallely on multiple cores. The signature for the same is:

```cpp
bool transaction(Entity &sender, Entity &receiver, int amount);
```

### Quant Analyst

1. There is a city with different chambers. Each chamber has at least $3$ light bulbs. The total number of light bulbs is even. There is a switch between any $2$ light bulbs (both the light bulbs can be in the same chamber or different chambers). Assume some initial configuration of the light bulbs. Is it possible to have a sequence of changes in the switches such that each chamber has both light bulbs (on and off), irrespective of the initial state?

2. There is a lift in a multi-level building. The probability of the lift going up is $0.2$, going down is $0.3$ and staying still is $0.5$. At floor $0$, the probability of going up is $0.2$ and staying is $0.8$. Assume infinite floors in the building. What is the proportion of time you are going to stay at level $0$?

3. There is a sequence of cards with some facing down and some facing up. If there are $n$ cards facing up, then you will flip the $n^{th}$ card from the left. You keep doing this until all the cards are facing down. Let the total number of cards be $P$.

- It is it always possible to bring all the cards facing down irrespective of the initial positioning?
- If it is possible to face all cards down, what is the expected length of sequence of moves?

4. There is a uniform distribution in the range $[0, 1]$. Ram and Shyam get $2$ numbers from this range at random. Both only know about the number that they have received. The player having a higher value wins. Ram has a chance to redraw another number at random from the distribution. Assuming that both the players play optimally, how many times will Ram choose to redraw?

5. Google wants to pick a new CEO. Mr. Pichai has a list of candidates he can recommend. He has $N$ people on the list, each of which has a probablity $p[i]$ of being selected as the CEO. You need to help Mr. Pichai maximize the probablity of exactly one candidate getting selected. You need to provide a solution for any $N$ and $p[i]$.

6. You are given a tree $T$ containing $N$ nodes and $N-1$ edges. Assume that each node of this tree is coloured either black or white independently with a probability of $0.5$. We define $G$ as the smallest connected subgraph of $T$ that contains all the black nodes. What is the expected number of white nodes in $G$? ($N$ is between $2$ and $10^5$)

7. There is tree of $n$ vertices, labelled $1$ to $n$. For every tree, you can assign it a sequence $a$ as follows:

   - Let the sequence be empty intially.
   - Take the smallest numbered leaf $v$, remove it from the tree and append the unique neeighbour that was adjacent to $v$ to the sequence.
   - Repeat the above step until the tree has only $2$ vertices.

   1. Prove that there is a one to one correspondence between the sequence of length $n-2$ and the labelled tree.
   2. Find the total number of labelled trees of $n$ vertices using this reduction.
   3. Find the number of labelled trees with $10$ vertices whose degree of $i$th vertex is $a[i]$ where $a[i] = [5,4,2,1,1,1,1,1,1,1]$.

8. Let $A$ be an $n \times n$ diagonal matrix with characteristic polynomial $(x - c*1)^{d_1} (x - c_2)^{d_2} * ... * (x - c_k)^{d_k}$ where $c_1, c_2, ..., c_k$ are distinct. Let $V$ be the vector space of all $n \times n$ matrices $B$ such that $AB = BA$. Prove that the dimension of $V$ is $d_1^2 + d_2^2 + ... + d_k^2$.

---
