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

---

# Deustche Bank

## Other Campus Questions

1. You are given a binary string $s$ of length $n$. What is the largest prime number whose binary representation can be formed by deleting some digits from the string $s$? The length of the string $s$ is at most $20$.

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
           if (s[i] == '0')
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

2. You are given a string $s$ of length $n$ containing only the characters $a$ and $b$. Find the lexographically smallest subsequence of $s$ of length $k$ with atleast $x$ $b$'s. Return an empty string if no such subsequence exits.

   Constraints:

   - $1 \leq n \leq 10^5$
   - $1 \leq k \leq n$
   - $0 \leq x \leq n$

3. You are given a grid of size $n \times m$ containg some free cells (marked as `.`) and some blocked cells (marked as `#`). You take $1$ minute to travel from one cell to the other. You can only move horizontally or vertically. You are given the coordinates of the starting cell and the ending cell. Find the minimum time required to reach the ending cell from the starting cell.

   Constraints:

   - $1 \leq n, m \leq 10^3$
   - $1 \leq x_1, y_1, x_2, y_2 \leq n$

---
