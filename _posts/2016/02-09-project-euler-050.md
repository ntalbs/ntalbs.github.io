tags: [project-euler, clojure]
date: 2016-02-09
title: 프로젝트 오일러 50
---
> 1백만 이하의 소수 중 가장 길게 연속되는 소수의 합으로 표현되는 수는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=50) [[영어]](https://projecteuler.net/problem=50)

소수의 누적 합을 만들어두면 문제를 쉽게 풀 수 있다. $p_i$를 $i$번째 소수라 하고 $s(n)$을 $n$번째 소수까지의 누적 합이라 하자.

{% math_block %}
\begin{aligned}
s(n) = p_1 + p_2 + ... + p_n
\end{aligned}
{% endmath_block %}
<!--more-->

$s(m, n)$를 $p_m$부터 $p_n$까지($m \le n$)의 합이라 하면, $s(m, n)$는 다음과 같이 나타낼 수 있다. $m=n$인 경우 $s(n, n) = p_n$이 된다. 그러나 문제를 풀 때는 이런 경우를 고려하지 않아도 된다.

{% math_block %}
\begin{aligned}
s(m, n) &= p_m + p_{m+1} + ... + p_n \\
        &= s(n) - s(m-1)
\end{aligned}
{% endmath_block %}

따라서 1백만 이하의 소수에 대해 누적 합을 구해 놓으면 이를 이용해 $s(m, n)$을 구할 수 있다. 여기서 $s(m, n)$ 역시 소수이면서 $n-m$이 최대가 되는 $s(m, n)$을 구하면 된다.

Clojure에서 누적 합은 `reductions` 함수를 이용해 쉽게 구할 수 있다.

<pre class="console">
p050=> (take 10 primes)
(2 3 5 7 11 13 17 19 23 29)
p050=> (take 10 (reductions + primes))
(2 5 10 17 28 41 58 77 100 129)
</pre>

문제를 풀 때는 소수의 누적 합이 몇 번째 소소까지의 합인지도 알아야 하므로 다음과 같이 인덱스와 누적 합을 함께 구해 두는게 좋겠다. 누적 합이 1백만 이하인 경우만 구하면 된다.

```clojure
(ns p050
  (:require [clojure.contrib.lazy-seqs :refer [primes]]
            [util :refer [prime?]]))

(def csp "indexes and cumulative sums of primes"
  (->> primes
       (reductions (fn [a p] [(inc (first a)) (+ (second a) p)]) [0 0])
       (take-while (fn [[_ s]] (< s 1000000)))))
```

이렇게 구한 `csp`의 처음 열 개 항은 다음과 같다. 벡터의 시퀀스로 되어 있고 벡터의 첫 요소는 인덱스를, 둘째 요소는 소수의 누적 합을 나타낸다.

<pre class="console">
p050=> (take 10 csp)
([0 0] [1 2] [2 5] [3 10] [4 17] [5 28] [6 41] [7 58] [8 77] [9 100])
</pre>

이제 모든 $m, n$ 조합 ($m<n$)에 대해 $s(m, n)$ 역시 소수이면서 $n-m$이 최대가 되는 $s(m, n)$을 구하면 된다. 이 로직을 코드로 표현하면 다음과 같다.

```clojure
(defn solve []
  (->> (for [csp1 csp, csp2 csp
             :let [[i1 s1] csp1, [i2 s2] csp2]
             :when (< i1 i2)]
         [(- i2 i1) (- s2 s1)])
       (filter (fn [[_ s]] (prime? s)))
       (apply max-key first)
       second))
```

실행 결과는 다음과 같다.

<pre class="console">
p050=> (time (solve))
"Elapsed time: 535.549903 msecs"
9976??
</pre>


## 참고
* [프로젝트 오일러 50 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p050.clj)
