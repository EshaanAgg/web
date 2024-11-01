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
- [Confluent](#confluent)
- [Amazon](#amazon)
- [Seimens](#seimens)
- [Walmart](#walmart)

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

15. You are monitoring the building density in a district of houses. The district is represented as a number line, where a house can be built at each numbered point on the line if at least one of the neighboring points is not occupied. Initially, there are no houses in the district. You are given $queries$, an array of integers representing the locations of new houses in the order in which they will be built. After each house is built, your task is to find the longest segment of contiguous houses in the district. It is guaranteed that all of the house locations in queries are unique and no house was built at a point with existing houses on both left and right adjacent points.

    Constraints:

    - $1 \leq |queries| \leq 10^5$
    - $1 \leq queries[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    ```cpp showLineNumbers
    int main()
    {
        int q;
        cin >> q;

        set<pair<int, int>> s;
        multiset<int> le;
        int x;
        cin >> x;
        s.insert({x, x});
        le.insert(1);
        cout << 1 << " ";

        for (int i = 1; i < q; i++)
        {
            cin >> x;

            auto itr = s.lower_bound({x, x});
            if (itr != s.end() && (*itr).first == x + 1)
            {
                auto p = *itr;
                le.erase(le.find(p.second - p.first + 1));
                s.erase(itr);
                s.insert({p.first - 1, p.second});
                le.insert({p.second - p.first + 2});
            }
            else if (itr != s.begin() && (*(--itr)).second == x - 1)
            {
                auto p = *itr;
                le.erase(le.find(p.second - p.first + 1));
                s.erase(itr);
                s.insert({p.first, p.second + 1});
                le.insert({p.second - p.first + 2});
            }
            else
            {
                le.insert(1);
                s.insert({x, x});
            }

            cout << *le.rbegin() << " ";
        }
    }
    ```

    </details>

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

---

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

5. Alex is working on a planet where there are $N$ days in a year. He noticed that his performence on $i^{th}$ the day of the year was equal to $nums[i]$. Alex is a hard worker and he wants to come to work for the max number of days that he can. However, he does not want to have a negative total perfonttance at any point in time since his boss will deduct his salary. Help Alex find the major number of days in the year that he can come to the office.

   Constraints:

   - $1 \leq N \leq 10^5$
   - $-10^9 \leq nums[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

   ```cpp
   int main() {
       int n;
       cin >> n;

       vector<int> arr(n);
       for (int i = 0; i < n; i++)
           cin >> arr[i];

       long long sum = 0;
       priority_queue<int, vector<int>, greater<int>> pq;
       int ans = 0;

       for (int i = 0; i < n; i++) {
           if (arr[i] >= 0) {
               sum += arr[i];
               ans++;
               continue;
           }

           if (sum + arr[i] >= 0) {
               sum += arr[i];
               pq.push(arr[i]);
               ans++;
           } else if (!pq.empty() && pq.top() < arr[i]) {
               sum -= pq.top();
               sum += arr[i];
               pq.pop();
               pq.push(arr[i]);
           }
       }

       cout << ans << endl;
   }
   ```

    </details>

6. You are given an array $arr$. In one operations, you are required to choose a range $[l, r]$ such that it has not been chosen previously, and then add the value of $max(arr[l] ..., arr[r])$ to your score. What is the maximum score you can obtain after performing at max $k$ operations?

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq k \leq min(10^9, \frac{n (n + 1)}{2})$
   - $1 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       long long n, k;
       cin >> n >> k;

       vector<int> arr(n);
       for (int i = 0; i < n; i++)
           cin >> arr[i];

       vector<int> nxtGreater(n, n);
       stack<int> st;
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

       vector<pair<long long, long long>> ele;
       for (int i = 0; i < n; i++)
       {
           long long cnt = (i - prevGreater[i]) * (nxtGreater[i] - i);
           ele.push_back({arr[i], cnt});
       }
       sort(ele.begin(), ele.end());
       reverse(ele.begin(), ele.end());

       long long ans = 0, mod = 1e9 + 7;
       for (auto &[x, cnt] : ele)
       {
           long long ops = min(cnt, k);
           k -= ops;
           ans += x * ops;
           ans %= mod;
           if (k == 0)
               break;
       }

       cout << ans << "\n";
   }
   ```

    </details>

7. You are given a string $s$. Find the length of the minimum substring of $s$ that must be removed from the same, so that the remaining string can be permuted to form a palindrome. String $s$ only consists of lowercase English alphabets.

   Constraints:

   - $1 \leq |s| \leq 10^5$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       string s;
       cin >> s;

       int n = s.size();
       vector<int> sufMask(n);
       sufMask[n - 1] = (1 << (s[n - 1] - 'a'));
       for (int i = n - 2; i >= 0; i--)
           sufMask[i] = sufMask[i + 1] ^ (1 << (s[i] - 'a'));

       vector<int> tarMasks = {0};
       for (int j = 0; j < 26; j++)
           tarMasks.push_back(1 << j);

       unordered_map<int, int> idx;
       idx[0] = -1;
       int ans = n;
       int pre = 0;

       for (int i = 0; i < n; i++)
       {
           pre ^= (1 << (s[i] - 'a'));
           for (auto t : tarMasks)
           {
               t = t ^ sufMask[i];
               if (idx.find(t) != idx.end())
                   ans = min(ans, i - idx[t] - 1);
           }

           idx[pre] = i;
       }

       cout << ans << "\n";
   }
   ```

    </details>

8. You are given $n$ points on a grid. Calculate the area of the minimum square that encloses at-least $k$ of the points in the grid. The points that lie on the boundary of the square are not counted as to be enclosed in the same.

   Constraints:

   - $1 \leq n \leq 100$
   - $1 \leq k \leq n$
   - $-10^9 \leq x, y \leq 10^9$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       int n;
       cin >> n;

       vector<pair<int, int>> pts(n);
       for (int i = 0; i < n; i++)
           cin >> pts[i].first >> pts[i].second;

       int k;
       cin >> k;

       int ans = 1e9;

       for (int i = 0; i < n; i++)
           for (int j = i + k - 1; j < n; j++)
           {
               int xr = pts[j].first - pts[i].first + 2;

               vector<int> y;
               for (int t = i; t <= j; t++)
                   y.push_back(pts[t].second);
               sort(y.begin(), y.end());

               int m = y.size();
               for (int t = 0; t + k - 1 < m; t++)
               {
                   int yr = y[t + k - 1] - y[t] + 2;
                   ans = min(ans, max(yr, xr));
               }
           }

       cout << (long long)ans * (long long)ans << "\n";
   }
   ```

   </details>

9. [Maximise the String](https://codeforces.com/problemset/problem/1506/G)

10. You are given a tree of $n$ nodes. You need to colour the nodes of the tree with $m$ colours, such that no two adjacent nodes, as well as two nodes that are adjacent to a common city have the same colour. Output the number of colourings of the graph modulo $10^9 + 7$.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq m \leq 10^5$

    <details>
    <summary>Solution</summary>

    ```cpp showLineNumbers
    long long MOD = 1e9 + 7;

    long long binPow(long long a, long long b)
    {
        a %= MOD;
        long long res = 1;

        while (b)
        {
            if (b & 1)
            {
                res = res * a;
                res %= MOD;
            }
            a *= a;
            a %= MOD;
            b >>= 1;
        }

        return res;
    }

    int main()
    {
        long long n, m;
        cin >> n >> m;

        vector<vector<int>> g(n);
        for (int i = 0; i < n - 1; i++)
        {
            int u, v;
            cin >> u >> v;
            g[u - 1].push_back(v - 1);
            g[v - 1].push_back(u - 1);
        }

        vector<long long> fac(m + 1);
        fac[0] = 1;
        for (long long i = 1; i <= m; i++)
        {
            fac[i] = i * fac[i - 1];
            fac[i] %= MOD;
        }

        vector<long long> inv(m + 1);
        for (int i = 0; i <= m; i++)
            inv[i] = binPow(fac[i], MOD - 2);

        auto nCr = [&](int n, int r) -> long long
        {
            if (r > n)
                return 0;

            long long dr = (inv[r] * inv[n - r]) % MOD;
            return (fac[n] * dr) % MOD;
        };

        function<long long(int, int, int)> dfs = [&](int u, int p, int d) -> long long
        {
            int cnt = 0;

            long long ways = 1;
            for (int v : g[u])
            {
                if (v == p)
                    continue;
                cnt++;
                ways *= dfs(v, u, d + 1);
                ways %= MOD;
            }

            if (d == 0)
            {
                long long w = (nCr(m - 1, cnt) * fac[cnt]) % MOD;
                return (w * ways) % MOD;
            }

            long long w = (nCr(m - 2, cnt) * fac[cnt]) % MOD;
            return (w * ways) % MOD;
        };

        long long ans = m * dfs(0, -1, 0);
        cout << ans % MOD << "\n";
    }
    ```

    </details>

---

# Confluent

## Online Assessment Questions

1. You are given a string of length $n$ consisiting of lowercase English letters. You need to count the number of substrings of $s$ such that the substring only consists of vowels, and all the vowels are present in the same atleast once.

   Constraints:

   - $1 \leq n \leq 10^5$

2. Same question as $4$ from the Online Assessment Questions from `Pace Stock Broking`

3. A lottery ticket is present by the number $n$, and the value of the lottery ticket is equal to the sum of the digits of $n$. In a lottery sessions, all the ticket numbers between $lowLimit$ and $highLimit$ (both inclusive) have been sold. A ticker is considered a winner if the value of the ticket is equal to the value decided by the organizers. Count the number of values that the organizers can choose so that the number of winners in the draw is maximized. Also return the number of people that would be winning the lottery in the said value is chosen.

   Constraints:

   - $1 \leq lowLimit \leq highLimit \leq 10^{18}$

---

# Amazon

## Online Assessment Questions

1. There are two arrays of length $n$, namely $a$ and $b$. In one operation, you can choose two indexes $i$ and $j$, and decrement $a[i]$ by $1$ and increment $a[j]$ by $1$. This operation can only be performed if $a[i]$ remains non-negative after the operation. You need to find the maximum number of indexes that can be made equal in both the arrays by performing the operations.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq a[i], b[i] \leq 10^9$

   <details>
   <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       int n;
       cin >> n;

       vector<int> a(n), b(n);

       int sum = 0;
       for (int i = 0; i < n; i++)
       {
           cin >> a[i];
           sum += a[i];
       }

       for (int i = 0; i < n; i++)
           cin >> b[i];
       sort(b.begin(), b.end());

       int ans = 0, curSum = 0;
       for (int i = 0; i < n; i++)
       {
           curSum += b[i];
           if (curSum <= sum)
               ans = i + 1;
       }
       if (curSum != sum && ans == n)
           ans--;

       cout << ans << "\n";
   }
   ```

    </details>

2. You are given an array $arr$. In one operation, you can decrease the value of one element by $p$ units, and the value of all the other elements by $q$ units. If is gauranteed that $p > q$. What is the minimum number of operations to make the value of all the elements of the array less than or equal to $0$?

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq arr[i] \leq 10^9$
   - $1 \leq p, q \leq 10^9$

    <details>

   ```cpp showLineNumbers
   bool check(int tot, vector<int> &arr, int p, int q)
   {
       int cnt = 0;

       for (auto x : arr)
       {
           // p * cnt + q * (tot - cnt) >= x
           // cnt * (p - q) >= x - q * tot
           int num = x - q * tot;
           int den = p - q;
           cnt += (num + den - 1) / den;
           if (cnt > tot)
               return 0;
       }

       return 1;
   }

   int main()
   {
       int n;
       cin >> n;

       vector<int> arr(n);
       for (int i = 0; i < n; i++)
           cin >> arr[i];

       int p, q;
       cin >> p >> q;

       int l = 0, r = 1e9;
       int ans;
       while (l <= r)
       {
           int m = (l + r) / 2;
           if (check(m, arr, p, q))
           {
               ans = m;
               r = m - 1;
           }
           else
               l = m + 1;
       }

       cout << ans << "\n";
   }
   ```

    </details>

3. You are given $n$ base strings. Then you are $m$ strings as queries. For each query, you need to determine if there exists atleast one string from the provided $n$ strings such that the following conditions hold:

   - The length of the query string is equal to the length of the base string.
   - The query string differs from the base string in exactly one position.

   Constraints:

   - $1 \leq n, m \leq 3 \cdot 10^3$
   - $1 \leq |base[i]|, |query[i]| \leq 10^3$

    <details>
    <summary>Solution</summary>

   We will make use of string hashing to solve this problem.

   ```cpp showLineNumbers
   class Hasher
   {
   public:
       long long p;
       long long mod;
       vector<long long> pow;

       Hasher(int p, long long mod, int maxLen) : p(p), mod(mod)
       {
           pow.resize(maxLen + 1);
           pow[0] = 1;
           for (int i = 1; i <= maxLen; i++)
               pow[i] = (pow[i - 1] * p) % mod;
       }

       long long getHash(string &s)
       {
           long long hash = 0;
           for (int i = 0; i < s.size(); i++)
           {
               hash += (long long)(s[i] - 'a' + 1) * pow[i];
               hash %= mod;
           }

           return hash;
       }

       vector<long long> getHashPre(string &s)
       {
           int n = s.size();
           vector<long long> hash(n);
           for (int i = 0; i < n; i++)
           {
               hash[i] = (i == 0 ? 0 : hash[i - 1]) + (long long)(s[i] - 'a' + 1) * pow[i];
               hash[i] %= mod;
           }

           return hash;
       }

       vector<long long> getHashSuf(string &s)
       {
           int n = s.size();
           vector<long long> hash(n);
           for (int i = n - 1; i >= 0; i--)
           {
               hash[i] = (i == n - 1 ? 0 : hash[i + 1]) + (long long)(s[i] - 'a' + 1) * pow[i];
               hash[i] %= mod;
           }

           return hash;
       }
   };

   int main()
   {
       int n;
       cin >> n;

       int MAXLEN = 1001;

       Hasher h(31, 1e15 + 7, MAXLEN);
       vector<set<long long>> present(MAXLEN + 1);

       for (int i = 0; i < n; i++)
       {
           string s;
           cin >> s;
           present[s.size()].insert(h.getHash(s));
       }

       int m;
       cin >> m;
       while (m--)
       {
           string s;
           cin >> s;
           auto hashPre = h.getHashPre(s), hashSuf = h.getHashSuf(s);

           bool found = 0;
           for (int i = 0; i < s.size(); i++)
           {
               long long hash = (i == 0 ? 0 : hashPre[i - 1]) + (i == s.size() - 1 ? 0 : hashSuf[i + 1]);
               hash %= h.mod;
               for (char c = 'a'; c <= 'z'; c++)
               {
                   if (c == s[i])
                       continue;

                   long long newHash = hash + (long long)(c - 'a' + 1) * h.pow[i];
                   newHash %= h.mod;
                   if (present[s.size()].find(newHash) != present[s.size()].end())
                   {
                       found = 1;
                       break;
                   }
               }

               if (found)
                   break;
           }

           cout << (found ? "YES" : "NO") << "\n";
       }
   }
   ```

    </details>

4. [Building a Fence](https://codeforces.com/problemset/problem/1469/C)

---

# Seimens

## Other Campus Questions

1. Bob developed a search game where he stores $N$ special sequences in a database. The sequences are stored in an array of strings called "games" and each sequence is of size $M$. Afterwards, Bob asks a bot $Q$ queries. When a query is made, the bot searches the database for any previously stored games. A special sequence is provided in each query. The special sequence is written as $a$ where $a_1, a_2, ... a_k$ the initial sequence and the terms $a_{k+1}, a_{k+2}, .... a_m$ are all $-1$ and must be ignored when processing the input. The bot's task is to find the number of games stored in the database that have the provided sequence as a prefix.

   Constraints:

   - $1 \leq n, m \leq 10^3$
   - $1 \leq q \leq 5 \cdot 10^3$
   - $1 \leq games[i] \leq 200$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   class Node
   {
   public:
       vector<int> ch;
       int cnt;

       Node()
       {
           ch.assign(201, -1);
           cnt = 0;
       }
   };

   class Trie
   {
       int root;
       vector<Node> nodes;

   public:
       Trie()
       {
           nodes.push_back(Node());
           root = 0;
       }

       void add(vector<int> &arr)
       {
           int r = root;
           for (int nxt : arr)
           {
               if (nxt == -1)
                   return;

               int u = nodes[r].ch[nxt];
               if (u == -1)
               {
                   u = nodes.size();
                   nodes.push_back(Node());
                   nodes[r].ch[nxt] = u;
               }

               r = u;
               nodes[r].cnt++;
           }
       }

       int get(vector<int> &arr)
       {
           int r = root;
           for (int nxt : arr)
           {
               if (nxt == -1)
                   return nodes[r].cnt;

               int u = nodes[r].ch[nxt];
               if (u == -1)
                   return 0;
               r = u;
           }

           return nodes[r].cnt;
       }
   };

   int main()
   {
       int n, m;
       cin >> n >> m;

       Trie trie;
       for (int i = 0; i < n; i++)
       {
           vector<int> arr(m);
           for (int j = 0; j < m; j++)
               cin >> arr[j];
           trie.add(arr);
       }

       int q;
       cin >> q;
       while (q--)
       {
           vector<int> arr(m);
           for (int i = 0; i < m; i++)
               cin >> arr[i];
           cout << trie.get(arr) << endl;
       }
   }
   ```

    </details>

2. Two players, Player $1$ and Player $2$, are playing a game on a $2D$ board. The board has an origin cell at $(0, 0)$ and extends infinitely in positive coordinates. There are $N$ stones placed on the board, each located in a cell $(X, Y)$. Each player can move a stone from it's current position $(a, b)$ to a new cell $(a - p, b)$ or $(a, b - p)$ (they can't be placed on negative coordinates). The only requirement is that $p$ must be a prime number, and the new cell has to be within the board's valid range. If a player cannot move any stone, they lose the game.

   Both players are strategic in their moves, and Player $1$ goes first. Which player wins the game? If it's Player $1$, print `A`, otherwise, print `B`.

   Constraints:

   - $1 \leq t \leq 10$
   - $1 \leq n \leq 10^5$
   - $0 \leq X, Y \leq 200$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   vector<int> primes;
   vector<vector<int>> g;

   int getGrundy(int x, int y)
   {
       if (g[x][y] != -1)
           return g[x][y];

       set<int> s;
       for (int p : primes)
       {
           if (p > x && p > y)
               break;
           if (p <= x)
               s.insert(getGrundy(x - p, y));
           if (p <= y)
               s.insert(getGrundy(x, y - p));
       }

       int mex = 0;
       while (s.find(mex) != s.end())
           mex++;
       return g[x][y] = mex;
   }

   void solve()
   {
       int n;
       cin >> n;

       int xor_val = 0;
       for (int i = 0; i < n; i++)
       {
           int x, y;
           cin >> x >> y;
           xor_val ^= getGrundy(x, y);
       }

       cout << (xor_val ? "A" : "B") << endl;
   }

   int main()
   {
       int t;
       cin >> t;

       // Calulate primes
       for (int i = 2; i <= 199; i++)
       {
           int j = 2;
           bool isPrime = 1;
           for (int k = 2; k * k <= i; k++)
               if (i % k == 0)
               {
                   isPrime = 0;
                   break;
               }
           if (isPrime)
               primes.push_back(i);
       }

       // Initiliase grundy values
       g.assign(201, vector<int>(201, -1));

       while (t--)
           solve();
   }
   ```

    </details>

3. Alice and Bob have integers represented by arrays $A$ and $B$ respectively of length $n$ each. For some integer value they want to achieve the sum $\sum_{i = 0}^{i = n - 1} A[i] \cdot B[i]$ on their respective array to be at most $K$. Both are allowed to do some operations. In a single operation, choose any index element $x$ and replace it with $floor(x/2)$. Determine who can achieve the sum at most $K$ in a minimum number of operations. Print `Alice` if she can achieve the required sum in less number of operations than Bob, or print `Bob` if he can achieve the required sum in less number of operations than Alice. Print `Tie` in the case of a tie.

   - If Alice starts doing operations, Bob waits for her to finish, and vice versa.
   - Both Alice and Bob start with the original array $A$ and array $B$ in their respective turn.
   - $0$ based indexing is followed.

   Constraints:

   - $1 \leq t \leq 10$
   - $1 \leq n \leq 10^5$
   - $1 \leq A[i], B[i] \leq 10^6$
   - $1 \leq k \leq 10^{18}$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   vector<long long> reduce(vector<long long> arr, vector<long long> &b, int ops)
   {
       priority_queue<pair<long long, int>> pq;
       for (int i = 0; i < arr.size(); i++)
           pq.push({arr[i] * b[i] - (arr[i] / 2) * b[i] , i});

       while (ops-- && !pq.empty())
       {
           auto [_, idx] = pq.top();
           pq.pop();
           arr[idx] /= 2;

           long long nxt = arr[idx] * b[idx];
           if (nxt)
               pq.push({nxt - (arr[idx] / 2) * b[idx], idx});
       }

       return arr;
   }

   int getOps(vector<long long> &a, vector<long long> &b, long long mx)
   {
       int n = a.size();
       int l = 0, r = 24 * n;
       int ans = -1;

       while (l <= r)
       {
           int m = (l + r) / 2;

           auto arr = reduce(a, b, m);
           long long score = 0;
           for (int i = 0; i < n; i++)
           {
               score += arr[i] * b[i];
               if (score >= mx)
                   break;
           }

           if (score <= mx)
           {
               ans = m;
               r = m - 1;
           }
           else
               l = m + 1;
       }

       return ans;
   }

   int main()
   {
       int t;
       cin >> t;

       while (t--)
       {
           int n;
           cin >> n;

           vector<long long> a(n), b(n);
           for (int i = 0; i < n; i++)
               cin >> a[i];
           for (int i = 0; i < n; i++)
               cin >> b[i];

           long long mx;
           cin >> mx;

           int op1 = getOps(a, b, mx), op2 = getOps(b, a, mx);
           if (op1 < op2)
               cout << "Alice\n";
           else if (op1 > op2)
               cout << "Bob\n";
           else
               cout << "Tie\n";
       }
   }
   ```

    </details>

## Online Assessment Questions

There were $4$ sections in the test and each section had it's own time limit of approximately $20$ minutes. The sections were as follows:

1. Mental Ability & Aptitude:

   - 20 Questions in 20 minutes.
   - Typical questions on probability, permutations, combinations, and series that required a good amount of calculations.

2. Digital Logic

   - 16 Questions in 25 minutes.
   - Topics like Verilog, KMap, Boolean Algebra, Multiplexers, Decoders and Number Representation were covered.

3. Software Engineering

   - 16 Questions in 20 minutes.
   - A lot of questions were based on C++ and OOPS.
   - Most of the questions were based on guessing the output or the error in the code.

4. Coding
   - 2 Questions in 20 minutes.
   - You are given a graph with $n$ nodes and $m$ edges. You need to find the number of pairs of nodes in the graph such that the two nodes do not belong to the same connected component.
   - You are given an integer array of even length. The rank of the biggest element of the array is $1$, the rank of the second biggest element is $2$, and so on. You need to find the absolute difference between the sum of the ranks of the elements in the first half of the array and the sum of the ranks of the elements in the second half of the array.

---

# Walmart

## Other Campus Questions

1.  You are given a box of crayons with different colors represented by different alphabets. In one operation, you can remove several continuous crayons of the same color. You may perform this operation several times until the box is empty. Each time you can choose the crayon set, they must be continuous and of the same colors (the set of $x$ crayons, $x \geq 1$). After removing them, you will get $x \cdot x$ points. You are given an integer $N$ where $N$ denotes the total number of crayons in the box. You are also given an array colors denoting the $N$ colors in the box where each color is represented by an English alphabet. Return the maximum points, you can get in the given scenario.

    Constraints:

    - $1 \leq n \leq 60$

    <details>
    <summary>Solution</summary>

    The problem can be solved using dynamic programming. Let $dp[i][j][cnt]$ denotes the maximum score that we can achieve by removing the crayons from $i$ to $j$ and we have $cnt$ continuous crayons of the same color as the $i^{th}$ crayon. Refer to the solution to see the transition. Careful handling of states is needed to avoid wrong memoization. The time complexity of the solution is $O(n^4)$.

    ```cpp showLineNumbers
    using vi = vector<int>;
    using vvi = vector<vi>;

    int solve(int l, int r, int cnt, vector<vvi> &dp, vector<char> &arr)
    {
        if (l > r)
            return 0;
        if (dp[l][r][cnt] != -1)
            return dp[l][r][cnt];

        int orgL = l, orgCnt = cnt;
        while (l + 1 <= r && arr[l + 1] == arr[l])
        {
            ++l;
            ++cnt;
        }

        int score = cnt * cnt + solve(l + 1, r, 1, dp, arr);
        for (int j = l + 1; j <= r; j++)
            if (arr[l] == arr[j])
            {
                int newScore = solve(l + 1, j - 1, 1, dp, arr) + solve(j, r, cnt + 1, dp, arr);
                score = max(score, newScore);
            }

        return dp[orgL][r][orgCnt] = score;
    }

    int main()
    {
        int n;
        cin >> n;

        vector<char> arr(n);
        for (int i = 0; i < n; i++)
            cin >> arr[i];

        if (n == 1) {
            cout << 1 << "\n";
            return 0;
        }

        vector<vvi> dp(n, vvi(n, vi(n, -1)));
        cout << solve(0, n - 1, 1, dp, arr);

        return 0;
    }
    ```

    </details>

2.  You are given an array $arr$ of size $N$. The power of the array represents the sum of the values that you obtain after performing the described operations for $N$ times. Your task is to delete the array by performing the following operations in exactly $N$ turns.

    - For any $turn_i$; where $1 \leq i \leq N$, delete either of the end (first or last elements of remaining array).
    - Before deleting that element (let's say at index $K$), it contributes to the sum of the values as $arr[K] \cdot turn_i + SV_i$ to the power of the array. Here $turn_i$, represents the number of turn in which you are performing the operation, and $SV_i$ represents the value of the maximum element that is present in the remaining array before the turn is performed.

    You are required to perform this in such a way that you maximize the value of the power of the array. Print the maximum value of the power that can be obtained after the array is completely deleted.

    Constraints:

    - $1 \leq n \leq 10^3$
    - $1 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    ```cpp showLineNumbers
    void solve()
    {
        int n;
        cin >> n;
        vector<long long> arr(n);
        for (int i = 0; i < n; i++)
            cin >> arr[i];

        vector<vector<long long>> mx(n, vector<long long>(n));
        for (int i = 0; i < n; i++)
        {
            mx[i][i] = arr[i];
            for (int j = i + 1; j < n; j++)
                mx[i][j] = max(mx[i][j - 1], arr[j]);
        }

        vector<vector<long long>> dp(n, vector<long long>(n, -1));

        function<long long(int, int)> get = [&](int f, int b) -> long long
        {
            long long turn = f + b + 1;
            if (turn > n)
                return 0;
            if (dp[f][b] != -1)
                return dp[f][b];

            long long ans = arr[f] * turn + mx[f][n - 1 - b] + get(f + 1, b);
            ans = max(arr[n - b - 1] * turn + mx[f][n - 1 - b] + get(f, b + 1), ans);

            return dp[f][b] = ans;
        };

        cout << get(0, 0) <<d "\n";
    }

    int main()
    {
        int t;
        cin >> t;
        while (t--)
            solve();
        return 0;
    }
    ```

    </details>

3.  Count the sum of XOR values of all the subarrays of the provided array $arr$ with length $n$. Provide the sum of the XOR values modulo $10^9 + 7$.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    ```cpp showLineNumbers
    int main() {
        int n;
        cin >> n;

        vector<int> arr(n);
        for (int i = 0; i < n; i++)
            cin >> arr[i];


        long long MOD = 1e9 + 7;
        long long ans = 0;

        for (int bit = 0; bit < 31; bit++) {
            // cntOdd -> Count of subarrays with odd number of 1's starting at index 0
            // odd -> Current count of 1's in the subarray
            int cntOdd = 0, odd = 0;
            long long cnt = 0;

            for (int i = 0; i < n; i++) {
                if (arr[i] & (1 << bit))
                    odd ^= 1;
                if (odd)
                    cntOdd++;
            }

            for (int i = 0; i < n; i++) {
                cnt += cntOdd;
                if (arr[i] & (1 << bit))
                    cntOdd = n - i - cntOdd;
            }

            cnt %= MOD;
            ans += (1LL << bit) * cnt;
            ans %= MOD;
        }

        cout << ans << "\n";
    }
    ```

    </details>

4.  You are given an array $arr$ of length $n$. What is the maximum sum of XOR values of two non-overlapping subarrays of $arr$?

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq arr[i] \leq 10^9$

    <details>
    <summary>Solution</summary>

    ```cpp showLineNumbers
    class Node {
    public:
        Node *ch[2];
        Node() { ch[0] = ch[1] = nullptr; }
    };

    class Trie {
    public:
        Node *root;

        Trie() { root = new Node(); }

        void add(int x) {
            Node *cur = root;
            for (int i = 30; i >= 0; i--) {
                int bit = (x >> i) & 1;
                if (!cur->ch[bit])
                    cur->ch[bit] = new Node();
                cur = cur->ch[bit];
            }
        }

        int getMaxXor(int v) {
            Node *cur = root;
            int ans = 0;
            for (int i = 30; i >= 0; i--) {
                int bit = (v >> i) & 1;
                if (cur->ch[!bit]) {
                    ans += (1 << i);
                    cur = cur->ch[!bit];
                } else
                    cur = cur->ch[bit];
            }

            return ans;
        }
    };

    int main() {
        int n;
        cin >> n;

        vector<int> arr(n);
        for (int i = 0; i < n; i++)
            cin >> arr[i];

        vector<int> pref(n);
        Trie t1;
        t1.add(0);
        int cur = 0;
        for (int i = 0; i < n; i++) {
            cur ^= arr[i];
            pref[i] = t1.getMaxXor(cur);
            t1.add(cur);
        }

        vector<int> suff(n);
        Trie t2;
        t2.add(0);
        cur = 0;
        for (int i = n - 1; i >= 0; i--) {
            cur ^= arr[i];
            suff[i] = t2.getMaxXor(cur);
            t2.add(cur);
        }

        int ans = 0;
        for (int i = 0; i < n - 1; i++)
            ans = max(ans, pref[i] + suff[i + 1]);
        cout << ans << "\n";

        return 0;
    }
    ```

    </details>

## Online Assessment Questions

1.  Shilpa wants to go to a movie with her friends. There are $N$ friends including Svipa. $M$ different offers are available. A different number of tickets are sold at different group booking rates. For example, a single ticket may cost $10$ rupees, two tickets may cost $40$ rupees together. The ticket seller always introduces $M$ offers which are always equal to the number of friends $N$. Determine how can he do it given $M$ and the $M$ costs for the tickets together, $k_1, k_2, ..., k_N$. Ticket seller would like to maximise his profit.

    Constraints:

    - $1 \leq n \leq 10^3$
    - $m = n$
    - $1 \leq k_i \leq 10^9$

    <details>
    <summary>Solution</summary>

    ```cpp showLineNumbers
    int main()
    {
        int n;
        cin >> n;

        vector<long long> cost(n);
        for (int i = 0; i < n; i++)
            cin >> cost[i];

        vector<long long> dp(n + 1, 0);
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= i; j++)
                dp[i] = max(dp[i], dp[i - j] + cost[j - 1]);

        cout << dp[n] << "\n";
    }
    ```

    </details>

2.  After delivering a lecture on rainwater harvesting on Environment day, the Director of the Institute asks students to construct a pit that allows rainwater harvesting in the backyard. The recharge pit is made up of $N \times M$ cells, where $N$ is the number of departments and $M$ is the number of students from each department. Each student has to raise or lower the soil level in the cell allotted to him/her to harvest rainwater. The students work as a team and decide the level of each coll considering the slope of the land, porosity, and texture of the soil. After completing the work, the final layout is represented as integers where $G[i][j]$ represents the ground level at the cell $(i, j)$. Negative values represents dug up areas and positive values represents raised areas. Water can be trapped in a cell only if all the four sides of a cell are above the cell level. You are given the elevation map which shows the level of each cell. Write a program to find the quantity of water that can be trapped in the recharge pit.

    Constraints:

    - $1 \leq n, m \leq 10^3$
    - $-10^3 \leq G[i][j] \leq 10^3$

    <details>
    <summary>Solution</summary>

    ```cpp showLineNumbers
    int trapRainWater(vector<vector<int>> &g)
    {
        int Y = g.size(), X = g[0].size();

        int ans = 0;

        vector<vector<int>> vis(Y, vector<int>(X, 0));
        priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> pq;

        // Handle the boundary cells
        for (int i = 0; i < Y; i++)
            for (int j = 0; j < X; j++)
                if (i == 0 || i == Y - 1 || j == 0 || j == X - 1)
                {
                    // If dug up, then add to the answer and set them to ground level
                    if (g[i][j] < 0)
                    {
                        ans += -g[i][j];
                        g[i][j] = 0;
                    }
                    pq.push({g[i][j], i, j});
                    vis[i][j] = 1;
                }

        int dx[] = {0, 0, 1, -1};
        int dy[] = {1, -1, 0, 0};

        while (!pq.empty())
        {
            auto t = pq.top();
            pq.pop();

            int h = t[0], x = t[1], y = t[2];
            for (int k = 0; k < 4; k++)
            {
                int nx = x + dx[k], ny = y + dy[k];
                if (nx >= 0 && nx < Y && ny >= 0 && ny < X && !vis[nx][ny])
                {
                    vis[nx][ny] = 1;
                    // If the same is lower that current level,
                    // we can store the water and update the height
                    if (g[nx][ny] < h)
                    {
                        ans += h - g[nx][ny];
                        g[nx][ny] = h;
                    }

                    // Always push to the pq if not visited,
                    // irrespective of the height
                    pq.push({g[nx][ny], nx, ny});
                }
            }
        }

        return ans;
    }

    int main()
    {
        int n, m;
        cin >> n >> m;

        vector<vector<int>> g(n, vector<int>(m));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++)
                cin >> g[i][j];

        cout << trapRainWater(g) << "\n";
    }
    ```

    </details>

---

# Winzo

## Online Assessment Questions

1. You are given two strings $s_1$ and $s_2$ representing the two deck of cards of length $52$ each. Two players are playing the game. The game is started by player $1$. The player in his turn can choose either of the string, and take one card either from the beginning or the end of the string, and add the score associated with the same to his score. If both of the play optimally, what will the difference in the score of player $1$ and player $2$ finally.

   - The score associated with Ace is $1$, King is $13$, Queen is $12$, Jack is $11$, and the rest of the cards have the same score as their face value.
   - Ace card is represented by `A`, $10$ as `T`, King card is represented by `K`, Queen card is represented by `Q`, and Jack card is represented by `J`.

2. You are given an array of length $n$. For each pair of indexes $(i, j)$, you need to add $arr[j] - arr[i]$ to the score if $j - i$ is positive and a prime number. Calculate the score for the given array.

   Constraints:

   - $1 \leq n \leq 10^3$
   - $1 \leq arr[i] \leq 10^3$

3. You are given a matrix of size $n \times 3$. You need to go from the first row to the last row. You cannot step into the same column for two consecutive rows. Find the maximum sum that can be obtained.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq arr[i][j] \leq 10^9$

---
