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
  1. Quant Desk Analyst
  2. Software Developer
  3. Infrastructure Engineer

## Quant Desk Analyst

Two coding questions were asked which were same for all the students were asked.

1. A simple implementation of two pointers was to be done, which was described in the question itself. Brute approach needed. LC Easy level.
2. You are given a matrix of 100 X 100 with values between 1 and 50. In one operation, you can choose any one element, and delete all the elements with the same value in the row and column of the picked element (along with the element itself). Give the minimum number of operations to delete all the elements.

<details>
<summary>Spoiler</summary>

You can read about [question 2](https://leetcode.com/discuss/interview-question/5846629/SquarePoint-OA-Desk-Quant) here. The question actually turns out to be NP Complete, and thus the best you can do is brute force and try all orderings. In the OA to pass the questions, you had to use the (incorrect) greedy approach, where you would always choose the element whose deletion would result in the maximum number of deletions. To solve it in actual constraints, you can [try this](https://codeforces.com/gym/101246/problem/C) on Codeforces.

</details>

## Software Developer

Everyone had different questions, but most of them were LC Easy or Medium. The questions often had vague wording so a lot of hit and trial was required to pass the test cases. Questions from the previous years were repeated. Only 2 programming questions were present for one student.

1. You are given a list of words and a search word. For each prefix in the search word (let's say X), you need to find at max 3 lexicographically smallest words from the dictionary that have the same prefix X.

- Number of dictionary words: <= 10^4
- Length of dictionary word: <= 10^4
- Sum(Length of all dictionary words) <= 10^5
- Length of search word: <= 10^3

You can try it out [here](https://leetcode.com/problems/search-suggestions-system/description/).

2. A question involving generating unique usernames for all the users on a platform was asked. Only basic string processing was needed, but having vague test descriptions made it difficult to pass the test cases. I had used the debug console to print out the testcases and then tried to guess the output the testcases were expecting. Nasty tricks like trailing whitespaces and wierd ASCII characters were used to make the testcases fail, so you had to be very careful with the output.

## Infrastructure Engineer

The test had two sections, one based on Python and two based on Linux.

### Linux Section

Remote machines were provided to us, and we had to write the Bash scripts to perform the following tasks. Having access to the server allowed to experiment with the commands and test the scripts before submitting them. The evaluation would happen after the contest, where the script would be used on a similar but new server, and check if all the objectives were met.

1. You need to run a `nginx` Docker container and bind it's default port to the server's port `8000`.
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
- 20-25 MCQs & 2 coding questions
- MCQs are based on C++, OOPS, DBMS and other core CS concepts.

The coding questions are relatively easy as compared to other companies, but the MCQs are a bit tricky and time-consuming. I would highly recommend practicing MCQs from GeeksforGeeks and other platforms before giving the test. SQL is one of the most important topics for AQR, so make sure you are well-versed with it.

---
