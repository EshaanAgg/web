---
title: "Placements '24: Assessments [Part 3]"
description: A brief of all the online assessments that I witnessed during the season of 2024.
pubDate: 2024-10-08
updateDate: 2024-10-17
pinned: true
requireLatex: true
tags: ["placements", "2024"]
---

This is the third part of the series on online assessments that I witnessed during the season of 2024. The previous parts can be found [here](../oa_1/) and [here](../oa_2/).

- [Phone Pe](#phone-pe)
- [Oracle](#oracle)

---

# Phone Pe

## Other Campus Questions

1. You are given a tree with $n$ nodes. Each node has $arr[i]$ amount of apples on it. You start walking from the node $1$, and on the walk you randomly choose any unvisited node connected to the current node with equal probability. You can only visit each node once. You can eat the apples on the node you are currently on. What is the expected number of apples you will eat?

   <details>
   <summary>Solution</summary>

   We will perform a single DFS to calculate the same. The time complexity of the same would be $O(n)$.

   ```cpp
   double dfs(int u, int p, vector<vector<int>> &g, vector<int> &arr) {
       int cntChild = 0;
       for (int v : g[u]) {
           if (v == p) continue;
           cntChild++;
       }

       if (cntChild == 0)
           return arr[u];

       double ans = arr[u], p = 1.0 / (double)cntChild;
       for (int v : g[u]) {
           if (v == p) continue;
           ans += p * dfs(v, u, g, arr);
       }

       return ans;
   }

   int main() {
       int n;
       cin >> n;

       vector<int> arr(n);
       for (int i = 0; i < n; i++) {
           cin >> arr[i];
       }

       vector<vector<int>> g(n);
       for (int i = 0; i < n - 1; i++) {
           int u, v;
           cin >> u >> v;
           u--, v--;
           g[u].push_back(v);
           g[v].push_back(u);
       }

       cout << fixed << setprecision(10) << dfs(0, -1, g, arr) << endl;
   }
   ```

   </details>

2. There are $n$ numbers of a board. In one operation, you will pick two numbers $x$ and $y$ from the board, erase them and add the following number back to the board:

   - $x - y$ if both $x$ and $y$ have the same parity.
   - $x + y$ if both $x$ and $y$ have different parity.

   Calculate how many different final numbers can be present on the board.

   Constraints:

   - $1 \leq n \leq 50$
   - $1 \leq a_i \leq 100$

3. There is a contest where two flags have been placed among checkpoints on the map of Haven. Checkpoints are connected by $m$ roads, it is possible that there are checkpoints between which no path exists, meaning there are no roads connecting them. You are given a checkpoint $a$ where you will start your journey, and you have to collect both flags, placed at checkpoints $b$ and $c$ in order ($b$ first and then $c$). You can pass through checkpoints more than once. However, you have to pay a price to use the road, so if someone goes along a road then every time he should pay the price for that road. You are given an array of costs of size $m$. You have to distribute prices such that each price of the road corresponds to only one road, so that the cost of collecting both flags will be minimal and hence win the contest. You cannot rearrange prices after the start of the contest. It is guaranteed that there are no self loops or multiple edges in the graph.

   Constraints:

   - $1 \leq n, m \leq 10^5$
   - $1 \leq a, b, c \leq n$
   - $1 \leq cost_i \leq 10^9$

<details>
<summary>Solution</summary>

</details>

4. Raju works for PhonePe and needs to deliver QR codes to Vanous merchants in a city laid out as an inom grid, Each shop in the grid requires a certain number of QR codes. Raju starts his journey at the top-left corner of the grid $(0,0)$ and needs to reach the bottom-right corner $(n-1, m-1)$. He can only move right or down at any step. Raju wants to distribute the maximum number of QR codes in a single commute. But there's a twist, To assist a merchant more efficiently Raju chooses to double the number of QR codes for one specific merchant along his path. However, he can only do this for one shop in his entire Journey. Your task is to help Raju determine the maximum number of QR's he would need on his way to the destination, Help considering the option to double the value of exactly one cell.

   Constraints:

   - $1 \leq n, m \leq 10^3$
   - $1 \leq a_{ij} \leq 10^3$

    <details>
    <summary>Solution</summary>

   ```cpp
   int main()
   {
       int Y, X;
       cin >> Y >> X;

       vector<vector<int>> g(Y, vector<int>(X));
       for (int i = 0; i < Y; i++)
           for (int j = 0; j < X; j++)
               cin >> g[i][j];

       long long dp[Y][X][2];
       memset(dp, 0, sizeof(dp));

       dp[0][0][0] = g[0][0];
       dp[0][0][1] = g[0][0] * 2;

       for (int y = 0; y < Y; y++)
           for (int x = 0; x < X; x++)
           {
               if (x != 0)
               {
                   dp[y][x][0] = max(dp[y][x][0], dp[y][x - 1][0] + g[y][x]);
                   dp[y][x][1] = max({
                       dp[y][x][1],
                       dp[y][x - 1][1] + g[y][x],
                       dp[y][x - 1][0] + g[y][x] * 2,
                   });
               }

               if (y != 0)
               {
                   dp[y][x][0] = max(dp[y][x][0], dp[y - 1][x][0] + g[y][x]);
                   dp[y][x][1] = max({
                       dp[y][x][1],
                       dp[y - 1][x][1] + g[y][x],
                       dp[y - 1][x][0] + g[y][x] * 2,
                   });
               }
           }

       cout << dp[Y - 1][X - 1][1] << endl;
   }
   ```

    </details>

5. To ensure seamless transactions, PhonePe needs to optimize its server network to minimize communication costs across these locations You are given a network of $N$ machines, which can either be server machines or client machines, and $M$ directed, weighted edges representing the network cost to travel from one machine to its neighbor machine. If a path exists from one machine to another, then network cost is defined as the sum of edge weights via that path. Your task is to determine the minimum sum of network cost to reach all machines (client and server machines) from any server. Additionally, each client machine can be upgraded to a server machine at a given one-time cost. This means the number of server machines will increase by $1$, but with additional cost.

   - The cost to reach itself for a client machine with server capabilities is zero since reaching itself needs no edge traversal.
   - The cost to reach a server machine from itself is zero.

   Input Format:

   - An integer $N$ representing the total number of machines. Machines are labeled from $1$ to $N$
   - An integer $C$ representing the total number of client.
   - $machines$: A list of integers containing client machine nodes.
   - An integer $S$ representing the total number of server machines.
   - A list of integers containing server machine nodes.
   - An integer $M$ representing the number of directed, weighted edges.
   - A list of $M$ tuples $(u,v,w)$, where $u$ is the starting machine, $v$ is the destination machine, and $w$ is the network cost to travel from $u$ to $v$.
   - An integer $K$ representing the number of upgradable client machines
   - A $K \times 2$ size two dimensional integer list $A$, where $A[i][0]$ denotes client machine node and $A[i][1]$ denotes upgradation cost to have server capabilities.

   Return the minimum network cost sum. Return $-1$ if it is not possible to reach all machines. Since the answer can overflow, you need to return the answer modulo $(10^6+7)$.

   Constraints:

   - $1 \leq N \leq 100$
   - $0 \leq M \leq N^2$
   - $1 \leq u, v \leq N$
   - $0 \leq w \leq 10^6$
   - $0 \leq k \leq 10$
   - $1 \leq A[i][0] \leq 100$
   - $0 \leq A[i][1] \leq 10^6$

    <details>
    <summary>Solution</summary>

   We will use a bitmask on the upgradable servers and a multi-source Dijkstra to solve this problem. The time complexity of the solution would be $O(2^k \cdot (N + M) \log N)$.

   ```cpp showLineNumbers
   int main()
   {
       int n;
       cin >> n;

       // Client -> 1, Server -> 2
       vector<int> arr(n + 1, 0);

       int c;
       cin >> c;
       for (int i = 0; i < c; i++)
       {
           int x;
           cin >> x;
           arr[x] = 1;
       }

       int s;
       cin >> s;
       for (int i = 0; i < s; i++)
       {
           int x;
           cin >> x;
           arr[x] = 2;
       }

       vector<vector<pair<int, int>>> g(n + 1);
       int m;
       cin >> m;
       for (int i = 0; i < m; i++)
       {
           int u, v, w;
           cin >> u >> v >> w;
           g[u].push_back({v, w});
       }

       int k;
       cin >> k;
       vector<vector<int>> A(k, vector<int>(2));
       for (int i = 0; i < k; i++)
           cin >> A[i][0] >> A[i][1];

       long long ans = 1e18;

       for (int mask = 0; mask < (1 << k); mask++)
       {
           long long curCost = 0;

           vector<long long> dist(n + 1, 1e18);
           priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;

           // Add all the original servers
           for (int i = 1; i <= n; i++)
               if (arr[i] == 2)
               {
                   dist[i] = 0;
                   pq.push({0, i});
               }

           // Add all the new servers
           for (int i = 0; i < k; i++)
               if (mask & (1 << i))
               {
                   dist[A[i][0]] = 0;
                   pq.push({0, A[i][0]});
                   curCost += A[i][1];
               }

           while (!pq.empty())
           {
               auto [d, u] = pq.top();
               pq.pop();

               if (dist[u] < d)
                   continue;

               for (auto [v, w] : g[u])
                   if (dist[v] > dist[u] + w)
                   {
                       dist[v] = dist[u] + w;
                       pq.push({dist[v], v});
                   }
           }

           bool valid = true;
           for (int i = 1; i <= n; i++)
               if (arr[i] == 1)
               {
                   if (dist[i] == 1e18)
                   {
                       valid = false;
                       break;
                   }
                   curCost += dist[i];
               }

           if (valid)
               ans = min(ans, curCost);
       }

       if (ans == 1e18)
           ans = -1;
       else
           ans %= ((long long)1e6 + 7);

       cout << ans << endl;
   }
   ```

    </details>

6. There are houses numbered from $1$ to $n$. Alice is intially at house $x$, and Bob is at house $y$. In one second, they can either move one house to the left or one house to the right. What is the minimum time they need to visit all the houses atleast once? There are $t$ testcases in one test file.

   Constraints:

   - $1 \leq t \leq 10^5$
   - $1 \leq n \leq 10^9$
   - $1 \leq x, y \leq n$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   bool check(int time, int n, int x, int y) {
       int cnt1 = x + max(0, time - 2 * (x - 1));
       cnt1 = max(cnt1, (time + x + 1)/2);

       int cnt2 = max(n - y + 1 + max(0, time - 2 * (n - y)));
       cnt2 = max(cnt2, n - (n + y - time + 1)/2 + 1);

       return cnt1 + cnt2 >= n;
   }

   void solve() {
       int n, x, y;
       cin >> n >> x >> y;

       if (x > y)
           swap(x, y);

       int l = max(x - 1, n - y), r = 2 * n;
       int ans;
       while (l <= r) {
           int m = l + (r - l) / 2;
           if (check(m, x, y, n)) {
               ans = m;
               r = m - 1;
           } else {
               l = m + 1;
           }
       }

       cout << ans << endl;
   }

   int main() {
       int t;
       cin >> t;

       while (t--)
           solve();
   }
   ```

    </details>

7. There is a country with $n$ cities and $n$ directed edges between them. It is desired to reorient the edges so that every city is reachable from every other city. Figure out the minimum cost to do the same. A city has atmost $2$ edges in this nation. The cost of reversing a directed edge is equal to the weight of the edges. It is gauranteed that a solution always exists for the provided setting.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq a_i \leq 10^9$

    <details>
    <summary>Solution</summary>

   Under the given conditions, it can be seen that the final layout with be that of a loop. Thus we just need to figure out the minimum cost to make a loop. The time complexity of the solution would be $O(n)$.

   ```cpp showLineNumbers
   int main() {
       int n;
       cin >> n;

       vector<vector<int>> g(n);
       map<pair<int, int>, int> cost;
       for (int i = 0; i < n; i++) {
           int u, v, w;
           cin >> u >> v >> w;
           u--, v--;
           g[u].push_back(v);
           g[v].push_back(u);
           cost[{u, v}] = 0;
           cost[{v, u}] = w;
       }

       vector<int> vis(n, 0);
       vector<int> cycle;

       function<void(int, int)> dfs = [&](int u, int p) {
           vis[u] = 1;
           cycle.push_back(u);

           for (int v : g[u]) {
               if (v == p) continue;
               if (!vis[v])
                   dfs(v, u);
           }
       };
       dfs(0, -1);

       long long cost1 = 0, cost2 = 0;
       for (int i = 0; i < n; i++) {
           int u = cycle[i], v = cycle[(i + 1) % n];
           cost1 += cost[{u, v}];
           cost2 += cost[{v, u}];
       }
       cout << min(cost1, cost2) << endl;
   }
   ```

    </details>

8. There are $n$ hurdles in a course and crossing each one increments your score by $arr[i]$. An athelete can only cross at max $k$ consecutive hurdles on the course. What is the maximum score any athlete can get on the course?

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq k \leq n$
   - $1 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

   We will use dynamic programming to solve this problem. Let us denote $dp[i]$ as the minimum sum of elements I must remove from the array $arr[1 \ldots i]$ such that the condition mentioned in the question holds. We also define $g[i]$ to be equal to $dp[i-1] + arr[i]$, and the value of $dp[i]$ can be calculated as $dp[i] = \min (g[j])$ for the previous $k$ indices with respect to $i$. We will use a deque to calculate the range minimum. The time complexity of the solution would be $O(n)$.

   ```cpp showLineNumbers
   int main()
   {
       int n, k;
       cin >> n >> k;

       vector<int> arr(n + 1);
       long long sum = 0;
       for (int i = 1; i <= n; i++)
       {
           cin >> arr[i];
           sum += arr[i];
       }

       vector<long long> dp(n + 1), g(n + 1);
       deque<int> dq;
       for (int i = 1; i <= k; i++)
       {
           dp[i] = 0;
           g[i] = dp[i - 1] + arr[i];

           while (!dq.empty() && g[dq.back()] >= g[i])
               dq.pop_back();
           dq.push_back(i);
       }

       for (int i = k + 1; i <= n; i++)
       {
           while (!dq.empty() && i - dq.front() > k)
               dq.pop_front();

           dp[i] = g[dq.front()];
           g[i] = dp[i - 1] + arr[i];

           while (!dq.empty() && g[dq.back()] >= g[i])
               dq.pop_back();
           dq.push_back(i);
       }

       cout << sum - dp[n] << endl;
   }
   ```

    </details>

9. There are $n$ cities in a country. You need to start at city $s$ and end at city $t$. Between any two cities, you can either take a plane or a boat. The cost for both of them would be given. You want to plan your journey in such a manner that you change your mode of travel between cities (i.e. from plane to boat, or from boat to plane) at most once in the whole journey. Find the minimum cost of the travel.

   Constraints:

   - $1 \leq n \leq 10^3$
   - $1 \leq s, t \leq n$
   - $1 \leq cost_{ij} \leq 10^9$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int main() {
       int n;
       cin >> n;

       vector<vector<int>> boat(n, vector<int>(n));
       for (int i = 0; i < n; i++)
           for (int j = 0; j < n; j++)
               cin >> boat[i][j];

       vector<vector<int>> plane(n, vector<int>(n));
       for (int i = 0; i < n; i++)
           for (int j = 0; j < n; j++)
               cin >> plane[i][j];

       int s, t;
       cin >> s >> t;
       s--, t--;

       // Node, Last Mode, Flipped Mode
       long long dis[n][2][2];
       for (int i = 0; i < n; i++)
           for (int j = 0; j < 2; j++)
               for (int k = 0; k < 2; k++)
                   dis[i][j][k] = 1e18;

       priority_queue<vector<long long>, vector<vector<long long>>, greater<vector<long long>>> pq;
       pq.push({0, s, 0, 0});
       pq.push({0, s, 1, 0});
       dis[s][0][0] = 0;
       dis[s][1][0] = 0;

       while (!pq.empty()) {
           auto top = pq.top();
           pq.pop();

           long long d = top[0], u = top[1], mode = top[2], flipped = top[3];
           if (dis[u][mode][flipped] < d)
               continue;

           for (int v = 0; v < n; v++)
               for (int newMode = 0; newMode < 2; newMode++) {
                   long long w = (newMode == 0 ? boat[u][v] : plane[u][v]);
                   if (w == -1)
                       continue;

                   int newFlipped = flipped + (mode != newMode);
                   if (newFlipped > 1)
                       continue;

                   if (dis[v][newMode][newFlipped] > dis[u][mode][flipped] + w) {
                       dis[v][newMode][newFlipped] = dis[u][mode][flipped] + w;
                       pq.push({dis[v][newMode][newFlipped], v, newMode, newFlipped});
                   }
               }
       }

       cout << min({
           dis[t][0][0],
           dis[t][0][1],
           dis[t][1][0],
           dis[t][1][1],
       }) << endl;
   }
   ```

    </details>

10. You are given an array of length $n$. In each step you do the following:

    1. Add the sum of the array to your score.
    2. If the length of the array is $1$, the game ends.
    3. You partition the array into two parts, such that both the parts are non-emtpty. You repeat the game with each part individually, and then add the score of both the parts to your score.

    What is the maximum score you can get?

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    We will greedily always parition the rest of the subarray and remove the smallest element from the subarray. The time complexity of the solution would be $O(n \log n)$ due to sorting.

    ```cpp showLineNumbers
    int main()
    {
        int n;
        cin >> n;

        vector<int> arr(n);
        for (int i = 0; i < n; i++)
            cin >> arr[i];

        sort(arr.begin(), arr.end());
        vector<long long> suf(n);
        suf[n - 1] = arr[n - 1];
        for (int i = n - 2; i >= 0; i--)
            suf[i] = suf[i + 1] + arr[i + 1];

        long long ans = 0;
        for (int i = 0; i < n; i++)
            ans += suf[i];

        cout << ans << "\n";
    }
    ```

    </details>

11. You are given an array of length $n$. Count the number of subarrays of the same whose $XOR$ has an even number of divisors.

    Contraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq arr[i] \leq n$

    <details>
    <summary>Solution</summary>

    ```cpp showLineNumbers
    int main()
    {
        long long n;
        cin >> n;

        vector<int> arr(n);
        for (int i = 0; i < n; i++)
            cin >> arr[i];

        vector<int> sq;
        for (int i = 0; i * i <= 2 * n; i++)
            sq.push_back(i * i);

        long long ans = n * (n + 1) / 2;
        map<int, int> cnt;
        cnt[0] = 1;

        int pre = 0;
        for (int i = 0; i < n; i++)
        {
            pre ^= arr[i];
            for (int j : sq)
                ans -= cnt[j ^ pre];
            cnt[pre]++;
        }

        cout << ans << "\n";
    }
    ```

    </details>

12. [XOUR](https://codeforces.com/problemset/problem/1971/G)

13. Given a string $s$, find the number of substrings of $s$ that have length atleast $l$, length atmost $r$, and have less than or equal to $k$ distinct characters present in them.

    Constraints:

    - $1 \leq |s| \leq 10^5$
    - $1 \leq l \leq r \leq |s|$
    - $1 \leq k \leq 26$

    <details>
    <summary>Solution</summary>

    We will use a two-pointer approach to solve this problem. We have calculated an utility that calculates the number of substrings with length at most $maxLen$ and having atmost $k$ distinct characters. Using the same, we can calculate the required quantity in the question. The time complexity of the solution would be $O(n)$.

    ```cpp showLineNumbers
    int cntMaxLen(string &s, int maxLen, int k)
    {
        if (k == 0 || maxLen == 0)
            return 0;

        int n = s.size();
        map<char, int> cnt;
        int j = 0;
        cnt[s[0]] = 1;

        int ans = 0;
        for (int i = 0; i < n; i++)
        {
            while (j + 1 < n)
            {
                int curLen = j - i + 1;
                bool lenSatify = curLen + 1 <= maxLen;
                bool szSatisfy = cnt.size() < k || (cnt.find(s[j + 1]) != cnt.end());
                if (lenSatify && szSatisfy)
                {
                    j++;
                    cnt[s[j]]++;
                }
                else
                    break;
            }

            ans += j - i + 1;
            cnt[s[i]]--;
            if (!cnt[s[i]])
                cnt.erase(s[i]);
        }

        return ans;
    }

    int main()
    {
        string s;
        cin >> s;

        int l, r, k;
        cin >> l >> r >> k;
        cout << cntMaxLen(s, r, k) - cntMaxLen(s, l - 1, k);
    }
    ```

    </details>

14. There is an undirected graph of $n$ vertices, connected by $n-1$ bidirectional edges. People are standing on each node of the graph connected by a rope inside of this graph. There are $2$ ends of the rope: head is at vertex $a$ and it's tail is at vertex $b$. The people connected by this rope occupy all vertices on the unique simple path between $a$ and $b$. The people want to know if they can reverse their order, meaning that the person standing at the head of the rope needs to move to the node where the rope's tail is, and the person standing on the tail node needs to move to the node where the rope's head is. Unfortunately, the people's movement is restricted to the graph structure.

    In an operation, the person on the head can move to an adjacent vertex not currently occupied. When the person at the head does this each person connected will also move one vertes closer to the head, so that the length of the rope remains unchanged. Similarly, the person standing on the tail vertex can move to an adjacent verter not currently occupied. When the person at tall does this cach person connected will also move one vertex closer to the tail. Determine if it is possible to reverse the people with some sequence of moves.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq a, b \leq n$

    This is a restatement of the question [The Majestic Brown Snake](https://codeforces.com/problemset/problem/1381/D).

## Online Assessment Questions

1. Checking a graph if the same was bipartite.

2. You are given an array $arr$ of length $n$. What is the shortest subarray that you must remove from the same so that the sum of the leftover array is divisible by $p$?

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq arr[i] \leq 10^9$
   - $1 \leq p \leq 10^9$

3. What is the number of subsets of the numbers $[1, 2, 3, ...., n]$ such that if $x$ is present in a subset, then $2 \cdot x$ and $3 \cdot x$ are not present in the same? Return the answer modulo $10^9 + 7$.

   Constraints:

   - $1 \leq n \leq 10^5$

4. There is a grid of bricks of size $N \times M$. You make $q$ attacks on the same. Each attack is represented as $(x, y, t)$ where you destroy the brick in the row $x$ and column $y$ at the time $t$. Find the minimum time after which there is atleast a square of size $k \times k$ of bricks that are destroyed.

   Constraints:

   - $1 \leq n, m \leq 10^3$
   - $1 \leq q \leq 10^5$
   - $1 \leq x \leq n$
   - $1 \leq y \leq m$
   - $1 \leq t \leq 10^9$

# Oracle

## Other Campus Questions

1. You are given two integer $x$ and $y$. You need to find an integer $z$ such that $z \leq 2^n$ and the value of $(x \oplus z) \cdot (y \oplus z)$ is maximum. Here, $\oplus$ denotes the bitwise XOR operation. Return the value of $(x \oplus z) * (y \oplus z)$ modulo $10^9 + 7$.

   Constraints:

   - $1 \leq x, y \leq 10^18$
   - $1 \leq n \leq 50$

   <details>
   <summary>Solution</summary>

   We will iterate over all the bits of $x$ and $y$ and try to set try to set the bit of both the numbers obtained after the XOR to $1$. If the same is not possible, we first prefer set the same in the smaller number. The time complexity of the solution would be $O(n)$.

   ```cpp
   int maximumXorProduct(long long a, long long b, int n) {
       for (int bit = n - 1; bit >= 0; bit--)
       {
           int x = (a >> bit) & 1;
           int y = (b >> bit) & 1;

           if (x == y) {
               a |= (1LL << bit);
               b |= (1LL << bit);
           }
           else
           {
               if (a > b)
                   swap(a, b);
               a |= (1LL << bit);
               if ((b >> bit) & 1)
                   b ^= (1LL << bit);
           }
       }

       long long mod = 1e9 + 7;
       return (a % mod) * (b % mod) % mod;
   }
   ```

   </details>

2. You are given an undirected connected graph witn $n$ nodes and $m$ edges. You first need to construct any traversal of the graph, and store it in array $a$. All the nodes must be visited atleast once in this traversal. Then you need to construct another array $b$ from the array $a$, such that $b$ is a subsequence of $a$ consiting of only the first occurences of every node. Thus the length of $b$ would be exactly $n$. Find the lexographically maximum sequence $b$ that can be generated by chosing the array $a$ optimally.

   Constraints:

   - $1 \leq n, m \leq 10^5$
   - $1 \leq a_i, b_i \leq n$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       int n, m;
       cin >> n >> m;

       vector<vector<int>> g(n);
       for (int i = 0; i < m; i++)
       {
           int x, y;
           cin >> x >> y;
           g[x - 1].push_back(y - 1);
           g[y - 1].push_back(x - 1);
       }

       vector<int> done(n, 0);
       set<int> candidates;
       vector<int> b;

       b.push_back(n);
       done[n - 1] = 1;
       for (int v : g[n - 1])
           candidates.insert(v);

       while (!candidates.empty())
       {
           auto t = *candidates.rbegin();
           candidates.erase(--candidates.end());

           b.push_back(t + 1);
           done[t] = 1;
           for (int v : g[t])
               if (!done[v])
                   candidates.insert(v);
       }

       for (int x : b)
           cout << x << " ";
   }
   ```

    </details>

3. Count the number of subsequences of string $t$ in the given string $s$. Return the answer modulo $1e9 + 7$.

   Constraints:

   - $1 \leq |s|, |t| \leq 10^3$

   <details>
   <summary>Solution</summary>

   ```cpp
   int main()
   {
       string s, t;
       cin >> s >> t;

       int n = s.size(), m = t.size();
       vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
       for (int i = 0; i <= n; i++)
           dp[i][0] = 1;

       int mod = 1e9 + 7;

       for (int i = 1; i <= n; i++)
           for (int j = 1; j <= m; j++)
           {
               if (s[i - 1] != t[j - 1])
                   dp[i][j] = dp[i - 1][j];
               else
                   dp[i][j] = dp[i - 1][j] + dp[i - 1][j - 1];
               dp[i][j] %= mod;
           }

       cout << dp[n][m] << "\n";
   }
   ```

   </details>

4. You are given an integer $x$. Find the smallest number greater or equal to $x$ which has no consecutive one's in it's binary representation.

   Constraints:

   - $1 \leq x \leq 10^9$

   <details>
   <summary>Solution</summary>

   We would iterate from right to left, and maintain a mask to find the occurence of $11$ in the digit. As soon we find the same, we increment the prefix by $1$ and replace the suffix of the number with $0000 \codts$ bits.

   ```cpp
   int main()
   {
       int x;
       cin >> x;

       int mask = 3, pos = 2;
       while (mask <= x)
       {
           if ((mask & x) == mask)
           {
               x >>= pos;
               x++;
               x <<= pos;
           }
           mask <<= 1;
           pos++;
       }

       cout << x;
   }
   ```

   </details>
