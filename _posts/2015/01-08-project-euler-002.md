tags: [project-euler, clojure]
date: 2015-01-08
title: 프로젝트 오일러 - 문제 2
---
<div class="box">[피보나치 수열에서 4백만 이하이면서 짝수인 항의 합은?](http://euler.synap.co.kr/prob_detail.php?id=2)</div>

피보나치 수열의 정의는 다음과 같다.

{% math-block %}
\begin{aligned}
F_n &= F_{n-1} + F_{n-2}, \\
F_2 &= F_1 = 1
\end{aligned}
{% endmath-block %}

구현하기 쉬워 보인다.<!--more-->

```[clojure]
(defn fibo [n]
  (cond (= 1 n) 1
        (= 2 n) 1
        :else (+' (fibo (- n 1)) (fibo (- n 2)))))
```

그러나 재귀를 이용한 단순한 구현은 인자가 커짐에 따라 답을 구하는 속도가 급격히 느려진다. `fibo` 함수 안에서 재귀 호출을 두 번 하는데, 인자가 커지면 재귀호출 회수가 지수적으로 증가하며 이미 구했던 값을 지속적으로 반복해 구하는 비효율이 생긴다.

이미 계산한 함수 값을 기억해두는 메모이제이션(memoization) 기법을 사용하면 부가적인 메모리를 사용하는 대신 속도를 빠르게 할 수 있다. Clojure에서는 다음과 같이 간단히 메모이제이션을 사용할 수 있다.

```
(def fibo (memoize fibo))
```

그러나 이 문제를 풀려면 $F_1, F_2, F_3, ...$을 계속해 구해야 하는데, 위 방법으로는 속도가 나오지 않는다. 다음과 같이 `(fn [[a b]] [b (+ a b)])`를 이용하면 좀더 효율적으로 피보나치 수열을 구할 수 있다.

```[clojure]
(def fibo
  (->> (iterate (fn [[a b]] [b (+ a b)]) [1 1])
       (map first)))
```

`iterate` 함수는 첫 번째 인자로 함수 `f`를, 두 번째 인자로 초기값 `x`를 받아 `x, (f x), (f (f x))...` 지연 시퀀스(lazy sequence)를 만든다. 위 경우는 `[1 1]`을 받아 `(fn [[a b]] [b (+ a b)])`를 적용하면 `[1 2]`가 되고 여기에 다시 함수를 적용하면 `[2 3]`이 되는 식이다. 각 벡터의 첫 항목만 빼내면(`(map first)`) 피보나치 수열이 된다. 이제 필요한 만큼 피보나치 수열을 만들 수 있다.

<pre class="console">
user=> (take 5 fibo)
(1 1 2 3 5)
user=> (take 10 fibo)
(1 1 2 3 5 8 13 21 34 55)
user=>
</pre>

따라서 다음과 같이 하면 문제의 답을 구할 수 있다.

```[clojure]
(->> fibo
     (filter even?)               ; 짝수 항만 필터링
     (take-while #(<= % 4000000)) ; 4백만 이하까지만
     (apply +))))
```
