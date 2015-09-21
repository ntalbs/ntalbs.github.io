tags: [project-euler, clojure]
date: 2015-01-08
title: 프로젝트 오일러 2
---
> 피보나치 수열에서 4백만 이하이면서 짝수인 항의 합은?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=2) [[영어]](https://projecteuler.net/problem=2)

피보나치 수열의 정의는 다음과 같다.

{% math_block %}
\begin{aligned}
F_n &= F_{n-1} + F_{n-2}, \\
F_2 &= F_1 = 1
\end{aligned}
{% endmath_block %}

구현하기 쉬워 보인다.<!--more-->

## 방법 1
```clojure
(defn fibo-rec [n]
  (cond (= 1 n) 1
        (= 2 n) 1
        :else (+' (fibo-rec (- n 1)) (fibo-rec (- n 2)))))
```

그러나 재귀를 이용한 단순한 구현은 인자가 커짐에 따라 답을 구하는 속도가 급격히 느려진다. `fibo-rec` 함수 안에서 재귀 호출을 두 번 하는데, 인자가 커지면 재귀호출 회수가 지수적으로 증가하며 이미 구했던 값을 지속적으로 반복해 구하는 비효율이 생긴다.

이미 계산한 함수 값을 기억해두는 메모이제이션(memoization) 기법을 사용하면 부가적인 메모리를 사용하는 대신 속도를 빠르게 할 수 있다. Clojure에서는 다음과 같이 간단히 메모이제이션을 사용할 수 있다.

```clojure
(def fibo-rec (memoize fibo-rec))
```

이렇게 하면 피보나치 수열의 n번째 항을 빠르게 구할 수 있다. 따라서 다음과 같이 문제를 풀 수 있다.

```clojure
(def limit 4000000)

(defn using-memoization []
  (->> (iterate inc 1)
       (map fibo-rec)
       (filter even?)
       (take-while #(<= % limit))
       (reduce +)))
```

## 방법 2
다음과 같이 `(fn [[a b]] [b (+ a b)])`를 이용해 피보나치 수열을 구할 수도 있다.

```clojure
(def fibo-iter
  (->> (iterate (fn [[a b]] [b (+ a b)]) [1 1])
       (map first)))
```

`iterate` 함수는 첫 번째 인자로 함수 `f`를, 두 번째 인자로 초기값 `x`를 받아 `x, (f x), (f (f x))...` 지연 시퀀스(lazy sequence)를 만든다. 위 경우는 `[1 1]`을 받아 `(fn [[a b]] [b (+ a b)])`를 적용하면 `[1 2]`가 되고 여기에 다시 함수를 적용하면 `[2 3]`이 되는 식이다. 각 벡터의 첫 항목만 빼내면(`(map first)`) 피보나치 수열이 된다. 이제 필요한 만큼 피보나치 수열을 만들 수 있다.

<pre class="console">
user=> (take 5 fibo-iter)
(1 1 2 3 5)
user=> (take 10 fibo-iter)
(1 1 2 3 5 8 13 21 34 55)
user=>
</pre>

따라서 다음과 같이 하면 문제의 답을 구할 수 있다.

```clojure
(defn using-iteration []
  (->> fibo-iter
       (filter even?)
       (take-while #(<= % limit))
       (apply +)))
```

## 정리
두 방식 모두 충분히 빠르게 답을 찾아낸다. 두 번째 방법이 두 배 빠른 것처럼 보이지만 여러 번 테스트해보면 꼭 그런 것만도 아님을 알 수 있다. 그러나 첫 번째 방법은 부가적 메모리를 사용한다. 두 번째 방식은 부가적 메모리를 사용하지 않으면서도 속도가 빠르다.

<pre class="console">
p002=> (time (using-memoization))
"Elapsed time: 0.640021 msecs"
4613???
p002=> (time (using-iteration))
"Elapsed time: 0.307647 msecs"
4613???
</pre>

## 참고
* [프로젝트 오일러 2 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p002.clj)
