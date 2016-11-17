tags: [Project-Euler, Clojure]
date: 2016-11-16
title: 프로젝트 오일러 78
---
> 동전을 여러 더미로 나누는 경우의 수 세기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=78) [[영어]](https://projecteuler.net/problem=78)

동전을 여러 더미로 나누는 방법의 수는 정수를 덧셈으로 표시할 수 있는 방법의 수와 같다. 위키백과를 찾아보면 다음과 같이 공식이 나와 있다.

{% math %}
\begin{aligned}
  p(n) &= \sum_{k \neq 0} (-1)^{k-1}p(n - g_k) \\
  g_k &= \frac{k(3k-1)}{2}
\end{aligned}
{% endmath %}

$n$을 증가시키면서 $p(n)$을 구해 1백만으로 나누어 떨어지는지 확인하는 방법으로 답을 찾을 수 있다. $p(n)$을 구하는 데 필요한 $g_k$는 다음과 같이 쉽게 구현할 수 있다.
<!--more-->

```clojure
(defn- g [k] (quot (* k (dec (* 3 k))) 2))
```

$p(n-g_k)$ 앞에 있는 $(-1)^{k-1}$은 $k$가 짝수인 경우는 $-1$, 홀 수 있 경우는 $1$이 되므로 다음과 같이 함수로 정의할 수 있다.

```clojure
(defn- s [k] (if (even? k) -1 1))
```

다음과 같이 `s`와 `g`를 묶어 시퀀스로 만들어 놓으면 $p(n)$을 구할 때 사용할 수 있다. $k$는 $0$이 아닌 정수에 대해 계산해야 하며, $1, -1, 2, -2, ...$ 순서로 계산해야 하는데 `interleave`를 사용하면 해당 정수 수열을 쉽게 만들 수 있다.

```clojure
(def ^:private gs
  (->> (interleave (iterate inc 1) (iterate dec -1))
       (map (fn [k] [(s k) (g k)]))))
```

$p(n)$을 구하기 위한 부속품을 모두 준비했다. 이제 $p(n)$을 구할 차례다. 공식을 코드로 옮기면 다음과 같이 된다. 1백만으로 나누어 떨어지는지만 확인하면 되므로 중간 계산 결과도 1백만으로 나눈 나머지를 이용하면 숫자가 지나치게 거쳐 `BigInt`가 사용되는 것을 방지할 수 있다.

```clojure
(defn- p [n]
  (cond (< n 0) 0
        (= n 0) 1
        (= n 1) 1
        (= n 2) 2
        (= n 3) 3
        :else (->> gs
                   (take-while #(<= (second %) n))
                   (map (fn [[s g]] (mod (* s (p (- n g))) 1000000)))
                   (apply +))))

(def p (memoize p))
```

이제 $n$을 증가시키며 $p(n)$이 1백만으로 나누어 떨어지는 $n$을 찾으면 된다.

```clojure
(defn solve []
  (->> (range)
       (map #(vector % (p %)))
       (drop-while #(not= 0 (mod (second %) 1000000)))
       ffirst))
```

실행 결과는 다음과 같다.

<pre class="console">
p078=> (time (solve))
"Elapsed time: 12352.211469 msecs"
55??4
</pre>

답을 구하는 데 12초가 넘게 걸린다. 코드를 약간 변형하면 9초대로 시간을 줄일 수 있지만, 코드가 조금 직관적이지 않게 바뀐다. 9초대의 시간도 만족스럽지 않기는 마찬가지다. 여러 방법을 시도해 봤지만 더 빠르게 답을 구하지 못했다.

## 참고
* [프로젝트 오일러 78 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p078.clj)
* <a href="http://en.wikipedia.org/wiki/Partition_(number_theory)#Partition_function_formulas">Partition function formulas</a>
* [Pentagonal Number Theorem](http://en.wikipedia.org/wiki/Pentagonal_number_theorem)
