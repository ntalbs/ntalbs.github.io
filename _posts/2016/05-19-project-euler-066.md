tags: [Project-Euler, Clojure]
date: 2016-05-19
title: 프로젝트 오일러 66
---
> $x^2 – Dy^2 = 1$ 형태의 디오판토스 방정식 풀기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=66) [[영어]](https://projecteuler.net/problem=66)

$\sqrt D$의 $i$번째 근사분수(convergents)를 $\frac{h_i}{k_i}$라 하면, 펠 방정식의 해 중 $x$를 최소화하는 해 $(x\_1, y\_1)$은 $h\_i^2 - Dk\_i^2 = 1$를 만족시키는 $(h\_i, k\_i)$가 된다. $h_i, k_i$는 다음과 같이 구할 수 있다.

{% math %}
\begin{aligned}
h_i &= a_ih_{i-1} + h_{i-2} \\
k_i &= a_ik_{i-1} + k_{i-2}
\end{aligned}
{% endmath %}
<!--more-->

첫 번째 근사분수는 $a_0$이므로 $h_0, k_0$는 각각 다음과 같이 초기화할 수 있다.

{% math %}
\begin{aligned}
h_0 = a_0,\, k_0 = 1
\end{aligned}
{% endmath %}

두 번째 근사분수는 $a_0 + \frac{1}{a_1} = \frac{a_0a_1+1}{a_1}$이므로, $h\_i, k\_i$를 구하는 식에 $h\_0, k\_0$을 대입해 계산하면 $h\_{-1}, k\_{-1}$의 값은 다음과 같아야 한다.

{% math %}
\begin{aligned}
h_{-1} = 1,, _{-1} = 0
\end{aligned}
{% endmath %}

이를 바탕으로, $h\_i, k\_i$를 계산해 $h\_i^2 - Dk\_i^2 = 1$이 되는 경우를 구하면 $(h\_i, k\_i)$가 펠 방정식의 해가 된다.

[문제 64](/2016/project-euler-064)에서 $\sqrt D$의 연분수꼴을 구하는 함수를 이미 구현했으므로 그대로 가져다 쓸 수 있다. 펠 방정식의 기본 해를 구하는 함수는 다음과 같이 작성할 수 있다. 루프를 돌면서 처음 찾은 해가 $x$를 최소화하는 해가 된다.

```clojure
(ns p066
  (:require [util :refer [perfect-square?]]
            [p064 :refer [expand-continued-fraction]]))

(defn find-fundamental-solution
  "find the fundamental solution of pell's equation,  x^2 - dy^2 = 1"
  [d]
  (let [cf (expand-continued-fraction d)
        as (lazy-cat cf (cycle (rest cf)))]
    (loop [h2 0, h1 1,
           k2 1, k1 0,
           as as, n 0]
      (if (and (>= n 1) (= 1 (-' (*' h1 h1) (*' d k1 k1))))
        [h1 k1]
        (recur h1 (+' (*' (first as) h1) h2)
               k1 (+' (*' (first as) k1) k2)
               (rest as) (inc n))))))
```

이제 $D$를 2부터 1000까지 변경하면서 펠 방정식에서 $x$를 최소화하는 기본해를 구한 다음, 이 중 $x$값이 가장 큰 경우의 $D$를 구하면 된다. $D$ 완전제곱수인 경우에는 $(1, 0)$을 제외한 다른 정수해가 존재하지 않으므로 이를 제외해야 한다.

```clojure
(defn solve []
  (->> (range 2 (inc 1000))
       (filter (complement perfect-square?))
       (map (fn [d] [d (first (find-fundamental-solution d))]))
       (apply (partial max-key second))))
```

실행 결과는 다음과 같다.

<pre class="console">
p066=> (time (solve))
"Elapsed time: 21.273114 msecs"
6?1
</pre>

## 참고
* [프로젝트 오일러 66 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p066.clj)
* [프로젝트 오일러 64](/2016/project-euler-064)
* [Continued fraction](http://en.wikipedia.org/wiki/Continued_fraction)
* [Pell's equation > Fundamental solution via continued fractions](https://en.wikipedia.org/wiki/Pell%27s_equation#Fundamental_solution_via_continued_fractions)
