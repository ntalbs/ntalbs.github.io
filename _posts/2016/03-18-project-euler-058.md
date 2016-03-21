tags: [Project-Euler, Clojure]
date: 2016-03-18
title: 프로젝트 오일러 58
---
> 나선모양 격자의 대각선상에 있는 소수의 비율 추적하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=58) [[영어]](https://projecteuler.net/problem=58)

[문제 28](/2015/project-euler-028/)에서 나선모양 행렬의 대각선 요소를 구하는 공식을 유도했다. 그때는 나선모양이 시계 방향으로 돌았고 여기서는 나선모양이 반시계 방향으로 돌아 방향이 다르지만 문제를 푸는 데 영향을 끼치지는 않는다.
<!--more-->

{% math %}
\begin{aligned}
d(n,k) &= 2n(k+1) + (2n-1)^2 \\
n &= 1, 2, 3, ... \\
k &= 0, 1, 2, 3
\end{aligned}
{% endmath %}

따라서 대각선 요소를 구하는 함수는 다음과 같이 조금 수정했다. 인자로 `n`만 준 경우에는 `k`를 0부터 3까지 바꿔가며 네 개의 대각선 요소를 만들어 시퀀스로 리턴한다.

```clojure
(defn- square [n] (* n n))

(defn- d
  ([n k] (+ (* 2 n (inc k)) (square (dec (* 2 n)))))
  ([n]   (map #(d n %) (range 4))))
```

주어진 시퀀스에서 소수가 몇개인지 세는 함수를 구현할 차례다. 예전에 작성했던 `prime?` 함수를 이용하면 쉽다.

```clojure
(ns p058
  (:require [util :refer (prime?)]))

(defn- cnt-prime [coll]
  (count (filter prime? coll)))
```

위 함수를 이용해 다음과 같이 문제를 풀 수 있다. 대각선 요소를 계속 만들어 가면서 정사각형 변의 크기, 소수의 개수, 전체 대각선 요소의 개수를 누적하는 시퀀스를 만들고, 소수 비율이 10%를 넘는 첫 요소를 구하면 된다.

```clojure
(defn solve []
  (->> (iterate inc 1)
       (map d)
       (reductions (fn [[w pc tc] ns]
                     [(+ 2 w) (+ pc (cnt-prime ns)) (+ tc 4)])
                   [1 0 1])
       (rest)
       (map (fn [[w pc tc]] [w (/ pc tc)]))
       (drop-while (fn [[_ r]] (>= r 0.1)))
       ffirst))
```

실행 결과는 다음과 같다.

<pre class="console">
p058=> (time (solve))
"Elapsed time: 2741.299153 msecs"
26??1
</pre>

실행 속도가 그다지 만족스럽지 않다. 조금 살펴보면 대각선 요소 중 오른쪽 아래로 향하는 대각선에 있는 요소(즉 $k=3$인 경우)는 절대로 소수가 될 수 없음을 알 수 있다.

{% math %}
\begin{aligned}
&2n(1+3) + (2n-1)^2 \\
&= 8n + 4n^2 -4n + 1 \\
&= (2n + 1)^2
\end{aligned}
{% endmath %}

따라서 `d` 함수를 다음과 같이 수정할 수 있다.

```clojure
(defn- d
  ...
  ([n]   (map #(d n %) (range 3)))) ; range 인자를 3으로 변경
```

이렇게 하면 답을 구하는 속도가 조금 빨라진다.

<pre class="console">
p058=> (time (solve))
"Elapsed time: 1859.395869 msecs"
26??1
</pre>

여전히 만족스럽지 않지만 숫자 하나 바꿔서 얻은 결과 치고는 상당히 괜찮다고 할 수 있다.

## 참고
* [프로젝트 오일러 58 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p058.clj)
* [프로젝트 오일러 28](/2015/project-euler-028/)
