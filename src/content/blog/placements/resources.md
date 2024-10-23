---
title: "Placements '24: Resources & Advice"
description: Collection of all the resources I used as all the advices that worked the best for me.
pubDate: 2024-12-01
pinned: false
tags: ["placements", "2024"]
---

## Competitive Programming & DSA

No suprise, this by far is the most important part that you need to focus on. Don't start at the last minute, and try to inculcate the habit of solving questions and discussing with your peers early on.

- Give contests regularly! [Codeforces](https://codeforces.com/) is the best platform for upsolving as well as giving contests. Many companies known for difficult tests often give direct restatements of the problems from here. Codeforces blogs on topics are great too!
- In the final month leading to placement OAs, I also started giving [LeetCode](https://leetcode.com/), [AtCoder](https://atcoder.jp/), and [Codechef](www.codechef.com) contests. I absolutely love AtCoder Beginner contests, have grown acustomed to the LeetCode ones, and hate Codechef. But they all have their own charm, and you should try them all to see which one you like the best.
- The [CSES problem set](https://cses.fi/) is a gold mine that is often overlooked. I personally used it in two manners:
  - Solving it periodically to ensure that I know the basics of a topic. Many questions from the same are used as subproblems in other problems, and the general solving techniques that I picked up from here helped me a lot. There have been many a times when I was unable to solve some LC questions, and then found articles and solutions of the same building on some CSES problems.
  - Resubmitted some of the common problems before the online assessments to ensure that I my brain has not rotted from using all the templates and Co-Pilot suggestions during the regular CP contests.
- [CP Algorithms](https://cp-algorithms.com/) is my go to resource for templates & intial understanding of a topic. The explanations are crystal clear, all accompanied by code snippets, common extensions of the problems as well as recommened problems. I would not recommed using it as a question source, but definitely for the theory and implementation snippets.

## Core Computer Science Concepts

These concepts take the most time, and are often the deciding factors in a low-medium difficulty online assesement where a large majority of the students are able to solve the problems. My two cents: don't skip these topics or keep them for the last. Learn them early on, and maintain conscise notes. Then as the placement or intern season approaches, make a habit of spending 30-45 minutes daily to solve MCQs related to these topics.

[GFG](https://www.geeksforgeeks.org/) is probably the only resource you need for these MCQs. It is very common for the companies to directly pick questions from here, and the explanations are also very good.

Here are also some conscise notes that I started maintainging as I solved these MCQs, as well as from the questions I saw in my online assements and that of my seniors:

- [Operating System]()
- [Database Management & SQL]()
- [OOPS in C++]()

I have no plans of updating them, and they probably won't make any sense if you haven't studied the topic first. But if you have, they might be a good refresher and help you in remembering some important or lesser known points, and getting those 'tricky' questions right.

## CPP Topics

When preparing for interviews, these are some common topics that I found to be the favourite amoung interviewers, specially for C++ developer roles or low level system roles. [Learn CPP](https://www.learncpp.com/) is a great resource for these topics and learning C++ nitigrities in general, but it you are short on time (like I was), these are some topics that you should focus on:

- [Void Pointers](https://www.learncpp.com/cpp-tutorial/void-pointers/)

  - How to figure out if a `void *` pointer is pointing to an integer or a character array?
  - How to figure out if a `void *` pointer is allocated on the stack or the heap?

- [Smart Pointers & Move Semantics in CPP](https://www.learncpp.com/cpp-tutorial/introduction-to-smart-pointers-move-semantics/)

  - How do these work under the hood and why do we need them?
  - Implementing a simple class for smart pointers in general, and for the three standard smart pointers in particular.
    - `std::unique_ptr`
    - `std::shared_ptr`
    - `std::weak_ptr`

- Difference between references and pointers in C++. When to use which and how they affect the safety as well as the usability of the code?

#### PS

Computer networks in also usually included in CS concepts, but I decided to skip them in the interest of time. A very few companies ask questions from this topic (like `Cisco`) and for very specific roles (like Network Engineer). You might want to read about them if you are interested in such roles.
