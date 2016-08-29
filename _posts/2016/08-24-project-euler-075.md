tags: [Project-Euler, Clojure]
date: 2016-08-24
title: 프로젝트 오일러 75
---
> 직각삼각형을 만들어내는 방법이 한 가지 뿐인 경우 세기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=75) [[영어]](https://projecteuler.net/problem=75)

합이 $1,500,000$ 이하인 [피타고라스 수(Pythagorean Triplet)](https://en.wikipedia.org/wiki/Pythagorean_triple)의 시퀀스를 생성한 다음, 합으로 `group-by` 해서 값(피타고라스 수 목록)의 길이가 $1$인 키의 개수를 세면 된다. 피타고라스 수를 구하는 방법은 [문제 39](/2015/project-euler-039/)에서 설명했다.
<!--more-->

{% math %}
\begin{aligned}
  a &= k \cdot (m^2 - n^2) \\
  b &= k \cdot (2mn)       \\
  c &= k \cdot (m^2 + n^2)
\end{aligned}
{% endmath %}

$m, n ,k$를 무한대까지 조사할 수는 없으므로 적절한 범위를 구해야 한다. 문제와 피타고라스 수 공식을 잘 살펴보면 다음과 같은 사실을 정리할 수 있다. 편의상 철사 길이 최대값을 $L$로, $m$의 최대값을 $M$으로 표시한다.

* $m, n, k$는 모두 양의 정수다. $m > n$이므로, $m \ge 2$다.
* $m$이 최대가 되려면 $n, k$가 최소가 되어야 한다. $n, k$의 최소값은 모두 $1$이다.
* $a + b + c \le L$이므로, $a, b, c$에 위 식을 대입하고 $n, k$에 최소값($=1$)을 대입해 정리하면 다음 식을 얻을 수 있다.
{% math %}
\begin{aligned}
  m(m+1) \le \frac{L}{2}
\end{aligned}
{% endmath %}
$m$이 충분히 크면 $m \approx (m+1)$로 볼 수 있다. 따라서 $m$의 최대값은 $M = \sqrt{L/2}$라 할 수 있다.

따라서 다음과 같이 상수를 정의할 수 있다.

```clojure
(ns p075
  (:require [util :refer [gcd]]))

(def L 1500000)                         ; max length of wire
(def M (int (Math/sqrt (quot L 2))))    ; max of m
```

처음 설명한 로직을 그대로 코드로 옮기면 답을 구할 수 있다.

```clojure
(defn solve1 []
  (->> (for [m (range 2 (inc M))
             n (range 1 m)
             k (range)
             :let [a (* k (- (* m m) (* n n)))
                   b (* k 2 m n)
                   c (* k (+ (* m m) (* n n)))
                   sum (+ a b c)]
             :while (<= sum L)
             :when (odd? (- m n))
             :when (= 1 (gcd m n))]
         [a b c])
       (group-by (fn [[a b c]] (+ a b c)))
       (filter (fn [[_ ls]] (= 1 (count ls))))
       count))
```

한 가지 중요한 점은, `for`안에서 `:while`이 `:when`보다 먼저 나와야 한다는 것이다. 순서가 바뀌면 의도한 결과가 나오지 않는다. 이 코드의 경우는 무한 루프에 빠지는 것 같다.

실행 결과는 다음과 같다. 속도가 만족스럽지는 않다.

<pre class="console">
p075=> (time (solve1))
"Elapsed time: 2473.175672 msecs"
161667
</pre>

가만히 생각해보니, `[a b c]`를 구한 후 어차피 `(+ a b c)`를 계산하는 데만 사용할 뿐 `a`, `b`, `c` 값을 따로 사용할 일은 없다. 불필요하게 `[a b c]` 벡터를 구할 필요 없이 `sum`으로 시퀀스를 만들면 성능이 조금 나아지지 않을까?

```clojure
(defn solve2 []
  (->> (for [m (range 2 (inc M))
             n (range 1 m)
             k (range)
             :let [a (* k (- (* m m) (* n n)))
                   b (* k 2 m n)
                   c (* k (+ (* m m) (* n n)))
                   sum (+ a b c)]
             :while (<= sum L)
             :when (odd? (- m n))
             :when (= 1 (gcd m n))]
         sum)
       (group-by identity)
       (filter (fn [[_ ls]] (= 1 (count ls))))
       count))
```

개선한 코드의 실행 결과는 다음과 같다.

<pre class="console">
p075=> (time (solve2))
"Elapsed time: 2448.249765 msecs"
16??67
</pre>

많이 빨라질 줄 알았는데, 거의 차이가 없다. 실행 순서(`solve1`을 먼저 실행하고 `solve2`를 실행했는지, 그 반대로 했는지)에 따라 결과가 뒤집히기도 하므로 사실상 차이가 없다고 봐도 무방할 것이다.

## 참고
* [프로젝트 오일러 75 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p075.clj)
* [프로젝트 오일러 39](/2015/project-euler-039/)
