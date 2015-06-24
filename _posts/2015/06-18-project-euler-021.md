tags: [project-euler, clojure]
date: 2015-06-18
title: 프로젝트 오일러 21
---
> 10000 이하 모든 친화수(우애수)의 합은?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=21) [[영어]](https://projecteuler.net/problem=21)

어떤 수가 친화수인지 판단하는 함수가 있다면 1부터 10,000까지의 수 중에서 친화수만 `filter`해 더하면 된다. 어떤 수가 친화수인지 판단하는 함수를 구현하려면 몇 가지 보조 함수가 필요하다. 자신을 제외한 약수를 진약수(proper divisor)라 하는데, 진약수의 합 $d(n)$을 구하는 방법에 따라 풀이가 갈린다.<!--more-->

## 방법 1
먼저 루프를 돌려서 진약수를 구해 문제를 해결하는 방법을 살펴보자. 어떤 수가 다른 수의 약수인지를 판단하는 함수가 있으면 유용할 것이다. 어떤 수 $n$이 $x$로 나누어 떨어지면 $x$는 $n$의 약수이므로, 약수인지 판단하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn divisor?
  "Returns true if x is a divisor of n."
  [x n] (zero? (rem n x)))
```

진약수는 다음과 같이 구할 수 있다. $n$의 약수를 구하는 가장 무식한 방법은, $x$를 1부터 $n$까지 증가시키면서 $n$을 $x$로 나누었을 때 나누어 떨어지는지 $x$만 추리는 방법일 것이다. 그러나 조금 생각해보면 그렇게까지 할 필요는 없음을 알게 된다. $x$가 $n$의 약수라면 $n/x$도 $n$의 약수이므로, 한 번에 약수를 두 개씩 구할 수 있다. 또한 $x$가 $\sqrt n$을 넘으면 $x$와 $n/x$의 쌍이 크기만 바뀐 채 앞에서 구한 약수 쌍과 반복될 것이므로 $x$는 1부터 $\sqrt n$까지만 돌려보면 된다.

```clojure
(defn proper-divisors
  "Returns the proper divisors of n."
  [n]
  (let [bound (ceil (Math/sqrt n))
        uniq #(if (= %1 %2) [%1] [%1 %2])]
    (->> (range 1 bound)
         (mapcat #(if (divisor? % n) (uniq % (quot n %))))
         (remove #(or (nil? %) (= n %)))
         sort)))
```

`let` 폼에 있는 `uniq` 함수는 두 인자 `a`, `b`를 받아 두 수가 같은 경우에는 `[a]`로, 다른 경우에는 `[a b]`를 리턴한다. 약수에 같은 수가 중복되는 것을 방지하기 위함이다. 같은 수가 중복되는 경우는 $\sqrt n$이 약수가 되는 경우 밖에 없다. `mapcat`의 인자로 전달된 함수는 입력된 수가 $n$의 약수일 때는 약수 쌍을 리턴하지만 약수가 아닐 때는 `nil`을 리턴한다. `mapcat` 다음 줄에 있는 `remove`는 약수 목록에서 `nil`과 `n`을 제거한다. 마지막 줄의 `sort`는 약수가 오름차순으로 나오게 하려는 것이다. 이 문제에서는 진약수의 합을 사용해 순서는 중요하지 않으므로 정렬을 생략해도 문제가 없을 것이다.

진약수 목록을 구했다면 그 합을 구하는 것은 식은 죽 먹기다.

```clojure
(defn aliquot-sum1
  "Returns the sum of n's proper divisors."
  [n]
  (apply + (proper-divisors n)))
```

진약수의 합을 구하는 함수까지 만들었으므로 친화수인지 판단하는 함수는 다음과 같이 간단히 구현할 수 있다.

```clojure
(defn amicable? [a f]
  (let [b (f a)]
    (and (not= a b) (= a (f b)))))
```

(굳이 두번째 인자로 함수를 넘기게 한 것은 **방법 2**에서 진약수의 합을 구하는 함수를 다르게 구현해 전달하기 위함이다.)

따라서 문제의 답은 다음과 같이 구할 수 있다.

```clojure
(defn solve1 []
  (apply + (filter #(amicable? % aliquot-sum1) (range 1 10000))))
```

실행 결과는 다음과 같다.
<pre class="console">p021=> (time (solve1))
"Elapsed time: 175.725515 msecs"
316??
</pre>

## 방법 2
어떤 수 $n$을 소인수분해 한 결과는 다음과 같이 나타낼 수 있다.

{% math_block %}
n = \prod_k p_k^{a_k}
{% endmath_block %}

이때 약수의 합은 다음과 같다.

{% math_block %}
\sigma(n)=\prod_k\left(\sum_{i=0}^{a_k}p_k^i\right)
{% endmath_block %}

진약수의 합은 위 결과에서 $n$을 빼주면 된다. 예를 들어, 120을 소인수분해하면 $120=2^3 \cdot 3 \cdot 5$이 되므로, 약수의 합은 다음과 같이 구할 수 있다.

{% math_block %}
(2^0 + 2^1 + 2^2 + 2^3) \cdot (3^0 + 3^1) \cdot (5^0 + 5^1) =15 \cdot 4 \cdot 6 =360
{% endmath_block %}

따라서 진약수의 합은 360에서 120을 뺀 240이 된다. 이 방식을 이용해 진약수의 합을 구하는 함수는 다음과 같이 구현할 수 있다.

```clojure
(defn aliquot-sum2 [n]
  (if (<= n 1) 0
      (->> (factorize n)
           (map (fn [[p a]] (reduce + (for [i (range (inc a))] (pow p i)))))
           (reduce *)
           (#(- % n)))))
```

`if` 폼을 사용해 `n`이 1 이하인 경우 0을 리턴하게 했다. `factorize` 함수에 0 또는 1을 인자로 주면 빈 시퀀스를 리턴하는데, 이때 `if`가 없다면 함수가 기대한 대로 동작하지 않는다. 인자로 1을 주면 진약수의 합이 0으로 리턴되는데 애매하기는 하지만 받아들일 수 있다, 그러나 인자로 0을 주었을 때 진약수의 합이 1로 리턴되는 것은 수용하기 어렵다. 이렇게 되는 데는 [이유](/2015/04/06/project-euler-015/)가 있지만 그렇다고 계산 결과를 올바른 것으로 볼 수는 없다. 따라서 0, 1인 경우에는 그냥 `if`로 걸러냈다.

```clojure
(defn solve2 []
  (apply + (filter #(amicable? % aliquot-sum2) (range 1 10000))))
```

실행 결과는 다음과 같다.

<pre class="console">p021=> (time (solve2))
"Elapsed time: 201.757973 msecs"
316??
</pre>

실행시간이 약간 느려졌다. 여러 번 실행해봐도 **방법 1**과 비슷하거나 조금 느리다.

## 방법 3
약수의 합을 구하는 다른 공식도 있다. 이 공식이 **방법 2**의 공식보다 계산이 빠를 것 같다.

{% math_block %}
\sigma(n)=\prod_k\frac{p_k^{a_k+1}-1}{p_k-1}
{% endmath_block %}

이 공식은 다음과 같이 구현할 수 있다. 방법 2에서와 마찬가지로 자신을 빼줘야 진약수의 합이 된다.

```clojure
(defn aliquot-sum3 [n]
  (if (<= n 1) 0
      (->> (factorize n)
           (map (fn [[p a]] (/ (dec (pow p (inc a))) (dec p))))
           (reduce *)
           (#(- % n)))))
```

실행 결과는 다음과 같다.
<pre class="console">p021=> (time (solve3))
"Elapsed time: 151.324716 msecs"
316??
</pre>

예상했던 대로 방법 2보다 빠르다. 그리고 방법 1보다도 빠르다. 공식을 사용한 보람이 있다.

## 참고
* [프로젝트 오일러 문제 21 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p021.clj)
* [Is there a formula to calculate the sum of all proper divisors of a number?](http://math.stackexchange.com/questions/22721/is-there-a-formula-to-calculate-the-sum-of-all-proper-divisors-of-a-number) 공식을 이용해 진약수의 합을 구하는 방법이 잘 설명되어 있다. **방법 2**에서 120을 예로 들어 설명한 것도 이 글에 설명된 내용을 그대로 참조한 것이다.
* [Finding sum of factors of a number using prime factorization](http://math.stackexchange.com/questions/163245/finding-sum-of-factors-of-a-number-using-prime-factorization)
* [Divisor Function -- Wolfram MathWorld](http://mathworld.wolfram.com/DivisorFunction.html)
* [프로젝트 오일러 15](/2015/04/06/project-euler-015/) 글의 끝부분에 항등원에 대해 설명하는 부분을 참조.
