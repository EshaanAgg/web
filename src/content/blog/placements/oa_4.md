---
title: "Placements '24: Assessments [Part 4]"
description: A brief of all the online assessments that I witnessed during the season of 2024.
pubDate: 2024-10-08
updateDate: 2024-10-17
pinned: true
requireLatex: true
tags: ["placements", "2024"]
---

This is the final part of the series on online assessments that I witnessed during the season of 2024. The previous parts can be found [here](../oa_1/), [here](../oa_2/) and [here](../oa_3/).

- [ThoughtSpot](#thoughtspot)

---

# ThoughtSpot

## Other Campus Questions

1. [Count the Number of Palindromic Paths in a Tree](https://leetcode.com/problems/count-paths-that-can-form-a-palindrome-in-a-tree/description/)

   <details>
   <summary>Solution</summary>

   ```cpp showLineNumbers
   class Solution {
   public:
       long long countPalindromePaths(vector<int>& parent, string s) {
           int n = parent.size();
           vector<vector<pair<int, char>>> g(n);
           for (int i = 1; i < n; i++)
               g[parent[i]].push_back({i, s[i]});

           map<int, long long> cnt;
           function<void(int, int)> dfs = [&](int u, int m) -> void {
               cnt[m]++;
               for (auto [v, c]: g[u]) {
                   int newMask = m ^ (1 << (c - 'a'));
                   dfs(v, newMask);
               }
           };
           dfs(0, 0);

           long long ans = 0;
           for (auto [m, f]: cnt) {
               ans += f * (f - 1);
               for (int i = 0; i < 26; i++)
                   if (cnt.find(m ^ (1 << i)) != cnt.end())
                       ans += f * cnt[m ^ (1 << i)];
           }

           return ans / 2;
       }
   };
   ```

   </details>

2. Determine the number of integers in the range $(l, r)$ such that they have no repeating digits. Each test file has $q$ queries.

   Constraints:

   - $1 \leq q \leq 10^5$
   - $1 \leq l, r \leq 10^6$

3. Given two integers $(l, r)$, determine the number of integers in the range $(l, r)$ such that they are a power number. A power number $x$ is a number that can be expressed as $x = a^p + b^q$ where $a, b, p, q$ are positive integers and $p, q > 1$ and $a, b > 0$.

   Constraints:

   - $1 \leq l, r \leq 5 \cdot 10^6$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       long long l, r;
       cin >> l >> r;

       vector<long long> isPow(r + 1, 0);
       isPow[0] = isPow[1] = 1;
       for (long long i = 2; i * i <= r; i++)
       {
           long long j = i * i;
           while (j <= r)
           {
               isPow[j] = 1;
               j *= i;
           }
       }

       vector<int> pow;
       for (int i = 0; i <= r; i++)
           if (isPow[i])
               pow.push_back(i);

       vector<long long> isGood(r + 1, 0);
       for (int i = 0; i < pow.size(); i++)
           for (int j = i; j < pow.size(); j++)
           {
               if (pow[i] + pow[j] > r)
                   break;
               isGood[pow[i] + pow[j]] = 1;
           }

       int cnt = 0;
       for (int i = l; i <= r; i++)
           cnt += isGood[i];
       cout << cnt << "\n";
   }
   ```

    </details>

4. [Minimum Swaps to Make the String Balanced](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/description/)

   <details>
   <summary>Solution</summary>

   ```cpp showLineNumbers
   class Solution {
   public:
       int minSwaps(string s) {
           int n = s.size();
           int j = n - 1, bal = 0, ans = 0;

           for (int i = 0; i < n; i++) {
               if (s[i] == '[')
                   bal++;
               else if (bal > 0)
                   bal--;
               else {
                   while (s[j] != '[')
                       j--;
                   swap(s[i], s[j]);
                   ans++;
                   bal++;
               }
           }

           return ans;
       }
   };
   ```

   </details>

5. The office manager of a healthcare billing company has been charged with eliminating food waste in the office lounge. The lounge has packets of coffee creamer, each with an expiry date. The creamer must be used no later than that day. The manager also has the option to order additional coffee creamer from a grocery store, each with varying expiry dates. Given a fixed daily demand for creamer, find the maximum amount of additional creamer the manager can order without waste.

   Example:

   ```plaintext
   onHand[0, 2, 2]
   supplier = [2, 0, 0]
   demand = 2

   The lounge has 3 units on hand expiring in [0,2,2] days, respectively.
   The store has an additional 3 units available, expiring in [2,0,0] days.
   Employees use at most 2 units of coffee creamer per day.
   The manager can order a maximum of 2 units: the one expiring in 2 days, and one in 0 days.
   The creamer can then be used as follows:
        Day 0 -> onHand[0] and supplier[1]
        Day 1 -> onHand[1] and supplier[0]
        Day 2 -> onHand[2]
   ```

   Constraints:

   - $1 \leq n, m \leq 10^5$
   - $1 \leq demand \leq 10^5$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       int n;
       cin >> n;
       map<int, int> inHand;
       for (int i = 0; i < n; i++)
       {
           int x;
           cin >> x;
           inHand[x]++;
       }

       int m;
       cin >> m;
       map<int, int> add;
       for (int i = 0; i < m; i++)
       {
           int x;
           cin >> x;
           add[x]++;
       }

       int dem;
       cin >> dem;

       auto check = [&](int units) -> bool
       {
           map<int, int> have = inHand;

           for (auto itr = add.rbegin(); itr != add.rend(); itr++)
           {
               auto &[exp, cnt] = *itr;
               int qty = min(units, cnt);
               have[exp] += qty;
               units -= qty;
               if (units == 0)
                   break;
           }

           int day = 0, need = dem;
           for (auto itr = have.begin(); itr != have.end();)
           {
               auto [exp, cnt] = *itr;
               if (exp < day)
                   return 0;

               int qty = min(cnt, need);
               need -= qty;
               if (need == 0)
               {
                   day++;
                   need = dem;
               }

               if (cnt == qty)
                   itr++;
               else
                   (*itr).second -= qty;
           }

           return 1;
       };

       int l = 0, r = m;
       int ans = -1;
       while (l <= r)
       {
           int mid = (l + r) / 2;
           if (check(mid))
           {
               ans = mid;
               l = mid + 1;
           }
           else
               r = mid - 1;
       }

       cout << ans << "\n";
   }
   ```

    </details>

6. There are in processes to be executed, and the $i^th$ process has a size of $processSize[i]$. Also, there are $m$ processors of different size capacity. The capacity of the processor is $capacity[i]$. A processor can process a task of size less than or equal to it's capacity in $1$ second, but it can not execute processes whose size is greater than it's capacity. A processor can execute multiple processes one after the other, but needs to pause for $1$ second after completing it's current one. Multiple processors can work on different processes simultaneously. Find the minimum time to execute all the processes or return $-1$ if there is no way to execute all the processes.

   Constraints:

   - $1 \leq n, m \leq 10^5$
   - $1 \leq processSize[i], capacity[i] \leq 10^9$

   <details>
   <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       int n;
       cin >> n;
       vector<int> p(n);
       for (int i = 0; i < n; i++)
           cin >> p[i];
       sort(p.begin(), p.end(), greater<int>());

       int m;
       cin >> m;
       vector<int> cap(m);
       for (int i = 0; i < m; i++)
           cin >> cap[i];
       sort(cap.begin(), cap.end(), greater<int>());

       auto check = [&](int mxTime) -> bool
       {
           int canProcess = (mxTime + 1) / 2;
           int toProcess = 0;

           for (int i = 0; i < m; i++)
           {
               int done = 0;
               while (toProcess < n && done < canProcess && p[toProcess] <= cap[i])
               {
                   done++;
                   toProcess++;
               }
           }

           return toProcess == n;
       };

       int l = 0, r = 1e9;
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

       cout << ans << "\n";
   }
   ```

   </details>

7. Two strings are given, $word$ and $substr$. Some of the characters in word are a question mark (`?`). Find the lexicographically smallest string that can be obtained by replacing `?` characters such that $substr$ appears at least once. If it is not possible to do so, return "-1".

   Constraints:

   - $1 \leq |word|, |substr| \leq 10^3$
   - $word$ and $substr$ contain only lowercase English letters and `?`

   <details>
   <summary>Solution</summary>

   ```cpp showLineNumbers
   int main()
   {
       string s, p;
       cin >> s >> p;
       int n = s.size(), m = p.size();

       vector<vector<int>> dp(n, vector<int>(m, -1));

       function<bool(int, int)> poss = [&](int idx, int matIdx) -> bool
       {
           if (matIdx == m)
               return 1;
           if (idx == n)
               return 0;
           if (dp[idx][matIdx] != -1)
               return dp[idx][matIdx];

           if (s[idx] != '?')
               return dp[idx][matIdx] = poss(idx + 1, s[idx] == p[matIdx] ? matIdx + 1 : 0);

           // Try replacing with 'a'
           if (poss(idx + 1, p[0] == 'a'))
           {
               s[idx] = 'a';
               return dp[idx][matIdx] = 1;
           }

           // Try replacing with the character from pattern
           if (poss(idx + 1, matIdx + 1))
           {
               s[idx] = p[matIdx];
               return dp[idx][matIdx] = 1;
           }

           return dp[idx][matIdx] = 0;
       };

       if (!poss(0, 0))
       {
           cout << "-1";
           return 0;
       }

       for (auto &ch : s)
           if (ch == '?')
               ch = 'a';
       cout << s << "\n";

       return 0;
   }
   ```

   </details>

   Additional Follow Up: Can you solve this problem in the same constraints if the same was asked for the pattern to appear as a subsequence in the string?

8. You are given a tree with $n$ nodes. Each node has a value denoted by $arr[i]$. Consider all the simple paths in the tree, and return the maximum possible sum of the values of the nodes lying on any path on the tree.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $-10^9 \leq arr[i] \leq 10^9$

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

       vector<vector<int>> g(n);
       for (int i = 0; i < n - 1; i++)
       {
           int u, v;
           cin >> u >> v;
           g[u - 1].push_back(v - 1);
           g[v - 1].push_back(u - 1);
       }

       vector<long long> mxDown(n);

       long long ans = -1e18;
       function<void(int, int)> dfs = [&](int u, int p) -> void
       {
           long long mx1 = 0, mx2 = 0;

           for (int v : g[u])
           {
               if (v == p)
                   continue;
               dfs(v, u);
               if (mxDown[v] >= mx1)
               {
                   mx2 = mx1;
                   mx1 = mxDown[v];
               }
               else if (mxDown[v] > mx2)
                   mx2 = mxDown[v];
           }

           mxDown[u] = arr[u] + mx1;
           ans = max(ans, mx1 + mx2 + arr[u]);
       };
       dfs(0, -1);

       cout << ans << "\n";
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

9. There is a tree with $n$ nodes. The tree is rooted at node with number $0$. As usually in computer science, the tree grows upside down comparing to trees existing in nature. Apples grow on nodes of this tree. Some of these apples are underhydrated, some are overhydrated, and others are neither. You know that for each overhydrated apple you'll get $a$ cents penalty and for every underhydrated you'll get $b$ cents penalty. Now, you want to pour water on exactly one node of the tree. When you pour water on node all apples that are in node's subtree, i.e., itself and all descendants of the node will be hydrated and in consequence, each hydrated apple that was almost overhydrated becomes overhydrated. Moreover, every apple in the whole tree that was almost underhydrated and no water was poured on it gets underhydrated. Calculate the minimum total penalty you can get from pouring water on exactly one node of the tree.

   You are given:

   - An integer array, $par$ of size $n$ where $par[i]$ denotes the parent of the $i^{th}$ node.
   - An integer array, $arr$ of size $n$ where $arr[i]$, denotes the level of the water in the apple on node. It's either $-1$, $0$ or $1$, where $-1$ stands for almost underhydrated, $0$ stands for neither and $1$ stands for almost overhydrated.
   - Integers $a$ and $b$ denoting the penalty for overhydrated and underhydrated apples respectively.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq a, b \leq 10^9$

    <details>
    <summary>Solution</summary>

   ```cpp showLineNumbers
   int solve(vector<int> &par, vector<int> &arr, int a, int b) {
       int n = par.size();

       vector<vector<int>> g(n);
       for (int i = 1; i < n; i++) {
           g[par[i]].push_back(i);
       }

       vector<vector<int>> cnt(n, vector<int>(3));

       function<void(int, int)> dfs = [&](int u, int p) -> void {
           cnt[u][arr[u] + 1]++;
           for (int v : g[u]) {
               if (v == p) continue;
               dfs(v, u);
               for (int i = 0; i < 3; i++)
                   cnt[u][i] += cnt[v][i];
           }
       };
       dfs(0, -1);

       int ans = 1e9;
       int totUnder = cnt[0][0];
       for (int i = 0; i < n; i++) {
           int over = cnt[i][2];
           int under = totUnder - cnt[i][0];
           ans = min(ans, over * a + under * b);
       }

       return ans;
   }
   ```

10. You are given $n$ items, each characterized by three values $(ty, w, v)$, where $ty$ is the type number of the item, $w$ is the weight of the item and $v$ is the value of the item. You can carry atmost a weight of $k$. Determine the maximum value of the items you can carry subject to the condition that you can not take two items of the same type together.

    Constraints:

    - $1 \leq n, k, ty, w, v \leq 10^3$

    <details>
    <summary>Solution</summary>

    ```cpp showLineNumbers
    int main()
    {
        int n;
        cin >> n;

        vector<vector<int>> arr(n, vector<int>(3));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < 3; j++)
                cin >> arr[i][j];

        sort(arr.begin(), arr.end());
        vector<int> nxt(n);
        for (int i = n - 1; i >= 0; i--)
        {
            int end = i + 1;
            while (i - 1 >= 0 && arr[i - 1][0] == arr[i][0])
                i--;
            for (int j = i; j < end; j++)
                nxt[j] = end;
        }

        int k;
        cin >> k;

        vector<vector<int>> dp(n, vector<int>(k + 1, -1));

        function<int(int, int)> get = [&](int idx, int wt) -> int
        {
            if (idx == n)
                return 0;
            if (dp[idx][wt] != -1)
                return dp[idx][wt];

            int ans = get(idx + 1, wt);
            if (arr[idx][1] + wt <= k)
            {
                int nxtIdx = nxt[idx];
                ans = max(ans, arr[idx][2] + get(nxtIdx, arr[idx][1] + wt));
            }

            return dp[idx][wt] = ans;
        };

        cout << get(0, 0) << "\n";
    }
    ```

    </details>

## Online Assessment Questions

1. [Avoid Straight Line](https://atcoder.jp/contests/abc312/tasks/abc312_g)

   <details>
   <summary>Solution</summary>

   ```cpp
   #include <bits/stdc++.h>
   using namespace std;

   #define IOS                       \
       ios_base::sync_with_stdio(0); \
       cin.tie(0);                   \
       cout.tie(0)
   #define INF 1e9
   #define EPS 1e-9

   #define pb push_back

   #define ll long long int
   #define dbl long double
   #define vi vector<int>
   #define vvi vector<vector<int>>
   #define vll vector<long long int>
   #define vvll vector<vector<long long int>>

   #define pii pair<int, int>
   #define pll pair<long long int, long long int>
   #define vpii vector<pair<int, int>>
   #define vvpii vector<vector<pair<int, int>>>
   #define vpll vector<pair<long long int, long long int>>

   #define range(x, s, n) for (int x = s; x < n; ++x)
   #define all(a) a.begin(), a.end()

   void solution();

   const int MOD = 1e9 + 7;

   int main()
   {
       IOS;
       int TEST_CASES;
       TEST_CASES = 1;
       while (TEST_CASES--)
           solution();
       return 0;
   }

   void solution()
   {
       int n;
       cin >> n;

       vvi g(n);
       range(i, 0, n - 1)
       {
           int u, v;
           cin >> u >> v;
           g[u - 1].pb(v - 1);
           g[v - 1].pb(u - 1);
       }

       vll sub(n);
       ll ans = 0;

       auto get = [](vll &a) -> ll
       {
           ll s1 = 0, s2 = 0, s3 = 0;
           for (auto a : a)
           {
               s3 += s2 * a;
               s2 += s1 * a;
               s1 += a;
           }
           return s3;
       };

       function<void(int, int)> dfs = [&](int u, int p) -> void
       {
           sub[u] = 1;

           vll comp;
           for (int v : g[u])
           {
               if (v == p)
                   continue;
               dfs(v, u);
               sub[u] += sub[v];
               comp.pb(sub[v]);
           }

           comp.pb(n - sub[u]);
           ans += get(comp);
       };
       dfs(0, -1);

       cout << ans << "\n";
   }
   ```

   </details>

2. You are given a weighted undirected tree of $n$ nodes. A pair of nodes $(x, y)$ can communicate via a third node $z$ if and only if the distance of $x$ and $z$ and the the distance of $y$ to $z$ are both divisible the by the given constant $w$. For each node, calculate the number of pairs of nodes that can communicate via it.

   Constraints:

   - $1 \leq n \leq 1000$
   - $1 \leq w \leq 10^4$

3. You need to implement a text editor. Intially the string on the screen is empty, and the cursor is at the $0^{th}$ position. Next the following type of queries would be made to the same:

   1. `insert s`: Insert the string $s$ at the current cursor position. The cursor moves to the end of the inserted string.
   2. `print x`: If the cursor is at the $m^th$ position, print the characters in the range $[m - x, m + x]$.
   3. `left x`: Move the cursor $x$ positions to the left.
   4. `right x`: Move the cursor $x$ positions to the right.
   5. `backscape x`: Delete the last $x$ characters from the screen with respect to the cursor position.
   6. `delete x`: Delete the next $x$ characters from the screen with respect to the cursor position.

   All the cursor positions may go out of bounds. You must handle them as any regular text editor would. It is given that the number of queries would be at most $5000$ and the length of the intermediate text on the screen would never exceed $125$ characters.

---
