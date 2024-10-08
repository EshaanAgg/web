---
title: "Placements '24: Assessments [Part 1]"
description: A brief of all the online assessments that I witnessed during the season of 2024.
pubDate: 2024-10-08
updateDate: 2024-10-08
pinned: true
requireLatex: true
tags: ["placements", "2024"]
---

Sitting for placements is a huge rollercoster ride, but having some idea of what to expect can make the ride a bit smoother. Here is a brief of some online assessments (patterns, questions & tips) that I either personally gave or heard about from my peers during the season of 2024.

- [GreyOrange](#greyorange)
- [Squarepoint Capital](#squarepoint-capital)
- [AQR Capital](#aqr-capital)
- [Graviton Research Capital](#graviton-research-capital)
- [Samsung Research Institute Noida](#samsung-research-institute-noida)
- [Codenation (Trilogy Innovations)](#codenation-trilogy-innovations)
- [Zomato](#zomato)

In addition to reading about the questions from here, please do search for the companies on Leetcode Discuss or Job Overflow. Sometimes people even post about OA questions in Codeforces blogs, so spending a bit of time searching for such questions (from past years or from different campuses) can help you gain an unexpected edge!

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

3. You are given an array of size $n$. You can change any number in the array to any value, and the cost of changing the same is absolute difference of new number and old number. Find the minimum cost to make the array either non-increasing or non-decreasing.

   Example:

   ```
   Input: 1 3 5 4 7
   Output: 1
   Explanation: It can be changed to 1 3 5 5 7 (cost to change 4 to 5 is 1)
   ```

   <br>
   <details>
   <summary>Spoiler</summary>

   You can first try solving this [similar question](https://www.geeksforgeeks.org/minimum-incrementdecrement-to-make-array-non-increasing/) and then try to modify the solution to fit the constraints of the question.

   </details>

4. You are given two numbers $minVal$ and $maxVal$ and an array $arr$. You need to calculate the number of contigous subarrays with minimum value as $minVal$ and maximum value as $maxVal$. Length of array is upto was $10^5$.

   This problem was a restatement of a problem on [Leetcode](https://leetcode.com/problems/count-subarrays-with-fixed-bounds/).

5. You are given an array $arr$. You need to remove elements from the array until array gets empty. You can remove either first or last element from the same, with the objective of maximizing the score. Score is calculated in this way:

   - Add the array sum to the score if the operation serial number was odd, and then remove an element from the array.
   - Subtract the array sum from the score if the operation serial number was even and then remove the element from the array.

   The length of the array was upto $2000$.

    <details>
    <summary>Solution</summary>

   We can use a $2D$ DP to solve this problem. Let $dp[i][j]$ denote the maximum score that can be obtained by when the first $i$ and the last $j$ elements have been removed. We can then define the transition as:

   ```cpp showLineNumbers
   int count(int i, int j, vector<int> &arr, vector<int> &pre, vector<vector<int>> &dp) {
       int n = arr.size();

       if (i + j == n) return 0;
       if (dp[i][j] != -1) return dp[i][j];

       int turn = (i + j + 1) % 2;
       int stIdx = i, endIdx = n - j - 1;

       int sum = pre[endIdx] - (stIdx > 0 ? pre[stIdx - 1] : 0);
       if (turn % 2 == 0) sum = -sum;

       dp[i][j] = max(sum + count(i + 1, j, arr, pre, dp), sum + count(i, j + 1, arr, pre, dp));
       return dp[i][j];
   }

   int solve(vector<int> &arr) {
       int n = arr.size();
       vector<int> pre(n);
       for (int i = 0; i < n; ++i) {
           pre[i] = arr[i] + (i > 0 ? pre[i - 1] : 0);
       }

       vector<vector<int>> dp(n, vector<int>(n, -1));
       return count(0, 0, arr, pre, dp);
   }
   ```

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

2. Given a DAG with atmost $1000$ nodes, print the two largest strongly connected components in the graph. Also print the shortest path between the two components. If there are multiple shortest paths, you need to print the path that with "extreme" vertices for the component. (Proper clarifications on the meaning of the "extreme" vertices was not given)

3. MCQ questions based on the following topics were given:
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

    <br>
    <details>
    <summary>Solution</summary>

   We need to add the numbers in the range $128$ to $255$, all of which have their $7$th bit always set. Thus if a number's $7$th bit is set, we can add it to the result, otherwise we can ignore it. We can use the following code snippet to achieve the same:

   ```cpp
   for (int i = 0; i < m; i++) {
   int toAdd = (data[i] >> 7) & 1;
   sum += toAdd * data[i];
   }
   ```

    </details>

2. There are $n$ datapoints given, each with coordinates $(x, y)$. Each data point can spread upto a max distance of $r$ units. What is the minimum value of $r$ so that all the datapoints can talk to each other? (Two datapoints can talk to each other if the distance between them is less than or equal to $r$. Datapoints can talk in a chain, i.e. if $A$ can talk to $B$ and $B$ can talk to $C$, then $A$ can talk to $C$)

   Constraints:

   - $n \leq 1000$
   - $x$, $y \leq 25000$

    <details>
    <summary>Solution</summary>

   We observe the fact that if the datapoints can talk to each other at a distance of $r$, then:

   - The graph formed by the datapoints is a single connected component.
   - All these datapoints would be able to be communicate with each other for any $r' > r$ as well.

   Thus using these two facts, we can use binary search to find the minimum value of $r$ for which the graph is a single connected component. For each value of $r$, we can use loop over all the pairs of datapoints, connect them if the distance between them is less than or equal to $r$ and then check if the graph is a single connected component or not (using DFS, BFS or Union Find).

   The overall complexity of the solution would be $O(n^2 \log MAX(x,y))$ which is feasible for the given constraints.

    </details>

3. There are $n$ players in a game, each with a certain number of gold chips denoted by $arr[i]$. The maximum number of gold chips that a player can have is denoted by $capacity[i]$. You are the player at index $0$ and thus initially have $arr[0]$ gold chips. You can give your gold chips to other players to improve your rank. If a player has more gold chips than its capacity, then that player disqualifies and your rank improves. Find an algorithm to get your best rank.

   <details>
   <summary>Solution</summary>

   We can use a combination of greedy & brute force approach to solve this problem. Let's say we have decided that we want to eliminate some people by giivng them our gold chips. It would always be ideal for us to give our coins to the player with the lowest $capacity[i] - arr[i]$ value. This exchange would increase our rank by $1$ due to elimination, but also might decrease our rank by $x$ due to now more player having more coins than me.

   We can efficiently simulate all the possible number of coins that we can spend by maintaing two priority queues:

   - One to keep track of the players that I can eliminate, ordered by the difference of their capacity and current coins.
   - One to keep track of players who have coins lesser than me.

   We can then simulate the process of giving coins to the players and updating the ranks. The overall complexity of the solution would be $O(n \log n)$.

   ```cpp showLineNumbers
   // Returns the rank as the number of people having lesser coins than me
   int bestRank(vector<int> arr, vector<int> cap) {

       priority_queue<pair<int, int>> lesserThanMe; // Max Heap -> <coins, index>
       priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> canEliminate; // Min Heap -> <capacity - coins + 1, index>

       for (int i = 1; i < arr.size(); ++i) {
           if (arr[i] < arr[0])
               lesserThanMe.push({arr[i], i});
           else
               canEliminate.push({cap[i] - arr[i] + 1, i});
       }

       int ans = lesserThanMe.size();

       // Loop while I can eliminate some players
       while (!canEliminate.empty() && arr[0] >= canEliminate.top().first) {
           auto [diff, index] = canEliminate.top();
           canEliminate.pop();

           arr[0] -= diff; // Update my coins

           // Add all the newly eligible players to the canEliminate heap
           while (!lesserThanMe.empty() && arr[0] < lesserThanMe.top().first) {
               auto [coins, i] = lesserThanMe.top();
               lesserThanMe.pop();
               canEliminate.push({cap[i] - arr[i] + 1, i});
           }

           ans = min(ans, (int)lesserThanMe.size());
       }

       return ans;
   }
   ```

   This code still requires some better handling around ties and how to determine ranks if two people have the same number of coins, but the general idea is the same.

   </details>

4. Build a transaction function that may run parallely on multiple cores with the signature:

   ```cpp
   bool transaction(Entity &sender, Entity &receiver, int amount);
   ```

    <br>
    <details>
    <summary>Solution</summary>

   The question is not very clear, but the main idea is to ensure that the transaction function is thread-safe. You can use locks to ensure that only one thread can access the function at a time, and we can assume that these locks are available on the `Entity` class itself. A simple implementation would look like:

   ```cpp showLineNumbers
   #include <iostream>
   #include <mutex>
   #include <thread>
   #include <vector>

   class Entity {
   public:
       Entity(int id, int initial_balance) : id(id), balance(initial_balance) {}

       int getBalance() const { ... }
       void updateBalance(int amount) { ... } // Not thread-safe
       int getId() const { ... }

   private:
       int id;
       int balance;
       std::mutex mtx;

   public:
       // Thread-safe transfer method (synchronization within entity)
       bool transferTo(Entity &receiver, int amount) {
           std::scoped_lock lock(mtx, receiver.mtx);

           if (balance < amount) {
               return false;
           }

           updateBalance(-amount);
           receiver.updateBalance(amount);
           return true;
       }
   };

   bool transaction(Entity &sender, Entity &receiver, int amount) {
       return sender.transferTo(receiver, amount);
   }

   int main() {
       Entity alice(1, 1000);
       Entity bob(2, 500);

       std::vector<std::thread> threads;

       // Launch multiple transactions in parallel
       for (int i = 0; i < 5; ++i) {
           threads.emplace_back([&]() {
               int amount = rand() % 150;
               if (transaction(alice, bob, amount)) {
                   std::cout << "Success!\n";
               } else {
                   std::cout << "Failed!\n";
               }
           });
       }

       // Wait for all threads to finish
       for (auto &t : threads) {
           t.join();
       }

       std::cout << "Final balance of Alice: " << alice.getBalance() << "\n";
       std::cout << "Final balance of Bob: " << bob.getBalance() << "\n";

       return 0;
   }

   ```

   [This article](https://medium.com/@abhishekjainindore24/mutex-in-c-threads-part-1-45aeac3ab62d) can be helpful to understand the concept of mutexes in C++ if you haven't seem them before. [Scoped locks](https://medium.com/@satyajeetjha06/scoped-lock-c-2d77aa08ed77) are a neat C++ 17 feature that can be used to lock multiple mutexes at once without the risk of deadlocks.

    </details>

5. In a $32$ bit machine, we subdivide the virtual address into 4 segments as follows:

   ```
   | 10 bit | 8 bit | 6 bit | 8 bit |
   ```

   We use a $3$ level page table, such that the first $10$ bit is for the first level and so on. Assuming the size of a page table entry as $2$ bytes, answer these questions:

   - What is the page size in such a system?
   - What is the size of a page table for a process that has $256K$ of memory starting at address $0$?

6. You are tasked with architecting the CPU pipeline for a hypothetical high-performance processor that must meet the following specifications:

   - A deeply pipelined architecture consisting of $15$ stages.
   - The implementation of dynamic branch prediction (e.g., leveraging a hybrid predictor combining both global and local history).

     - Describe how you would structure the pipeline stages, focusing on optimizing and balancing the stages for instruction fetch, decode, execution, memory access, and write-back.
     - What challenges do you anticipate in managing a deep pipeline of this nature? Propose techniques and strategies to address these challenges effectively.
     - Design a branch prediction mechanism suitable for this architecture, discussing how your design would balance prediction accuracy and the associated performance overhead.

7. Given an array $a$ of $n$ integers, we have to split the array into continuous non-empty subarrays. Let’s say there are $k$ subarrays and let the $i^{th}$ subarray be from $[l(i) to r(i)]$ — both inclusive. Hence a split of the array will satisfy $k \geq 1$, $[l(i) \leq r(i)]$ for $1 \leq i \leq k$, $l(1) = 1$, $r(k) = n$, $r(i) + 1 = l(i+1)$ for $1 \leq i \leq k$.

   Each subarray has a value assigned to it. For a subarray from $l$ to $r$, the value $val(l, r)$ is calculated as follows:

   - First calculate:
   - $sum = a[l] + a[l+1] + a[l+2] + ... + a[r-1] + a[r]$
   - $size = r - l + 1$
   - Then $val(l, r)$ is:
   - $0$, if $sum = 0$
   - $+size$, if $sum > 0$
   - $-size$, if $sum < 0$

   The value of a split of the array is the sum of values of all the subarrays of the split. You are requested to find the maximum value of a split possible (over all possible splits of the array).

   Constraints:

   - $1 \leq n \leq 5*10^5$
   - $-10^9 \leq a[i] \leq 10^9$

8. You are currently trapped in a maze with $n$ rooms, which are connected by bridges. Each bridge connects two rooms $(u, v)$ and has a maximum weight capacity $w$. It breaks if the load exceeds $w$. Bridges can be used to travel in both directions and any number of times (as long as the bridge can hold your weight).

   There is one magic fruit in each room, and to escape the maze, you have to eat all the magic fruits (an exit portal opens in the room where you finish eating the last fruit). Eating the magic fruit in room $i$ increases your weight by $a[i]$.

   You are currently in room number $1$. You realize that with your current weight it might not be possible to escape the maze. So you wonder what is the maximum starting weight with which it is possible to eat all the magic fruits (without breaking a bridge and getting trapped in the maze) to escape.

   You can assume that the maze is designed in such a way that you can escape it with some positive starting weight. It is not mandatory to eat the magic fruit the first time you visit a room, and each room can be visited any number of times.

   Constraints:

   - $1 \leq n \leq 5*10^5$
   - $-10^9 \leq a[i] \leq 10^9$
   - $1 \leq m \leq 5*10^5$
   - $1 \leq u[i], v[i] \leq n$
   - $1 \leq w[i] \leq 10^9$

### Quant Analyst

1. There is a city with different chambers. Each chamber has at least $3$ light bulbs. The total number of light bulbs is even. There is a switch between any $2$ light bulbs (both the light bulbs can be in the same chamber or different chambers). Assume some initial configuration of the light bulbs. Is it possible to have a sequence of changes in the switches such that each chamber has both light bulbs (on and off), irrespective of the initial state?

2. There is a lift in a multi-level building. The probability of the lift going up is $0.2$, going down is $0.3$ and staying still is $0.5$. At floor $0$, the probability of going up is $0.2$ and staying is $0.8$. Assume infinite floors in the building. What is the proportion of time you are going to stay at level $0$?

3. There is a sequence of cards with some facing down and some facing up. If there are $n$ cards facing up, then you will flip the $n^{th}$ card from the left. You keep doing this until all the cards are facing down. Let the total number of cards be $P$.

   - Is it always possible to bring all the cards facing down irrespective of the initial positioning?
   - If it is possible to face all cards down, what is the expected length of sequence of moves?

4. There is a uniform distribution in the range $[0, 1]$. Ram and Shyam get $2$ numbers from this range at random. Both only know about the number that they have received. The player having a higher value wins. Ram has a chance to redraw another number at random from the distribution. Assuming that both the players play optimally, how many times will Ram choose to redraw?

5. Google wants to pick a new CEO. Mr. Pichai has a list of candidates he can recommend. He has $N$ people on the list, each of which has a probablity $p[i]$ of being selected as the CEO. You need to help Mr. Pichai maximize the probablity of exactly one candidate getting selected. You need to provide a solution for any $N$ and $p[i]$.

6. You are given a tree $T$ containing $N$ nodes and $N-1$ edges. Assume that each node of this tree is coloured either black or white independently with a probability of $0.5$. We define $G$ as the smallest connected subgraph of $T$ that contains all the black nodes. What is the expected number of white nodes in $G$? ($N$ is between $2$ and $10^5$)

7. There is tree of $n$ vertices, labelled $1$ to $n$. For every tree, you can assign it a sequence $a$ as follows:

   - Let the sequence be empty intially.
   - Take the smallest numbered leaf $v$, remove it from the tree and append the unique neighbour that was adjacent to $v$ to the sequence.
   - Repeat the above step until the tree has only $2$ vertices.

   1. Prove that there is a one to one correspondence between the sequence of length $n-2$ and the labelled tree.
   2. Find the total number of labelled trees of $n$ vertices using this reduction.
   3. Find the number of labelled trees with $10$ vertices whose degree of $i$th vertex is $a[i]$ where $a[i] = [5,4,2,1,1,1,1,1,1,1]$.

8. Let $A$ be an $n \times n$ diagonal matrix with characteristic polynomial $(x - c_1)^{d_1} (x - c_2)^{d_2} * ... * (x - c_k)^{d_k}$ where $c_1, c_2, ..., c_k$ are distinct. Let $V$ be the vector space of all $n \times n$ matrices $B$ such that $AB = BA$. Prove that the dimension of $V$ is $d_1^2 + d_2^2 + ... + d_k^2$.

9. There are $n$ participants in a game, where each of them plays a match against the other. The winner gets $1$ point, while the loser gets $0$. In case of a draw, both the players get $0.5$. It is observed that for every player half of their points come from playing against the bottom $10$ ranked players, including these bottom $10$ players. Find the value of $n$.

10. There are $2$ boxes. You can do $n$ operations on them. In each operation, you can either do a take move or a put move. In a put move, $1 is placed randomly into one of the two boxes with equal probability. In a take move, you gain all the money in one of the randomly chosen boxes. What is the maximum expected payout if you play optimally?

11. There are $10$ males and $10$ females that you need to seat at a round dining table. In how many ways can you seat them so that every man is sitting beside at least 1 woman?

12. Given $S = (a,b,c,d)$, $T(S) = (|a-b|, |b-c|, |c-d|, |d-a|)$, does the series $S, T(S), T(T(S)), T(T(T(S)))....$ converge?

13. There is a sequence of $100$ coins, that have already been flipped. Alice starts checking each coin from the beginning to the end. Bob first checks the coins at even positions, and then the coins at the odd positions. The first one to find 26 heads wins. Who is more likely to win the game?

# Samsung Research Institute Noida

- The test is conducted on their own software, which works only on Windows, lags a lot, and is generally quite a pain to work with. You can use their inbuilt IDE, Eclipse or Visual Studio to write the code.
- 3 - 4 hours are given to solve a single question, and the questions are generally on the easier to medium side.
- The questions are primarily from the `Recursion`, `Dynamic Programming`, `Bitmasking` and `Graph Theory` topics.
- The questions are very frequently repeated, so it's a good idea to go through the previous year questions. You can view the same from [this very helpful repository](https://github.com/s-kachroo/SamsungPractice/).
- Some of the seniors also mentioned that in some tests, the standard library functions were disabled, so you might need to implement them yourself. Some common topics to brush up upon before the test include:
  - Sorting Algorithms
  - Heaps and Priority Queues
  - Queue and Stack
  - Custom Comparator Functions
  - Arrays (`vector.h` might not be allowed)

## Question

There are $n$ fishing spots on a lake, numbered from $1$ to $n$. There are $m$ fishermen waiting to get in. There are $3$ gates, located at positions $x[i]$ and having $arr[i]$ employees at gate $i$. The distance between consecutive spots is $1$, and the distance between the gate and the nearest spot is also $1$. Only $1$ gate can be opened at a time and all fishermen of that gate must occupy spots before next gate is open. Each fisherman will occupy the nearest spot to the gate greedily. It can be seen that all the employees at a gate will occupy a fixed position, except the last one who might have $2$ spots to choose from. Write a program to return sum of minimum distance that the fishermen need to walk.

Constraints:

- $n \leq 100$
- $1 \leq x[i] \leq n$
- $1 \leq arr[i] \leq 60$
- It is guaranteed that the fishermen will be able to occupy atleast one spot.

---

# Codenation (Trilogy Innovations)

- 2 hour test is conducted with 4 questions
- The company is known for asking very diffcult questions. There is partial marking for the test cases.
- Questions are very frequently repeated across the campuses in the same year, and not so much with the previous years.

## Other Campus Questions

1. An array is considered valid if there is no subarray longer than $B$ where all elements are identical. Additionally, the array can only contain integers from the range $[1, C]$. Determine the number of valid arrays of length $A$. Since the result can be very large, return it modulo $10^9+7$.

   Problem Constraints:

   - $1 \leq A \leq 10^9$
   - $1 \leq B \leq min(50, A)$
   - $1 \leq C \leq 10^5$

   <details>
   <summary>Solution</summary>

   If the array length was upto $10^5$, then we could have used a simple DP solution where we can define $dp[i]$ as the number of valid suffixes starting from index $i$. As a part of the transition at index $i$, we can take the new element to occur $x$ times (between $1$ and $B$), and thus add the value for $dp[i + x]$. Further, the number of possible values of this new element would be $C$ if the index is $0$, and would be $C - 1$ otherwise (as it cannot be equal to the previous element). The overall complexity of this solution would be $O(A * B)$.

   But this solution is not feasible for $A = 10^9$. We will make use of binary matrix exponentiation to solve this problem.

   Let us maintain a matrix $M_l$ of size $B$ where $M[j]$ at any point denotes how many valid arrays exist with the last element of the array occuring $j$ times for the current length $l$. We can then define the transition to the next matrix $M_{l+1}$ representing the length $l + 1$ as:

   - For $j = 1$, we can a new element (with $C - 1$ possible values) to each of the $j$ elements in the previous array. Thus $M_{l+1}[1] = (C - 1) * (\sum_{j = 1}^{B} M_l[j])$.
   - For $j \neq 1$, we can only transition using the same element as the previous one. Thus $M_{l+1}[j] = M_l[j - 1]$.

   We can see that these transitions are independent of the vlaue of $l$!

   Using these facts, we can define a transition matrix $X$ of size $B \times B$ to denote the number of ways to transition from current length $l$ to the next length $l + 1$.

   $\begin{array}{l} M_{l+1} = M_l \times \begin{bmatrix} C-1 & C-1 & C-1 & \cdots & C-1\\ 1 & 0 & 0 & \cdots & 0\\ 0 & 1 & 0 & \cdots & \vdots \\ \vdots & \ddots & \ddots & 0 & \vdots \\ 0 & \cdots & 0 & 1 & 0 \end{bmatrix} \\ \end{array}$

   $\begin{array}{l}  M_1 = \begin{bmatrix} C-1 & C-1 & C-1 & \cdots & C-1\\  \end{bmatrix} \\ \end{array}$

   Then we can set the state for the initial matrix of length $1$ as $M_1[1] = C$ and $M_1[j] = 0$ for $j \neq 1$. We can then calculate the matrix $M$ for length $A$ as $M_A = M * X^{A - 1}$.

   The overall complexity of this solution would be $O(B^3 \log A)$ where $B^3$ is the complexity of matrix multiplication and $\log A$ is the complexity of matrix exponentiation.

   ```cpp showLineNumbers
   long long MOD = 1e9 + 7;

   class Matrix
   {
   public:
       vector<vector<long long>> arr;

       Matrix(vector<vector<long long>> arr) : arr(arr) {}

       Matrix multiply(Matrix &b)
       {
           int Y = arr.size(), X = b.arr[0].size();
           vector<vector<long long>> res(Y, vector<long long>(X, 0));

           for (int y = 0; y < Y; y++)
               for (int x = 0; x < X; x++)
                   for (int k = 0; k < arr[0].size(); k++)
                   {
                       res[y][x] += arr[y][k] * b.arr[k][x];
                       res[y][x] %= MOD;
                   }

           return Matrix(res);
       }

       Matrix power(long long n)
       {
           int Y = arr.size();

           // Start with identity matrix
           vector<vector<long long>> iden(Y, vector<long long>(Y));
           for (int i = 0; i < Y; i++)
               iden[i][i] = 1;

           Matrix a = Matrix(arr);
           Matrix res = Matrix(iden);

           while (n)
           {
               if (n % 2 == 1)
                   res = res.multiply(a);
               a = a.multiply(a);
               n >>= 1;
           }

           return res;
       }
   };

   int solve(int A, int B, int C)
   {
       vector<vector<long long>> l0(1, vector<long long>(B, 0));
       l0[0][0] = C;

       vector<vector<long long>> tr(B, vector<long long>(B, 0));
       for (int i = 0; i < B; i++)
       {
           tr[i][0] = C - 1;
           if (i + 1 < B)
               tr[i][i + 1] = 1;
       }

       Matrix m = Matrix(l0), t = Matrix(tr);
       t = t.power(A - 1);
       Matrix res = m.multiply(t);

       long long ans = 0;
       for (int i = 0; i < B; i++)
       {
           ans += res.arr[0][i];
           ans %= MOD;
       }

       return ans;
   }
   ```

   </details>

2. Given is the pseudocode below to find a target number $i$ between $l$ and $r$ (both inclusive):

   ```cpp
   while (l < r) {
       int mid = (l + r) / 2;
       if (i < mid) r = mid - 1;
       else if (i > mid) l = mid + 1;
       else {
           print("Found");
           break;
       }
   }
   ```

   You are required to answer $q$ queries, where in each query, you will be provided with values $l$ and $r$. For each query, determine what is the probability that the above code will fail to print "Found" when any value $i$ (where $l \leq i \leq $r$) is chosen?

   Express this probability as an integer where the fraction is $\frac{P}{Q}$ and $gcd(P, Q) = 1$. You should compute $P * Q^{-1}$ modulo $10^9+7$, where $Q^{-1}$ is the modular inverse of $Q$ modulo $10^9+7$.

   Problem Constraints:

   - $1 \leq A[i][0] \leq A[i][1] \leq 10^6$

   <details>
   <summary>Solution</summary>

   It can be observed that the output of the code only depends on the length of the array that we are searching in, and the actual values of $l$ and $r$ are irrelevant. Thus we can simplify the problem to finding the probability that the code will fail to print "Found" for an array of length $n$.

   Let us calculate the value $cnt[i]$ where $cnt[i]$ denotes the number of values of $i$ such that the code will print `Found` for an array of length $i$. It can be seen that in the base case $cnt[0] = cnt[1] = 0$ (as the algorithm chooses the wrong endpoint in these cases).

   For $i \geq 2$, we can see that the code will always print `Found` for the middle element of the array. After that the problem would be reduced to counting the number of valid values in the left and right subarrays. Thus we can define the following recursive formula:

   - If $i$ is even, then $cnt[i] = 1 + cnt[i/2] + cnt[i - i/2 - 1]$ as
     $i - i/2 - 1$ is the number of elements in the left subarray, and $i/2$ is the number of elements in the right subarray.
   - If $i$ is odd, then $cnt[i] = 1 + 2*cnt[i/2]$ as both the left and right subarrays would have the same number of elements.

   Once we have these counts, finding the required probability is trivial.

   ```cpp showLineNumbers
   long long MOD = 1e9 + 7;

   long long power(long long a, long long b)
   {
       long long res = 1;

       while (b)
       {
           if (b % 2 == 1)
           {
               res *= a;
               res %= MOD;
           }
           a *= a;
           a %= MOD;
           b >>= 1;
       }

       return res;
   }

   vector<int> solve(vector<vector<int>> queries)
   {
       const int MAXN = 1e6;
       vector<long long> cnt(MAXN + 1, 0);

       for (int i = 2; i <= MAXN; i++)
       {
           int k = i / 2;
           if (i % 2 == 1)
               cnt[i] = 1LL + 2LL * cnt[k];
           else
               cnt[i] = 1LL + cnt[k] + cnt[k - 1];
           cnt[i] %= MOD;
       }

       int n = queries.size();
       vector<int> ans;

       for (auto q : queries)
       {
           int l = q[1] - q[0] + 1;
           long long pr = (l - cnt[l]) * power(l, MOD - 2);
           pr %= MOD;
           ans.push_back(pr);
       }

       return ans;
   }
   ```

   </details>

3. You are given an array $arr$ consisting of $N$ integers. You are also given $q$ queries. Each query consists of three integers $X$, $Y$, and $Z$. For each query find the largest contiguous subarray $B$ starting from index $X$, whose $Y$th bit is set, and then update each of its elements $B_j$ with $B_j \oplus Z$ where $\oplus$ denotes the bitwise XOR operator.

   Your task is to print the total number of updates performed after $q$ queries. Given a $2D$ array $mat$ that represents the queries:

   - $mat[i][0] = X$
   - $mat[i][1] = Y$
   - $mat[i][2] = Z$

   Problem Constraints:

   - $1 \leq N \leq 10^5$
   - $0 \leq arr[i] \leq 10^9$
   - $1 \leq q \leq 10^5$
   - $1 \leq X \leq N$
   - $0 \leq Y \leq 30$
   - $0 \leq Z \leq 10^9$

   <details>
   <summary> Solution </summary>

   This question is quite an exercise on segment trees with lazy proportion & binary search. Let us create $30$ segment trees, on for each bit in the number of the arrays. This segment tree needs to support the following operations:

   - Getting the sum of the elements in a range. This can be done using the standard segment tree.
   - Flipping all the values in a range. This can be done using the lazy propagation technique and setting the value of a tree node to $l - nodeValue$ where $l$ is the length of the range and $nodeValue$ is the current value of the node (this shows that all the $1$s in the range are flipped to $0$ and vice versa).

   Now, wherenever we get a query, we can do the following:

   - Perform a binary search to find the rightmost index where the $Y$th bit is set. When checking for an index $r$ starting from $idx$, we need to check that $sum(idx, r) = r - idx + 1$ where $sum$ is the sum returned by the segment tree of bit $Y$.
   - Then for all the bits $i$ set in $Z$, we can flip the values in the range $[idx, r]$ for the segment tree of bit $i$.

   The overall complexity of the solution would be $O(30 * Q * (N \log^2 N + N \log N))$, which requires careful implementation to pass the time limits.

   ```cpp showLineNumbers
   int MAX_BITS = 30;

   class SegTree
   {
   public:
       int n, bit;
       vector<int> tree, lazy;

       SegTree(int bit, vector<int> &arr)
       {
           this->bit = bit;
           n = arr.size();

           tree.resize(4 * n);
           build(1, 0, n - 1, arr);
           lazy.assign(4 * n, 0);
       }

       void build(int v, int l, int r, vector<int> &arr)
       {
           if (l == r)
               tree[v] = (arr[l] >> bit) & 1;
           else
           {
               int m = (l + r) / 2;
               build(2 * v, l, m, arr);
               build(2 * v + 1, m + 1, r, arr);
               tree[v] = tree[2 * v] + tree[2 * v + 1];
           }
       }

       void push(int v, int l, int m, int r)
       {
           if (!lazy[v])
               return;

           tree[2 * v] = (m - l + 1) - tree[2 * v];
           lazy[2 * v] ^= 1;

           tree[2 * v + 1] = (r - (m + 1) + 1) - tree[2 * v + 1];
           lazy[2 * v + 1] ^= 1;

           lazy[v] = 0;
       }

       void update(int v, int l, int r, int ql, int qr)
       {
           if (ql > qr)
               return;

           if (l == ql && r == qr)
           {
               // Convert the cnt of 1 to cnt of 0's
               tree[v] = (r - l + 1) - tree[v];
               lazy[v] ^= 1;
               return;
           }

           int m = (l + r) / 2;
           push(v, l, m, r);

           update(2 * v, l, m, ql, min(qr, m));
           update(2 * v + 1, m + 1, r, max(m + 1, ql), qr);
           tree[v] = tree[2 * v + 1] + tree[2 * v];
       }

       int query(int v, int l, int r, int ql, int qr)
       {
           if (ql > qr)
               return 0;
           if (ql == l && qr == r)
               return tree[v];

           int m = (l + r) / 2;
           push(v, l, m, r);

           int q1 = query(2 * v, l, m, ql, min(qr, m));
           int q2 = query(2 * v + 1, m + 1, r, max(m + 1, ql), qr);
           return q1 + q2;
       }

       void update(int l, int r)
       {
           update(1, 0, n - 1, l, r);
       }

       int query(int l, int r)
       {
           return query(1, 0, n - 1, l, r);
       }
   };

   int solve(vector<int> arr, vector<vector<int>> que)
   {
       int totOps = 0;
       int n = arr.size();

       vector<SegTree> tr;
       for (int bit = 0; bit < MAX_BITS; bit++)
           tr.push_back(SegTree(bit, arr));

       for (auto q : que)
       {
           int idx = q[0] - 1, bit = q[1] - 1, z = q[2];

           int l = idx, r = n - 1;
           int ans = -1;
           while (l <= r)
           {
               int m = (l + r) / 2;
               if (tr[bit].query(idx, m) == m - idx + 1)
               {
                   ans = m;
                   l = m + 1;
               }
               else
                   r = m - 1;
           }

           if (ans != -1)
           {
               totOps += ans - idx + 1;
               for (int i = 0; i < MAX_BITS; i++)
                   if ((z >> i) & 1)
                       tr[i].update(idx, ans);
           }
       }

       return totOps;
   }
   ```

   </details>

4. You are a book collector aiming to sell your collection of $A$ books. The books are arranged in a line with the $i$th book to the left of the $(i + 1)$th book. The thickness of each book is represented by an array $B$ (where $B[i]$ is the thickness of the $i$th book) and each book has a unique thickness.

   To enhance the appeal of your books, you can apply a special protective covering to some of them. However, this cover is expensive and thus you want tp minimize its use while ensuring the following conditions are met:

   - You should apply the cover to at least one book.
   - If you apply the cover to the $i$th book, you must also apply the cover all books that are thicker than the $i$th book.
   - There must exist at least one subarray (contiguous segment) of books of size at least $C$ such that the number of books with the protective cover is greater than the number of books without the cover.

   Your task is to determine the smallest number of books on which you should apply the protective cover to satify the above conditions.

   Problem Constraints:

   - $1 \leq A \leq 10^5$
   - $1 \leq B[i] \leq A (1 \leq i < j \leq n, B[i] \neq B[j])$
   - $1 \leq C \leq A$

   <details>
   <summary> Solution </summary>

   Let us fix the minimum thickness of the book that we must cover as $t$. It can easilu be argued that if there exists a subarray satisfying the third condition for $t$, then the same subarray would also be valid for all $t' < t$. This gives us the idea that we can binary search on the minimum thickess $t$ hoping to maximize the same.

   To check if there is a subarray that satifies condition 3 for a particular $t$, we can make the following construction: Create a new array $b$ where $b[i] = 1$ if $arr[i] \geq t$ else it is $-1$. Now the third question reduces to finding if there is a subarray of atleast size $C$ in $b$ such that the sum of the elements in the subarray is greater than $0$.

   This is a pretty standard problem which can be solved with the concepts of prefix sums and minimums (Reading about [2 Sum problem on Leetcode](https://leetcode.com/problems/two-sum/description/) and all it's possible extensions) in $O(N)$ time. Thus the overall complexity of the solution would be $O(N \log A)$ where $A$ is the maximum thickness of the book.

   ```cpp showLineNumbers
   bool checkValid(int mi, int n, vector<int> &base, int k)
   {
       vector<int> arr(n), pre(n + 1), preMin(n + 1);

       for (int i = 0; i < n; i++)
           arr[i] = base[i] >= mi ? 1 : -1;

       for (int i = 1; i <= n; i++)
       {
           pre[i] = arr[i - 1] + pre[i - 1];
           preMin[i] = min(pre[i], preMin[i - 1]);
       }

       for (int i = k; i <= n; i++)
           if (pre[i] - preMin[i - k] > 0)
               return true;

       return false;
   }

   int solve(int n, vector<int> arr, int k)
   {
       int l = 0, r = *max_element(arr.begin(), arr.end());
       int ans = -1;

       while (l <= r)
       {
           int m = l + (r - l) / 2;
           if (checkValid(m, n, arr, k))
           {
               // Update the answer count
               ans = 0;
               for (int i : arr)
                   if (i >= m)
                       ans++;

               // Update the bounds
               l = m + 1;
           }
           else
               r = m - 1;
       }

       return ans;
   }
   ```

   </details>

5. The teacher in Bitland writes the numbers from $1$ to $A$ (inclusive) on Blackboard. Now, he gives the following task:

   - Choose some numbers (possibly all or none) from the blackboard.
   - The bitwise XOR of the chosen numbers should be equal to $0$ (If you pick no elements, bitwise XOR is considered to be $0$).
   - The count of chosen numbers should be maximum.
   - If there are multiple possible options which yield maximum count, then choose the one with minimum sum.
   - If there are still multiple possible options, choose the one which is lexicographically smallest.

   Problem Constraints:

   - $1 \leq A \leq 10^5$

6. You are a librarian, and after a long day, you decide to collect all the books kept on tables. In front of you, there are several stacks of books. $A[i]$ denotes the size of the $i$th stack of books. In one move you can pick an existing stack and merge it with another stack of books. The efforts required for this task is the size of stack being added. You have also decided that for any stack you will not add books to it for more than $B$ times added to any other stack. What is the minimum effort required to collect all the books in one stack?

   Problem Constraints:

   - $1 \leq |A| \leq 10^5$
   - $1 \leq A[i] <= 10^9$
   - $1 \leq B \leq 10^5$

## Questions

1. A cryptarithm is a mathematical puzzle where the goal is to find the correspondence between letters and digits such that the given arithmetic equation consisting of letters holds true. Given a cryptarithm as an array of strings $crypt$, count the number of its valid solutions.

   The solution is valid if each letter represents a different digit, and the leading digit of a multi-digit number is not zero. The cryptarithm contains only capital letters and does not contain any leading zeros. $crypt$ has the following structure: $[wordl, word2, word3]$, which stands for the $word1 + word2 = word3$ cryptarithm. Is is guranteed that the length of the cryptarithm is $3$.

   Constraints:

   - $1 \leq crypt[i].length \leq 35$
   - $A \leq crypt[i][j] \leq Z$

2. You are given a string of the form `a/b+c/d` where $a, b, c, d$ are integers upto $2000$. You need to calculate the value $\frac{a}{b} + \frac{c}{d}$ in the simplest form as $\frac{p}{q}$ where $p$ and $q$ are coprime integers. Return a string of the form `p/q`.

3. You are given an array called $balance$ where $balance[i]$ denotes the balance of the $i$th account. You are also given an array $requests$ where $requests[i]$ denotes the $i$th transaction request. Each transaction request is a string of the form `timestamp [withdraw|deposit] amount accountIdx`. You need to process these requests subject to the following conditions:

   - The timestamps are processed in increasing order & in seconds.
   - A transaction may be invalid if the account balance is less than the amount to be withdrawn or the `accountIdx` is invalid.
   - As soon as you encouter an invalid transaction, you need to stop processing the requests. If the $1$ based index of the first invalid transaction is $i$, you need to return a vector with a single element equal to $-i$.
   - If all the transactions are valid, you need to return the final balance of all the accounts.
   - The bank has an additional offer. Whenever amount $x$ is withdrawn from an account, the bank automatically credits a cashbacks $c = \lfloor \frac{2x}{100} \rfloor$ to the account after $24$ hours of the withdrawn.
   - Return the balances just after processing the last transaction, and do not wait for the pending cashbacks (if any) to complete.

4. You are given two `ListNode` heads $a$ and $b$. Each list represents a huge number, and each list node represents exactly $4$ digits of the number. You need to return the sum of the two numbers as a linked list. The numbers may have leading zeros. (For example, if $a = [1, 20, 333, 4124]$ then it actually represents the number $1000200033304124$)

   ```cpp
   class ListNode {
   public:
       int val;
       ListNode *next;

       ListNode(int val) : val(val), next(nullptr) {}
   };
   ```

---

# Zomato

## Other Campuses Questions

1.  You are given the edges that form a tree with the root as $0$. A traversal of the tree is generated in the following manner:

    - An empty queue $q$ is initialized and the node $0$ is pushed into it.
    - While the queue is not empty, the front element is popped and all its children are pushed into the queue in any arbitary order.
    - The popped element is added to the traversal.

    You are given multiple traversals of the tree, and you need to find which of the traversals provided can be a valid BFS order traversal of the same.

     <details>
     <summary> Solution </summary>

    We can use the provided traversal to order the nodes of the tree in the particular order. We can then generate the BFS traversal of the tree and compare it with the provided traversal.

    Time Complexity: $O(Q * N \log N)$

    ```cpp showLineNumbers
    bool checkTraversal(int n, vector<set<int>> &g, vector<int> &traversal) {
        if (traversal.size() != n)
            return false;

        vector<int> idx(n, -1);
        for (int i = 0; i < n; i++)
            idx[traversal[i]] = i;
        for (int i = 0; i < n; i++)
            if (idx[i] == -1)
                return false;

        for (auto &ch: g) sort(ch.begin(), ch.end(), [&](int a, int b) { return idx[a] < idx[b]; });

        queue<int> q;
        q.push(0);
        vector<int> tr;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            tr.push_back(u);
            for (auto &v: g[u])
                q.push(v);
        }

        return tr == traversal;
    }

    vector<bool> show(vector<vector<int>> edges, vector<vector<int>> traversals) {
        int n = edges.size() + 1;

        vector<vector<int>> g(n);
        for (auto &e : edges) {
            g[e[0]].push_back(e[1]);
            g[e[1]].push_back(e[0]);
        }

        vector<bool> ans;
        for (auto &tr : traversals)
            ans.push_back(checkTraversal(n, g, tr));

        return ans;
    }
    ```

     </details>

2.  You are given an string $s$. You are also given two strings $t$ and $u$ which are both initially empty. You can perform either of the two operations in a tunr:

    - Append the first character of $s$ to the end of $t$.
    - Append the last character of $t$ to the end of $u$.

    You need to apply these operations such that all the end all the characters from $s$ are shifted to $u$, and the generated string $u$ is the lexicographically smallest possible. Return the lexicographically smallest string $u$ that can be generated.

    <details>
    <summary> Solution </summary>

    This question can be solved with the help of stack and using a greedy approach. In the stack, we try to maintain all the elements that we can processed till now (it acts like our string $t$). We greedily process the characters from $a$ to $z$, always travelling to their rightmost occurence and trying to add them to the string $u$. Before processing any character, we also check our stack to see it has some smaller character than the current one, and if it does, we pop it out and add it to the string $u$.

    Time Complexity: $O(N)$ where $N$ is the length of the string $s$.

    ```cpp showLineNumbers
    string solve(string s)
    {
        int n = s.size();

        vector<int> lastOccur(26, -1);
        for (int i = 0; i < n; i++)
            lastOccur[s[i] - 'a'] = i;

        stack<char> st;
        string ans = "";

        int lastIdx = -1;
        for (char cur = 'a'; cur <= 'z'; cur++)
        {
            if (lastOccur[cur - 'a'] == -1 || lastOccur[cur - 'a'] <= lastIdx)
                continue;

            while (!st.empty() && st.top() <= cur)
            {
                ans += st.top();
                st.pop();
            }

            while (lastIdx < lastOccur[cur - 'a'])
            {
                lastIdx++;
                if (s[lastIdx] == cur)
                    ans += cur;
                else
                    st.push(s[lastIdx]);
            }
        }

        while (!st.empty())
        {
            ans += st.top();
            st.pop();
        }

        return ans;
    }
    ```

    </details>

3.  You are given a string $s$ that has lowercase English characters. You are also given an integer $n$. You need to generate a string $x$ of length $n$ such that:

    - All of characters present in $s$ must be present in the string.
    - We will then make a string of length $t$ by repeatedly adding the string $x$ to it untill the string $t$ can be re-arranged to have the string $s$ as a substring.
    - The generated string $t$ should be of the minimum possible length. If there are multiple possible $t$ with the same length, it should be so that the generated string $t$ is lexicographically smallest.

    Return the string $x$ that would generate the string $t$.

    <details>
    <summary>Solution</summary>

    It is clear that we need to minimse the number of copies of the string $x$ that we need to add to the string $t$. We can binary search on this value of copies needed, and then generate the string $x$ greedily by adding the minimum number of characters needed to fullfill condition $2$, and pad the rest of the spaces with the character $a$.

    Time Complexity: $O(N + 26 \log N)$ where $N$ is the length of the string $s$.

    ```cpp showLineNumbers
    bool canGenerate(int copies, int n, vector<int> &cnt)
    {
        int total = 0;
        for (int i = 0; i < 26; i++)
            total += (cnt[i] + copies - 1) / copies;
        return total <= n;
    }

    string generate(int n, string s)
    {
        vector<int> neededCnt(26, 0);
        for (char ch : s)
            neededCnt[ch - 'a']++;

        int l = 0, r = s.size();
        int minCopies = -1;
        while (l <= r)
        {
            int mid = (l + r) / 2;
            if (canGenerate(mid, n, neededCnt))
            {
                minCopies = mid;
                r = mid - 1;
            }
            else
                l = mid + 1;
        }

        if (minCopies == -1)
            return "";

        int usedSpaces = 0;
        vector<int> usedCnt(26, 0);
        for (int i = 0; i < 26; i++)
        {
            usedCnt[i] = (neededCnt[i] + minCopies - 1) / minCopies;
            usedSpaces += usedCnt[i];
        }
        usedCnt[0] += n - usedSpaces;

        string ans = "";
        for (int i = 0; i < 26; i++)
            ans += string(usedCnt[i], 'a' + i);

        return ans;
    }
    ```

    </details>
