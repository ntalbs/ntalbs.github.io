tags: [Project-Euler, Clojure]
date: 2015-11-04
title: 프로젝트 오일러 45
---
> 오각수와 육각수도 되는, 40755 다음으로 큰 삼각수는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=45) [[영어]](https://projecteuler.net/problem=45)

육각수를 구하는 공식을 조금 변형해보면 다음과 같은 결과를 얻을 수 있다.
<!--more-->

{% math %}
\begin{aligned}
H_n &= n(2n-1) \\
    &= \frac{2n(2n-1)}{2} \\
    &= \frac{(2n-1)(2n-1+1)}{2} \\
\therefore H_n &= T_{2n-1}
\end{aligned}
{% endmath %}

즉, 모든 육각수는 삼각수임을 알 수 있다. 따라서 40755보다 큰 육각수 중에서 오각수도 되는 첫 수가 문제의 답이 될 것이다. 어떤 수가 오각수인지 확인하는 함수는 [문제 44](/2015/project-euler-044/)에서 이미 작성했다.

```clojure
(defn- pentagonal? [x]
  (let [n (-> (* 24 x) (+ 1) (Math/sqrt) (+ 1) (/ 6))]
    (== n (int n))))
```

육각수 $H_n$을 구하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn- h [n]
  (* n (- (* 2 n) 1)))
```

$n=144, 145, ...$와 같이 증가시키며 $H_n$을 구해 이 중 오각수인 것만 필터로 걸러내 그 중 첫번째 요소를 구하면 된다.

```clojure
(defn solve []
  (->> (iterate inc 144) ; start from H(144)
       (map h)
       (filter pentagonal?)
       first))
```

실행 결과는 다음과 같다. 충분히 빠르게 답을 구한다.

<pre class="console">
p045=> (time (solve))
"Elapsed time: 22.899174 msecs"
15337768??
</pre>

## 참고
* [프로젝트 오일러 45 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p045.clj)
* [프로젝트 오일러 44](/2015/project-euler-044/)
