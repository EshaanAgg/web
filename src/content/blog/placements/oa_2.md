---
title: "Placements '24: Assessments [Part 2]"
description: A brief of all the online assessments that I witnessed during the season of 2024.
pubDate: 2024-12-01
updateDate: 2024-12-01
requireLatex: true
hasBlogCard: false
draft: false
series:
  name: "placements"
  part: 5
tags: ["placements", "2024"]
---

This is the second part of the series on online assessments that I witnessed during the season of 2024. The first part can be found [here](../oa_1/).

- [Zomato](#zomato)
- [PACE Stock Broking](#pace-stock-broking)
- [HiLabs Technologies](#hilabs-technologies)
- [InMobi](#inmobi)
- [Dream 11](#dream-11)
- [Netradyne](#netradyne)
- [Microsoft](#microsoft)
- [Google](#google)
- [Plutus Research](#plutus-research)

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
    bool checkTraversal(int n, vector<vector<int>> &g, vector<int> &traversal) {
        if (traversal.size() != n)
            return false;

        vector<int> idx(n, -1);
        for (int i = 0; i < n; i++)
            idx[traversal[i]] = i;
        for (int i = 0; i < n; i++)
            if (idx[i] == -1)
                return false;

        for (auto &ch: g)
            sort(ch.begin(), ch.end(), [&](int a, int b) {
                return idx[a] < idx[b];
            });

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

2.  You are given an string $s$. You are also given two strings $t$ and $u$ which are both initially empty. You can perform either of the two operations in a turn:

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

3.  You are given a string $s$ that has lowercase English characters. You are also given an integer $n$. You need to generate a string $x$ of the given length $n$ such that:

    - All of the distinct characters present in $s$ must be present in the string $x$.
    - We will then make a string $t$ by repeatedly adding the string $x$ to it untill the string $t$ can be rearranged to have the string $s$ as a substring.
    - The generated string $t$ should be of the minimum possible length.
    - If there are multiple possible $t$ with the same length, the string $x$ should be chosen so that the generated string $t$ is the lexicographically smallest possible.

    Return the string $x$ that would generate the string $t$. Return empty string if no such string $x$ exists.

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

---

# PACE Stock Broking

## Other Campus Questions

1. There are $n$ employees in a company, out of which there are $k$ special employees who have data network and share their mobile hotspots with other employees. There are employee edges connections already made between the employees, where the / connection connects the employees $from[i]$ and $to[i]$, such that either of the employees, $from[i]$ and $to[i]$ can share a mobile hotspot.

   Two employees $x$ and $y$ are connected if there is a path between them. All the employees connected to a special employee $x$ will use the mobile hotspot of the special employee $x$.

   Up to now, to restrict data usage, any employee was connected to at most one special employee. As data consumption has increased, any employee can be connected to at most $m$ number of special employees. Find the maximum number of edges that can be added to the graph such that any employee is connected to at most $m$ special employees.

    <details>
    <summary>Solution</summary>

   It can be proven that it is optimal to greedily make a component as large as possible. To do the same, we will perform the following steps:

   - Perform a BFS on the graph to find the connected components.
   - For each connected component that has no special employee, connect it to the largest connected component that has a special employee.
   - Sort all the connected components in decreasing order of their size.
   - If the components are $c_1, c_2, \ldots, c_k$, then connect the first $m$ components (i.e. $c_1, c_2, \ldots, c_m$), then the next $m$ components (i.e. $c_{m + 1}, c_{m + 2}, \ldots, c_{2m}$), and so on.

   Now each component with size $s$ contribute $\frac{s \cdot (s + 1)}{2} - x$ to the answer, where $x$ is the number of edges present originally in that component. The time complexity of the solution is $O(n + m)$.

    </details>

2. A simple variation of [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/description/)

3. A simple variation of the [Job Scheduling Problem](https://leetcode.com/problems/maximum-profit-in-job-scheduling/description/)

4. Find the number of ways to colour a $3 \times n$ grid using $3$ colours such that no row and column has all the colours the same. Print the answer modulo $10^9 + 7$.

   <details>
   <summary>Solution</summary>

   Refer to [this blog post](https://stackoverflow.com/questions/62952172/permutation-combination-question-3n-board#:~:text=For%20a%20column%20to%20fulfill,%5E3%3D27%20possible%20colorings).

   </details>

5. The floor of your house is created by $n$ tiles, which are either empty (`.`), dirty (`D`) or have food (`F`). Your task is to group the food into a single consecuive group while following the following rules:

   - You can move the food to the left or right by one tile at cost $x$.
   - Food can't be moved to a tile that is dirty.
   - The cost to clean a dirty tile is $y$.

   Given $q$ queries, each all of the form $(x, y)$ and a string representing the floor, find the minimum cost to group all the food together for each query.

    <details>
    <summary>Solution</summary>

   This is an application of the standard problem trying to group people together, along with the realization of the fact that all the dirty spots between the leftmost food point and the righmost food point must be cleaned. The complexity of the solution is $O(n + q)$.

   ```cpp showLineNumbers
   int main()
   {
       int n;
       string s;
       cin >> n >> s;

       int firstFood = -1, lastFood = -1;
       for (int i = 0; i < n; i++)
           if (s[i] == 'F')
           {
               if (firstFood == -1)
                   firstFood = i;
               lastFood = i;
           }

       int countDirty = 0, countFood = 0;
       for (int i = firstFood; i <= lastFood; i++)
           if (s[i] == 'D')
           {
               countDirty++;
               s[i] = '.';
           }
           else if (s[i] == 'F')
               countFood++;

       int minMoves = 0;
       int seenLeft = 0;
       for (int i = firstFood; i <= lastFood; i++)
       {
           if (s[i] == '.')
               minMoves += min(seenLeft, countFood - seenLeft);
           else
               seenLeft++;
       }

       int q;
       cin >> q;
       while (q--)
       {
           long long x, y;
           cin >> x >> y;
           cout << x * minMoves + y * countDirty << endl;
       }
   }
   ```

    </details>

6. There are infinite seats in a bus. There are $n$ people in a queue waiting to board the bus, and each wants to board and sit as seat $arr[i]$. It is givent that the seat desired by each person is between $1$ and $n$. The allotment is done in the following manner:

   - If the seat desired by the person in the front of the queue is empty, they are allotted that seat and removed from the queue.
   - If the seat desired by the person in the front of the queue is occupied, the seat number desired by them is incremented by $1$ and they are pushed to the end of the queue.

   Find the final seat number allotted to each person in the queue. There are atmost $10^5$ people in the queue.

    <details>
    <summary>Solution</summary>

   We will first store all the people who have not been alloted a seat in a stack to simulate their priority. We can also see that at max seats till index $2 \cdot n$ will be occupied. The rest can be seen from the implementation. The time complexity of the solution is $O(n)$.

   ```cpp showLineNumbers
   int main() {
       int n;
       cin >> n;

       vector<int> arr(n);
       for (int i = 0; i < n; i++)
           cin >> arr[i];

       vector<vector<int>> people(2 * n + 1);
       for (int i = 0; i < n; i++)
           people[arr[i]].push_back(i);

       vector<int> ans(n);
       stack<int> st;
       for (int seat = 1; seat <= 2 * n; seat++) {
           if (!people[seat].empty()) {
               // Allot seat to first person, and push rest to stack for later allotment
               // in reverse order
               auto p = people[seat];
               ans[p[0]] = seat;
               for (int i = p.size() - 1; i >= 0; i--)
                   st.push(p[i]);
           } else {
               if (!st.empty()) {
                   ans[st.top()] = seat;
                   st.pop();
               }
           }
       }

       for (int i = 0; i < n; i++)
           cout << ans[i] << " ";
   }
   ```

    </details>

7. You are running a restaurant and are expecting $n$ customers. The customers are represented by a vector of $N \times 3$ where the $i^{th}$ customer is represented by $(arrival_i, departure_i, numberDishes_i)$. The $i^{th}$ customer arrives at time $arrival_i$ and will stay till time $departure_i$. The $i^{th}$ customer will order $numberDishes_i$ dishes. What is the minimum number of chefs you need to hire so that all the customers can be served?

   - Assume that any chef can prepare any dish in $1$ unit of time.
   - A customer takes no time to eat the dishes after they are served, and they order all the dishes at once as soon as they come.

    <details>
    <summary>Solution</summary>

   We will binary search on the number of chefs required. We can then simulate the process of serving the customers and check if the number of chefs required is less than or equal to the number of chefs we have. So simulate the process, we can use the greedy strategy of trying to serve the customer who is leaving the earliest first. Careful implementation is needed to ensure that you do not process the dishes of the customer before they arrive! I have used a priority queue to store the dishes to simulate the same. The time complexity of the solution is $O(n \log n \cdot \log A)$ where $A$ is the maximum number of chefs that can be needed.

   ```cpp showLineNumbers wrap
   using pq_type = priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>>;

   void processOrders(int curTime, int lastFreeTime, int chefCnt, pq_type &toProcess, vector<int> &served)
   {
       int canProcess = (curTime - lastFreeTime) * chefCnt;
       while (!toProcess.empty() && canProcess)
       {
           auto p = toProcess.top();
           toProcess.pop();
           int leaveTime = p[0], quantity = p[1], idx = p[2];

           int process = min(canProcess, quantity);
           canProcess -= process;
           quantity -= process;

           if (quantity)
               toProcess.push({leaveTime, quantity, idx});
           else
               served[idx] = 1;
       }
   }

   bool check(int chefCnt, vector<vector<int>> &customers)
   {
       int n = customers.size();
       vector<int> served(n, 0);

       // pq -> stores [time, 0 / 1, idx]
       // toProcess -> stores [leaveTime, quantity, idx]
       pq_type pq, toProcess;
       for (int i = 0; i < n; i++)
       {
           pq.push({customers[i][0], 0, i});
           pq.push({customers[i][1], 1, i});
       }

       int lastFreeTime = -1;
       while (!pq.empty())
       {
           auto t = pq.top();
           pq.pop();
           int custIdx = t[2], type = t[1], curTime = t[0];

           if (type == 0)
           {
               toProcess.push({customers[custIdx][1], customers[custIdx][2], custIdx});
               if (lastFreeTime == -1)
                   lastFreeTime = curTime;
               processOrders(curTime, lastFreeTime, chefCnt, toProcess, served);
           }
           else
           {
               processOrders(curTime, lastFreeTime, chefCnt, toProcess, served);
               if (!served[custIdx])
                   return 0;
           }
           lastFreeTime = curTime;
       }

       return 1;
   }

   int solve(vector<vector<int>> &customers)
   {
       int low = 1, high = 1e9, ans = -1;
       while (low <= high)
       {
           int mid = (low + high) / 2;
           if (check(mid, customers))
           {
               ans = mid;
               high = mid - 1;
           }
           else
               low = mid + 1;
       }

       return ans;
   }
   ```

    </details>

8. You are given a string $s$ whose length can be more than $10^9$. You are given an array $arr$ and a string $p$ showing the count of the characters (for example, if $arr = [1, 2]$ and $p$ is `ab`, then the string $s$ is `abb`). Count the number of sequences modulo $10^9 + 7$ such that every subsequence contains all the vowels atleast once.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq arr[i] \leq 10^5$

    <details>
    <summary>Solution</summary>

   We will make use of DP to solve this problem. We will maintain $idx$ as the current index in the compressed string that we are processing, and a $mask$ to represent the vowels that have occured atleast once in the current subsequence upto the index $idx$. The time complexity of the solution is $O(n \cdot 2^5 \cdot \log max(arr[i]))$. The extra factor of $\log max(arr[i])$ comes from the fact that we are using the binary exponentiation to calculate the powers of $2$, which can be removed with the help of precomputation.

   ```cpp showLineNumbers
   long long mod = 1e9 + 7;

   long long binPower(long long a, long long b)
   {
       long long res = 1;
       while (b)
       {
           if (b & 1)
               res = (res * a) % mod;
           a = (a * a) % mod;
           b >>= 1;
       }
       return res;
   }

   int getVowelIdx(char c)
   {
       if (c == 'a')
           return 0;
       if (c == 'e')
           return 1;
       if (c == 'i')
           return 2;
       if (c == 'o')
           return 3;
       if (c == 'u')
           return 4;
       return -1;
   }

   long long solve(int idx, int mask, string &p, vector<int> &arr, vector<vector<long long>> &dp)
   {
       if (idx == p.size())
           return mask == 31;

       if (dp[idx][mask] != -1)
           return dp[idx][mask];

       long long ans = 0;
       int vowelIdx = getVowelIdx(p[idx]);

       if (vowelIdx == -1 || (mask & (1 << vowelIdx)))
       {
           // Not a vowel or already present, thus can take any number of occurences
           // from 0 to arr[idx]
           ans += solve(idx + 1, mask, p, arr, dp) * binPower(2, arr[idx]);
           ans %= mod;
       }
       else
       {
           // Do not take the vowel
           ans += solve(idx + 1, mask, p, arr, dp);
           ans %= mod;
           // Take atleast one occurence of the vowel
           ans += solve(idx + 1, mask | (1 << vowelIdx), p, arr, dp) * (binPower(2, arr[idx] - 1));
           ans %= mod;
       }

       return dp[idx][mask] = ans;
   }

   int countSubsequences(string p, vector<int> arr)
   {
       vector<vector<long long>> dp(p.size(), vector<long long>(32, -1));
       return solve(0, 0, p, arr, dp);
   }
   ```

    </details>

9. You are given three arrays $a$, $b$ and $c$ of length $n$ each. In one operation, you can choose any one element from any one of the arrays and move it to any other array. After you have performed all the operations, we would sort each of the arrays indidually, and then concatenate them. What is the minimum number of operations that you must perform so that the final resulting array formed is also sorted?

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq a[i], b[i], c[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

   We can use an approach similar to merging sorted arrays in this question. Let us first sort all the three arrays, and now try to form the new array. If we are able to add the element from the first array, then that is analogous to no operation being required for the sorting to be performed. On the other hand, it the current minimum is either from the second or the third array, then atleast one operation would be needed to put the same to it's correct position. This can be simulated easily with the help of pointers or we can use priority queues for easier implementation. The time complexity of the solution is $O(n \log n)$.

   ```cpp showLineNumbers
   int main()
   {
       int n;
       cin >> n;

       vector<int> a(n), b(n), c(n);

       priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
       for (int i = 0; i < n; i++)
       {
           cin >> a[i];
           pq.push({a[i], 0});
       }
       for (int i = 0; i < n; i++)
       {
           cin >> b[i];
           pq.push({b[i], 1});
       }
       for (int i = 0; i < n; i++)
       {
           cin >> c[i];
           pq.push({c[i], 2});
       }

       int cntA = 0, cntB = 0, cntC = 0, ops = 0;
       while (cntA + cntB + cntC != 3 * n)
       {
           auto [_, idx] = pq.top();
           pq.pop();

           if (idx == 0)
               cntA++;
           else if (idx == 1)
           {
               cntB++;
               if (cntA != n)
                   ops++;
           }
           else
           {
               cntC++;
               if (cntA != n || cntB != n)
                   ops++;
           }
       }

       cout << ops << endl;
   }
   ```

    </details>

10. You are given an array $arr$ on length $n$. In one operation you can choose any two distinct indexes $i$ and $j$, remove both the elements from the array, and then add their sum back to the array at any position of your choice. What is the minimum number of operations required to make the array sorted in non-decreasing order?

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    Let us fix the elements that we would not change in the array, that is the longest non-decreasing subsequence in the array. We can then see that the elements that are not part of the longest non-decreasing subsequence must be removed and added back to the array. When adding back, we can always pair two elements together, and add them in the appropiate position in the sorted array. The time complexity of the solution is $O(n \log n)$.

    ```cpp showLineNumbers
    int main() {
        int n;
        cin >> n;

        vector<int> arr(n);
        for (int i = 0; i < n; i++)
            cin >> arr[i];

        vector<int> lis;
        for (int i = 0; i < n; i++) {
            int idx = lower_bound(lis.begin(), lis.end(), arr[i] + 1) - lis.begin();
            if (idx == lis.size())
                lis.push_back(arr[i]);
            else
                lis[idx] = arr[i];
        }

        cout << (n - lis.size() + 1)/2 << "\n";
    }
    ```

    </details>

11. There are $n$ bacteria samples which are arranged in a row in a lab, from $1$ to $n$. There are $m$ number of pairs of bacteria, where $a[i]$ bacteria is poisonous to the bacteria $b[i]$. Determine the number of intervals of samples that can coexist.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq m \leq 10^5$
    - $1 \leq a[i], b[i] \leq n$

    <details>
    <summary>Solution</summary>

    ```cpp showLineNumbers
    int main() {
        int n, m;
        cin >> n >> m;

        vector<int> a(m), b(m);
        for (int i = 0; i < m; i++)
            cin >> a[i];
        for (int i = 0; i < m; i++)
            cin >> b[i];

        // Denotes the minimum index till which I can include
        // in the subarray ending at me and still be safe
        vector<int> d(n + 1, -1);

        for (int i = 0; i < m; i++) {
            int u = a[i], v = b[i];
            if (u > v)
                swap(u, v);
            d[v] = max(d[v], u);
        }

        // All those in my range need to be safe too
        for (int i = 1; i <= n; i++)
            d[i] = max(d[i], d[i - 1]);

        long long ans = 0;
        for (int i = 1; i <= n; i++) {
            if (d[i] == -1)
                ans += i;
            else
                ans += i - d[i];
        }

        cout << ans << endl;
    }
    ```

    </details>

12. [Number of Ways](https://codeforces.com/blog/entry/106132)

13. For some array $arr$, the score of the array is defined as $len(arr) * max(arr)$. Given an array $arr$, find the sum of the scores of all the non-empty subarrays of the array. Return the same modulo $10^9 + 7$.

    <details>
    <summary>Solution</summary>

    For each index $i$, let us calculate the number of subarrays that have the maximum element as that index, and add the contribution of all those arrays to the answer. This can be done with the help of some maths and stacks. Remember to handle the equality of the elements in exactly one the computations of either the previous greater or the next greater and calculate the contribution of the lengths accordingly. The time complexity of the solution is $O(n)$.

    ```cpp showLineNumbers
    long long mod = 1e9 + 7;

    long long getCnt(long long x, long long y)
    {
        if (x > y)
            swap(x, y);

        long long ans = x * (x + 1) / 2LL;
        ans %= mod;
        ans *= (x + y);
        ans %= mod;

        long long ans2 = (y - x - 1) * x;
        ans2 %= mod;
        ans2 *= x;
        ans2 %= mod;

        ans = (ans + ans2 + 2LL * mod) % mod;
        return ans;
    }

    int main()
    {
        int n;
        cin >> n;

        vector<int> arr(n);
        for (int i = 0; i < n; i++)
            cin >> arr[i];

        stack<int> st;
        vector<int> nxtGreater(n, n);
        for (int i = 0; i < n; i++)
        {
            while (!st.empty() && arr[i] > arr[st.top()])
            {
                nxtGreater[st.top()] = i;
                st.pop();
            }
            st.push(i);
        }
        while (!st.empty())
            st.pop();

        vector<int> prevGreater(n, -1);
        for (int i = n - 1; i >= 0; i--)
        {
            while (!st.empty() && arr[i] >= arr[st.top()])
            {
                prevGreater[st.top()] = i;
                st.pop();
            }
            st.push(i);
        }

        long long ans = 0;
        for (int i = 0; i < n; i++)
        {
            arr[i] %= mod;
            ans += getCnt(i - prevGreater[i], nxtGreater[i] - i) * arr[i];
            ans %= mod;
        }

        cout << ans << endl;
    }
    ```

    </details>

## Online Assessment Questions

1. [Make Fence Great Again](https://codeforces.com/problemset/problem/1221/D)

   <details>
   <summary>Solution</summary>

   The key realization to solve the problem is that you will never need to increment one number (or fence) by more than $2$ times in the optimal solution. Using the same we can write a simple DP solution with the time complexity of $O(n \cdot 3 \cdot 3)$.

   ```cpp showLineNumbers
   #include <bits/stdc++.h>
   using namespace std;

   #define IOS                       \
       ios_base::sync_with_stdio(0); \
       cin.tie(0);                   \
       cout.tie(0)

   #define ll long long int
   #define vvll vector<vector<long long int>>
   #define vpll vector<pair<long long int, long long int>>
   #define range(x, s, n) for (int x = s; x < n; ++x)

   void solution();

   const int MOD = 1e9 + 7;

   int main()
   {
       IOS;
       int TEST_CASES;
       TEST_CASES = 1;
       cin >> TEST_CASES;
       while (TEST_CASES--)
           solution();
       return 0;
   }

   ll solve(int idx, int lastIncr, vpll &arr, vvll &dp)
   {
       if (idx == arr.size())
           return 0;

       if (dp[idx][lastIncr] != -1)
           return dp[idx][lastIncr];

       ll cost = 1e18;
       int lastEle = arr[idx - 1].first + lastIncr;
       for (ll incr = 0; incr <= 2; incr++)
       {
           if (lastEle == arr[idx].first + incr)
               continue;
           cost = min(cost, incr * arr[idx].second + solve(idx + 1, incr, arr, dp));
       }
       return dp[idx][lastIncr] = cost;
   }

   void solution()
   {
       int n;
       cin >> n;

       vpll arr(n);
       range(i, 0, n) cin >> arr[i].first >> arr[i].second;

       vvll dp(n, vll(3, -1));
       ll ans = 1e18;
       for (ll incr = 0; incr <= 2; incr++)
           ans = min(ans, incr * arr[0].second + solve(1, incr, arr, dp));

       cout << ans << endl;
   }
   ```

   </details>

2. You are given a tree with $n$ nodes, and each node has a value $arr[i]$. You are given $q$ queries, and for each query you need to count the number of nodes with a prime value in the subtree of the query $q[i]$. The tree is rooted at $1$.

   Constraints:

   - $1 \leq n, q \leq 10^5$
   - $1 \leq arr[i] \leq 10^5$

3. You are given an even integer $n$. You need to count the number of ways to colour a $1 \times n$ grid using $3$ colours such that no two adjacent cells have the same colour and the cells equidistant from the beginning and the end also do not have the same colour. Print the answer modulo $10^9 + 7$.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $n$ is even

4. You are even a grid of size $n \times m$. Each cell of the grid is either:

   1. $0$ -> Meaning that it is free to move
   2. $1$ -> Meaning that it is blocked
   3. $2$ -> Meaning that it is a has a gold coin

   You need to begin at the point $(0,0)$ and end at the point $(t_x, t_y)$ and need to collect all the gold coins on the way. You can only move within the grid, and can move in any of the $4$ directions. Find the minimum number of moves required to collect all the gold coins. You are allowed to visit multiple cells multiple times.

   Constraints:

   - $1 \leq n, m \leq 100$
   - Count of gold coins $\leq 10$
   - $0 \leq t_x < n$
   - $0 \leq t_y < m$

---

# HiLabs Technologies

The company repeated the coding questions across campuses, even if the gap between the OA dates was more than $3$ days. MCQs questions were also partially repeated across campuses, both for the SDE and DS roles.

## Other Campus Questions

1.  You are given a graph with $n$ nodes and $m$ edges. The graph is undirected and unweighted. A bridge is an edge that, if removed, will increase the number of connected components in the graph. Find the number of pairs of nodes $(u, v)$ in the graph such that $u \leq v$ and any path between $u$ and $v$ contains exactly one bridge.

    Constraints:

    - $1 \leq n, m \leq 10^5$

     <details>
     <summary>Solution</summary>

    You can use Tarjan's algorithm to find the bridges in the graph. Then, you can condense all the nodes in the graph that have no bridge between them into a single node. This technique is known as the [bridge tree](https://codeforces.com/blog/entry/99259). Then the given condition converts to chosing two nodes in the bridge tree such that the path between them contains exactly one edge. The time complexity of the solution is $O(n + m)$.

    ```cpp showLineNumbers
    int main()
    {
        int n, m;
        cin >> n >> m;

        vector<vector<int>> g(n);
        for (int i = 0; i < m; i++)
        {
            int u, v;
            cin >> u >> v;
            u--, v--;
            g[u].push_back(v);
            g[v].push_back(u);
        }

        vector<int> vis(n, 0), tin(n), low(n);
        int timer = 0;
        set<pair<int, int>> bridges;

        function<void(int, int)> dfs = [&](int u, int p) -> void
        {
            vis[u] = 1;
            tin[u] = low[u] = timer++;

            for (int v : g[u])
            {
                if (v == p)
                    continue;
                if (!vis[v])
                {
                    dfs(v, u);
                    low[u] = min(low[u], low[v]);
                    if (low[v] > tin[u])
                    {
                        bridges.insert({u, v});
                        bridges.insert({v, u});
                    }
                }
                else
                    low[u] = min(low[u], low[v]);
            }
        };
        dfs(0, -1);

        vector<int> compId(n, -1);
        function<void(int, int, int)> bridgeDfs = [&](int u, int p, int comp) -> void
        {
            compId[u] = comp;
            for (int v : g[u])
            {
                if (v == p || compId[v] != -1)
                    continue;

                if (bridges.find({u, v}) == bridges.end())
                    bridgeDfs(v, u, comp);
            }
        };

        int comp = 0;
        for (int i = 0; i < n; i++)
            if (compId[i] == -1)
                bridgeDfs(i, -1, comp++);

        vector<int> compSize(comp + 1, 0);
        for (int i = 0; i < n; i++)
            compSize[compId[i]]++;

        long long ans = 0;
        for (auto &[u, v] : bridges)
        {
            long long a = compId[u];
            long long b = compId[v];
            ans += compSize[a] * compSize[b];
        }

        ans /= 2;
        cout << ans << endl;
    }
    ```

    </details>

2.  You are given an array $arr$ of length $n - 1$. What is the maximum GCD that you can obtain by selecting exactly $n - 1$ elements from the array?

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    We will try to exclude every element from the array and calculate the GCD of the remaining elements. The maximum GCD that we can obtain is the maximum of all the GCDs that we calculate. This calculation can be done in $O(n)$ time by using prefix and suffix GCD arrays. The time complexity of the solution is $O(n \log A_{max})$.

    ```cpp showLineNumbers
    int main()
    {
        int n;
        cin >> n;

        vector<int> arr(n);
        for (int i = 0; i < n - 1; i++)
            cin >> arr[i];

        vector<int> prefix(n), suffix(n);
        prefix[0] = arr[0];
        for (int i = 1; i < n - 1; i++)
            prefix[i] = __gcd(prefix[i - 1], arr[i]);

        suffix[n - 1] = arr[n - 1];
        for (int i = n - 2; i >= 0; i--)
            suffix[i] = __gcd(suffix[i + 1], arr[i]);

        int ans = 0;
        for (int i = 0; i < n; i++)
        {
            int curGCD = i == 0 ? suffix[1] : (i == n - 1 ? prefix[n - 2] : __gcd(prefix[i - 1], suffix[i + 1]));
            ans = max(ans, curGCD);
        }

        cout << ans << endl;
    }
    ```

    </details>

3.  A compnay has $n$ servers, labelled from $1$ to $n$, all of which initally have no workload. $m$ requests are sent to the company's API, where the requests are distributed evenly between the servers. An even distribution ensures that the busiest server has the least possible load. Print which server would handle the request for each API request.

    - $1 \leq n \leq 10^5$
    - $1 \leq m \leq 10^5$
    - $1 \leq requests[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    Use a priority queue to store the servers and their loads. The time complexity of the solution is $O(m \log n)$.

    ```cpp showLineNumbers
    int main()
    {
        int n, m;
        cin >> n >> m;

        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        for (int i = 1; i <= n; i++)
            pq.push({0, i});

        for (int i = 0; i < m; i++)
        {
            cin >> load;
            auto [curLoad, server] = pq.top();
            pq.pop();
            cout << server << " ";
            pq.push({curLoad + load, server});
        }
    }
    ```

    </details>

4.  You are given an array $arr$ of length $n$. You need to find the number of ways to divide the array into subarrays such that each subarray has exactly one $1$ present in it. The length of the array is up to $10^6$. The answer can be large, so print the answer modulo $10^9 + 7$.

    <details>
    <summary>Solution</summary>

    We can simply store the indices of all the $1$s in the array and then perform a cut at each of the position between two consecutive $1$s. The time complexity of the solution is $O(n)$.

    ```cpp showLineNumbers
    int solve(vector<int> arr) {
        int n = arr.size();

        vector<int> oneIdx;
        for (int i = 0; i < n; i++) {
            if (arr[i] == 1) {
                oneIdx.push_back(i);
            }
        }

        if (oneIdx.size() <= 1) return oneIdx.size();

        long long ways = 1, MOD = 1e9 + 7;
        for (int i = 1; i < oneIdx.size(); i++) {
            ways = (ways * (oneIdx[i] - oneIdx[i - 1])) % MOD;
        }

        return ways;
    }
    ```

    </details>

5.  A consisent sequence is a binary string where all the adjacent elements are different. You are given an integer $n$. Find the number of consistent subsequences of a consistent sequence of length $n$ starting with the character $0$. Return the number of subsequences modulo $10^9 + 7$.

    - $1 \leq n \leq 10^5$

    <details>
    <summary>Solution</summary>

    The sequence given to us is nothing but $010101\ldots$ and we need to find the alternating sequence of $0$s and $1$s. We can use a simple DP to solve this problem. The time complexity of the solution is $O(n)$.

    ```cpp
    long long MOD = 1e9 + 7;

    long long solve(int idx, int need, int n, vector<vector<long long>> &dp)
    {
        if (idx == n)
            return 1;
        if (dp[idx][need] != -1)
            return dp[idx][need];

        dp[idx][need] = solve(idx + 1, need, n, dp);
        if (idx % 2 == need)
        {
            dp[idx][need] += solve(idx + 1, !need, n, dp);
            dp[idx][need] %= MOD;
        }

        return dp[idx][need];
    }

    int consistentSubsequence(int n)
    {
        vector<vector<long long>> dp(n, vector<long long>(2, -1));
        // -1 to remove empty subsequence
        long long ans = solve(0, 0, n, dp) - 1;
        ans += solve(0, 1, n, dp) - 1;
        ans = (ans + 2 * MOD) % MOD;

        return ans;
    }
    ```

    </details>

6.  The beauty of an subarray between $(i, j)$ of array $arr$ is defined as $\sum_{k = i}^{k = j} (arr[k]) + c \cdot (j - i)$. Print the maximum value of the beauty across all the possible distinct indexes $(u, v)$ in the array.

    <details>
    <summary>Solution</summary>

    We maintain the largest value of beauty in the subarray. Then at any index either we can start a new subarray or extend the current subarray by adding the element and one unit of $c$. The time complexity of the solution is $O(n)$.

    ```cpp
    long long maximumQuirkness(vector<int> &arr, long long cost)
    {
        long long sufMax = arr.back();
        long long ans = -1e18;

        for (int i = arr.size() - 2; i >= 0; i--)
        {
            ans = max(ans, sufMax + arr[i] + cost);
            sufMax = max(arr[i] + cost + sufMax, (long long)arr[i]);
        }

        return ans;

    }
    ```

    </details>

7.  The beauty of an subarray between $(i, j)$ of array $arr$ is defined as $\sum_{k = i}^{k = j} (arr[k] + c \cdot (j - i)) + 2 \cdot i \cdot j$. Print the maximum value of the beauty across all the possible distinct indexes $(u, v)$ in the array. The array is $1$ indexed.

8.  You have $n$ coins with values from $0$ to $n - 1$. Find the number of ways of choosing exactly $k$ coins such that the sum of the coins is divisible by $m$. Return the number of ways modulo $1e9 + 7$.

    Constraints:

    - $1 \leq n \leq 10^3$
    - $1 \leq k \leq min(n, 10^2)$
    - $1 \leq m \leq 10^3$

    <details>
    <summary>Solution</summary>

    We can use a take or not-take approach to solve this problem. The state of the DP can be represented as $(i, j, k)$ where $i$ is the coin that we are considering right now, $j$ is the number of coins taken that we can take in the next moves, and $k$ is the sum of the coins that must be taken in the next moves modulo $m$. The time complexity of the solution is $O(n \cdot k \cdot m)$ as each state can be reached in $O(1)$ time.

    ```cpp
    int main()
    {
        int n, k, m;
        cin >> n >> k >> m;

        using ll = long long;
        using vll = vector<ll>;
        vector<vector<vll>> dp(n + 1, vector<vll>(k + 1, vll(m + 1, 0)));

        dp[n][0][0] = 1;
        ll MOD = 1e9 + 7;

        for (int i = n - 1; i >= 0; i--)
            for (int j = 0; j <= k; j++)
                for (int l = 0; l <= m; l++)
                {
                    dp[i][j][l] = dp[i + 1][j][l];
                    if (j > 0)
                    {
                        int reqMod = l - i;
                        reqMod = ((reqMod % m) + m) % m;
                        dp[i][j][l] += dp[i + 1][j - 1][reqMod];
                    }
                    dp[i][j][l] %= MOD;
                }

        cout << dp[0][k][0] << endl;
    }
    ```

    This might give TLE in a $1$ time limit or MLE in strict constraints, so we can space optimise the same and make use of arrays instead of vectors to improve the performance.

    <details>
    <summary>Space Optimised Solution</summary>

    ```cpp showLineNumbers
    const int MAXK = 100, MAXM = 1000;
    long long cur[MAXK + 1][MAXM + 1], nxt[MAXK + 1][MAXM + 1];

    int main()
    {
        int n, k, m;
        cin >> n >> k >> m;

        memset(nxt, 0, sizeof(nxt));
        nxt[0][0] = 1;

        long long MOD = 1e9 + 7;

        for (int i = n - 1; i >= 0; i--)
        {
            memset(cur, 0, sizeof(cur));

            for (int j = 0; j <= k; j++)
                for (int l = 0; l <= m; l++)
                {
                    cur[j][l] = nxt[j][l];
                    if (j > 0)
                    {
                        int reqMod = l - i;
                        reqMod = ((reqMod % m) + m) % m;
                        cur[j][l] += nxt[j - 1][reqMod];
                    }
                    cur[j][l] %= MOD;
                }

            memcpy(nxt, cur, sizeof(cur));
        }

        cout << nxt[k][0] << endl;
    }
    ```

    </details>

9.  You are standing at position $k$. You can move to any position which is the product of any two elements of the array $arr$ from the current position. Find the maximum distance you can move in one jump.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $-10^9 \leq arr[i] \leq 10^9$
    - $-10^9 \leq k \leq 10^9$

    <details>
    <summary>Solution</summary>

    You will make the jump to either the most positive position possible or the most negative position possible. The time complexity of the solution is $O(n \log n)$ due to the sorting.

    ```cpp showLineNumbers
    int main()
    {
        long long n, k;
        cin >> n >> k;

        vector<long long> arr(n);
        for (int i = 0; i < n; i++)
            cin >> arr[i];

        sort(arr.begin(), arr.end());

        long long maxPos1 = arr[n - 1] * arr[n - 2];
        long long maxPos2 = arr[0] * arr[1];
        long long maxPos3 = arr[0] * arr[n - 1];

        long long d = max({abs(maxPos1 - k),
                        abs(maxPos2 - k),
                        abs(maxPos3 - k)});

        cout << d << endl;
    }
    ```

    </details>

10. You are given an array of distinct elements $arr[i]$. You elements $a$ and $b$ can be connected by an edge if $lcm(a, b) \leq 10^6$. Find the minimum number of connected components possible in from the given array.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    It is obvious that elements greater than $10^9$ when paired with any other element would have a $lcm$ greater than $10^6$. So we can ignore all the elements greater than $10^6$. Now let us fix the $gcd$ as $g$. We can push all the elements that are divisible by $g$ into an array. Now it is certain that all the elements in this array with have a $gcd$ of atleadt $g$. We can use a two pointer approach to connect all the elements in the array that have $a * b \leq 10^6 \cdot g$. We will use a DSU to connect all the elements in the array. The time complexity of the solution is $O(n + A \log A)$ where $A$ is $10^6$.

    ```cpp showLineNumbers
    class DSU
    {
    public:
        vector<int> parent, size;

        DSU(int n)
        {
            parent.resize(n);
            size.resize(n, 1);
            for (int i = 0; i < n; i++)
                parent[i] = i;
        }

        int find(int x)
        {
            if (parent[x] == x)
                return x;
            return parent[x] = find(parent[x]);
        }

        void unite(int x, int y)
        {
            x = find(x);
            y = find(y);
            if (x != y)
            {
                if (size[x] < size[y])
                    swap(x, y);
                parent[y] = x;
                size[x] += size[y];
            }
        }
    };

    int solve(vector<int> &arr)
    {
        int n = arr.size();

        const int LIMIT = 1e6;
        DSU dsu(LIMIT + 1);

        int compCnt = 0;
        vector<int> pre(LIMIT + 1, 0);
        for (int i = 0; i < n; i++)
        {
            if (arr[i] > LIMIT)
                compCnt++;
            else
                pre[arr[i]] = 1;
        }

        for (int gcd = 1; gcd <= LIMIT; gcd++)
        {
            vector<long long> ele;
            for (int j = gcd; j <= LIMIT; j += gcd)
                if (pre[j])
                    ele.push_back(j);

            long long maxProduct = (long long)1e6 * gcd;
            int n = ele.size();

            int j = 0;
            for (int i = 0; i < n; i++)
            {
                if (j < i)
                    j = i;
                dsu.unite(ele[i], ele[j]);
                while (j + 1 < n && ele[i] * ele[j + 1] <= maxProduct)
                {
                    dsu.unite(ele[i], ele[j + 1]);
                    j++;
                }
            }
        }

        set<int> par;
        for (int x : arr)
            if (x <= LIMIT)
                par.insert(dsu.find(x));

        return par.size() + compCnt;
    }
    ```

    </details>

11. [Candle Problem](https://www.hackerearth.com/problem/algorithm/candle-problem/)

12. You are given a tree with $n$ nodes with one node intially marked as black, and the rest marked as white. In one operation, you can colour any of the nodes black only if atleast one the neighbours of the node is black. Count the possible number of colourings of the tree. Return the answer modulo $10^9 + 7$.

    <details>
    <summary>Solution</summary>

    We can use simple DFS to solve this problem. Let the $dfs$ function return the number of ways of colouring the subtree of $u$ (when the whole tree is rooted at $root$) and the node $u$ is coloured black. Then for every child node, we can either leave it white, resulting in $1$ way of colouring, or colour it black which can be calculated recursively by multiplying with the result of the $dfs$ function. All the ways for all the children are multiplied together to get the final result. The complexity of the solution is $O(n)$.

    ```cpp showLineNumbers
    long long mod = 1e9 + 7;

    long long dfs(int u, int p, vector<vector<int>> &g)
    {
        long long ans = 1;
        for (int v : g[u])
        {
            if (v == p)
                continue;
            ans *= (1 + dfs(v, u, g));
            ans %= mod;
        }
        return ans;
    }

    int main()
    {
        int n;
        cin >> n;

        vector<vector<int>> g(n);
        for (int i = 0; i < n - 1; i++)
        {
            int u, v;
            cin >> u >> v;
            u--, v--;
            g[u].push_back(v);
            g[v].push_back(u);
        }

        int root;
        cin >> root;
        root--;

        cout << dfs(root, -1, g) << endl;

    }
    ```

    </details>

13. When comparing two numbers, you need to first compare the sum of digits of the two numbers, and only if they are the same, then you need to compare the actual values of the numbers themselves. Given an array $arr$, for each index, find the index of the closest number to the right that is bigger than the number at the given index according to the comparision scheme specified above. If no such number exists, print $-1$.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq arr[i] \leq 10^9$

14. You are given array $A$ of size $N$. You can make atmost $K$ operations on the same, where in each operation you can increase or decrease an element in array by $1$. Now, the beauty of array is frequency of most frequent element in the array. Output the maximum beauty that can be achieved in $K$ operations.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq k \leq 10^{18}$
    - $-10^9 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    Let us first sort the array and try to binary search on the answer. It is clear that when we are checking the validity for an answer $x$, we would want some subarray of the sorted array to become all equal to $x$. Thus we can maintain a sliding window, and calculate the required number of operations for each window. It is a well known fact that given a sorted array, the median of the array is the point from where the number of operations required to make the array all equal by increments and decrements is minimum. We can use prefix sums to calculate the number of operations required to make the array all equal to $x$ in $O(1)$ time for any subarray. Thus the overall complexity of the solution is $O(n \log n)$.

    ```cpp showLineNumbers
    int main()
    {
        int n;
        long long k;
        cin >> n >> k;

        vector<int> arr(n);
        for (int i = 0; i < n; i++)
            cin >> arr[i];
        sort(arr.begin(), arr.end());

        vector<long long> pre(n);
        pre[0] = arr[0];
        for (int i = 1; i < n; i++)
            pre[i] = pre[i - 1] + arr[i];

        auto getRangeSum = [&](int l, int r) -> long long
        {
            if (l > r)
                return 0;
            return pre[r] - (l == 0 ? 0 : pre[l - 1]);
        };

        auto getMinOpsAtIdx = [&](int l, int r, int m) -> long long
        {
            long long sum1 = getRangeSum(l, m - 1);
            sum1 = (long long)(m - l) * arr[m] - sum1;

            long long sum2 = getRangeSum(m, r);
            sum2 = sum2 - (long long)(r - m + 1) * arr[m];

            return sum1 + sum2;
        };

        auto getMinOps = [&](int l, int r) -> long long
        {
            int len = r - l + 1;
            if (len % 2 == 1)
                return getMinOpsAtIdx(l, r, l + len / 2);
            else
            {
                long long m1 = l + len / 2 - 1, m2 = l + len / 2;
                return min(getMinOpsAtIdx(l, r, m1), getMinOpsAtIdx(l, r, m2));
            }
        };

        auto checkLength = [&](int l) -> bool
        {
            for (int i = 0; i <= n - l; i++)
                if (getMinOps(i, i + l - 1) <= k)
                    return true;
            return false;
        };

        int ans = 0;
        int l = 1, r = n;

        while (l <= r)
        {
            int m = (l + r) / 2;
            if (checkLength(m))
            {
                ans = m;
                l = m + 1;
            }
            else
                r = m - 1;
        }

        cout << ans << endl;
    }
    ```

    </details>

15. You are given a tree with $n$ nodes and each node has the value $0$ initially. The tree is rooted at $1$. You need to perform $q$ queries on the same of the following types:

    - `1 X Y`: Increase the value of all the nodes in the subtree of node $X$ by $Y$.
    - `2 X Y`: Increase the value of all nodes by $Y$ except the nodes in the subtree of node $X$.

    Print the final values of all the nodes in the tree.

    Constraints:

    - $1 \leq n, q \leq 10^5$
    - $1 \leq X \leq n$
    - $-10^9 \leq Y \leq 10^9$

    <details>
    <summary>Solution</summary>

    ```cpp showLineNumbers
    int main()
    {
        int n;
        cin >> n;

        vector<vector<int>> g(n);
        for (int i = 0; i < n - 1; i++)
        {
            int u, v;
            cin >> u >> v;
            u--, v--;
            g[u].push_back(v);
            g[v].push_back(u);
        }

        int timer = 0;
        vector<int> tin(n), tout(n);

        function<void(int, int)> dfs = [&](int u, int p) -> void
        {
            tin[u] = timer++;
            for (int v : g[u])
            {
                if (v == p)
                    continue;
                dfs(v, u);
            }
            tout[u] = timer++;
        };
        dfs(0, -1);

        vector<long long> dif(2 * n + 1);

        int q;
        cin >> q;
        while (q--)
        {
            int ty, x, y;
            cin >> ty >> x >> y;
            x--;

            if (ty == 1)
            {
                dif[tin[x]] += y;
                dif[tout[x] + 1] -= y;
            }
            else
            {
                dif[tin[0]] += y;
                dif[tout[0] + 1] -= y;

                dif[tin[x]] -= y;
                dif[tout[x] + 1] += y;
            }
        }

        for (int i = 1; i <= 2 * n; i++)
            dif[i] += dif[i - 1];

        for (int i = 0; i < n; i++)
            cout << dif[tin[i]] << " ";
    }
    ```

    </details>

16. This question was asked in the Software Developer role, and a workspace was provided to work on the same. You are required to design a simple HTML page that accepts from the user the number of rows and columns, and then makes a table of the specified dimensions. There is bonus marking for CSS styling.

    <details>
    <summary>HTML Code</summary>

    ```html
    <!doctype html>
    <html>
      <head>
        <title>Test</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            padding: 5px;
          }

          input {
            margin-left: 5px;
            margin-right: 5px;
          }

          table {
            text-align: center;
          }

          tr:nth-child(even) {
            background-color: lightgrey;
          }

          tr:hover {
            background-color: lightcyan;
          }

          td {
            border: 1px solid black;
            margin: 0;
            padding: 1px;
          }
        </style>
      </head>

      <body>
        <center>
          <form name="input-form">
            <label for="rows" tabindex="1">Rows</label>
            <input
              type="number"
              name="rows"
              required
              min="1"
              max="10"
              id="rows"
            />
            <label for="cols" tabindex="2">Columns</label>
            <input
              type="number"
              name="cols"
              required
              min="1"
              max="10"
              id="cols"
            />
            <button type="submit" tabindex="3">Submit</button>
            <button type="reset" tabindex="4">Reset</button>
          </form>

          <h2>Generated Table</h2>
          <table id="main-table"></table>
        </center>
      </body>

      <script>
        const tableDiv = document.getElementById("main-table");
        const form = document.forms["input-form"];

        const resetValues = () => {
          form["rows"].value = "";
          form["cols"].value = "";
        };

        const handleSubmit = (event) => {
          event.preventDefault();
          const rows = +form["rows"].value,
            cols = +form["cols"].value;
          if (Number.isNaN(rows) || Number.isNaN(cols)) {
            alert("Please enter valid value of rows and columns");
            resetValues();
            return;
          }

          if (rows == 0 || cols == 0) {
            alert("Rows and columns can't be zero");
            resetValues();
            return;
          }
          plotTable(rows, cols);
        };

        const plotTable = (rows, cols) => {
          tableDiv.innerHTML = "";
          for (let r = 0; r < rows; r++) {
            const rowEle = document.createElement("tr");
            for (let c = 0; c < cols; c++) {
              const colEle = document.createElement("td");
              colEle.innerHTML = `Row ${r + 1} Col ${c + 1}`;
              rowEle.appendChild(colEle);
            }
            tableDiv.appendChild(rowEle);
          }
        };

        form.addEventListener("submit", handleSubmit);
      </script>
    </html>
    ```

    </details>

## Online Assessment Questions

1. You are given a string $s$ and a dictionary of words as $arr$ of length $n$. You need to find the word from the dictionary with the minimum edit distance with respect to the provided string $s$. If there are multiple such words, return the lexographically smallest word.

   Constraints:

   - $1 \leq n \leq 10^4$
   - $1 \leq |s| \leq 10$
   - $1 \leq |arr[i]| \leq 10$

2. You are given a string $s$ of length $n$ denoting a valid binary expression. The string can have the following characters:

   - `x`: Denotes the primary variable
   - `X`: Denotes the negation of the primary variable
   - `1`: Denotes the logical `true` value
   - `0`: Denotes the logical `false` value
   - `&`: Denotes the logical `and` operation
   - `|`: Denotes the logical `or` operation
   - `^`: Denotes the logical `xor` operation
   - `(`: Denotes the start of a subexpression
   - `)`: Denotes the end of a subexpression

   You need to determine the minimum number of substituitons required (replace any `x` or `X` with `0` or `1`) to make the expression evaluate to either `true` or `false`. There are multiple testcases, and you need to print the result for each testcase in a new line.

   Constraints:

   - $1 \leq t \leq 10$
   - $1 \leq n \leq 10^5$
   - The expression is always valid.

   Sample Input:

   ```
   5
   1&0
   x
   1|(x^x&(x|0))
   1|0
   (0|x|(X^1^x^X))
   ```

   Sample Output & Explanation:

   ```
   0 -> The expression is already false
   1 -> The expression can be made true or false by replacing x with 1 or 0
   0 -> The expression is already true, irrespective of the value of x
   0 -> The expression is already false
   1 -> We can set x = 1 to make the expression true
   ```

3. A UI screenshot involving three buttons and a picture was given. Depending upon which button is clicked, the image shown shown be changed. Some amount of Flexbox and CSS was required to position the buttons and the image in the correct manner as shown in the UI. Asthetics was also a part of the marking.

---

# InMobi

## Other Campus Questions

1. You are given $n$ projects, where the $i^{th}$ project has a pure profit of $profit[i]$ and a minimum capital of $capital[i]$ is required to start the same. Initially you have $w$ capital. Whenever you complete a project, you will obtain its pure profit and the same would be added to your capital. Pick a list of at most $k$ distinct projects from the given projects to maximise your final capital, and return the final maximised capital.

   This question is repeat of [IPO](https://leetcode.com/problems/ipo/description/) on Leetcode.

2. [Wiggle Subsequence](https://leetcode.com/problems/wiggle-subsequence/description/)

   <details>
   <summary>Solution</summary>

   ```cpp
   int wiggleMaxLength(vector<int>& nums) {
       int size = nums.size(), peak = 1, valley = 1;

       for (int i = 1; i < size; ++i) {
           if (nums[i] > nums[i-1])
               peak = valley + 1;
           else if (nums[i] < nums[i-1])
               valley = peak + 1;
       }

       return max(peak , valley);
   }
   ```

   </details>

3. You are given a string $word$ of lowercase English letters. You need to select one index from it and remove the letter at that index from $word$ such that the frequency of every letter in $word$ is equal. Return `true` if it possible to do so in exactly one operation, or else return `false`.

4. [X of a Kind in a Deck of Cards](https://leetcode.com/problems/x-of-a-kind-in-a-deck-of-cards/description/)

5. [Fruits into Baskets](https://leetcode.com/problems/fruit-into-baskets/description/)

6. [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses/description/)

7. [Remove Letter to Equlaize Frequency](https://leetcode.com/problems/remove-letter-to-equalize-frequency/description/)

8. Imagine a vertical line cutting through the root node, thus dividing the left and right sub-trees of it. A mirror element of a node $x$ satisfies the following three properties:

   - It is on the opposite side of the dividing line.
   - It is at the same depth as $x$.
   - It's horizontal distance from the vertical dividing line is the same as that of $x$.

   Your task is to write a program logic that first creates a Binary Search Tree, then creates a mirrored tree out of it, and finally prints the preorder (Root, Left, Right) traversal of the mirrored tree. Your program will be provided with the number of nodes in the Binary Search Tree and the data of nodes separated by space in the next line.

    <details>
    <summary> Solution </summary>

   This question can be seen as a conjuction of three standard DSA problems:

   1. Creating a balanced BST from a sorted array.
   2. Mirroring a binary tree.
   3. Preorder traversal of a binary tree.

   The implementation is relatively simple. The time complexity of the solution is $O(n)$.

   ```cpp
   class Node
   {
   public:
       Node *left, *right;
       int val;

       Node() : left(nullptr), right(nullptr), val(-1) {}
       Node(int x) : left(nullptr), right(nullptr), val(x) {}
   };

   Node *build(int l, int r, vector<int> &arr)
   {
       if (l > r)
           return nullptr;
       if (l == r)
           return new Node(arr[l]);

       int m = (l + r) / 2;
       Node *n = new Node(arr[m]);
       n->left = build(l, m - 1, arr);
       n->right = build(m + 1, r, arr);
       return n;
   }

   void flip(Node *root)
   {
       if (root == nullptr)
           return;
       swap(root->left, root->right);
       flip(root->left);
       flip(root->right);
   }

   void print(Node *root)
   {
       if (root == nullptr)
           return;
       cout << root->val << " ";
       print(root->left);
       print(root->right);
   }

   int main()
   {
       int n;
       cin >> n;
       vector<int> arr(n);
       for (int i = 0; i < n; i++)
           cin >> arr[i];

       Node *root = build(0, n - 1, arr);
       flip(root);
       print(root);
   }
   ```

    </details>

9. [Aggressive Cows](https://www.spoj.com/problems/AGGRCOW/)

10. [Word Ladder](https://leetcode.com/problems/word-ladder/)

11. [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/description/)

12. Try all the variants of the [House Robber](https://leetcode.com/problems/house-robber/description/) problem.

13. [Buy & Sell Stocks atmost K Times](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/description/)

14. [Cycle Detection in Directed Graph](https://cp-algorithms.com/graph/finding-cycle.html)

## Online Assessment Questions

1. Given an array of size $N$, find the missing and duplicate integer in the array. The array is supposed to all the integers between $1$ and $N$ exactly once.

2. Find the probability to reach the target node from the root node $1$ in an unweighted undirected tree in time $t$. In each second you can visit one of the unvisited nodes from the current node with equal probability, and if there are no unvisited nodes, you can stay at the same node. The tree is given in the form of an adjacency list.

3. Given an integer $k$ and character $arr$ of size $n$ containing two characters: $G$ for guard and $I$ for intruder, you need to count the maximum number of intruders that can be caught. A guard can catch only one thief if it lies in range $[i-k, i+k]$ where $i$ is the position of the guard under consideration.

---

# Dream 11

## Other Campus Questions

1.  Cricket is a team sport comprised of $11$ player each team has four types of player: Batsman, Bowler, All-Rounder, and Wicket Keeper. Dream11 is a fantasy cricket platform where users create their own cricket teams. You have decided to participate in Dream11 during the IPL season. The platform rewards prizes based on the maximum total value of your team. Your task is to create a cricket team based on certain constraints to win the reward.

    Write a program to do so while adhering to the following constraints:

    1. Your team must consist of $11$ players.
    2. You have a budget of $B$ to spend on selecting players.
    3. Each player has a price tag and a player value.
    4. There are four types of player: Batsman, Bowler, All-Rounder, and Wicket Keeper.
    5. Your team should have at least one Wicket Keeper, one All-Rounder, two Batsmen, two Bowlers.
    6. Now given list of price and player values to determine the type of players:
       - The first 20% of players are considered as Wicket Keepers. Note: Take the ceil of the number obtained.
       - Batsmen are selected from odd positions (excluding the first 20%).
       - Bowlers are selected from the even positions that are not divisible by 4 (excluding the first 20%).
       - All-Rounders are selected from positions divisible by 4 (excluding the first 20%).
       - Player index starts from zero. Please factor this in calculation of player types viz. Wicket Keeper, All-Rounder, Batsmen and Bowler.

    Print the maximum total value $M$ which is the summation of the selected player values, that can be obtained while satisfying all the constraints and is within the budget else print `Insufficient Budget`.

    `Constraints`

    - $11 \leq N \leq 200$
    - $1 \leq B \leq 1000$
    - $1 \leq P \leq 20$
    - $1 \leq V \leq 20$

    ```
    Example #1

    12
    4 3 3 6 5 2 8 8 2 7 8 2
    2 1 1 2 3 6 1 6 2 7 6 3
    50

    Output #1: 34

    Example #2

    12
    4 3 3 6 5 2 8 8 2 7 9 2
    2 1 1 2 3 6 1 6 2 7 6 3
    50

    Output #2: Insufficient Budget
    ```

    <details>
    <summary>Solution</summary>

    We will use dynamic programming to solve this problem. We will maintain a $6$-dimensional DP array where the dimensions are the index of the player, the budget left, the number of Wicket Keepers, the number of All Rounders, the number of Bowlers, the number of Batsmen, and the total number of players. We would also need to space optimise the solution as the number of dimensions is too high. The time complexity of the solution is $O(n \cdot B \cdot 2 \cdot 2 \cdot 3 \cdot 3 \cdot 12 )$ which approximately equals $10^8$ operations.

    ```cpp showLineNumbers
    // 0 -> WK, 1 -> Bat, 2 -> Bowl, 3 -> All Rounder
    int getType(int i, int n)
    {
        int wkCnt = ceil((double)n * 0.2);
        if (i < wkCnt)
            return 0;

        if (i % 2 == 1)
            return 1;

        if (i % 4 == 0)
            return 3;

        return 2;
    }

    int main()
    {
        int n;
        cin >> n;

        vector<int> cost(n), val(n);
        for (int i = 0; i < n; i++)
            cin >> cost[i];
        for (int i = 0; i < n; i++)
            cin >> val[i];

        int b;
        cin >> b;

        // idx, budget left, wk, all rounder, bowl, bat, total
        int cur[b + 1][2][2][3][3][12], nxt[b + 1][2][2][3][3][12];
        memset(cur, -1, sizeof(cur));
        memset(nxt, -1, sizeof(nxt));

        cur[b][0][0][0][0][0] = 0;

        for (int idx = 0; idx < n; idx++)
        {
            for (int budLeft = 0; budLeft <= b; budLeft++)
                for (int wk = 0; wk < 2; wk++)
                    for (int ar = 0; ar < 2; ar++)
                        for (int bowl = 0; bowl < 3; bowl++)
                            for (int bat = 0; bat < 3; bat++)
                                for (int tot = 0; tot < 12; tot++)
                                {
                                    if (cur[budLeft][wk][ar][bowl][bat][tot] == -1)
                                        continue;

                                    // Do not take the player
                                    nxt[budLeft][wk][ar][bowl][bat][tot] = max(
                                        nxt[budLeft][wk][ar][bowl][bat][tot],
                                        cur[budLeft][wk][ar][bowl][bat][tot]);

                                    // Buy the player
                                    if (tot < 11 && budLeft >= cost[idx])
                                    {
                                        int ty = getType(idx, n);
                                        int newBud = budLeft - cost[idx];
                                        int newWk = wk | (ty == 0);
                                        int newBat = min(bat + (ty == 1), 2);
                                        int newBowl = min(bowl + (ty == 2), 2);
                                        int newAr = ar | (ty == 3);

                                        nxt[newBud][newWk][newAr][newBowl][newBat][tot + 1] = max(
                                            nxt[newBud][newWk][newAr][newBowl][newBat][tot + 1],
                                            cur[budLeft][wk][ar][bowl][bat][tot] + val[idx]);
                                    }
                                }

            memcpy(cur, nxt, sizeof(nxt));
            memset(nxt, -1, sizeof(nxt));
        }

        int ans = -1;
        for (int left = 0; left <= b; left++)
            ans = max(ans, cur[left][1][1][2][2][11]);

        if (ans == -1)
            cout << "Insufficient Budget" << endl;
        else
            cout << ans << endl;
    }
    ```

    </details>

2.  [Number of Ways to Decode the String](https://leetcode.com/problems/decode-ways-ii/description/)

3.  You are given a rectangular grid with the bottom left corner as $(x_1, y_1)$ and the upper right corner as $(x_2, y_2)$. Find all the lattice points in the grid that are at a maximum distance of $r$ from the given point $(x_c, y_c)$. The distance between two points is the cartesian distance between them.

    Constraints:

    - $1 \leq x_1, y_1, x_2, y_2, x_c, y_c \leq 10^6$
    - $x_1 \leq x_2$
    - $y_1 \leq y_2$
    - $1 \leq r \leq 10^6$

    <details>
    <summary>Solution</summary>

    Since the coordinates are upto $10^6$ only, we can loop over any one coordinate and then use binary search on the other coordinate to find it's maximum and minimum possible value that allows it to be within the described circle. If we iterate over the coordinate $x$, we need to consider the position $y_c$ of the center and thus make three different cases for the same. Refer to the implementation for details. The time complexity of the solution is $O(X \log Y)$ where $X = x_2 - x_1$ and $Y = y_2 - y_1$.

    ```cpp showLineNumbers
    bool withinRange(int x1, int y1, int x2, int y2, long long r)
    {
        long long d = pow(x2 - x1, 2) + pow(y2 - y1, 2);
        return d <= r * r;
    }

    // yc < y1
    int getCountLower(int x, int y1, int y2, int xc, int yc, int ra)
    {
        if (!withinRange(x, y1, xc, yc, ra))
            return 0;

        int l = y1, r = y2;
        int ans = -1;
        while (l <= r)
        {
            int m = (l + r) / 2;
            if (withinRange(x, m, xc, yc, ra))
            {
                ans = m;
                l = m + 1;
            }
            else
                r = m - 1;
        }
        return ans - y1 + 1;
    }

    // yc > y2
    int getCountHiger(int x, int y1, int y2, int xc, int yc, int ra)
    {
        if (!withinRange(x, y2, xc, yc, ra))
            return 0;

        int l = y1, r = y2;
        int ans = -1;
        while (l <= r)
        {
            int m = (l + r) / 2;
            if (withinRange(x, m, xc, yc, ra))
            {
                ans = m;
                r = m - 1;
            }
            else
                l = m + 1;
        }

        return y2 - ans + 1;
    }

    // y1 <= yc <= y2
    int getCountMiddle(int x, int y1, int y2, int xc, int yc, int ra)
    {
        if (!withinRange(x, yc, xc, yc, ra))
            return 0;

        // Lower bound
        int l = y1, r = yc;
        int ans1 = -1;
        while (l <= r)
        {
            int m = (l + r) / 2;
            if (withinRange(x, m, xc, yc, ra))
            {
                ans1 = m;
                r = m - 1;
            }
            else
                l = m + 1;
        }

        // Upper bound
        int ans2 = -1;
        l = yc, r = y2;
        while (l <= r)
        {
            int m = (l + r) / 2;
            if (withinRange(x, m, xc, yc, ra))
            {
                ans2 = m;
                l = m + 1;
            }
            else
                r = m - 1;
        }

        return ans2 - ans1 + 1;
    }

    int solve(int x1, int y1, int x2, int y2, int xc, int yc, int r)
    {
        long long ans = 0;
        for (int x = x1; x <= x2; x++)
        {
            if (yc < y1)
                ans += getCountLower(x, y1, y2, xc, yc, r);
            else if (yc > y2)
                ans += getCountHiger(x, y1, y2, xc, yc, r);
            else
                ans += getCountMiddle(x, y1, y2, xc, yc, r);
        }

        return ans;
    }
    ```

    </details>

    <details>
    <summary>Testing Script</summary>

    If you want to test your own solution, you can use this script to generate random testcases and compare the output of your solution and the brute force solution.

    ```cpp
    int solveBrute(int x1, int y1, int x2, int y2, int xc, int yc, int r)
    {
        int ans = 0;
        for (int x = x1; x <= x2; x++)
            for (int y = y1; y <= y2; y++)
                if (withinRange(x, y, xc, yc, r))
                    ans++;
        return ans;
    }

    int main()
    {
        mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());

        int testCount = 2000;
        int x1 = 50, y1 = 50, x2 = 150, y2 = 150;

        for (int t = 0; t < testCount; t++)
        {
            int xc = uniform_int_distribution<int>(50, 250)(rng);
            int yc = uniform_int_distribution<int>(-50, 250)(rng);
            int r = uniform_int_distribution<int>(0, 200)(rng);

            int a1 = solve(x1, y1, x2, y2, xc, yc, r);
            int a2 = solveBrute(x1, y1, x2, y2, xc, yc, r);
            if (a1 != a2)
            {
                cout << "Mismatched " << t + 1 << endl;
                cout << x1 << " " << y1 << " " << x2 << " " << y2 << " " << xc << " " << yc << " " << r << endl;
                cout << a1 << " " << a2 << endl;
                return 0;
            }
        }

        cout << "Passed" << endl;

        return 0;
    }
    ```

    </details>

4.  You are given an undirected and connected graph with $n$ nodes. Intially you are at node $1$, and need to travel to node $n$. There are power boosters at $k$ nodes, and every time you arrive at a power booster node, your power is set to $p$, which allows you to walk cross $p$ edges. What is the minimum value of $p$ such that you can reach node $n$ from node $1$?

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq k \leq 10^5$

    <details>
    <summary>Non Optimal Solution</summary>

    As with such minimization questions, we will use binary search to find the minimum value of $p$. Once we have a value of $p$, we can use a simple Djikstra to find if a valid path exists. The only change we need to make is if we arrive at a power booster node, we need to set the power to $p$ instead of further decrementing it.

    You might expect the time complexity of the solution to be $O(m \log n \cdot \log m)$ where $m$ is the maximum number of edges in the graph due to Djikstra, but the same turns out to be in the order of $O(n^2)$ instead. This is because having power booster breaks the monotonicity of the distance function that Djikstra expects (Suppose you reach an intermediary power node that is still at a large distance from destination before the other power node that is at a smaller distance. Now you will recharge at that node (farther from destination) and do Djikstra from it which would be of no use as it is suboptimal and may not be able to reach the final destination from there)

    ```cpp
    int main()
    {
        int n, m;
        cin >> n >> m;

        vector<vector<int>> g(n);
        for (int i = 0; i < m; i++)
        {
            int u, v;
            cin >> u >> v;
            u--, v--;
            g[u].push_back(v);
            g[v].push_back(u);
        }

        int k;
        cin >> k;
        vector<int> power(n, 0);
        for (int i = 0; i < k; i++)
        {
            int x;
            cin >> x;
            x--;
            power[x] = 1;
        }

        auto check = [&](int p) -> bool
        {
            vector<int> dis(n, -1);

            priority_queue<pair<int, int>> pq;
            pq.push({p, 0});
            dis[0] = p;

            while (!pq.empty())
            {
                auto [ops, node] = pq.top();
                pq.pop();

                if (dis[node] != ops)
                    continue;
                if (node == n - 1)
                    return 1;

                if (power[node])
                    ops = p;
                if (ops == 0)
                    continue;

                for (int v : g[node])
                {
                    if (dis[v] < ops - 1)
                    {
                        dis[v] = ops - 1;
                        pq.push({ops - 1, v});
                    }
                }
            }

            return 0;
        };

        int l = 1, r = m;
        int ans = -1;
        while (l <= r)
        {
            int mid = (l + r) / 2;
            if (check(mid))
            {
                ans = mid;
                r = mid - 1;
            }
            else
                l = mid + 1;
        }

        cout << ans << endl;
    }

    ```

    </details>

    <details>
    <summary>Optimal Solution</summary>

    We will binary seach on the value of $p$. To check for a particular value of $p$, we will construct an new graph with the nodes $1$, $n$, and all the nodes which are at a distance of $\leq ceil(p / 2)$ from any power node. We will then just run a BFS to check if a path exists from $1$ to $n$ in this new graph. The time complexity of the solution is $O((n + m)\log m)$.

    ```cpp showLineNumbers
    int main()
    {
        int n, m;
        cin >> n >> m;

        vector<vector<int>> g(n);
        vector<pair<int, int>> edges;
        for (int i = 0; i < m; i++)
        {
            int u, v;
            cin >> u >> v;
            u--, v--;
            g[u].push_back(v);
            g[v].push_back(u);
            edges.push_back({u, v});
        }

        int k;
        cin >> k;
        vector<int> power;
        for (int i = 0; i < k; i++)
        {
            int x;
            cin >> x;
            power.push_back(x - 1);
        }
        // Can consider n - 1 as power node as well
        power.push_back(n - 1);

        auto check = [&](int p) -> bool
        {
            vector<int> dis(n, -1);
            queue<int> q;
            for (int x : power)
            {
                dis[x] = 0;
                q.push(x);
            }

            // Calculate distance from power nodes
            int curDis = 0;
            while (!q.empty())
            {
                int sz = q.size();
                curDis++;
                if (curDis > (p + 1) / 2)
                    break;

                while (sz--)
                {
                    int u = q.front();
                    q.pop();

                    for (int v : g[u])
                    {
                        if (dis[v] != -1)
                            continue;
                        dis[v] = curDis;
                        q.push(v);
                    }
                }
            }

            // Build the new graph
            vector<vector<int>> gn(n);
            for (auto [u, v] : edges)
                if (dis[u] != -1 && dis[v] != -1)
                {
                    gn[u].push_back(v);
                    gn[v].push_back(u);
                }

            // Perform BFS to check if the node is reachable
            vector<int> vis(n, 0);
            queue<int> q2;
            q2.push(0);
            vis[0] = 1;

            while (!q2.empty())
            {
                int u = q2.front();
                q2.pop();
                if (u == n - 1)
                    return 1;

                for (int v : gn[u])
                {
                    if (vis[v])
                        continue;
                    vis[v] = 1;
                    q2.push(v);
                }
            }

            return 0;
        };

        int l = 1, r = m;
        int ans = -1;
        while (l <= r)
        {
            int mid = (l + r) / 2;
            if (check(mid))
            {
                ans = mid;
                r = mid - 1;
            }
            else
                l = mid + 1;
        }

        cout << ans << endl;
    }

    ```

    </details>

5.  [Count Number of Good Subsets](https://leetcode.com/problems/the-number-of-good-subsets/description/)

    <details>
    <summary>Solution</summary>

    Since it is clear that only each number can be used at most once in a valid subset, we can maintain a map of the frequency of the elements present. We will use a bitmask to show which all prime numbers have been already been used in our product, and keep the other state as the number we are trying to add to the answer. The main trick behind the question is to first ignore all the occurences of $1$, and then add them later to the sets achieved by the other numbers. The time complexity of the solution is $O(2^{10} \cdot 10^2 + log(A))$ where $A$ is the count of maximum occurences of $1$, which can be $n$ in the worst case.

    ```cpp showLineNumbers
    class Solution
    {
        vector<int> primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29};
        long long mod = 1e9 + 7;
        vector<vector<long long>> dp;

        long long binPow(long long a, long long b, long long m)
        {
            long long ans = 1;
            while (b)
            {
                if (b & 1)
                    ans = (ans * a) % m;
                a = (a * a) % m;
                b >>= 1;
            }

            return ans;
        }

        pair<bool, int> getNewMask(int mask, int n)
        {
            for (int i = 0; i < 10; i++)
                if (n % primes[i] == 0)
                {
                    if (n % (primes[i] * primes[i]) == 0)
                        return {0, 0};
                    if ((mask >> i) & 1)
                        return {0, 0};
                    mask |= (1 << i);
                }

            return {1, mask};
        }

        long long solve(int n, int mask, map<int, long long> &cnt)
        {
            if (n == 31)
                return mask != 0;
            if (dp[n][mask] != -1)
                return dp[n][mask];

            long long ans = solve(n + 1, mask, cnt);
            auto x = getNewMask(mask, n);
            if (x.first)
                ans += (solve(n + 1, x.second, cnt) * cnt[n]) % mod;

            return dp[n][mask] = ans % mod;
        }

    public:
        int numberOfGoodSubsets(vector<int> &nums)
        {
            dp.assign(31, vector<long long>(1 << 10, -1));

            map<int, long long> freq;
            for (int x : nums)
                freq[x]++;

            long long ans = solve(2, 0, freq);
            ans *= binPow(2, freq[1], mod);
            ans %= mod;

            return ans;
        }
    };
    ```

    </details>

## Online Assessment Questions

- There were 10 MCQs on C++, OS, and DBMS, and 2 coding questions.
- The MCQs were partly repeated from those of other campuses and some were new. There was a particular focus on error handling in C++ and the basics of DBMS.
- The coding questions did not run all the test cases. Only 2-3 sample test cases were visible, and the code would be evaluated later was the general feedback.

1. Same question as Deutsche Bank: Question $13$ from the `Other Campus Questions` section.

2. You are given upto $q$ queries of the type $[l, r, k]$, where in you have to find the $k^{th}$ beautiful number between $l$ and $r$. A number is said to be beautiful if it contains the substring $101$ in it's binary representation.
   - $1 \leq q \leq 200$
   - $1 \leq l \leq r \leq 10^{18}$
   - $1 \leq k \leq 10^{18}$

---

# Netradyne

The test usually involves 2 coding questions and 1 question involving writing a SQL query. The rest are MCQs from topics like:

- Sitting arrangements
- Percentages & Ratio-Proportion
- Graphs & Data Interpretation
- SQL
- Operating System & Deadlock Synchronisation
- DBMS Normalisation

## Other Campus Questions

1. The map contains islands named from $1$ to $n$. For any two islands $i$ and $j$, you can go to $j$ from $i$ only if $i$ divides $j$. Find the number of ways to reach island $n$ starting from island $1$. You can't move from island $i$ to $i$. There are $t$ test cases, each denoted by a single integer $n$, the island that you have to reach.

   Constraints:

   - $1 \leq t \leq 10^5$
   - $1 \leq n \leq 10^6$

    <details>
    <summary>Solution</summary>

   We can use a simple sieve like approach to compute all the divisors of all the numbers upto $10^6$ and then use a simple DP to precompute the number of ways for all the possible $n$. Then answering any query takes just $O(1)$ time. The time complexity of the solution is $O(A \log A + T)$ where $A = max(N)$.

   ```cpp showLineNumbers
   int main()
   {
       const int MAXN = 1e6 + 10;

       long long MOD = 1e9 + 7;
       vector<long long> dp(MAXN, 0);
       dp[1] = 1;
       for (int i = 1; i < MAXN; i++)
       {
           for (int j = 2 * i; j < MAXN; j += i)
           {
               dp[j] += dp[i];
               dp[j] %= MOD;
           }
       }

       int t;
       cin >> t;
       while (t--)
       {
           int n;
           cin >> n;
           cout << dp[n] <<details endl;
       }
   }
   ```

    </details>

2. You are given an array of $n$ elements. In each step, you need to take the sum of the numbers at the odd indexes of the array ($1$ indexed), and remove all the even elements. Do this until only $1$ element is left in the array. What is the final sum obtained?

   Constraints:

   - $1 \leq n \leq 10^5$
   - $-10^9 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

   Writing the pattern for a couple of arrays by hand, we realize only the elements at index $i$ such that $i % 2^k = 1$ are added to the answer for every possible value of $k$ greater than $0$. Thus we can writing a simple simulation in $O(n \log n) time.

   ```cpp
   int main()
   {
       int n;
       cin >> n;

       vector<int> arr(n + 1);
       for (int i = 1; i <= n; i++)
           cin >> arr[i];

       long long ans = 0;
       for (int pow2 = 2; pow2 <= 2 * n; pow2 *= 2)
           for (int i = 1; i <= n; i++)
               if (i % pow2 == 1)
                   ans += arr[i];

       cout << ans << endl;
   }
   ```

    </details>

3. You are given an array of length $n$. You need to all the subsequences of the same of length $m$, and then calculate the score of the subsequence as the product of the first and last element of the subsequence. Return the minimum possible score of any subsequence.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $-10^9 \leq arr[i] \leq 10^9$

## Online Assessment Questions

1. You are given an integer as a string $s$. In each iteration, you need to take the sum of the digits of the number with have their index divisible by $k$. Treat the obtained number as the original string and repeat this untill you obtain a simple digit sum. Return the same.

2. You are looking to hire $n$ frontend and $m$ backend developers. There are $n + m$ candidates, each of which can be hired either as a frontend or backend developer. The cost of hiring the $i^{th}$ candidate as a frontend developer is $f[i]$ and the cost of hiring the $i^{th}$ candidate as a backend developer is $b[i]$. Find the minimum cost of hiring $n$ frontend and $m$ backend developers.

   Constraints:

   - $1 \leq n, m \leq 10^4$
   - $1 \leq f[i], b[i] \leq 10^9$

3. There was $1$ MCQ on aptitude, $1$ simple SQL query writing question, and $14$ MCQs from OS, C++ and data structures. A couple of the MCQ questions were repeated from the questions from other campuses.

---

# Microsoft

## Other Campus Questions

1. [Reorient Edges to Make All Paths Lead to Zero](https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/description/)

2. You are given $m$ square tiles of size $1 \times 1$ and $n$ square tiles of size $2 \times 2$. Your task is to create the largest square possible using the given tiles. The tiles can not overlap, and the resulting square can not have empty spaces in between. Return the side length of the square.

   Constraints:

   - $1 \leq m, n \leq 10^9$

    <details>
    <summary>Solution</summary>

   The key trick to realize is that if try to binary search over the length of the longest side of the square $s$, then the function would be moontonic sepearately for the cases of even and odd side lengths. This is due to the difference in the optimal greedy strategy to construct the squares:

   1. For odd side lengths, you atleast need $2s - 1$ tiles of size $1 \times 1$ that can be used to fill two adjacent edges, and then you can fill the even square of side $s - 1$ with the remaining tiles.
   2. For the even sides, use as many as possible tiles of size $2 \times 2$ to fill the square, and then fill the remaining gaps with the tiles of size $1 \times 1$.

   Then we can simply perform two binary searches to find the maximum possible side length of the square. The time complexity of the solution is $O(\log A)$ where $A$ is the maximum possible side length of the square.

   ```cpp showLineNumbers
   int main()
   {
       using ll = long long;

       ll n, m;
       cin >> n >> m;

       auto checkEvenSide = [&](ll s, ll n, ll m) -> bool
       {
           ll use2Sq = min(m, (s * s) / 4LL);
           ll needOneSq = s * s - 4LL * use2Sq;
           return needOneSq <= n;
       };

       auto checkOddSide = [&](ll s, ll n, ll m) -> bool
       {
           ll minOneSq = 2LL * s - 1;
           if (n < minOneSq)
               return 0;

           return checkEvenSide(s - 1, n - minOneSq, m);
       };

       ll ansOdd = 0, l = 1, r = 1e9;
       while (l <= r)
       {
           ll mid = (l + r) / 2;
           if (checkOddSide(2LL * mid + 1, n, m))
           {
               ansOdd = 2LL * mid + 1;
               l = mid + 1;
           }
           else
               r = mid - 1;
       }

       ll ansEven = 0;
       l = 0, r = 1e9;
       while (l <= r)
       {
           ll mid = (l + r) / 2;
           if (checkEvenSide(2LL * mid, n, m))
           {
               ansEven = 2LL * mid;
               l = mid + 1;
           }
           else
               r = mid - 1;
       }

       cout << max(ansOdd, ansEven) << endl;
   }
   ```

    </details>

3. There is string of length $n$ consiting only of characters $a$. Whenever there are two identical adjacent letters, they can be merged together to form the next alphabet (for example, $aa$ can be converted to $b$). The letter pair $zz$ can be merged. What is the lexographically maximum string you can obtain by applying the operations optimally?

   Constraints:

   - $1 \leq n \leq 10^9$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       int n;
       cin >> n;

       string s = "";
       while (n)
       {
           int maxP = log2(n);
           char ch = 'a' + min(maxP, 25);
           n -= (1 << min(maxP, 25));
           s += ch;
       }
       cout << s << "\n";
   }
   ```

    </details>

4. Strings with long blocks of repeating characters take much less space if kept in a compressed representation. To obtain the compressed representation, we replace each segment of equal characters in the string with the number of characters in the segment followed by the character (for example, we replace segment `CCCC` with `4C`). To avoid increasing the size, we leave the one-letter segments unchanged (the compressed representation of `BC` is the same string `BC`).

   For example, the compressed representation of the string `ABBBCCDDCCC` is `A382C2D3C`, and the compressed representation of the string `AAAAAAAAAAABXXAAAAAAAAAA` is `11AB2X10A`. In order increase the compression further, we decided to modify our compression algorithm. Now, before compression, we remove exactly $K$ consecutive letters from the input string. We would like to know the shortest compressed form that we can generate this way.

   Constraints:

   - $1 \leq |s| \leq 10^5$
   - $1 \leq K \leq n$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int getLen(int n)
   {
       int cnt = 0;
       while (n)
       {
           cnt++;
           n /= 10;
       }
       return cnt;
   }

   int getCont(int n)
   {
       if (n == 1)
           return 1;
       return 1 + getLen(n);
   }

   int main()
   {
       string s;
       cin >> s;
       s = "$" + s + "#";
       int n = s.size();

       int k;
       cin >> k;

       vector<int> compId(n), suff(n), segs;
       for (int i = 0, id = 0; i < n; i++)
       {
           int st = i;
           while (i + 1 < n && s[i + 1] == s[i])
               i++;
           int len = i - st + 1;
           segs.push_back(len);

           for (int j = st; j <= i; j++)
           {
               suff[j] = len;
               len--;
               compId[j] = id;
           }
           id++;
       }

       int m = segs.size();
       vector<int> segSuff(m + 1);
       for (int i = m - 1; i >= 0; i--)
           segSuff[i] = segSuff[i + 1] + getCont(segs[i]);

       int ans = n;

       int prevLen = 0, fre = 1;
       char curChar = s[0];

       for (int i = 0; i < n; i++)
       {
           int endIdx = i + k + 1;
           if (endIdx >= n)
               break;

           int segId = compId[endIdx];
           int addLen = segSuff[segId + 1];
           int curAns;

           if (curChar == s[endIdx])
               curAns = prevLen + addLen + getCont(fre + suff[endIdx]);
           else
               curAns = prevLen + addLen + getCont(fre) + getCont(suff[endIdx]);
           ans = min(ans, curAns);

           if (s[i + 1] == s[i])
               fre++;
           else
           {
               prevLen += getCont(fre);
               fre = 1;
               curChar = s[i + 1];
           }
       }

       cout << ans - 2 << "\n";
   }
   ```

    </details>

5. In this task, you are given two strings of digits that represent (possibly very large) Integers. Your goal is to make those numbers as close to one another as possible. In other words, you want to minimize the absolute value of their difference. You can swap some of the corresponding digits (e.g. the first digit of the first the first digit of the second number, the second digit of the first number with the second digit of the second number, etc.). Swapping the digita is an extremely tiring task, so you want to make as few swaps as possible. Write a function that, given two strings $S$ and $T$, both of length $N$, returns the minimum number of swaps needed to minimize the difference between the two numbers represented by the input strings.

   Constraints:

   - $1 \leq N \leq 10^5$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       string s, t;
       cin >> s >> t;

       if (s == t)
       {
           cout << 0;
           return 0;
       }

       int n = s.size();

       int fnd = 0;
       int gr1 = 0, gr2 = 0;
       for (int i = 0; i < n; i++)
       {
           if (s[i] == t[i])
               continue;

           if (!fnd)
           {
               if (s[i] > t[i])
                   fnd = 1;
               else
                   fnd = 2;
               continue;
           }

           if (s[i] > t[i])
               gr1++;
           else
               gr2++;
       }

       cout << min(gr1 + (fnd != 1), gr2 + (fnd == 1)) << "\n";
   }
   ```

   </details>

6. There is an array $A$ of $N$ integers. What is the largest sum of two numbers which do not have any common digits? If it is impossible to choose two such numbers, the function should return $-1$.

   Constraints:

   - $1 \leq N \leq 2 \cdot 10^5$
   - $1 \leq A[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       int n;
       cin >> n;

       vector<int> arr(n);
       for (int i = 0; i < n; i++)
           cin >> arr[i];

       vector<long long> mx(1 << 10, -1e18);
       for (int i = 0; i < n; i++)
       {
           int m = 0;
           if (arr[i] == 0)
               m = 1;

           int v = arr[i];
           while (v)
           {
               int d = v % 10;
               m |= (1 << d);
               v /= 10;
           }

           mx[m] = max(mx[m], (long long)arr[i]);
       }

       long long ans = -1e18;
       for (int m1 = 0; m1 < (1 << 10); m1++)
       {
           if (mx[m1] == -1e18)
               continue;

           for (int m2 = m1 + 1; m2 < (1 << 10); m2++)
           {
               if (mx[m2] == -1e18)
                   continue;
               if ((m1 & m2) == 0)
                   ans = max(ans, (long long)mx[m1] + mx[m2]);
           }
       }

       cout << max(ans, -1LL) << "\n";
   }
   ```

    </details>

7. [Minimum Cost to Equalize Array](https://leetcode.com/problems/minimum-cost-to-equalize-array/description/)

## Online Assessment Questions

1. You are given $n$ strings of length $k$ each. You need to form a string of length $k$ such that all the strings differ from the same by atmost $1$ character. If it is not possible to form such a string, return an empty string.

   Constraints:

   - $1 \leq n \leq 10^6$
   - $1 \leq k \leq 10^6$
   - $1 \leq n \cdot k \leq 10^6$
   - The strings consist of lowercase English alphabets only.

2. You are given a grid of size $2 \times n$. You need to start from $(0,0)$ and need to reach the cell $(1, n - 1)$. You can only move rightwards and downwards. The cost of this path is the maximum value of the grid that comes in the path. Find the minimum cost of the path.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq grid[i][j] \leq 10^9$

---

# Google

## Other Campus Questions

1. You are given an array $arr$ of length $n$ and two number $m$ and $l$. You can perform at max $m$ operations on the array, where in one operation you can select any subarray of $arr$ of length at most $l$, and decrement the value of all elements of the subarray by $1$. Determine the minimum value of the maximum element present in the array if the operations are performed optimally.

- $1 \leq n \leq 10^5$
- $1 \leq m \leq 10^5$
- $1 \leq l \leq n$

    <details>
    <summary>Solution</summary>

  It is clear that we can binary search on the answer. Once we have fixed the maximum element of the array, we can simply iterate over the array from left to right, and whenever we see an element that is greater that the currently fixed maximum, we would apply operations to it to bring it to the maximum. We would always greedily apply the operation to the largest possible subarray, that is of length $l$ as it would never worsen our answer. The application of range updates would require the difference array concept. The time complexity of the solution is $O(n \log A)$ where $A$ is the maximum possible value of the maximum element in the array.

  ```cpp showLineNumbers
  int main()
  {
      int n, m, l;
      cin >> n >> m >> l;

      vector<int> arr(n);
      for (int i = 0; i < n; i++)
          cin >> arr[i];

      auto check = [&](int maxEle) -> bool
      {
          int opsLeft = m;
          vector<int> diffArr(n + 1), curArr = arr;

          for (int i = 0; i < n; i++)
          {
              if (i > 0)
                  diffArr[i] += diffArr[i - 1];
              curArr[i] += diffArr[i];

              if (curArr[i] <= maxEle)
                  continue;
              int ops = curArr[i] - maxEle;
              if (ops > opsLeft)
                  return 0;
              opsLeft -= ops;

              diffArr[i] -= ops;
              diffArr[i + l] += ops;
          }

          return 1;
      };

      int hi = 1e9, lo = -1e9;
      int ans;
      while (lo <= hi)
      {
          int mid = (lo + hi) / 2;
          if (check(mid))
          {
              ans = mid;
              hi = mid - 1;
          }
          else
              lo = mid + 1;
      }
      cout << ans << endl;
  }
  ```

    </details>

2. You are given a graph (not necessarily connected) of $n$ nodes numbered from $1$ to $n$ and $n - 1$ edges. Each edge has a cost associated with it. You can break any edge, disconnecting the pair of nodes in one operation, but you must add the same edge between a different pair od nodes. The cost of one such operation is the cost of the edge. Find the minimum cost to make the graph a tree.

   - $1 \leq n \leq 10^5$
   - $1 \leq cost[i] \leq 10^9$
   - The graph may contain self loops and multiple edges between the same pair of nodes.

    <details>
    <summary>Solution</summary>

   Since the final connected graph must be a tree, we can make minor modifications to the algorithm for the Maximum Spanning Tree. We will iterate over the edges in the decreasing order of their cost, and only change the edges are present between some already connected components. We won't add these edges to any component just yet, as it would be optimal to hold of them till the end, and then connect the disconnected components with them. We can use the DSU data structure to keep track of the connected components. The time complexity of the solution is $O(n \log n)$.

   ```cpp showLineNumbers
   class DSU
   {
       int n;
       vector<int> parent, size;

   public:
       DSU(int n)
       {
           this->n = n;
           parent.resize(n);
           size.resize(n, 1);
           for (int i = 0; i < n; i++)
               parent[i] = i;
       }

       int find(int u)
       {
           if (parent[u] == u)
               return u;
           return parent[u] = find(parent[u]);
       }

       void merge(int u, int v)
       {
           int pu = find(u), pv = find(v);
           if (pu == pv)
               return;
           if (size[pu] < size[pv])
               swap(pu, pv);
           parent[pv] = pu;
           size[pu] += size[pv];
       }
   };

   int solve(int n, vector<vector<int>> &edges)
   {
       sort(edges.begin(), edges.end(), [](vector<int> &a, vector<int> &b)
           { return a[2] > b[2]; });

       DSU dsu(n + 1);
       int ans = 0;
       for (auto &e : edges)
       {
           int u = e[0], v = e[1], w = e[2];
           if (dsu.find(u) != dsu.find(v))
               dsu.merge(u, v);
           else
               ans += w;
       }

       return ans;
   }
   ```

    </details>

## Online Assessment Questions

1. You are given an array $arr$ of length $n$. You need to count the number of quadruples $(i, j, k, l)$ such that $i \leq j \leq k \leq l$ and $arr[i] \cdot arr[k] = arr[j] \cdot arr[l]$.

   Constraints:

   - $1 \leq n \leq 1000$
   - $1 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       int t;
       cin >> t;

       auto get = [](int a, int b) -> pair<int, int>
       {
           int g = __gcd(a, b);
           return {a / g, b / g};
       };

       while (t--)
       {
           int n;
           cin >> n;

           vector<int> arr(n);
           for (int i = 0; i < n; i++)
               cin >> arr[i];

           // p / q = s / r
           map<pair<int, int>, int> cnt;
           cnt[get(arr[0], arr[1])]++;
           int ans = 0;

           for (int i = 2; i < n; i++)
           {
               for (int j = i + 1; j < n; j++)
                   ans += cnt[get(arr[j], arr[i])];

               for (int j = 0; j < i; j++)
                   cnt[get(arr[j], arr[i])]++;
           }

           cout << ans << "\n";
       }
   }
   ```

    </details>

2. You are given an array of size $n$ and an integer $k$. You want to divide the array $arr$ into $k$ non-empty contiguous subarrays such that each subarray is a good subarray. A good subarray has the absolute difference between any two elements in that array to be greater than or equal to $X$. A singleton array is by default a good subarray.

   What is the maximum possible value of $X$ such that the division is possible?

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq k \leq n$
   - $-10^6 \leq arr[i] \leq 10^6$

    <details>
    <summary>Solution</summary>

   ```cpp
   int getCnt(vector<int> &arr, int n, int ma)
   {
       int cnt = 0;
       for (int i = 0; i < n; i++)
       {
           set<int> s;
           s.insert(arr[i]);

           while (i + 1 < n)
           {
               auto itr = s.lower_bound(arr[i + 1]);
               if (itr != s.end() && *itr - arr[i + 1] < ma)
                   break;
               if (itr != s.begin())
               {
                   itr--;
                   if (arr[i + 1] - *itr < ma)
                       break;
               }
               i++;
               s.insert(arr[i]);
           }

           cnt++;
       }

       return cnt;
   }

   void solve()
   {
       int n;
       cin >> n;

       vector<int> arr(n);
       for (int i = 0; i < n; i++)
           cin >> arr[i];

       int k;
       cin >> k;

       int l = 0, r = *max_element(arr.begin(), arr.end()) - *min_element(arr.begin(), arr.end());
       int ans = 0;
       while (l <= r)
       {
           int mid = (l + r) / 2;
           auto cnt = getCnt(arr, n, mid);
           if (cnt == k)
           {
               ans = mid;
               l = mid + 1;
           }
           else if (cnt < k)
               l = mid + 1;
           else
               r = mid - 1;
       }

       cout << ans << endl;
   }

   int main()
   {
       int t;
       cin >> t;

       while (t--)
           solve();
   }
   ```

    </details>

3. [Lexographically Smallest Beautiful String](https://leetcode.com/problems/lexicographically-smallest-beautiful-string/description/)

   <details>
   <summary>Solution</summary>

   ```cpp showLineNumbers
   class Solution {
   public:
       string smallestBeautifulString(string s, int k) {
           int n = s.size();

           auto check = [&](int idx) -> bool {
               return (
                   idx == 0
                   || (idx == 1 && s[idx] != s[idx - 1])
                   || (idx >= 2 && s[idx] != s[idx - 1] && s[idx] != s[idx - 2])
               );
           };

           int idx = s.size() - 1;
           while (idx >= 0) {
               s[idx]++;
               if (s[idx] - 'a' == k)
                   idx--;
               else if (check(idx))
                   break;
           }

           if (idx < 0)
               return "";

           string rep = "abc";
           for (int j = idx + 1; j < n; j++) {
               for (int c: rep) {
                   s[j] = c;
                   if (check(j))
                       break;
               }
           }

           return s;
       }
   };
   ```

   </details>

---

# Plutus Research

## Other Campus Questions

1. Given two integers $l$ and $r$ ($l \leq r$) and $k$, find the minimum value $x$ between $l$ and $r$ such that sum of digits of all numbers between $l$ and $x$ is at least $k$. Its given that at least one such $x$ exists.

   - $l \leq 10^{15}$
   - $r \leq 10^{15}$

    <details>
    <summary>Solution</summary>

   We will try to binary search on the answer. If the current answer is $x$, we need to check if the count of digits in the range $[l, x]$ is atleast $k$ or not. The same can be calculated by finding a function to give the sum of the digits of the numbers in the range $[0, x]$, which will use digit DP to calculate the same. The time complexity of the solution is $\log(10^{15} \cdot 15 \cdot 2)$.

   ```cpp showLineNumbers wrap
   // Returns <count, sum>
   pair<long long, long long> solve(int idx, bool eq, string &num, pair<long long, long long> dp[][2])
   {
       if (idx == num.size())
           return {1, 0};
       if (dp[idx][eq].first != -1)
           return dp[idx][eq];

       long long sum = 0, ways = 0;
       int mx = eq ? num[idx] - '0' : 9;
       for (long long i = 0; i <= mx; i++)
       {
           bool newEq = eq && i == mx;
           auto p = solve(idx + 1, newEq, num, dp);
           ways += p.first;
           sum += p.second + p.first * i;
       }

       return dp[idx][eq] = {ways, sum};
   }

   long long getSum(long long x)
   {
       if (x <= 0)
           return 0;

       string num = to_string(x);
       pair<long long, long long> dp[num.size() + 1][2];
       memset(dp, -1, sizeof(dp));

       auto p = solve(0, 1, num, dp);
       return p.second;
   }

   int main()
   {
       long long l, r, k;
       cin >> l >> r >> k;

       long long cnt1 = getSum(l - 1);
       long long low = l, high = r, ans = -1;
       while (low <= high)
       {
           long long mid = (low + high) / 2;
           long long cnt2 = getSum(mid) - cnt1;
           if (cnt2 >= k)
           {
               ans = mid;
               high = mid - 1;
           }
           else
               low = mid + 1;
       }

       cout << ans << endl;
   }
   ```

    </details>

2. Given an array $a$ of size $n$, find the number of subarrays whose product of the minimum value and the maximum value is divisuble by the length of subarray.

   - $1 \leq n \leq 10^5$
   - $1 \leq a[i] \leq 30$

    <details>
    <summary>Solution</summary>

   Since the maximum value of the array is $30$, the maximum possible product of the minimum and maximum value of the subarray is $30 \times 30 = 900$. We can iterate over all the possible subarrays of length at most $900$ and count the number of subarrays that satisfy the condition. We will use deque to maintain the minimum and maximum in the current subarray. The time complexity of the solution is $O(min(n, 900)^2)$.

   ```cpp showLineNumbers
   int main()
   {
       int n;
       cin >> n;

       vector<int> arr(n);
       for (int i = 0; i < n; i++)
           cin >> arr[i];

       int cnt = 0;
       for (int len = 1; len <= min(n, 900); len++)
       {
           deque<int> minDq, maxDq;
           for (int i = 0; i < n; i++)
           {
               while (!minDq.empty() && minDq.front() <= i - len)
                   minDq.pop_front();
               while (!maxDq.empty() && maxDq.front() <= i - len)
                   maxDq.pop_front();

               while (!minDq.empty() && arr[minDq.back()] >= arr[i])
                   minDq.pop_back();
               while (!maxDq.empty() && arr[maxDq.back()] <= arr[i])
                   maxDq.pop_back();

               minDq.push_back(i);
               maxDq.push_back(i);

               if (i >= len - 1)
               {
                   int prod = arr[maxDq.front()] * arr[minDq.front()];
                   if (prod % len == 0)
                       cnt++;
               }
           }
       }

       cout << cnt << endl;
   }
   ```

    </details>

3. Given a tree of $n$ nodes rooted at $1$ and an array of integers $a$, you need to process $q$ queries of the form `v x`. For each query you need to tell the maximum length of the matching prefix (from the MSB to LSB) of $v$ and any of the $a$ values of the nodes that lie on the path from the root to the node $x$ (all ancestors of $x$ and $x$). Each number is represented in $30$ bits.

   - $1 \leq n \leq 10^5$
   - $1 \leq q \leq 10^5$
   - $1 \leq a[i] \leq 10^9$
   - $1 \leq v \leq 10^9$

    <details>
    <summary>Solution</summary>

   We can use a bit trie to store the binary representation of the numbers. We can then use the trie to answer the queries in $O(30)$ time while performing a DFS on the tree. The time complexity of the solution is $O(n + 30 * q)$.

   ```cpp showLineNumbers
   class Node
   {
   public:
       vector<int> ch;
       int cnt;

       Node() : ch(vector<int>(2, -1)), cnt(0) {}
   };

   class Trie
   {
       vector<Node> nodes;

   public:
       Trie()
       {
           nodes.push_back(Node());
       }

       void add(int x)
       {
           int cur = 0;
           for (int bit = 29; bit >= 0; bit--)
           {
               int u = (x >> bit) & 1;
               if (nodes[cur].ch[u] == -1)
               {
                   nodes[cur].ch[u] = nodes.size();
                   nodes.push_back(Node());
               }
               cur = nodes[cur].ch[u];
               nodes[cur].cnt++;
           }
       }

       void remove(int x)
       {
           int cur = 0;
           for (int bit = 29; bit >= 0; bit--)
           {
               int u = (x >> bit) & 1;
               cur = nodes[cur].ch[u];
               nodes[cur].cnt--;
           }
       }

       int get(int x)
       {
           int cur = 0;
           int len = 0;
           for (int bit = 29; bit >= 0; bit--)
           {
               int u = (x >> bit) & 1;
               if (nodes[cur].ch[u] == -1)
                   return len;
               cur = nodes[cur].ch[u];
               if (nodes[cur].cnt == 0)
                   return len;
               len++;
           }
           return len;
       }
   };

   int main()
   {
       int n;
       cin >> n;

       vector<vector<int>> g(n);
       for (int i = 0; i < n - 1; i++)
       {
           int u, v;
           cin >> u >> v;
           u--, v--;
           g[u].push_back(v);
           g[v].push_back(u);
       }

       vector<int> arr(n);
       for (int i = 0; i < n; i++)
           cin >> arr[i];

       int q;
       cin >> q;

       vector<vector<pair<int, int>>> qByNode(n);
       for (int i = 0; i < q; i++)
       {
           int x, v;
           cin >> x >> v;
           qByNode[x - 1].push_back({v, i});
       }

       vector<int> ans(q);
       Trie t;

       function<void(int, int)> dfs = [&](int u, int p) -> void
       {
           t.add(arr[u]);
           for (auto [v, idx] : qByNode[u])
               ans[idx] = t.get(v);

           for (int v : g[u])
           {
               if (v == p)
                   continue;
               dfs(v, u);
           }

           t.remove(arr[u]);
       };
       dfs(0, -1);

       for (auto x : ans)
           cout << x << "\n";
   }

   ```

    </details>

4. Given $n$ balls of some colors, where the $i^{th} ball's color is a[i]$, you need to find the minimum number of arrangements of these balls module $10^9 + 7$ where you can perform an operation atmost once, in which you can choose all balls of one color and change their color to some other color.

   - $1 \leq n \leq 10^5$
   - $1 \leq a[i] \leq n$

    <details>
    <summary>Solution</summary>

   You need to use the simple formula for the number of arrangements of $n$ balls of $k$ colors, which is $\frac{n!}{a[1]! \cdot a[2]! \ldots a[k]!}$. It is clear to minimise the value of this expression, we must combine the two largest colour groups into one. The time complexity of the solution is $O(n \log n)$ due to sorting and some addtional time is needed for the factorial calculation.

   ```cpp showLineNumbers
   long long mod = 1e9 + 7;

   long long binPower(long long a, long long b)
   {
       long long res = 1;
       while (b)
       {
           if (b & 1)
               res = (res * a) % mod;
           a = (a * a) % mod;
           b >>= 1;
       }
       return res;
   }

   int main()
   {
       int n, k;
       cin >> n >> k;

       vector<long long> fac(n + 1);
       fac[0] = 1;
       for (int i = 1; i <= n; i++)
           fac[i] = (fac[i - 1] * i) % mod;

       vector<int> arr(k);
       for (int i = 0; i < k; i++)
           cin >> arr[i];
       sort(arr.begin(), arr.end(), greater<int>());

       if (k == 1)
       {
           cout << 1 << "\n";
           return 0;
       }

       arr[1] += arr[0];
       long long ans = fac[n];
       for (int i = 1; i < k; i++)
           ans = (ans * binPower(fac[arr[i]], mod - 2)) % mod;

       cout << ans << "\n";
   }

   ```

    </details>

5. Same question as Deutsche Bank: Question $1$ & $2$ from the `Online Assessment Question` section.

6. Same question as Deutsche Bank: Question $2$, $9$ & $17$ from the `Other Campus Questions` section.

7. Same question as HiLabs: Question $14$ from the `Other Campus Questions` section.

8. You are given a number $n$, which represents time. Starting from the origin, you can move in any of the fourth cardinal directions, but once you make a move, the next move that you make should be perpendicular to the previous move. What is the distinct number of coordinates reachable with this time?

   - $1 \leq n \leq 10^3$

    <details>
    <summary>Solution</summary>

   Due to the small constraint on the value of $n$, we can simply simulate the movement of the person and keep track of the coordinates that are reachable. The time complexity of the solution is $O(n^2)$ if we use a BFS to simulate all the possible moves.

   ```cpp showLineNumbers
   int main()
   {
       int n;
       cin >> n;

       // Y, X, DIR -> 0 for HOR, 1 for VER
       int vis[2 * n + 1][2 * n + 1][2];
       memset(vis, 0, sizeof(vis));

       queue<vector<int>> q;
       q.push({n, n, 0});
       q.push({n, n, 1});
       vis[n][n][0] = 1;
       vis[n][n][1] = 1;

       int dx[] = {0, 1, 0, -1};
       int dy[] = {1, 0, -1, 0};
       int ddir[] = {1, 0, 1, 0};

       int dis = 0;
       while (!q.empty())
       {
           int sz = q.size();
           dis++;
           if (dis > n)
               break;

           while (sz--)
           {
               auto t = q.front();
               q.pop();

               int y = t[0], x = t[1], dir = t[2];
               for (int k = 0; k < 4; k++)
               {
                   int yn = y + dy[k], xn = x + dx[k], ndir = ddir[k];
                   if (ndir == dir)
                       continue;
                   if (!vis[yn][xn][ndir])
                   {
                       vis[yn][xn][ndir] = 1;
                       q.push({yn, xn, ndir});
                   }
               }
           }
       }

       int cnt = 0;
       for (int i = 0; i <= 2 * n; i++)
           for (int j = 0; j <= 2 * n; j++)
               cnt += max(vis[i][j][0], vis[i][j][1]);
       cout << cnt << endl;
   }
   ```

   </details>

9. You are given a graph of $n$ cities and $m$ edges between these cities. If two cities are connected, then they belong to the same kingdom. You are also given an array $arr$ of length $n$ where $arr[i]$ denotes the number of people living in the group $i$. You need to assign each group to exactly $1$ unique city so that the sum of number of friendships across all the kingdoms is the maximum possible. A pair of people are said to be friends if they belong to the same kingdom. Output the maximum possible number of friendships.

- $1 \leq n \leq 10^5$
- $1 \leq m \leq 10^5$
- $1 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

  We can use a simple greedy approach and calculate the number of cities in each kingdom (connected component). Then we can use sort the groups in the reverse order, and try to assign the largest number of people to the largest possible kingdom. The time complexity of the solution is $O(n + m + n \log n)$.

  ```cpp showLineNumbers
  int main()
  {
      int n, m;
      cin >> n >> m;

      vector<vector<int>> g(n);
      for (int i = 0; i < m; i++)
      {
          int u, v;
          cin >> u >> v;
          u--, v--;
          g[u].push_back(v);
          g[v].push_back(u);
      }

      vector<int> arr(n);
      for (int i = 0; i < n; i++)
          cin >> arr[i];

      vector<int> vis(n, 0);

      int compSize = 0;
      function<void(int, int)> dfs = [&](int u, int p) -> void
      {
          vis[u] = 1;
          compSize++;

          for (int v : g[u])
          {
              if (v == p || vis[v])
                  continue;
              dfs(v, u);
          }
      };

      vector<int> comps;
      for (int i = 0; i < n; i++)
      {
          if (vis[i])
              continue;
          compSize = 0;
          dfs(i, -1);
          comps.push_back(compSize);
      }

      sort(comps.begin(), comps.end(), greater<int>());
      sort(arr.begin(), arr.end(), greater<int>());

      long long ans = 0;
      int j = 0;

      for (auto sz : comps)
      {
          long long cnt = 0;
          for (int i = 0; i < sz; i++)
          {
              cnt += arr[j];
              j++;
          }

          ans += cnt * (cnt - 1) / 2LL;
      }

      cout << ans << endl;
  }
  ```

    </details>

11. You are given a binary string of length $n$. You need to count the number of substrings it has such that it has atleast $x$ bits set.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq x \leq n$

    <details>
    <summary>Solution</summary>

    We can use a simple two pointer approach to count the number of substrings that have atleast $x$ bits set. The time complexity of the solution is $O(n)$.

    ```cpp showLineNumbers
    int main() {
        int n, x;
        cin >> n >> x;

        string s;
        cin >> s;

        int cnt = s[0] == '1';
        int j = 0;

        long long ans = 0;
        for (int i = 0; i < n; i++) {
            while (cnt < x && j + 1 < n) {
                j++;
                cnt += s[j] == '1';
            }

            if (cnt < x)
                break;
            ans += n - j;
            cnt -= s[i] == '1';
        }

        cout << ans << endl;
    }
    ```

    </details>

12. You are given two positive integers $X$ and $Y$ without leading zeroes. You can perform an operation on these integers any number of times, in which you can delete a digit of the given number such that resulting number does not have leading zeroes: Let $X'$ and $Y'$ be two numbers that were formed after performing operations on $X$ and $Y$ respectively. You have to find the number of all the unique pairs of $X'$ and $Y'$ whose XOR is zero.

    Two pairs of numbers $(A, B)$ and $(C, D)$ are considered different if and only if $A \neq C$ and $B \neq D$.

    Constraints:

    - $1 \leq X, Y \leq 10^{12}$
    - $X$ and $Y$ do not have leading zeroes.

    <details>
    <summary>Solution</summary>

    Two numbers $X$ and $Y$ have XOR equal to $0$ only and only if they are equal to each other. Thus the answer is nothing but the number of common subsequences of the two numbers when represented as string. We must be careful to exclude the strings with leading zeros. The complexity of the solution is $(2^{12} \cdot 12)$ as we will be using a bitmask to generate the subsequences.

    ```cpp showLineNumbers
    void addNumbers(string &s, set<long long> &pre) {
        for (int mask = 1; mask < (1 << s.size()); mask++) {
            string t;
            for (int i = 0; i < s.size(); i++) {
                if (mask & (1 << i))
                    t += s[i];
            }

            if (t[0] == '0')
                continue;

            long long v = stoll(t);
            pre.insert(v);
        }
    }

    int main() {
        long long a, b;
        cin >> a >> b;

        string x = to_string(a), y = to_string(b);

        set<long long> s1, s2;
        addNumbers(x, s1);
        addNumbers(y, s2);

        long long ans = 0;
        for (auto v : s1)
            if (s2.count(v))
                ans++;

        cout << ans << endl;
    }
    ```

    </details>

13. You are given a tree of $N$ nodes and $N - 1$ edges rooted at node $1$ with exactly one candy placed at each node. Let's say the cost of the candy placed on the $i^{th}$ node is $A[i]$ and you have $K$ amount of money. Now, you will choose exactly one node (say, $u$) and will start buying the candies placed on the path from node $u$ to the root until you run out of money, that is, first, you will buy the candy placed at node $u$ ,then the candy placed at the ancestor of $u$, then it's ancestor so on till you run out of money or you reach root node. Also, you cannot skip over a node without buying the candy placed on it. Calculate the the maximum number of candies you can buy in a given amount of money by choosing exactly one starting node.

    Constraints:

    - $1 \leq N \leq 10^5$
    - $1 \leq A[i] \leq 10^9$
    - $1 \leq K \leq 10^{18}$

    <details>
    <summary>Solution</summary>

    We will use binary lifting to solve this problem. For each node, we would calculate the ${2^j}^{th}$ ancestor of the node and the money that we would need to spend to reach the ancestor. Then we can simply iterate over all the nodes and calculate the maximum number of candies that we can buy. The time complexity of the solution is $O(N \log N)$.

    ```cpp showLineNumbers
    int main()
    {
        int n;
        cin >> n;

        long long amt;
        cin >> amt;

        vector<int> arr(n);
        for (int i = 0; i < n; i++)
            cin >> arr[i];

        vector<vector<int>> g(n);
        for (int i = 0; i < n - 1; i++)
        {
            int u, v;
            cin >> u >> v;
            g[u - 1].push_back(v - 1);
            g[v - 1].push_back(u - 1);
        }

        int l = ceil(log2(n));
        vector<vector<pair<int, long long>>> up(n, vector<pair<int, long long>>(l + 1));

        function<void(int, int)> dfs = [&](int u, int p) -> void
        {
            if (p == -1)
                up[u][0] = {-1, 1e18};
            else
                up[u][0] = {p, arr[p]};

            for (int i = 1; i <= l; i++)
            {
                int v = up[u][i - 1].first;
                long long c = up[u][i - 1].second;
                if (v == -1)
                    up[u][i] = {-1, 1e18};
                else
                    up[u][i] = {up[v][i - 1].first, c + up[v][i - 1].second};
            }

            for (int v : g[u])
            {
                if (v == p)
                    continue;
                dfs(v, u);
            }
        };
        dfs(0, -1);

        int ans = 0;
        for (int i = 0; i < n; i++)
        {
            if (arr[i] > amt)
                continue;

            int u = i, cnt = 1;
            long long left = amt - arr[i];

            for (int j = l; j >= 0; j--)
            {
                auto [v, c] = up[u][j];
                if (v != -1 && c <= left)
                {
                    left -= c;
                    u = v;
                    cnt += (1 << j);
                }
            }
            ans = max(ans, cnt);
        }

        cout << ans << endl;
    }
    ```

    </details>

14. You are given a circular array with $n$ elements. In one operation, you can swap any two adjacent elements. What is the minumum number of operations you need to perform to make the first two elements of the array same? Return $-1$ is the same is never possible.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq a[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    We will iterate over all the elements, and count the moves needed to make them the first two elements. We will then take the minimum of all the moves. The time complexity of the solution is $O(n)$.

    ```cpp showLineNumbers
    int main() {
        int n;
        cin >> n;

        map<int, vector<int>> idx;
        for (int i = 0; i < n; i++) {
            int x;
            cin >> x;
            idx[x].push_back(i);
        }

        int ans = 1e9;
        for (auto &[_, v]: idx) {
            int l = v.size();
            if (l == 1)
                continue;

            ans = min(ans, v[0] + abs(v[1] - 1));
            ans = min(ans, n - v.back() + abs(v[0] - 1));
        }

        if (ans == 1e9)
            ans = -1;
        cout << ans << endl;
    }
    ```

    </details>

15. You are given an undirected graph that contains $N + 1$ nodes and $M$ edges. These nodes are numbered from $0$ to $N$. Initially, you start at node $0$. Each node except node $0$ has a priority associated with it that is denoted by the array denoted as $P$. You have to follow these commands to visit each noche in the path:

    1. You have to start at node $0$ and move to the next unvisited node which directly connected to node $0$ and having the highest priority.
    2. If the priority is the same for multiple nodes, then you have to select the nodes that have the minimum distance between them.
    3. After going to the next node, you have to again select a connected node that has the highest priority among the remaining unvisited nodes
    4. If there are no adjacent unvisited nodes at a point, then you have to traverse back to the previous node from where you came to the present node for the first time
    5. You cannot traverse the path once you reach the last unvisted node.

    If the distance between the node $x$ to node $y$ is $d$, then the time elapsed to reach from one node to another is $d$ units. Determine the time required to reach at each node except node $0$ for the first time. The given graph is a connected graph.

    Constraints:

    - $1 \leq N \leq 10^5$
    - $1 \leq M \leq 10^5$
    - $1 \leq P[i] \leq 10^9$

16. You are given the two arrays $a$ and $b$ of length $n$ and $m$ respectively. Consider the following points on the coordinate plane:

    - $(a_1,0), (a_2,0) ..., (a_n, 0)$
    - $(b_1, 1), (b_2, 1) ..., (b_m, 1)$

    Find the area of the largest rectangle that can be constructed from the given points. If there is no rectangle possible then print $0$.

    Constraints:

    - $1 \leq n, m \leq 10^5$
    - $1 \leq a[i], b[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    It is obvious that it is only possible to form a rectangle if there are atleast $2$ points on the same line. We can iterate over all the points and store all the points that are common in $a$ and $b$, and then take the minimum and maximum of the points to calculate the area of the rectangle. The time complexity of the solution is $O(n \log n + m \log m)$.

    ```cpp showLineNumbers
    int main() {
        int n, m;
        cin >> n >> m;

        vector<int> a(n), b(m);
        for (int i = 0; i < n; i++)
            cin >> a[i];
        for (int i = 0; i < m; i++)
            cin >> b[i];

        sort(a.begin(), a.end());
        sort(b.begin(), b.end());

        vector<int> common;
        int i = 0, j = 0;
        while (i < n && j < m) {
            if (a[i] == b[j])
                common.push_back(a[i]);
            if (a[i] < b[j])
                i++;
            else
                j++;
        }

        if (common.size() < 2)
            cout << 0 << endl;
        else
            cout << common.back() - common[0] << endl;
    }
    ```

    </details>

17. You need to implement the Least Frequently Used (LFU) cache with the capacity $N$. You are also given $Q$ operations of the following type:

    1.  $(1, key, -1)$: Get the value of the $key$ from the cache. If the value does not exist in the cache return $-1$.
    2.  $(2, key, value)$: Update the value of the $key$ if present, or insert the $key$ if not already present.

    When the cache reaches it's capacity, it should invalidate and remove the least frequently used key before inserting a new item. For this problem, when there is a tie (two or more keys with the same frequency), smallest key should be removed. For each operation of type $1$, print the required value.

    <details>
    <summary>Solution</summary>

    Since we need to remove the key with the smallest value when the cache is full, we can use a set to store the keys in sorted order. We can use a map to store the frequency of the keys and a set to store the keys with the same frequency. The time complexity of the solution is $O(Q \log N)$.

    ```cpp
    class LFU {
        int cap;
        map<int, int> kvMap;
        map<int, int> freqMap;
        set<pair<int, int>> freqSet;

        void increaseFreq(int key) {
            int freq = freqMap[key];
            freqSet.erase({freq, key});

            freqMap[key]++;
            freqSet.insert({freqMap[key], key});
        }

    public:
        LFU(int capacity) {
            cap = capacity;
        }

        int get(int key) {
            if (kvMap.find(key) == kvMap.end())
                return -1;

            increaseFreq(key);
            return kvMap[key];
        }

        void set(int key, int val) {
            if (kvMap.find(key) != keyMap.end()) {
                kvMap[key] = val;
                increaseFreq(key);
                return;
            }

            if (kvMap.size() == cap) {
                auto [toRem, _] = *freqSet.begin();
                kvMap.erase(toRem);
                freqMap.erase(toRem);
                freqSet.erase(freqSet.begin());
            }

            kvMap[key] = val;
            freqMap[key] = 1;
            freqSet.insert({1, key});
        }
    };

    int main() {
        int cap;
        cin >> cap;
        LFU lfu(cap);

        int q;
        cin >> q;

        while (q--) {
            int ty, key, val;
            cin >> ty >> key >> val;

            if (ty == 1)
                cout << lfu.get(key) << endl;
            else
                lfu.set(key, val);
        }
    }
    ```

    </details>

18. During your English exam, you are given a question to find whether a sentence is valid according to the defined rules. You need to create a basic sentence checker that takes in strings as input and determines whether they form valid sentences. You can consider a sentence valid if it conforms to the following rules:

    1. The sentence must start with a capital letter, followed by a lowercase letter, or a space.
    2. All other characters must be lowercase letters, separators (`.:;`) or terminal marks (`.?!`).
    3. There must be a single space between each word, where space is denoted by `$`.
    4. The sentence must end with a terminal mark immediately following a word.

    You are given an integer $N$ where $N$ denotes the length of the string sentence. You are given a string sentence that you need to validate. Print $1$ if the string sentence is valid else print $0$.

19. Alice wanted to setup a chain of restaurants in a town. The town is represented as an $X$ axis on the number line. The town consists of $N$ houses, and the location of each house is known and given by array $A$. She has to deliver food at each house location. She will set up $K$ restaurants in the town and appoint as many delivery boys as she wants at each restaurant. All delivery boys leave the restaurants together for food delivery for all the locations. She will choose $K$ locations in town to set up restaurants, such that all food packets get delivered in the minimum possible time. Determine the minimum time in which all food packets get delivered to each house in the town.

    - It takes one unit of time to travel one unit distance.
    - There is no delay in delivering the food packet, once the delivery boy has reached the delivery location.
    - There is no limit on food packets that can be delivered by a single delivery boy.

    <details>
    <summary>Solution</summary>

    We will binary search on the minimum of the maximum distance that all the houses can have from any restaurants. The time complexity is $N \log(max(A))$.

    ```cpp showLineNumbers
    int main() {
        int n, k;
        cin >> n >> k;

        vector<int> arr(n);
        for (int i = 0; i < n; i++)
            cin >> arr[i];
        sort(arr.begin(), arr.end());

        auto check = [&](int mx) -> bool {
            int cnt = 0, lastRes = -1e9;

            for (int i = 0; i < n; i++) {
                if (abs(lastRes - arr[i]) <= mx)
                    continue;
                cnt++;
                lastRes = arr[i] + mx;
            }

            return cnt <= k;
        };

        int l = 0, r = arr.back() - arr[0];
        int ans = -1;
        while (l <= r) {
            int m = (l + r)/2;
            if (check(m)) {
                ans = m;
                r = m - 1;
            } else l = m + 1;
        }

        cout << ans << "\n";
    }
    ```

    </details>

## Probability Questions

1. Patel is having a party for $100$ foreign delegates at his farmhouse. Out of the $100$ guests, $90$ can speak French, $80$ can speak German and $75$ can speak Dutch. Mr. Patel, as a diplomatic policy, starts giving a thank you note speech for all his guests which has phrases from all the three languages. At least, how many people would understand the full speech given by Mr. Patel?

2. On a lazy Sunday afterrioon, Chandler thinks of challenging Joey for his love of pizzas. He comes up with a game where Chandler throws a dice and the number that appears on the dice would be the number of pizza slices Joey will have to eat, except when $6$ appears. In that case, Joey has to eat $5$ pizza slices and Chandler gets to throw the dice again. This may continue Indefinitely. What is the expected number of pizza slices Joey will eat?

3. There is an array of size $20$, with numbers from $1$-$20$. A random permutation of these numbers is stored in the array. What is the expected number of local minimas in the array. (A point is called local minima if it is the lowest among its neighbours, with first and last index having only one neighbour)

4. Mama's Pizza Kitchen has a $50$ percent discount every Friday, Rohit has promised his friends for a treat on his new job's first salary but will get his salary credited on the last business day of the month. What is the probability that Rohit would be able to avail the offer the day he receives his salary and takes his friends out on a treat to Mamma's Pizza Kitchen?

5. If $Correlation(PQ) = 0.5$ and $Correlation(QR) = 0.5$, what is the maximum possible value of $Correlation(PR)$?

6. You host a game where a person throws two dice. Person will get money according to dice rolls ($d_1$,$d_2$ being the numbers on respective dice throws). The payout will be equal to $max(0, d_1 \cdot d_2 - 30)$. What is the expected value of the game?

7. You are given a box with $100$ balls ($50$ yellow and $50$ red). You pick balls from the box one by one without replacements until all the balls are out. A yellow followed by a red or a red followed by a yellow is termed as "Flip". Calculate the expected number of "Flip" if the balls are being picked at random.

8. What are the two next terms in the sequences:

   1. $11, 21, 1211, 111221$
   2. $10, 11, 12, 13, 14, 20, 22, 101$

9. Sum $25$ is to be broken down into a set of positive integers $x_1, x_2, x_3 ..., x_k$ such that the product of $x_1$ to $x_k$ is maximised. What is the maximum product possible?

10. You are a trader considering a stock whose next price movement will be up or down with equal probability. Fortunately you have access to a binary signal predictive of the price change (observable ahead of time). The signal is $75%$ accurate, conditional on the stock going up. There is a $0.75$ probability that the signal says up and $0.25$ probability that it says down. The reverse is true if stock goes down. You have access to many such signals, all with the same accuracy.

    Assume they are conditionally independent given the price movement (eg. conditional of the stock going up, there's a $0.75^2$ probability that signals one and two both point up). Suppose you observe $10$ such signals and out of those $6$ of them are pointing up, while $4$ of them are pointing down. What is the probability that will go up?

11. A bitwise XOR for all tile numbers in a list $l$ is calculated as: $1$ if the number of times $1$ appears in the bit is odd and $0$ if the number of times $1$ appears in the list is even. A function $THOR(M,N)$ is defined as the XOR of all natural numbers between $M$ & $N$, both $M$ and $N$ inclusive. What is the value of $THOR(51,100)$?

12. There are $10$ socks Monica has with numbers $1$ to $10$ on them. Out of those $5$ socks are white and $5$ are blue. She has numbered $5$ white socks from $1$ to $5$ and blue socks from $6$ to $10$. Joey, Chandler, Ross, Rachel and Phoebe come one by one and pick one blue and one white sock randomly. Score of every person is determined by the sum of the pair of socks they wear. What is the probability that the product of scores of those all five friends is divisible by $11$.

13. What is the smallest $n$ such that $n!$ has $100$ zeroes?

14. There are $5$ doors. Behind one of them is a Mercedes Benz and behind the other the key to the Mercedez. The remaining three doors are empty. Hrithik knows what is behind all the doors. He asks you to choose two doors. After you choose doors, he opens an empty door which is not chosen by you. Now he gives you a chance to either stick to your earller chosen doors or to switch to the other closed doors. You win the car if you choose doors having both a car and a key. Let $p$ be the probability of winning the car in the best case. What is $100 \cdot p$?

15. You are playing a game with your friend, in which you toss a fair coin. You win $1$ point from your friend if the head comes, and if talis comes your friend wins $1$ point from you (your score is $-1$). The game continues till either one of you reaches a total of $2$ points (and the other one has $-2$ points). At this point the winner gets $10$ dollars from the loser.

    1. What is the expected value of this game?
    2. Now, assume you have an option to double the payoff (from $10$ to $20$) of the winner at any point of the game. You can use this option only once. What is the expected value of the new game?

16. A country has only $2$ denominations: $13$ and $17$. What is the highest integral amount that cannot be made using only these $2$ denominations?

17. What is the total number of $5$ digit numbers such that the product of the digits of that number is divisible by $10$?

    - Case $1$: Consider numbers whose product is 0 to be divisible by 10.
    - Case $2$: Consider only non-zero digit numbers.

18. There are $70$ people in a group, for any two members $X$ and $Y$ there is a language that $X$ speaks but $Y$ does not and there is a language that $Y$ speaks but $X$ does not. What is the minimum number of distinct languages spoken by this group?

## Online Assessment Questions

1. There are $a$ string potions and $b$ weak potions. You need to prepare a mixture of $c$ potions, such that it atleast has $3$ strong potions and $1$ weak potions. What is the total number of ways to prepare the mixture?

   Constraints:

   - $1 \leq a, b, c \leq 30$

2. You are given a tree with $n$ vertices. Figure out the number of unordered pairs of distinct vertices such that the simple path between them has exactly $1$ prime node lying on it.

   Constraints:

   - $1 \leq n \leq 10^5$

    <details>
    <summary>Solution</summary>

   ```cpp
   #include <bits/stdc++.h>
   using namespace std;

   #define IOS                       \
       ios_base::sync_with_stdio(0); \
       cin.tie(0);                   \
       cout.tie(0)

   #define ll long long int
   #define vll vector<long long int>
   #define range(x, s, n) for (int x = s; x < n; ++x)

   void solution();
   int main()
   {
       IOS;
       int TEST_CASES;
       TEST_CASES = 1;
       while (TEST_CASES--)
           solution();
       return 0;
   }

   class DSU
   {
   public:
       vector<long long> p, sz, cnt;
       int n;

       DSU(int n)
       {
           this->n = n;
           p.assign(n, 0);
           range(i, 0, n) p[i] = i;
           sz.assign(n, 1);
           cnt.assign(n, 0);
       }

       int find(int v)
       {
           if (p[v] == v)
               return v;
           return p[v] = find(p[v]);
       }

       void join(int u, int v)
       {
           u = find(u), v = find(v);
           if (u == v)
               return;
           if (sz[u] < sz[v])
               swap(u, v);
           sz[u] += sz[v];
           cnt[u] += cnt[v];
           p[v] = u;
       }

       void incr(int v)
       {
           cnt[find(v)]++;
       }
   };

   void solution()
   {
       int n;
       cin >> n;

       vector<bool> isPrime(n + 1, 1);
       isPrime[0] = 0;
       isPrime[1] = 0;
       for (int i = 2; i * i <= n; i++)
           if (isPrime[i])
               for (int j = i * i; j <= n; j += i)
                   isPrime[j] = 0;

       DSU dsu(n + 1);
       vector<vector<int>> g(n + 1);
       range(i, 0, n - 1)
       {
           int u, v;
           cin >> u >> v;
           if (!isPrime[u] && !isPrime[v])
               dsu.join(u, v);
           g[u].push_back(v);
           g[v].push_back(u);
       }

       long long ans = 0;
       range(i, 1, n + 1) if (isPrime[i])
       {
           ll tot = 0;
           vll v;
           for (int j : g[i])
               if (!isPrime[j])
               {
                   v.push_back(dsu.sz[dsu.find(j)]);
                   tot += v.back();
               }

           ans += tot;

           ll c = 0;
           for (ll x : v)
               c += x * (tot - x);
           ans += c / 2;
       }

       cout << ans << "\n";
   }
   ```

    </details>

3. You are given two arrays $a$ and $b$ of length $n$. You need to select a subset of indices from $1..n$ such that for any pair of indices $i, j$, atleast one of the following conditions would hold true:

   - If $a_i < a_j$, then $b_i < b_j$
   - If $a_i > a_j$, then $b_i > b_j$
   - If $a_i = a_j$, then $b_i \neq b_j$

   Find the length of maximum possible subset.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq a[i], b[i] \leq 10^9$

4. There are $n$ people, numbered from $1$ to $n$. You are also given an vector of pairs $(i, j)$ if two people $i$ and $j$ have an enemity. You need to fivide these people into two teams of equal size such that two people who are enemies are not on the same team. It is also guraunteed that each person has enemity with atmost $2$ other people. Find the largest possible team size that can be made.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $0 \leq |enemies| \leq 10^5$

5. You are given an array $arr$ of integers also $q$ queries. For each query of the form $(x, m)$ you need to find the number of elements $y$ from the array $arr$ such that the value $2 \cdot (x | y) - x \oplus y$ is greater than or equal to $m$. Here $|$ is bitwise OR and $\oplus$ is bitwise XOR.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq q \leq 10^5$
   - $1 \leq arr[i], x, m \leq 10^9$

---
