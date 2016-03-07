tags: [Project-Euler, Clojure]
date: 2016-02-24
title: 프로젝트 오일러 51
---
> 일부 숫자를 치환했을 때 8개의 서로 다른 소수가 생기는 가장 작은 소수?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=51) [[영어]](https://projecteuler.net/problem=51)

문제를 분석해보면 다음과 같은 조건을 만족해야 함을 알 수 있다.

* 치환할 위치가 마지막 자리면 안 된다.
* 치환할 자리는 세 자리여야 한다.
* 치환할 숫자는 0, 1 또는 2여야 한다.

<!--more-->

첫째 조건은 직관적이다. 치환할 때 사용할 수 있는 숫자는 $0, 1, 2, ..., 9$ 열 개다. 이 중 여덟 개를 사용할 수 있어야 한다. 짝수가 다섯 개, 홀수가 다섯 개이므로 어떻게 여덟 개를 선택하든 최소 세 개의 짝수가 포함된다. 짝수가 마지막 자리에 오면 해당 숫자는 짝수가 되어 소수가 될 수 없다. 따라서 치환할 위치가 마지막 자리면 안 된다.

둘째 조건은 직관적이지 않지만, 자릿수의 합이 3의 배수면 해당 수는 3의 배수가 된다는 성질을 이용하면 치환할 자릿수가 세 개가 되어야 한다는 사실을 확인할 수 있다. 다음과 같은 $\bmod$ 연산자의 특성을 알면 이 사실을 이해하는 데 도움이 된다.

{% math_block %}
\begin{aligned}
(a \bmod n) \bmod n &= a \bmod n \\
((a \bmod n) + b) \bmod n &= (a + b) \bmod n
\end{aligned}
{% endmath_block %}

이제, 5자리 숫에서 한 자리를 치환하는 경우를 생각해보자. 치환할 자리를 제외한 나머지 네 자리의 수를 한 값을 $s$라 하면 $s \bmod 3$은 $0, 1, 2$ 셋 중 하나가 될 것이다. $s=0$인 경우, 치환할 숫자를 $0$부터 $9$깨지 대입해 $s$에 더한 다음 $\mod 3$을 적용하면 $0$인 경우가 네 번($0, 3, 6, 9$) 나온다. 즉 $3$의 배수가 되는 경우가 네 번이란 뜻이므로 나머지 여섯 경우가 모두 소수라도 여덟 개의 다른 소수를 만들 수 없다. 동일한 작업을 $s=1, s=2$인 경우에 대해 반복하면 $3$의 배수가 되는 경우가 세 번($3, 6, 9$) 나오므로 나머지 일곱 경우가 모두 소수가 된다 하더라도 여덟 개의 다른 소수를 만들 수 없다.

치환할 자리가 두 자리인 경우 치환할 숫자를 $0$부터 $9$까지 대입하면, 치환할 숫자의 합은 $0, 2, 4, ..., 18$이 될 것이고 여기에 $0, 1, 2$를 더해 $\mod 3$을 해보면 3의 배수가 아닌 숫자가 몇 개 나오는 지 확인할 수 있다. 이런 작업은 다음 함수로 간단히 확인할 수 있다.

```clojure
(defn check [n]
  (map count
       (for [m [0 1 2]]
         (for [x (map #(* n %) (range 10)) :when (< 0 (mod (+ m x) 3))]
           [m (+ m x)]))))
```

REPL에서 치환할 자리 수에 따라 만들 수 있는 소수 후보(3의 배수가 아닌)의 개수를 확인해보면 다음과 같다.

<pre class="console">
p051=> (check 1)
(6 7 7)
p051=> (check 2)
(6 7 7)
p051=> (check 3)
(0 10 10)
p051=> (check 4)
(6 7 7)
p051=> (check 5)
(6 7 7)
p051=> (check 6)
(0 10 10)
</pre>

즉, 치환할 자리 수가 세 개인 경우와 여섯 개인 경우만 여덟 개 이상의 소수를 만들 가능성이 있다. 그러나 숫자가 여섯 자리인 경우 여섯 자리를 모두 치환하는 것은 의미가 없다. 총 자릿수가 다섯 자리, 여섯 자리 수에 대해서는 치환할 자릿수가 세 자리인 경우만 고려하면 된다.

마지막 조건도 쉽다. 치환에 사용할 수 있는 숫자 $0, 1, 2, ..., 9$ 중 여덟 개를 써야 하므로 가장 작은 수는 $0$, $1$, $2$ 중 하나여야 한다.

위 세 조건을 이용해 문제를 쉽게 풀 수 있다. 먼저 숫자에서 특정 숫자가 세 번 반복되는지 확인하는 함수가 있으면 좋을 것 같다.

```clojure
(defn digit-repeated-three-times? [ds d]
  (->> ds
       (filter #(= d %))
       count
       (= 3)))
```

위 함수는 숫자 벡터 `ds`에서 특정 숫자 `d`가 세 번 반복되는지 확인해 `true/false`를 리턴한다. 이제 위 함수를 이용해 주어진 숫자 `n`에  $0$, $1$ 또는 $2$가 세 번 반복되는지 확인하는 함수를 구현한다. $0$이 세 번 반복되면 `0`을, $1$이 세 번 반복되면 `1`을, $2$가 세 번 반복되면 `2`를 리턴하고, 그 외 경우는 `nil`을 리턴한다. 불리언 대신 숫자를 리턴하게 한 것은 반복되는 숫자를 다른 곳에서 쉽게 활용할 수 있게 하기 위해서다.

```clojure
(defn three-times-repeated-digit [n]
  (let [ds (butlast (digits n))]
    (cond (digit-repeated-three-times? ds 0) 0
          (digit-repeated-three-times? ds 1) 1
          (digit-repeated-three-times? ds 2) 2)))
```

이제 주어진 소수에서 반복되는 자리의 수를 치환해 여덟 개의 다른 소수를 만들 수 있는지 확인하는 함수를 구현할 차례다. 치환할 숫자를 인자로 받으면 구현이 좀더 간편해진다. 치환할 숫자는 위에서 구현한 `three-times-repeated-digit` 함수의 리턴 값을 그대로 사용할 수 있다.

```clojure
(defn eight-prime-family? [p rd]
  (let [p (str p) rd (str rd)]
    (->> (for [i (range 10)] (s/replace p rd (str i)))
         (map #(Integer/parseInt %))
         (filter #(< (count p) (inc (Math/log10 %))))
         (filter prime?)
         count
         (= 8))))
```

코드가 조금 복잡해 보이지만 차근차근 따져보면 어렵지 않다. 숫자를 문자열로 바꾸면 `replace` 함수로 특정 숫자를 쉽게 다른 숫자로 바꿀 수 있다. 소수 `p`와 치환할 숫자 `rd`를 받아서 `rd`를 `0`부터 `9`로 바꾼 다음 숫자로 변환해 소수인지 확인한다. 이런 식으로 해서 소수가 여덟 개가 생기면 `true`를 리턴한다.

중간에 `Math/log10`의 용도는 숫자의 자리 수를 확인하기 위함이다. 숫자의 맨 앞자리를 $0$으로 치환하면 안 되기 때문에, 숫자로 바꾼 후 자릿수가 줄어들지 않았음을 확인한다.

위에서 구현한 함수를 이용하면 다음과 같이 문제를 풀 수 있다.

```clojure
(defn solve []
  (->> primes
       (drop-while #(< % 56003))
       (map (fn [p] [p (three-times-repeated-digit p)]))
       (filter second)
       (filter (fn [[p rd]] (eight-prime-family? p rd)))
       ffirst))
```

실행 결과는 다음과 같다.

<pre class="console">
p051=> (time (solve))
"Elapsed time: 603.863756 msecs"
121??3
</pre>

처음에는 치환할 위치의 패턴을 이용해 키를 만들어 소수를 `group-by` 해서 여덟 개의 소수가 묶이는 그룹을 찾는 방식으로 문제를 풀었다. 답을 구하기는 하지만 위에서 설명한 방식보다 속도가 훨씬 느렸다.

## 참고
* [프로젝트 오일러 51 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p051.clj)
* [Modulo operation](https://en.wikipedia.org/wiki/Modulo_operation#Equivalencies)
