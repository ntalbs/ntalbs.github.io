tags: [project-euler, clojure]
date: 2015-11-03
title: 프로젝트 오일러 44
---
> 합과 차도 모두 오각수인 두 오각수 차의 최소값은?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=44) [[영어]](https://projecteuler.net/problem=44)

어떤 수가 오각수인지 빠르게 판단할 수 있다면 $i$와 $j$를 계속 늘려가며 $P_i$와 $P_j$를 구하고 그 합과 차 역시 오각수인 경우를 찾을 수 있다. $P_n ≡ x$로 놓고 근의 공식을 이용해 $n$에 대한 이차방정식을 풀면 다음과 같은 결과를 얻는다.
<!--more-->

{% math_block %}
\frac{n(3n-1)}{2} = x \\
\therefore n = \frac{1 \pm \sqrt{1+24x}}{6}
{% endmath_block %}

제곱근 안의 수가 1보다 크므로 $n$이 양수가 되려면 다음과 같이 되어야 한다.

{% math_block %}
n = \frac{1 + \sqrt{1 + 24x}}{6}
{% endmath_block %}

어떤 수 $x$가 주어졌을 때 위 공식을 만족하는 정수 $n$을 구할 수 있다면 $x$를 오각수라 할 수 있다. 따라서 어떤 수가 오각수인지 확인하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn- pentagonal? [x]
  (let [n (-> (* 24 x) (+ 1) (Math/sqrt) (+ 1) (/ 6))]
    (== n (int n))))
```

오각수 $P_n$을 구하는 함수도 다음과 같이 작성할 수 있다.

```clojure
(defn- p [n]
  (/ (* n (- (* 3 n) 1)) 2))
```

위 두 함수를 이용해 $i, j$를 늘려가며 합과 차가 모두 오각수인 경우를 찾아볼 수 있다. 아래 코드에서 `(for ...)` 폼은 합과 차가 모두 오각수인 경우 $D = |P_i - P_j|$의 지연 시퀀스를 구한다. 일단 `first` 함수를 이용해 값을 하나 찾을 때까지만 돌려보자. (사실 첫째 요소는 금방 구하지만 둘째 요소까지 구하려 하면 한참을 기다려도 결과가 나오지 않는다.)

```clojure
(defn solve []
  (first (for [i (range) j (range 1 i)
               :let [pi (p i) pj (p j)]
               :when (pentagonal? (- pi pj))
               :when (pentagonal? (+ pi pj))]
           (- pi pj))))
```

실행 결과는 다음과 같다.

<pre class="console">
p044=> (time (solve))
"Elapsed time: 377.343675 msecs"
54826??
</pre>

이 결과가 문제의 답이기는 하지만, 이것은 제대로 된 풀이라 할 수 없다. 여기서 구한 것은 $i, j$를 늘려가며 처음 찾은 $D$ 값일 뿐이다.

$D$의 최소값을 구하려면 모든 $P_i, P_j$에 대해 합과 차가 오각수인 경우를 구하고, 그 중에서 $D$의 최소값을 구해야 한다. 무한대까지 확인할 수는 없으므로, 어느 범위에서 찾은 값이 최소값이 된다거나 아니면 처음 찾은 $D$ 값이 최소가 된다는 증명이 있어야 할 것이다. 이 풀이에는 그 부분이 빠져있다. 인터넷에서 다른 풀이를 찾아봤지만 내가 이해할 수 있는 수준의 올바른 풀이는 찾지 못했다.

## 참고
* [프로젝트 오일러 44 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p044.clj)
* [Speedup for Project Euler 44 - pentagon numbers](http://codereview.stackexchange.com/questions/93232/speedup-for-project-euler-44-pentagon-numbers)
문제 풀이 방법에 대한 설명이 있지만 안타깝게도 이해하지는 못했다.
