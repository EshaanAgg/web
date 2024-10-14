---
title: "Placements '24: Assessments [Part 2]"
description: A brief of all the online assessments that I witnessed during the season of 2024.
pubDate: 2024-10-08
updateDate: 2024-10-08
pinned: true
requireLatex: true
tags: ["placements", "2024"]
---

This is the second part of the series on online assessments that I witnessed during the season of 2024. The first part can be found [here](../oa_1/).

- [Zomato](#zomato)
- [PACE Stock Broking](#pace-stock-broking)
- [HiLabs Technologies](#hilabs-technologies)
- [InMobi](#inmobi)

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

   Now each component with size $s$ contribute $\frac{s * (s + 1)}{2} - x$ to the answer, where $x$ is the number of edges present originally in that component. The time complexity of the solution is $O(n + m)$.

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
               for (int i = p.size() - 1; i > 0; i--)
                   st.push(p[i]);
           } else {
               if (st.empty()) {
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

   ```cpp showLineNumbers

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

    <details>

---

# HiLabs Technologies

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
