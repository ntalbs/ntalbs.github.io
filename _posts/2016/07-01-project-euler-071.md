tags: [Project-Euler, Clojure]
date: 2016-07-01
title: 프로젝트 오일러 71
---
> 기약 진분수를 커지는 순으로 늘어놓기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=71) [[영어]](https://projecteuler.net/problem=71)

분모가 $n$보다 작거나 같은 0과 1 사이의 기약 진분수의 수열을 [Farey sequence](http://en.wikipedia.org/wiki/Farey_sequence)라 한다. 이 수열에서 $\frac{a}{b}$와 $\frac{c}{d}$가 이웃이고 $\frac{a}{b} < \frac{c}{d}$면, 두 수의 차는 $\frac{a}{b} - \frac{c}{d} = \frac{1}{bd}$가 되어야 한다.
<!--more-->

{% math %}
\begin{aligned}
\frac{a}{b} - \frac{c}{d} = \frac{1}{bd} \\[5pt]
\therefore bc - ad = 1
\end{aligned}
{% endmath %}

$\frac{3}{7}$의 이웃 중 가장 큰 값을 찾아야 하므로 $c=3,\, d=7$이라 하면 다음과 같은 식을 얻을 수 있다.

{% math %}
\begin{aligned}
a = \frac{3b - 1}{7}
\end{aligned}
{% endmath %}

따라서 $1 < b < 1,000,000$의 범위에서 $a$를 계산한 다음 $\frac{a}{b}$의 최대값을 구하면 문제의 답을 찾을 수 있다. $a, b$ 모두 정수여야 하므로, 위 공식으로 구한 $a$가 정수인 경우만 `filter`로 걸러내 계산하면 된다.

```clojure
(ns p071
  (:require [util :refer [infix]]))

(def limit 1000000)

(defn solve []
  (->> (range 2 limit)                                ; b
       (map (fn [b] [(infix (((3 * b) - 1) / 7)) b])) ; [a b]
       (filter (fn [[a b]] (integer? a)))             ; a should be an int
       (map (fn [[a b]] (/ a b)))                     ; a/b
       (apply max)
       numerator))
```

실행 결과는 다음과 같다.

<pre class="console">
p071=> (time (solve))
"Elapsed time: 155.691129 msecs"
42??70
</pre>



## 참고
* [프로젝트 오일러 71 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p071.clj)
* [Farey sequence](http://en.wikipedia.org/wiki/Farey_sequence)
