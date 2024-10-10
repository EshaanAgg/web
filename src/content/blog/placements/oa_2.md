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

- [Deustche Bank](#deustche-bank)
- [PACE Stock Broking](#pace-stock-broking)
- [HiLabs Technologies](#hilabs-technologies)

---

# Deustche Bank

## Other Campus Questions

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
            long long allSet = (1LL << (len + 1)) - 1;

            // 1 unset
            for (int i = 0; i < len; i++)
                validNumbers.insert(allSet ^ (1LL << i));

            // 2 unset
            for (int i = 0; i < len; i++)
                for (int j = i + 1; j < len; j++)
                    validNumbers.insert(allSet ^ (1LL << i) ^ (1LL << j));

            // 3 unset
            for (int i = 0; i < len; i++)
                for (int j = i + 1; j < len; j++)
                    for (int k = j + 1; k < len; k++)
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

5.  You are given a tree with $n$ vertices, and each vertice has a colour as $0$ or $1$. For a node, we define the beauty of the vertex as the number of paths in the subtree of the node that have different colours of the ending points. Find the beauty of each node in the tree when the tree is rooted at vertex $1$.

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

6.  Given a sequence of $n$ integers $(a_1, a_2, \ldots, a_n)$, you need to perform the following operation and return the obtained result.

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

7.  A function $S(x)$ is defined as the sum of all the divisors for the number $x$. The function $F(x)$ is defined as the sum of $S(y)$ for all the divisors $y$ of $x$. Given two numbers $l$ and $r$, find the sum of $F(x)$ for all the numbers in the range $[l, r]$ modulo $998244353$.

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

8.  Given an array of size $N$ containing integers, find the minimum possible sum of that can be formed be adding the elements in the array. You can perform the following operation at most once:

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

9.  Given an integer array $arr$ of integers of length $n$, find the largest possible value $x$ such that atleast $k$ elements of the array are divisible by the same.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq k \leq n$
    - $1 \leq arr[i] \leq 10^6$

    <details>
    <summary>Solution</summary>

    We can precompute all the divisors of all the numbers upto $10^6$ using the Sieve of Eratosthenes. Then, we can iterate over all the divisors of any number in the array, and check if it a valid divisor satifying the condition. Since a number till $10^6$ can have atmost $128$ divisors, this solution would work in $O(n \cdot 128 + A \log A)$ time where $A$ is $10^6$ for precomputation. We would need careful handling of the case when all the numbers are $0$, and a streamlined implementation to avoid TLE in a $1$ second time limit.

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
            bool allZero = true;

            for (int i = 0; i < n; i++)
            {
                int x;
                cin >> x;
                arr.push_back(x);
                if (x != 0)
                    allZero = false;
            }

            if (allZero)
            {
                cout << "1000000000\n";
                return;
            }

            int maxEle = -1;
            for (int ele : arr)
                for (int div : divisors[ele])
                {
                    cnt[div]++;
                    if (cnt[div] >= k)
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

10. You are given two integer arrays $A$ and $B$ of length $n$ consisiting of non-negative integers. You have to select $K$ numbers from $B$, and then take the bitwise OR of all the elements of $A$ one at a time with each of the selected elements. The score of this operation is the sum of the $n \cdot K$ bitwise OR operations. Find the minimum value of $K$ such that a score of atleast $M$ can be achieved.

    Constraints:

    - $1 \leq n \leq 10^5$
    - $1 \leq M \leq 10^9$
    - $0 \leq A[i], B[i] \leq 10^9$

11. [Increasing Frequency](https://codeforces.com/contest/1082/problem/E)

12. You are given three arrays $l$, $r$ and $a$, which represents that the $i^{th}$ client was making $a[i]$ requests to the server per second for the duration $[l[i], r[i]]$. Find the minimum requests per second that this server should be able to handle to server all the requests.

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

13. You are given the initial positions of Alice and Bob as $(x_1, y_1)$ and $(x_2, y_2)$. You are also given $n$ apples at the positions $(x_i, y_i)$. Alice and Bob need to collect all of the apples in the order they are given. The distance between the two points is the Manhattan distance. Find the minimum distance that Alice and Bob need to travel to collect all the apples.

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

2. For a bus going to Hackerland, there are infinite seats numbered from $1$ to $\inf$, and $n$ people are standing in a queue waiting to be seated. The $i^{th}$ person wants to be seated on the seat numbered $arr[i]$. The seats are allocated based on the following rules:

   - The seats are allocated in the sequence of the queue, i.e., the first person followed by the second person and so on.
   - If the seat required by the person in the front of the queue is empty, they are allocated that seat and removed from the queue.
   - If the seat required by the person in the front of the queue is occupied, the seat number required by them is incremented by $1$ and they are pushed to the end of the queue.

   Given an array $arr$ representing the seat numbers that the people in the queue want, find the final seat number allocated to each person in the queue.

3. A simple variation of [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/description/)

4. A simple variation of the [Job Scheduling Problem](https://leetcode.com/problems/maximum-profit-in-job-scheduling/description/)

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

3.  A compnay has $n$ servers, labelled from $1$ to $n$, all of which initally have no workload. $m$ requests are sent to the company's API, where the requests are distributed evenly between the servers. An even distribution ensures that the busiest server has the least possible load. Print which server would handle the request for each API rewuest.

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
