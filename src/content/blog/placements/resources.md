---
title: "Placements '24: Resources & Advice"
description: Collection of all the resources I used as all the advices that worked the best for me.
pubDate: 2024-12-01
updatedDate: 2024-12-03
tags: ["placements", "2024"]
hasBlogCard: false
draft: false
series:
  name: "placements"
  part: 2
---

## Competitive Programming & DSA

No suprise, this is the most important part that you need to focus on. Don't start at the last minute, and try to inculcate the habit of solving questions and discussing with your peers early.

- Give contests regularly! [Codeforces](https://codeforces.com/) is the best platform for upsolving as well as giving contests. Many companies known for difficult tests often give direct restatements of the problems from here. Codeforces blogs are great learning resources too!
- In the final month leading to placement OAs, I also started giving [LeetCode](https://leetcode.com/), [AtCoder](https://atcoder.jp/), and [Codechef](www.codechef.com) contests. I absolutely love AtCoder Beginner contests, have grown acustomed to the LeetCode ones, and hate Codechef. But they all have their own charm, and you should try them all to see which one you like the best.
- The [CSES problem set](https://cses.fi/) is a gold mine that is often overlooked. I personally used it in two manners:
  - Solving it periodically to ensure that I know the basics of a topic. Many questions from the same are used as subproblems in other problems, and the general solving techniques that I picked up from here helped me a lot. There have been many a times when I was unable to solve some LC questions, and then found articles and solutions of the same building on some CSES problems.
  - Resubmitted some of the common problems before the online assessments to ensure that I my brain has not rotted from using all the templates and Co-Pilot suggestions during the regular CP contests.
- [CP Algorithms](https://cp-algorithms.com/) is my go to resource for templates & intial understanding of a topic. The explanations are crystal clear, all accompanied by code snippets, common extensions of the problems as well as recommened problems. I would not recommed using it as a question source, but definitely for the theory and implementation snippets.
- The infamous [Dynamic Programming Atcoder List](https://atcoder.jp/contests/dp/tasks) is a must read for all the DP problems. I would recommend solving the problems on your own first, and then looking at the solutions to see if you can improve your code or if there is a better way to solve the problem. It is probably the best curated introductory list of DP problems of the most common types.
- This is a [list of Leetcode Problems](https://leetcode.com/problem-list/an5azr1i/) that I had curated throught my placements. Some of these problems have been directly asked in OAs, and others are my favourite because of the concepts they teach. They are strictly more from a CP point of view and not DSA, so they may not be entirely useful for interview preparation.

## Core Computer Science Concepts

These concepts take the most time, and are often the deciding factors in a low-medium difficulty online assesement where a large majority of the students are able to solve the problems. My two cents: don't skip these topics or keep them for the last. Learn them early on, and maintain conscise notes. Then as the placement or intern season approaches, make a habit of spending 30-45 minutes daily to solve MCQs related to these topics.

[GFG](https://www.geeksforgeeks.org/) is probably the only resource you need for these MCQs. It is very common for the companies to directly pick questions from here, and the explanations are also very good.

Here are also some [conscise notes about OOPS](../../../blog/placements/OOPS.pdf) that I started maintainging as I solved these MCQs, as well as from the questions I saw in my online assements and that of my seniors. I have no plans of updating them, and they probably won't make any sense if you haven't studied the topic first. But if you have, they might be a good refresher and help you in remembering some important or lesser known points, and getting those 'tricky' questions right.

Database Management, SQL, and Operating Systems are a much do if you are from a circuital branch. The questions that are asked are usually basic and standard for the most part, but you need to be aware about them and have a good understanding of the concepts. As usual, MCQS from GFG to test your mettle and YouTube videos of any online educator that you like would be a good start.

Computer networks in also usually included in CS concepts, but I decided to skip them in the interest of time. A very few companies ask questions from this topic (like `Cisco`) and for very specific roles (like Network Engineer). You might want to read about them if you are interested in such roles. Many of my friends who just covered some basics topics like TCP/IP, OSI model, and HTTPS, were able to answer "most" of the netwroking questions in the OAs as well as the interviews.

## Puzzles & Quant Resouce

Other than the above topics, puzzles and probability questions are also very common in OAs & interviews alike. The good news about them is that they have been more or less standardized, so you can find a lot of resources online to practice them. [Brainstellar](https://brainstellar.com/) is a must do if you are aiming for Quant roles or roles in major fin-tech giants (Making a habit of 30 minutes daily practice is a good idea). [GeeksforGeeks](https://www.geeksforgeeks.org/) is also a good resource for these questions, and you can find a lot of them in the `Puzzles` section of the website.

If you want to dwell even deeper into the same, [A Practical Guide To Quantitative Finance Interviews]() by Xinfeng Zhou, better known as the "Green Book" is the most trusted source. I never managed to read it, but the introduction chapter on puzzles is something that I really enjoyed. [Quant Guide](https://www.quantguide.io/) (AKA the Leetcode for Quant) and [Puzzled Quant](https://www.puzzledquant.com/) are some other resources that I have heard good things about, but never used myself.

## CPP Topics

`WARNING`: This section is probably not for you unless you are aiming for a dedicated C++ developer role or a low level role like system programming. If you are aiming for a general SDE role, you should be fine with the basics of C++ and the topics that are covered in the DSA section.

[Learn CPP](https://www.learncpp.com/) is a great resource for these topics and learning C++ nitigrities in general. [The Modern CPP Tutorial](https://changkun.de/modern-cpp/en-us/00-preface/) and [CMU Databases's 15445 Bootcamp](https://github.com/cmu-db/15445-bootcamp) are also some resources that I found post the placement season that I wish I had known about earlier.

Do spend good time on learning about your language in general (apart from the typical competitive programming), and how it works under the hood. If you are short on time, I would recommend focusing on the following topics:

- [Void Pointers](https://www.learncpp.com/cpp-tutorial/void-pointers/)

  - How to figure out if a `void *` pointer is pointing to an integer or a character array?
  - How to figure out if a `void *` pointer is allocated on the stack or the heap?

- [Smart Pointers & Move Semantics in CPP](https://www.learncpp.com/cpp-tutorial/introduction-to-smart-pointers-move-semantics/)

  <details>
  <summary>Quick Notes</summary>

  - How do these work under the hood and why do we need them?

    We need smart pointers because raw pointers are error prone and can lead to memory leaks. Smart pointers are objects that manage the memory of a pointer, and automatically free the memory when the object goes out of scope. They are also exception safe, and can be used in containers and classes.

  - `std::unique_ptr`

    - Allocated on the stack, and eventually calls `delete` on the pointer when it goes out of the scope.
    - The copy assignment operator and the copy constructor are deleted, and thus it can't be copied. You need to use `std::move` to transfer the ownership of the pointer.
    - Smart enough to differentiate between scalar delete or array delete, but is advised to use with `std::vector` or `std::array` instead of raw arrays.
    - Use `std::make_unqiue` to create a `std::unique_ptr` instead of using `new` directly. It calls the constructor of the object and returns a `std::unique_ptr` to the object. This can lead to better exception safety and is more readable.

  - `std::shared_ptr`

    - Keeps track of how many `std::shared_ptr` are pointing to the same object, and deletes the object when the last `std::shared_ptr` goes out of scope.
    - Always make a copy of an existing `std::shared_ptr` if you need more than one `std::shared_ptr` pointing to the same resource, otherwise each of them might think that it the sole owner, and drop the memory when it goes out of scope.
    - `std::make_shared` is also available, and is recommended to use instead of `new` for the same reasons as `std::make_unique`.
    - Internally, it uses a control block to keep track of the number of `std::shared_ptr` pointing to the same resource, and the resource itself. The control block is allocated on the heap, and the resource is allocated on the heap as well.

  - `std::weak_ptr`

  - Difference between references and pointers in C++. When to use which and how they affect the safety as well as the usability of the code?

  </details>

  - Multithreading in C++

    - Write a web-crawler using multithreading in C++ that can crawl multiple pages at the same time. The crwaler should work in a BFS like manner, and we should be able to configure the maximum depth of the crawler.

    <details>

    We have assumed the existence of a `HtmlParser` class that has a method `getUrls` that returns a list of URLs on the page. The `crawl` method should return a list of all the URLs that the crawler has visited.

    ```cpp showLineNumbers
    class Solution
    {
    public:
        vector<string> crawl(string startUrl, HtmlParser htmlParser, int maxDepth = 100)
        {
            unordered_set<string> seen{startUrl};
            string hostname = getHostname(startUrl);

            // Store the URL and its depth in the queue
            queue<pair<string, int>> q;
            q.push({startUrl, 0});

            vector<thread> threads;
            mutex mtx; // Mutex to guard seen and q
            condition_variable cv;

            // Worker function which continuously fetches URLs from the queue and processes them
            // Each worker DOES NOT process one complete depth as it may not be optimal
            auto worker = [&]()
            {
                while (true)
                {
                    pair<string, int> current;

                    {
                        unique_lock<mutex> lock(mtx); // Need deferred lock to use cv.wait_for
                        // cv.wait_for is used to avoid spurious wakeups
                        cv.wait_for(lock, 30ms, [&]()
                                    { return !q.empty(); });

                        // Kill the worker if the queue is empty
                        if (q.empty())
                            return;

                        current = q.front();
                        q.pop();
                    }

                    // Parse the URL
                    string url = current.first;
                    int depth = current.second;

                    if (depth >= maxDepth)
                        continue;

                    vector<string> urls = htmlParser.getUrls(url);

                    for (const auto &nextUrl : urls)
                    {
                        // Check if URL is within the same domain
                        if (nextUrl.find(hostname) != string::npos)
                        {
                            lock_guard<mutex> lock(mtx);
                            if (seen.insert(nextUrl).second)
                            {
                                q.push({nextUrl, depth + 1});
                                cv.notify_all();
                            }
                        }
                    }
                }
            };

            // Get the number of hardware threads and create that many threads
            for (int i = 0; i < thread::hardware_concurrency(); ++i)
                threads.emplace_back(worker);

            for (auto &t : threads)
                t.join();

            return {seen.begin(), seen.end()};
        }

    private:
        // Extract hostname from the URL
        // URL is assumed to be of the form "http://hostname/..."
        string getHostname(const string &url)
        {
            return url.substr(0, url.find('/', 7));
        }
    };
    ```

    </details>
