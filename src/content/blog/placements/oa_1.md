---
title: "Placements '24: Assessments [Part 1]"
description: A brief of all the online assessments that I witnessed during the season of 2024.
pubDate: 2024-10-08
updateDate: 2024-10-17
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
- [Deustche Bank](#deustche-bank)
- [26 Miles Capital](#26-miles-capital)

In addition to reading about the questions from here, please do search for the companies on Leetcode Discuss or Job Overflow. Sometimes people even post about OA questions in Codeforces blogs, so spending a bit of time searching for such questions (from past years or from different campuses) can help you gain an unexpected edge!

PS. I have tried to add the solutions of the problems from the time that I had solved them to as many problems as possible, but they may not be necessarily correct. Please raise an issue [here](https://github.com/EshaanAgg/web/issues) if you find any mistakes, either in the solutions or in the content of the blog!

---

# GreyOrange

- 45 min test with 60 MCQs and 2 coding questions
- MCQs based on basic C++ and OOPS

## Coding Questions

- Print a 2D matrix
- Print the second greatest element of an array

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

3. The question revolved around calculating the sum of the nodes of a binary tree which had exactly two children. The tree nodes were given in a non-convental way (as a string of `L` and `R` characters denoting the path that you need to take to reach the node from the root).

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

   You are required to answer $q$ queries, where in each query, you will be provided with values $l$ and $r$. For each query, determine what is the probability that the above code will fail to print "Found" when any value $i$ (where $l \leq i \leq r$) is chosen?

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

# Deustche Bank

## Other Campus Questions

A lot of these questions have been mixed with questions that were asked in the internship season of 2024 for Deustche Bank!

1.  You are given a binary string $s$ of length $n$. What is the largest prime number whose binary representation can be formed by deleting some digits from the string $s$? The length of the string $s$ is at most $20$.

    <details>
    <summary>Solution</summary>

    Since the length of the string is at most $20$, we can generate all the prime numbers up to $2^{20} - 1$ and store their binary representations in a trie. Then, we can perform a DFS on the trie to find the largest prime number that can be formed as a subsequence of the given string, by greeding selecting the next bit from the string.

    Time Complexity: $O(2^n + 2n)$

    ```cpp showLineNumbers
    class Node
    {
    public:
        Node *ch[2];
        int val;

        Node()
        {
            ch[0] = ch[1] = NULL;
            val = -1;
        }
    };

    class Trie
    {
    public:
        Node *root;

        Trie()
        {
            root = new Node();
        }

        void insert(int x)
        {
            int org = x;

            string bits = "";
            while (x)
            {
                bits += (x & 1) + '0';
                x >>= 1;
            }
            reverse(bits.begin(), bits.end());

            Node *cur = root;
            for (char bit : bits)
            {
                if (cur->ch[bit - '0'] == NULL)
                    cur->ch[bit - '0'] = new Node();
                cur = cur->ch[bit - '0'];
            }
            cur->val = org;
        }
    };

    void dfs(Node *cur, int idx, string &s, int &ans)
    {
        if (cur->val != -1)
            ans = max(ans, cur->val);

        int nextZeroIdx = -1, nextOneIdx = -1;
        while (idx < s.size() && (nextZeroIdx == -1 || nextOneIdx == -1))
        {
            if (s[idx] == '0' && nextZeroIdx == -1)
                nextZeroIdx = idx;
            else if (s[idx] == '1' && nextOneIdx == -1)
                nextOneIdx = idx;
            idx++;
        }

        if (nextZeroIdx != -1 && cur->ch[0] != NULL)
            dfs(cur->ch[0], nextZeroIdx + 1, s, ans);

        if (nextOneIdx != -1 && cur->ch[1] != NULL)
            dfs(cur->ch[1], nextOneIdx + 1, s, ans);
    }

    int solve(string s)
    {
        int MAXN = 0;

        int n = s.size();
        for (int i = 0; i < n; i++)
            if (s[i] == '1')
                MAXN |= (1 << (n - 1 - i));

        vector<int> isPrime(MAXN + 1, 1);
        isPrime[0] = isPrime[1] = 0;
        for (int i = 2; i * i <= MAXN; i++)
            if (isPrime[i])
                for (int j = i * i; j <= MAXN; j += i)
                    isPrime[j] = 0;

        Trie trie;
        for (int i = 1; i <= MAXN; i++)
            if (isPrime[i])
                trie.insert(i);

        int ans = -1;
        dfs(trie.root, 0, s, ans);

        return ans;
    }
    ```

    On second thought, we have a simpler implementation available since $n$ is small. We can directly use bitmasks to generate all the subsequences of the provided string and check if the number formed by the same is prime or not. The complexity of this solution would be $O(2^n \cdot n + A \log \log A)$ where $A = 2^n$.

    </details>

2.  You are given a string $s$ of length $n$ containing only the characters $a$ and $b$. Find the lexographically smallest subsequence of $s$ of length $k$ with atleast $x$ $b$'s. Return an empty string if no such subsequence exits.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq k \leq n$
    - $0 \leq x \leq n$

     <details>
     <summary>Solution</summary>

    Take the $b$ characters from the end of the string as much as possible, and then take the $a$ characters from the beginning of the string as much as possible. There is some edge case handling required related to the count of the characters. The time complexity of the solution is $O(n)$.

    ```cpp showLineNumbers
    string solve(int s, int k, int x) {
        int n = s.size();
        if (k > n) return "";

        int cntA = 0, cntB = 0;
        for (int i = 0; i < n; i++) {
            if (s[i] == 'a') cntA++;
            else cntB++;
        }

        if (cntB < x) return "";

        int useA = min(cntA, k - x);
        int useB = k - useA;

        vector<int> idx, AIdx, BIdx;
        for (int i = 0; i < n; i++) {
            if (s[i] == 'a') AIdx.push_back(i);
            else BIdx.push_back(i);
        }

        for (int i = 0; i < useA; i++) idx.push_back(AIdx[i]);
        reverse(BIdx.begin(), BIdx.end());
        for (int i = 0; i < useB; i++) idx.push_back(BIdx[i]);

        sort(idx.begin(), idx.end());
        string ans = "";
        for (int i : idx) ans += s[i];

        return ans;
    }
    ```

     </details>

3.  You are given a grid of size $n \times m$ containg some free cells (marked as `.`) and some blocked cells (marked as `#`). You take $1$ minute to travel from one cell to the other. You can only move horizontally or vertically. You are given the coordinates of the starting cell and the ending cell. Find the minimum time required to reach the ending cell from the starting cell.

    Constraints:

    - $1 \leq n, m \leq 10^3$
    - $1 \leq x_1, y_1, x_2, y_2 \leq n$

4.  A number is called beautiful if it atleast contains one bit as $0$, and atmost $3$ bits as $0$ in it's binary representation. Given multiple queries of the form $[l, r]$, find the sum of the cubes of all the beautiful numbers in the range $[l, r]$. Print the sum modulo $998244353$.

    Constraints:

    - $1 \leq l \leq r \leq 10^{18}$
    - $1 \leq q \leq 2 \cdot 10^5$

    <details>
    <summary>Solution</summary>

    We can use a simple brute force to generate all the possible beautiful numbers, and then use prefix sums and binary search to calculate the sum of the cubes of these numbers in any range. The time complexity of the solution is $O(60^4 + q \log N)$ where $N$ is the total number of beautiful numbers ($N \leq 10^5$).

    ```cpp showLineNumbers
    int main()
    {
        int MAX_BITS = 60;

        set<long long> validNumbers;

        for (int len = 1; len <= MAX_BITS; len++)
        {
            long long allSet = (1LL << len) - 1;

            // The last bit is always set, thus the last variable is only upto len - 1
            // 1 unset
            for (int i = 0; i < len - 1; i++)
                validNumbers.insert(allSet ^ (1LL << i));

            // 2 unset
            for (int i = 0; i < len; i++)
                for (int j = i + 1; j < len - 1; j++)
                    validNumbers.insert(allSet ^ (1LL << i) ^ (1LL << j));

            // 3 unset
            for (int i = 0; i < len; i++)
                for (int j = i + 1; j < len; j++)
                    for (int k = j + 1; k < len - 1; k++)
                        validNumbers.insert(allSet ^ (1LL << i) ^ (1LL << j) ^ (1LL << k));
        }

        long long MOD = 998244353;

        vector<long long> preSum, arr;
        for (long long x : validNumbers)
        {
            arr.push_back(x);
            x %= MOD;
            x = (((x * x) % MOD) * x) % MOD;
            long long last = preSum.empty() ? 0 : preSum.back();
            preSum.push_back((last + x) % MOD);
        }

        int q;
        cin >> q;

        while (q--)
        {
            long long l, r;
            cin >> l >> r;

            int idxLow = lower_bound(arr.begin(), arr.end(), l) - arr.begin();
            int idxUp = upper_bound(arr.begin(), arr.end(), r) - arr.begin() - 1;
            long long ans = 0;
            if (idxUp >= idxLow)
            {
                ans = preSum[idxUp];
                if (idxLow > 0)
                    ans = (ans - preSum[idxLow - 1] + MOD) % MOD;
            }

            cout << ans << endl;
        }
    }
    ```

    </details>

    <details>
    <summary>Extension</summary>

    If the question revolved around finding the number of beautiful numbers in the range $[l, r]$, or just the sum of all the beautiful numbers in the range $[l, r]$, then we could have used a simple digit DP based approach to solve the problem (as addition is distributive over modulo operation). The time complexity of the solution would have been $O(Q \cdot (64 \cdot 4 \cdot 2 \cdot 2 \cdot 2)\cdot 2)$.

    ```cpp showLineNumbers
    long long MOD = 998244353;
    using pll = pair<long long, long long>;

    // idx: Current index
    // cnt0: Number of 0's in the number
    // eq: Whether the number is equal to the given number
    // started: Whether the number has started (to avoid leading zeros)
    pll countWithSum(int idx, int cnt0, bool eq, bool started, string &s, pll dp[][4][2][2])
    {
        if (idx == s.size())
            return {cnt0 > 0, 0};

        if (dp[idx][cnt0][eq][started].first != -1)
            return dp[idx][cnt0][eq][started];

        long long ways = 0, sum = 0;
        int maxDigit = eq ? (s[idx] - '0') : 1;

        for (int bit = 0; bit <= maxDigit; bit++)
        {
            bool newStarted = started || (bit == 1);
            int newCnt0 = cnt0 + (newStarted && (bit == 0));
            bool newEq = eq && (bit == maxDigit);

            if (newCnt0 > 3)
                continue;

            auto [waysToAdd, sumToAdd] = countWithSum(idx + 1, newCnt0, newEq, newStarted, s, dp);
            ways += waysToAdd;
            ways %= MOD;

            sum += sumToAdd;
            if (bit == 1)
                sum += waysToAdd * ((1LL << (s.size() - 1 - idx)) % MOD);
            sum %= MOD;
        }

        return dp[idx][cnt0][eq][started] = {ways, sum};
    }

    string getBinary(long long x)
    {
        string ans = "";
        while (x)
        {
            ans += (x & 1) + '0';
            x >>= 1;
        }
        reverse(ans.begin(), ans.end());
        return ans;
    }

    long long getSum(string s)
    {
        int n = s.size();
        pll dp[n][4][2][2];
        memset(dp, -1, sizeof(dp));

        auto [ways, sum] = countWithSum(0, 0, 1, 0, s, dp);
        return sum;
    }

    vector<int> countBeautifulNumbers(vector<pll> queries)
    {
        vector<int> ans;

        for (auto [l, r] : queries)
        {
            string L = getBinary(l - 1);
            string R = getBinary(r);

            long long cntL = getSum(L);
            long long cntR = getSum(R);

            ans.push_back((cntR - cntL + MOD) % MOD);
        }

        return ans;
    }
    ```

    </details>

5.  You are given an array $a$ and who empty arrays $s$ and $t$. The array $a$ is a permutation of length $n$. In one operation, you can do one of the following:

    - Remove the element from the starting of $a$ and add it to the end of $t$.
    - Remove the element from the starting of $a$ and add it to the end of $s$.
    - Remove the element from the starting of $s$ and add it to the end of $t$

    Determine if it is possible to obtain the sorted permutation in the array $t$.

    Constraints:

    - $1 \leq n \leq 10^5$

    <details>
    <summary>Solution</summary>

    We will use a greedy approach, where we will try to find the currently needed element from both $s$ and $a$, and if not found, we would move the elements from $a$ to $s$ in hopes of finding the currently required element. The time complexity is $O(n)$.

    ```cpp
    int main()
    {
        int n;
        cin >> n;

        queue<int> a, b;
        for (int i = 0; i < n; i++)
        {
            int x;
            cin >> x;
            a.push(x);
        }

        int need = 1;
        while (need != n + 1)
        {
            if (!a.empty() && a.front() == need)
            {
                a.pop();
                need++;
            }
            else if (!b.empty() && b.front() == need)
            {
                b.pop();
                need++;
            }
            else
            {
                while (!a.empty() && a.front() != need)
                {
                    b.push(a.front());
                    a.pop();
                }
                if (a.empty())
                {
                    cout << "NO\n";
                    return 0;
                }
            }
        }

        cout << "YES\n";
    }
    ```

    </details>

6.  You are given a tree with $n$ nodes rooted at $1$. In one operation, you can break any edge of the tree. Even after breaking the edge, the original parent-child relation between the nodes will hold. Minimize the number of operations needed to be performed so as convert the tree into a valid $k$ -nary tree. After minimising the operations, also return the maximum size of the tree possible.

    <details>
    <summary>Solution</summary>

    ```cpp showLineNumbers
    void dfs(int u, vector<vector<int>> &g, vector<int> &subtree, int k, int &ops, int &maxSize)
    {
        subtree[u] = 1;
        int childCnt = 0;
        vector<int> sz;

        for (int v : g[u])
        {
            dfs(v, g, subtree, k, ops, maxSize);
            childCnt++;
            subtree[u] += subtree[v];
            sz.push_back(subtree[v]);
        }

        int toRem = childCnt % k;
        sort(sz.begin(), sz.end());
        for (int i = 0; i < toRem; i++)
        {
            subtree[u] -= sz[i];
            ops++;
        }

        maxSize = max(maxSize, subtree[u]);
    }

    int main()
    {
        int t;
        cin >> t;
        while (t--)
        {
            int n, k;
            cin >> n >> k;

            vector<vector<int>> g(n);
            for (int i = 1; i < n; i++)
            {
                int x;
                cin >> x;
                g[x - 1].push_back(i);
            }

            int maxSize = 0, ops = 0;
            vector<int> sub(n);
            dfs(0, g, sub, k, ops, maxSize);
            cout << ops << " " << maxSize << "\n";
        }
    }
    ```

    </details>

7.  You are given a tree with $n$ vertices, and each vertice has a colour as $0$ or $1$. For a node, we define the beauty of the vertex as the number of paths in the subtree of the node that have different colours of the ending points. Find the beauty of each node in the tree when the tree is rooted at vertex $1$.

    <details>
    <summary>Solution</summary>

    We can perform a simple DFS to calculate the number of nodes with colour $0$ and colour $1$ in the subtree of each node. The beauty of a node is then the product of the number of nodes with colour $0$ and colour $1$ in the subtree of the node. The time complexity of the solution is $O(n)$.

    ```cpp showLineNumbers
    vector<int> getBeauty(int n, string col, vector<vector<int>> &edges)
    {
        vector<vector<int>> g(n);
        for (auto &e : edges)
        {
            e[0]--, e[1]--;
            g[e[0]].push_back(e[1]);
            g[e[1]].push_back(e[0]);
        }

        vector<vector<int>> subCnt(n, vector<int>(2));

        function<void(int, int)> dfs = [&](int u, int p) -> void
        {
            subCnt[u][col[u] - '0'] = 1;

            for (int v : g[u])
            {
                if (v == p)
                    continue;
                dfs(v, u);
                subCnt[u][0] += subCnt[v][0];
                subCnt[u][1] += subCnt[v][1];
            }
        };

        dfs(0, -1);

        vector<int> ans(n);
        for (int i = 0; i < n; i++)
            ans[i] = subCnt[i][0] * subCnt[i][1];
        return ans;
    }
    ```

    </details>

8.  Given a sequence of $n$ integers $(a_1, a_2, \ldots, a_n)$, you need to perform the following operation and return the obtained result.

    - For a given integer $x$, calculate the value of the expression $min_{i = 1}^{j = n - x + 1} (fun(a_i, a_{i + 1}, \ldots, a_{i + x -1}))$, where $fun(a_i, a_{i + 1}, \ldots, a_{i + x -1})$ is the rightmost number with the highest number of distinct prime factors in the sequence $(a_i, a_{i + 1}, \ldots, a_{i + x -1})$.

    Constraints:

    - $1 \leq n \leq 10^6$
    - $1 \leq x \leq n$
    - $0 \leq a_i \leq 10^6$

    <details>
    <summary>Solution</summary>

    We can use the Sieve of Eratosthenes to compute the number of distinct prime factors of each number in the sequence. Then, we can use a sliding window of size $x$ and a priority queue to find the rightmost number with the highest number of distinct prime factors in the window. The priority queue would store the number of divisors of the element as well as it's index. The time complexity of the solution is $O(A \log A + n \log x)$ where $A$ is the maximum value of $a_i$.

    ```cpp showLineNumbers
    int getCntPrime(int n, vector<int> &spf)
    {
        int cnt = 0;
        while (n > 1)
        {
            int p = spf[n];
            cnt++;
            while (n % p == 0)
                n /= p;
        }

        return cnt;
    }

    int getValue(vector<int> &arr, int x)
    {
        int mx = 0, n = arr.size();
        for (int i = 0; i < n; i++)
            mx = max(mx, arr[i]);

        vector<int> spf(mx + 1);
        for (int i = 0; i <= mx; i++)
            spf[i] = i;

        for (int i = 2; i <= mx; i++)
            if (spf[i] == i)
                for (int j = i * i; j <= mx; j += i)
                    if (spf[j] == j)
                        spf[j] = i;

        int ans = 1e9;
        priority_queue<pair<int, int>> pq;

        for (int i = 0; i < x - 1; i++)
            pq.push({getCntPrime(arr[i], spf), i});

        for (int i = x - 1; i < n; i++)
        {
            pq.push({getCntPrime(arr[i], spf), i});

            while (pq.top().second <= i - x)
                pq.pop();
            ans = min(ans, arr[pq.top().second]);
        }

        return ans;
    }
    ```

    </details>

9.  A function $S(x)$ is defined as the sum of all the divisors for the number $x$. The function $F(x)$ is defined as the sum of $S(y)$ for all the divisors $y$ of $x$. Given two numbers $l$ and $r$, find the sum of $F(x)$ for all the numbers in the range $[l, r]$ modulo $998244353$.

    Constraints:

    - $1 \leq l \leq r \leq 10^6$

    <details>
    <summary>Solution</summary>

    We can use a simple sieve like approach to calculate the sum of divisors of all the numbers in the range $[1, r]$. Then, we can again apply this sieve like approach to the sum of divisors to calculate the sum of $F(x)$ for all the numbers in the range $[1, r]$. The time complexity of the solution is $O(r \log r)$.

    ```cpp showLineNumbers
    long long MOD = 998244353;

    long long getSum(int l, int r)
    {
        vector<long long> sumDiv(r + 1, 0);
        for (int i = 1; i <= r; i++) {
            for (int j = i; j <= r; j += i) {
                sumDiv[j] += i;
            }
        }

        vector<long long> sumF(r + 1, 0);
        for (int i = 1; i <= r; i++) {
            for (int j = i; j <= r; j += i) {
                sumF[j] += sumDiv[i];
            }
        }

        long long ans = 0;
        for (int i = l; i <= r; i++) {
            ans += sumF[i];
            ans %= MOD;
        }

        return ans;
    }
    ```

    This approach can easily be extended with precomputation to calculate the sum of $F(x)$ for all the numbers in the range $[l, r]$ in $O(1)$ time for multiple queries.
    </details>

10. Given an array of size $N$ containing integers, find the minimum possible sum of that can be formed be adding the elements in the array. You can perform the following operation at most once:

    - Select an index. If the sum of all the elements in the array up to the selected index is a multiple of the element present at the index. divide the sum up to the selected index by the element present at the index.
    - After dividing, you do not have to add this element to the resultant sum.
    - After this operation is performed, you will have to add the remaining elements to the resultant sum.
    - Note that the chosen index is excluded from the prefix sum and the suffix sum. If the chosen index is $0$, then it should be included in the prefix sum.

    Constraints:

    - $1 \leq N \leq 10^6$
    - $1 \leq A_i \leq 10^6$

    <details>
    <summary>Solution</summary>

    We can use a prefix sum and a suffix sum to calculate the sum of all the elements in the array. Then, we can iterate over all the elements in the array and calculate the sum of all the elements in the array excluding the current element. The time complexity of the solution is $O(N)$.

    ```cpp showLineNumbers
    long long solve(vector<int> &arr) {
        int n = arr.size();

        vector<long long> prefix(n), suffix(n);
        prefix[0] = arr[0];
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] + arr[i];
        }
        suffix[n - 1] = arr[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] + arr[i];
        }

        long long ans = prefix[n - 1];

        for (int i = 0; i < n; i++) {
            long long pre = i == 0 ? 0 : prefix[i - 1];
            long long suf = i == n - 1 ? 0 : suffix[i + 1];

            if (pre % arr[i] == 0) {
                ans = min(ans, pre / arr[i] + suf);
            }
        }

        return ans;
    }
    ```

    </details>

11. Given an integer array $arr$ of integers of length $n$, find the largest possible value $x$ such that atleast $k$ elements of the array are divisible by the same.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq k \leq n$
    - $1 \leq arr[i] \leq 10^6$

    <details>
    <summary>Solution</summary>

    We can precompute all the divisors of all the numbers upto $10^6$ using the Sieve of Eratosthenes. Then, we can iterate over all the divisors of any number in the array, and check if it a valid divisor satifying the condition. Since a number till $10^6$ can have atmost $128$ divisors, this solution would work in $O(n \cdot 128 + A \log A)$ time where $A$ is $10^6$ for precomputation. We would need careful handling of the case when the numbers are $0$, and a streamlined implementation to avoid TLE in a $1$ second time limit.

    ```cpp showLineNumbers
    void precomputeDivisors(int n, vector<vector<int>> &divisors)
    {
        divisors.resize(n + 1);
        for (int i = 1; i <= n; i++)
            for (int j = i; j <= n; j += i)
                divisors[j].push_back(i);
    }

    int main()
    {
        const int MAXA = 1e6 + 10;
        vector<vector<int>> divisors;
        precomputeDivisors(MAXA, divisors);

        vector<int> cnt(MAXA, 0);

        function<void()> solve = [&]() -> void
        {
            int n, k;
            cin >> n >> k;
            vector<int> arr;
            int cntZero = 0;

            for (int i = 0; i < n; i++)
            {
                int x;
                cin >> x;
                arr.push_back(x);
                if (x == 0) cntZero++;
            }

            if (cntZero >= k)
            {
                cout << "1000000000\n";
                return;
            }

            int maxEle = -1;
            for (int ele : arr)
                for (int div : divisors[ele])
                {
                    cnt[div]++;
                    if (cnt[div] >= k - cnt[0])
                        maxEle = max(maxEle, div);
                }

            cout << maxEle << "\n";

            for (int ele : arr)
                for (int div : divisors[ele])
                    cnt[div]--;
        };

        int t;
        cin >> t;

        while (t--)
            solve();
    }
    ```

    </details>

12. You are given two integer arrays $A$ and $B$ of length $n$ consisiting of non-negative integers. You have to select $K$ numbers from $B$, and then take the bitwise OR of all the elements of $A$ one at a time with each of the selected elements. The score of this operation is the sum of the $n \cdot K$ bitwise OR operations. Find the minimum value of $K$ such that a score of atleast $M$ can be achieved.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq M \leq 10^9$
    - $0 \leq A[i], B[i] \leq 10^9$

13. [Increasing Frequency](https://codeforces.com/contest/1082/problem/E)

    <details>
    <summary> Solution </summary>

    ```cpp
    int maxSubarraySum(vector<int> &arr)
    {
        int n = arr.size();
        int maxSum = 0, sum = 0;

        for (int i = 0; i < n; i++)
        {
            sum = max(arr[i], sum + arr[i]);
            maxSum = max(maxSum, sum);
        }

        return maxSum;

    }

    void solution()
    {
        int n, c;
        cin >> n >> c;

        vector<int> arr(n);
        unordered_map<int, vector<int>> idx;
        for (int i = 0; i < n; i++)
        {
            cin >> arr[i];
            idx[arr[i]].pb(i);
        }

        vector<int> freC(n);
        freC[0] = arr[0] == c;
        for (int i = 1; i < n; i++)
            freC[i] = freC[i - 1] + (arr[i] == c);

        int ans = freC[n - 1];
        for (auto &[ele, id] : idx)
        {
            if (ele == c)
                continue;
            vector<int> arr;
            arr.push_back(1);
            for (int i = 1; i < id.size(); i++)
            {
                int l = id[i - 1], r = id[i];
                arr.push_back(-(freC[r] - freC[l]));
                arr.push_back(1);
            }
            ans = max(ans, freC.back() + maxSubarraySum(arr));
        }

        cout << ans << endl;
    }

    ```

    </details>

14. You are given three arrays $l$, $r$ and $a$, which represents that the $i^{th}$ client was making $a[i]$ requests to the server per second for the duration $[l[i], r[i]]$. Find the minimum requests per second that this server should be able to handle to serve all the requests.

    <details>
    <summary>Solution</summary>

    We can use a line sweep algorithm to solve this problem. We can iterate over all the requests and add the requests to the server at the start time of the request, and remove the requests from the server at the end time of the request. We can then iterate over all the times and calculate the number of requests that the server should be able to handle at that time. The time complexity of the solution is $O(n \log n)$.

    ```cpp showLineNumbers

    long long solve(vector<int> a, vector<int> l, vector<int> r)
    {
        using pll = pair<long long, long long>;
        priority_queue<pll, vector<pll>, greater<pll>> pq;

        for (int i = 0; i < a.size(); i++)
        {
            pq.push({l[i], a[i]});
            pq.push({r[i] + 1, -a[i]});
        }

        long long curLoad = 0, maxLoad = 0;

        while (!pq.empty())
        {
            auto [_, load] = pq.top();
            pq.pop();

            curLoad += load;
            maxLoad = max(maxLoad, curLoad);
        }

        return maxLoad;
    }
    ```

    </details>

15. You are given the initial positions of Alice and Bob as $(x_1, y_1)$ and $(x_2, y_2)$. You are also given $n$ apples at the positions $(x_i, y_i)$. Alice and Bob need to collect all of the apples in the order they are given. The distance between the two points is the Manhattan distance. Find the minimum distance that Alice and Bob need to travel to collect all the apples.

    Constraints:

    - $1 \leq n \leq 2000$
    - $1 \leq x_i, y_i \leq 10^9$

    <details>
    <summary> Solution </summary>

    We can use a simple Djikstra to solve this question where the state is represented as $(i, j)$, where $i$ is the index of the apple that Alice is currently at, and $j$ is the index of the apple that Bob is currently at. The time complexity of the solution is $O(n^2 \log n)$.

    ```cpp showLineNumbers
    long long getDis(pair<int, int> a, pair<int, int> b)
    {
        return abs(a.first - b.first) + abs(a.second - b.second);
    }

    void solve()
    {
        int n;
        cin >> n;

        int x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;

        vector<pair<int, int>> apples;
        apples.push_back({x1, y1});
        apples.push_back({x2, y2});

        for (int i = 0; i < n; i++)
        {
            int x, y;
            cin >> x >> y;
            apples.push_back({x, y});
        }

        int m = apples.size();

        vector<vector<long long>> dis(m, vector<long long>(m, 1e18));
        priority_queue<vector<long long>, vector<vector<long long>>, greater<vector<long long>>> pq;

        dis[0][1] = 0;
        pq.push({0, 0, 1});

        while (!pq.empty())
        {
            auto t = pq.top();
            pq.pop();

            int idx1 = t[1], idx2 = t[2];
            long long d = t[0];
            if (dis[idx1][idx2] != d)
                continue;

            if (idx1 == m - 1 || idx2 == m - 1)
            {
                cout << d << endl;
                return;
            }

            int next = max(idx1, idx2) + 1;
            // Move idx1
            if (dis[next][idx2] > d + getDis(apples[idx1], apples[next]))
            {
                dis[next][idx2] = d + getDis(apples[idx1], apples[next]);
                pq.push({dis[next][idx2], next, idx2});
            }

            // Move idx2
            if (dis[idx1][next] > d + getDis(apples[idx2], apples[next]))
            {
                dis[idx1][next] = d + getDis(apples[idx2], apples[next]);
                pq.push({dis[idx1][next], idx1, next});
            }
        }

        cout << -1 << endl;
    }

    int main()
    {
        int TEST_CASES;
        cin >> TEST_CASES;
        while (TEST_CASES--)
            solve();
        return 0;
    }
    ```

    </details>

16. Count the number of $k$ periodic subsequences of a string $s$ of length $n$.

    - A string is $k$ periodic if $x_{i} = x_{i + k}$ for all valid indexes $i$ in the string.
    - An empty string is also $k$ periodic.

    Constraints:

    - $1 \leq n \leq 20$
    - $1 \leq k \leq 20$

    <details>
    <summary>Solution</summary>

    Since the value of $n$ is small, we can just generate all the subsequences and check if it is $k$ periodic. The time complexity of the solution is $O(2^n \cdot k)$.

    ```cpp
    int solve(string s, int k) {
        int ans = 0;
        int n = s.size();

        for (int i = 0; i < (1 << n); i++) {
            vector<int> idx;

            for (int j = 0; j < n; j++)
                if ((i >> j) & 1)
                    idx.push_back(j);

            bool valid = 1;

            for (int j = 0; j < min((int) idx.size(), k); j++) {
                for (int nxt = j + k; nxt < idx.size(); nxt += k) {
                    if (s[idx[j]] != s[idx[nxt]]) {
                        valid = 0;
                        break;
                    }
                }
            }

            ans += valid;
        }

        return ans;
    }
    ```

    </details>

17. Given an undirected tree with $N$ nodes such that there exists a path between any two nodes. For the $i^{th}$ node, a positive integer value $A[i]$ is associated with it. You also have a special positive integer $K$ and you may perform the following operation zero or more times on the given tree: Choose an edge and update the value of the nodes connected with that edge with bitwise XOR of its current value and $K$. Formally, $A[i] = (A[i] \oplus K)$ for all $i$ connected to the chosen edge. Find the maximum value of $sum_{i=1}^{i=N} A[i]$ if you can perform the above operations any number of times.

    <details>
    <summary>Solution</summary>

    It can be realized that the structure of the tree does not matter, and the only effective constraint that we have is that we can take the XOR of the nodes with $K$ in pairs only (you can do so by applying the operation on all the edges in the path between the two chosen nodes). Thus, we can use a simple greedy approach to solve this problem. The time complexity of the solution is $O(N \log N)$ due to sorting.

    ```cpp showLineNumbers

    int solve(vector<int> arr, vector<vector<int>> edges, int k)
    {
        vector<int> incr;
        int sum = 0, n = arr.size();

        for (int i = 0; i < arr.size(); i++)
        {
            sum += arr[i];
            incr.push_back((arr[i] ^ k) - arr[i]);
        }

        sort(incr.begin(), incr.end(), greater<int>());

        for (int i = 0; i + 1 < n; i += 2)
        {
            if (incr[i] > 0 && incr[i + 1] > 0)
            {
                sum += incr[i] + incr[i + 1];
                continue;
            }

            if (incr[i] > 0 && incr[i + 1] <= 0)
            {
                if (incr[i] + incr[i + 1] > 0)
                    sum += incr[i] + incr[i + 1];
            }
            break;
        }

        return sum;
    }
    ```

    </details>

18. You are given an array $arr$ of $n$ elements. For each index $i$, find the length of the smallest subarray starting at the index $i$ and having a non-negative sum. If there is no such subarray for an index, set the answer as $0$ for that index.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $-10^9 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    We will use a stack to solve this problem. We will iterate over the array from left to right and maintain a stack of indices that have not found a valid subarray for them. Whenever we get an element, if it is non-negative we can set it's answer as $1$ directly and try to pop the elements from the stack that be paired with the current index. If we get a negative element, we will push the index to the stack always.

    We will maintain prefix sums to do this computation in constant time for each index. The time complexity of the solution is $O(n)$.

    ```cpp showLineNumbers
    vector<int> solve(vector<int> &arr)
    {
        int n = arr.size();

        vector<long long> pre(n);
        pre[0] = arr[0];
        for (int i = 1; i < n; i++)
            pre[i] = pre[i - 1] + arr[i];

        vector<int> ans(n);
        stack<int> st;

        for (int i = 0; i < n; i++)
        {
            if (arr[i] < 0)
                st.push(i);
            else
            {
                ans[i] = 1;
                while (!st.empty() && pre[i] - (st.top() == 0 ? 0 : pre[st.top() - 1]) >= 0)
                {
                    ans[st.top()] = i - st.top() + 1;
                    st.pop();
                }
            }
        }

        return ans;
    }
    ```

    </details>

19. [Count Increasing Quadruples](https://leetcode.com/problems/count-increasing-quadruplets/description/)

    <details>
    <summary>Solution</summary>

    In such questions, often the trick is to fix the middle elements. Thus we will brute force over the pairs of $(j, k)$ and then find the number of elements less than $arr[k]$ and greater than $arr[j]$ in the range $[0, j - 1]$ and $[k + 1, n - 1]$ respectively. Counting the number of elements less than or a greater than a particular number in a range is typically done with a merge sort tree, but since here the elements are given to be in the range $[1, n]$, we can use simple precomputation to solve the problem. The time complexity of the solution is $O(n^2)$.

    ```cpp showLineNumbers
    class Solution
    {
    public:
        long long countQuadruplets(vector<int> &arr)
        {
            int n = arr.size();

            vector<vector<int>> left(n, vector<int>(n + 1, 0));
            // left[i][j] = Count of numbers <= j till index i
            for (int j = arr[0]; j <= n; j++)
                left[0][j] = 1;
            for (int i = 1; i < n; i++)
                for (int j = 0; j <= n; j++)
                    left[i][j] = left[i - 1][j] + (arr[i] <= j);

            vector<vector<int>> right(n, vector<int>(n + 1, 0));
            // right[i][j] = Count of numbers >= j from index [i, n-1]
            for (int j = 0; j <= arr[n - 1]; j++)
                right[n - 1][j] = 1;
            for (int i = n - 2; i >= 0; i--)
                for (int j = 0; j <= n; j++)
                    right[i][j] = right[i + 1][j] + (arr[i] >= j);

            long long ans = 0;
            for (int j = 1; j < n - 2; j++)
                for (int k = j + 1; k < n - 1; k++)
                {
                    if (arr[k] >= arr[j])
                        continue;
                    long long l = left[j - 1][arr[k] - 1];
                    long long r = arr[j] == n ? 0 : right[k + 1][arr[j] + 1];

                    ans += l * r;
                }

            return ans;
        }
    };
    ```

    </details>

20. You are given a directed tree of $n$ nodes in the form of an array $arr$ such that there is an edge from the node $arr[i]$ to the node $i + 1$ for $1 \leq i < n$. In one operation you can break any edge of this tree, and thus divide the same into two subtrees. Apply this operation repeatedly so that each of the final subtrees is a directed chain, and the total sum of the squares of length of each directed chain is maximized. Return the maximum possible sum of the squares of the lengths of the directed chains. It is gaurenteed that all the nodes are reachable from the root node $1$.

    Constraints:

    - $1 \leq n \leq 10^5$

    <details> 
    <summary>Solution</summary>

    It is clear that we should follow a greedy approach where we try to maximise the length of each of the chains. Since the chains are directed, we will intially take the longest paths from the root node to the leaves, and then try to maximise the length of the chains on the other edges. Refer to the following code for the implementation. The time complexity of the solution is $O(n)$.

    ```cpp showLineNumbers
    // Returns the maximum depth in the subtree
    // and the rest of the child paths to the paths vector
    int dfs(int u, vector<vector<int>> &g, vector<int> &paths)
    {
        if (g[u].empty())
            return 1;

        vector<int> allDepths;
        for (int v : g[u])
            allDepths.push_back(dfs(v, g, paths));

        sort(allDepths.begin(), allDepths.end(), greater<int>());
        for (int i = 1; i < allDepths.size(); i++)
            paths.push_back(allDepths[i]);

        return 1 + allDepths[0];
    }

    int solve(int n, vector<int> &arr)
    {
        vector<vector<int>> g(n);

        for (int i = 0; i < n - 1; i++)
            g[arr[i] - 1].push_back(i + 1);

        vector<int> paths;
        paths.push_back(dfs(0, g, paths));

        int ans = 0;
        for (int i = 0; i < paths.size(); i++)
            ans += paths[i] * paths[i];
        return ans;
    }
    ```

    </details>

21. There is an empty container. You want to support 2 types of queries:

    1.  `1 V X`: Insert an element in the container with value $V$ and weight $X$.
    2.  `2 V 0`: Let $n$ be the number of bits in the binary representation of $V$. Consider all the elements in the container till now. You need to count the number of elements which when divided by $2^i$ have a remainder of $V$, and also return the sum of the weights of these elements.

    Constraints:

    - $1 \leq 1 \leq 2 \cdot 10^5$
    - If the query is of type $1$, then $1 \leq V, X \leq 10^9$
    - If the query is of type $2$, then $1 \leq V \leq 10^9$

    <details>
    <summary>Solution</summary>

    Since a number upto $10^9$ can have atmost $30$ bits, we can maintain the count of different modulo values and the sum of powers for each possible length of the binary representation of the number. We can use a map to store the count of different modulo values and the sum of weights for each length of the binary representation of the number. The time complexity of the solution is $O(30 \cdot Q)$.

    ```cpp showLineNumbers
    vector<pair<int, long long>> solve(vector<vector<int>> queries)
    {
        int MAX_BITS = 31;
        vector<unordered_map<int, long long>> powerSum(MAX_BITS), cnt(MAX_BITS);

        vector<pair<int, long long>> ans;
        for (auto q : queries)
        {
            if (q[0] == 1)
            {
                int v = q[1], x = q[2];
                for (int i = 0; i < MAX_BITS; i++)
                {
                    int mask = (1 << (i + 1)) - 1;
                    powerSum[i][v & mask] += x;
                    cnt[i][v & mask]++;
                }
            }
            else
            {
                int v = q[1], v2 = q[1];

                int bitCnt = 0;
                while (v2)
                {
                    bitCnt++;
                    v2 >>= 1;
                }

                ans.push_back({cnt[bitCnt - 1][v], powerSum[bitCnt - 1][v]});
            }
        }

        return ans;
    }
    ```

    </details>

22. You are given two binary strings $S$ and $Q$ of length $n$ consisting of only $0$ and $1$. Consider a non-empty substring $S_1$ of $S$ and a non-empty substring $Q_1$ of $Q$ of the same length. Let $X$ be the string obtained as the XOR of $S_1$ and $Q_1$.

    The score of these two strings is defined as $floor(\frac{len(X)}{2^{X_{10}}})$ where $X_{10}$ is the decimal representation of $X$ and $len(X)$ is the length of the string $X$.

    Find the maximum possible score that can be obtained by choosing the strings $S_1$ and $Q_1$.

    Constraints:

    - $1 \leq n \leq 10^3$

    <details>
    <summary>Solution</summary>

    The key observation is that since the score is defined as $floor(\frac{len(X)}{2^{X_{10}}})$, the numerator of the fraction can be at max $3000$. To have a non-zero score, the value of $2^{X_{10}}$ must be less than or equal to $3000$, then the value of $X_{10}$ must be less than or equal to $11$. Thus, we can be sure that the binary representation of $X$ will have at most $4$ bits (without non-leading zeroes). To compute the number of leading zeroes in the number at every position, we can use a simple precomputation. The time complexity of the solution is $O(n^2)$.

    ```cpp showLineNumbers
    int solve(string &s, string &t)
    {
        int n = s.size();

        // The max common substring of s and t ending at s[i] and t[j]
        // 1 indexed
        vector<vector<int>> maxPre(n + 1, vector<int>(n + 1, 0));
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++)
            {
                if (s[i - 1] == t[j - 1])
                    maxPre[i][j] = maxPre[i - 1][j - 1] + 1;
                else
                    maxPre[i][j] = 0;
            }

        int maxScore = 0;
        for (int lenSub = 1; lenSub <= 4; lenSub++)
        {
            for (int i = 0; i < n - lenSub; i++)
                int a = stoi(s.substr(i, lenSub));

                for (int j = 0; j < n - lenSub; j++)
                {
                    int b = stoi(t.substr(j, lenSub));
                    int len = lenSub + maxPre[i][j];
                    int score = len / (1 << (a ^ b));
                    maxScore = max(maxScore, score);
                }
        }

        return maxScore;
    }
    ```

    </summary>

23. You are given an array of length $n$, where the $i^{th}$ element represents a chocolate of length $array[i]$. When you merge two chocolate of lengths $x$ and $y$, cost of merging is $x+y$, and the resultant chocolate length becomes $x+y$ and is replaced in the array. You need to apply these operations until there is only one chocolate left in the array. Find the minimum cost of merging. The expected time complexity of the algorithm should be $O(n \log n)$.

24. You are given two arrays $A$ and $B$ of same length $n$. You need to find a subset of the indexes $[0,1..., n-1]$, such that for any two entries in the subset, say $x$ and $y$ the following conditions holds:

    - If $A[x] != A[y]$ then $B[x] != B[y]$
    - If $A[x] = A[y]$ then $B[x] = B[y]$

    Return the maximum length of the subset possible.

25. You are given a tree of $n$ nodes. You are given $q$ queries where each query has three arguments: node $u$, node $v$ and a number $k$. You need to consider the path from $u$ to $v$, and take the XOR of all the nodes in the path and check if it is equal to the given $k$. You can exclude atmost one node from the path so that the XOR becomes equal to $k$. Return `true` if the same is possible else `false` for each query.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq q \leq 10^5$
    - $1 \leq k \leq 10^9$
    - $1 \leq u, v \leq n$

    <details>
    <summary>Solution</summary>

    It is clear that if the XOR of the nodes from $u$ to $v$ is equal to $k$, then we can simply return `true`. If the same is not true, then we need to check if there is a node $x \oplus k$ in the path from $u$ to $v$ where $\oplus$ is the XOR operation (as we can exclude this node from the path to get the desried result). To support both of these queries effeciently, we will make use of Mo's algorithm. The time complexity of the solution is $O(n \log n + q \sqrt{n})$.

    An alternative solution for the problem involves the use of Heavy Light Decomposition, but I personally find Mo's algorithm to be more intuitive and easier to implement in online assessments.

    ```cpp showLineNumbers
    #include <bits/stdc++.h>
    using namespace std;

    #define IOS                       \
        ios_base::sync_with_stdio(0); \
        cin.tie(0);                   \
        cout.tie(0)
    #define INF 1e9
    #define EPS 1e-9

    #define pb push_back
    #define vi vector<int>
    #define vvi vector<vector<int>>

    #define range(x, s, n) for (int x = s; x < n; ++x)
    #define all(a) a.begin(), a.end()

    const int BLOCK_SIZE = 300;
    const int MAXN = 2e5 + 1;
    int nodeFreq[MAXN];

    class Query
    {
    public:
        int l, r, v, c, idx;
        Query(int l, int r, int v, int idx, int c) : l(l), r(r), v(v), c(c), idx(idx) {}

        bool operator<(Query &other) const
        {
            int blk1 = l / BLOCK_SIZE, blk2 = other.l / BLOCK_SIZE;
            if (blk1 != blk2)
                return blk1 < blk2;
            return (blk1 & 1) ? (r > other.r) : (r < other.r);
        }
    };

    class Mo
    {
        int curXor;
        int n;

    public:
        Mo(int n) : n(n)
        {
            curXor = 0;
            range(i, 0, n + 1)
                nodeFreq[i] = 0;
        }

        void add(int idx)
        {
            curXor ^= (idx + 1);
            nodeFreq[idx]++;
        }

        void remove(int idx)
        {
            curXor ^= (idx + 1);
            nodeFreq[idx]--;
        }

        bool check(int val)
        {
            // Either the XOR of the current path is equal to val
            if (curXor == val)
                return true;

            // Or the target is present in the current path
            int tar = curXor ^ val;
            return tar <= n && nodeFreq[tar - 1] == 1;
        }

        bool checkAddNode(int idx, int tar)
        {
            int newCurXor = curXor ^ (idx + 1);
            if (newCurXor == tar)
                return true;

            tar = newCurXor ^ tar;
            return tar <= n && nodeFreq[tar - 1] == 1;
        }
    };

    int main()
    {
        int n, q;
        cin >> n >> q;

        vvi g(n);
        range(i, 0, n - 1)
        {
            int u, v;
            cin >> u >> v;
            u--, v--;
            g[u].pb(v);
            g[v].pb(u);
        }

        int timer = 0;
        vi tin(n), tout(n);
        int l = ceil(log2(n));
        vvi up(n, vi(l + 1));
        vector<int> tour;

        function<void(int, int)> dfs = [&](int u, int p) -> void
        {
            tin[u] = timer++;
            tour.push_back(u);

            up[u][0] = p;
            for (int i = 1; i <= l; i++)
                up[u][i] = up[up[u][i - 1]][i - 1];

            for (int v : g[u])
            {
                if (v == p)
                    continue;
                dfs(v, u);
            }

            tout[u] = timer++;
            tour.push_back(u);
        };
        dfs(0, 0);

        auto isAncestor = [&](int u, int v) -> bool
        {
            return tin[u] <= tin[v] && tout[u] >= tout[v];
        };

        auto getLCA = [&](int u, int v) -> int
        {
            if (isAncestor(u, v))
                return u;
            if (isAncestor(v, u))
                return v;

            for (int i = l; i >= 0; i--)
                if (!isAncestor(up[u][i], v))
                    u = up[u][i];

            return up[u][0];
        };

        vector<Query> qu;
        for (int i = 0; i < q; i++)
        {
            int u, v, val;
            scanf("%d %d %d", &u, &v, &val);
            u--, v--;

            if (tin[u] > tin[v])
                swap(u, v);
            int lca = getLCA(u, v);
            if (lca == u)
                qu.push_back(Query(tin[u], tin[v], val, i, -1));
            else
                qu.push_back(Query(tout[u], tin[v], val, i, lca));
        }

        sort(all(qu));
        vector<int> ans(q);
        Mo mo(n);

        int curL = 0,
            curR = -1;
        for (auto &q : qu)
        {
            while (curL > q.l)
            {
                curL--;
                mo.add(tour[curL]);
            }
            while (curR < q.r)
            {
                curR++;
                mo.add(tour[curR]);
            }
            while (curL < q.l)
            {
                mo.remove(tour[curL]);
                curL++;
            }
            while (curR > q.r)
            {
                mo.remove(tour[curR]);
                curR--;
            }

            ans[q.idx] = mo.check(q.v);
            if (q.c != -1)
            {
                int leftNode = tour[tin[q.c]];
                ans[q.idx] |= mo.checkAddNode(leftNode, q.v);
            }
        }

        for (int x : ans)
            cout << (x ? "true" : "false") << endl;
    }
    ```

    </details>

## Online Assessment Questions

1. You are given a string $s$ and an $arr$ of integers, both of length $n$. You can swap indexes $i$ and $j$ of the string $s$ if $arr[i] = arr[j]$. Find the lexographically smallest string $s$ you can obtain after performing some (possible zero) swaps.

   - $1 \leq n \leq 10^5$

2. There are $n$ types of objects, and each has a cost denoted by $arr[n]$. In some operations, you can either:

   - Choose an index $i$, pay $arr[i]$ and get $1$ object of type $i$.
   - Pay cost $x$, and transform all the objects of type $i$ to type $i + 1$. The object of type $n$ is converted to type $1$. The cost of the objects is only related to their index and not their type.

   Find the minimum cost to get $1$ object of each type.

   - $1 \leq n \leq 10^3$
   - $1 \leq arr[i] \leq 10^9$
   - $1 \leq x \leq 10^9$

    <details>
    <summary>Solution</summary>

   Suppose that you perform the second operation $k$ times. Then you would need to add the fixed cost $k \cdot x$ to the total cost. After that, for each object of type $i$, you would be able to buy it in the minimum of the cost in the range $arr[i]$ to $arr[i + k]$. Thus loop over the number of times you perform the second operation and find the minimum cost using sliding windows for each object of type $i$. If you use a set with the sliding window, the complexity is $O(n^2 \log n)$ which passed comfortably.

   </details>

3. You are given an array of strings $arr$. A permuation of the $arr$ is called valid if for any two strings in the array that have a common prefix, all the strings between them also have atleast that common prefix. For example, the ordering `[a, aa, aab]` and `[a, aab, aa]` are both valid, but `[hi, ho, hi]` is not. Find the number of valid permutations of the array.

   - $1 \leq n \leq 10^3$
   - $1 \leq arr[i].size() \leq 10^3$

   - `Example #1` For the array `["a", "aa", "aaa", "aaaa"]`, the answer is $8$.
   - `Example #2` For the array `["ivo", "ja", "jo"]`, the answer is $4$.

   <details>
   <summary>Solution</summary>

   This question can be solved with the help of a trie. Each prefix of a word denotes a split point, where all the next nodes can be arranged in any specific order. We would also need to add an extra dummy character to denote the end of the word. In the OA, when using pointers to allocate the memory for nodes of the trie, a `MLE` verdict was given. Thus, we need to use a vector of nodes to store the trie nodes. The time complexity of the solution is $O(n \cdot m)$ where $m$ is the maximum length of the string.

   ```cpp showLineNumbers
   long long mod = 1e9 + 7;
   vector<long long> fac;

   class Node
   {
   public:
       vector<int> ch;

       Node() : ch(vector<int>(27, -1)) {}
   };

   class Trie
   {
       vector<Node> nodes;

   public:
       Trie()
       {
           nodes.clear();
           nodes.emplace_back(Node());
       }

       void insert(string &s)
       {
           s += 'z' + 1;
           int cur = 0;
           for (char ch : s)
           {
               int childIdx = ch - 'a';
               if (nodes[cur].ch[childIdx] == -1)
               {
                   nodes[cur].ch[childIdx] = nodes.size();
                   nodes.emplace_back(Node());
               }
               cur = nodes[cur].ch[childIdx];
           }
       }

       long long dfs(int nodeIdx)
       {
           long long ans = 1;
           int cnt = 0;

           for (int i = 0; i < 27; i++)
           {
               if (nodes[nodeIdx].ch[i] == -1)
                   continue;
               cnt++;
               ans *= dfs(nodes[nodeIdx].ch[i]);
               ans %= mod;
           }

           ans *= fac[cnt];
           ans %= mod;

           return ans;
       }
   };

   int solve(vector<string> &words)
   {
       fac.resize(30);
       fac[0] = 1;
       for (int i = 1; i < 30; i++)
           fac[i] = (fac[i - 1] * i) % mod;

       Trie trie;
       for (string &s : words)
           trie.insert(s);

       return trie.dfs(0);
   }
   ```

    </details>

# 26 Miles Capital

There were $20$ questions in the test, which had to be solved in $60$ minutes. Out of the same, $2$ were coding questions which were different for each candidate. The rest of the questions were MCQs from the topics of finance, probablity, data interpretation, and logical reasoning. The MCQs were also shuffled between the candidates.

## Coding Questions

1. Find all the distinct palindromic substrings of the given string $s$. The length of $s$ is upto $5 \cdot 10^3$.

   <details>
   <summary>Solution</summary>

   You can fix the center of the palindrome, and then iterate creating odd and even length palindromes from that center. The time complexity of the solution is $O(n^2)$. To find the unique palindromes, you can use rolling hash to convert all the substrings to a number in constant time and push them to a set, thus adding an additonal $O(\log n)$ factor to the runtime. As luck would have it, the test cases of the questions were weak, and a $O(n^3)$ solution where I generated the substring between the two indexes and then pushed it to a set passed the test cases.

   </details>

2. [Count paths that can form a palindrome in a tree](https://leetcode.com/problems/count-paths-that-can-form-a-palindrome-in-a-tree/description/)

3. You are given an unidirected tree of $n$ nodes, where each node has a value $arr[i]$ which is rooted at node $1$. In one operation, you can select a node and delete the entire subtree of that node (along with it). The cost of one such operation is $x$. The final score of the tree is the sum of the values in the tree after all the operations minus the total cost of the operations. What is the maximum possible score that can be obtained?

   - $1 \leq n \leq 10^5$
   - $-10^9 \leq arr[i] \leq 10^9$
   - $1 \leq x \leq 10^9$

4. You are given a string $s$ that contains spaces, commas, brackets, $0$, $1$ and logical operators such as `&`, `|` and `!`. The string given will always represent a valid boolean expression in prefix notation, and would be bracketted appropriately to convey the precedence. Find the value of the boolean expression.

   - Example: `| [& [! 1] 0 [! [! 0]]] [& 0 0]` would evaluate to `0`.
