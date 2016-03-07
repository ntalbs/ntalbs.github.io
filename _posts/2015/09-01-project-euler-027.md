tags: [Project-Euler, Clojure]
date: 2015-09-01
title: 프로젝트 오일러 27
---
> 연속되는 n에 대해 가장 많은 소수를 만들어내는 2차식 구하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=27) [[영어]](https://projecteuler.net/problem=27)

$n^2+an+b$란 식이 주어졌고 $a, b$의 범위가 $|a|<1000, |b|<1000$ 으로 주어졌으므로, 무식하게 루프를 돌리는 방법으로 풀이를 시도해 볼 수 있다. 대략 4백만 가지의 $(a, b)$ 조합에 대해 얼마나 많은 소수를 만들 수 있는지 확인해야 한다.

<!--more-->
그러나 문제를 조금 분석해보면 경우의 수를 줄일 수 있다. $n=0$인 경우 2차식 $n^2+an+b$가 소수가 되려면 $b$가 소수여야 한다. 그리고 $n=1$인 경우 2차식이 소수가 되려면 $1+a+b$가 소수가 되어야 한다.

## 준비
먼저 다음과 같이 계수에 대한 2차식을 만드는 함수가 필요하다. 다음 함수는 주어진 $a, b$에 대해 2차식 함수를 리턴한다.

```clojure
(defn f [a b]
  (fn [n]
    (+ (* n n) (* a n) b)))
```

그리고 $a, b$가 주어졌을 때 연속된 $n$에 대해 소수를 몇 개 만들 수 있는지 구하는 함수를 작성할 수 있다.

```clojure
(defn prime-count [a b]
  (->> (iterate inc 0)      ; n = 0, 1, 2, ...
       (map (f a b))        ; f(n)
       (take-while prime?)
       count))
```

이제 위 두 함수를 이용해 문제를 풀 수 있다.

## 방법 1
$a, b$를 주어진 범위에서 변화시키면서 각 $a, b$ 조합에 대해 소수가 몇 개씩 생기는지 확인할 수 있다. 소수는 1과 자신만을 약수로 가지는 자연수며 $b$는 소수여야 하므로, $b$가 음수인 경우는 고려하지 않아도 된다. 또한 $1+a+b$가 소수여야 한다는 조건을 추가하면 조사 범위를 줄일 수 있다.

```clojure
(defn solve1 []
  (let [lower -999 upper 1000]
    (->> (for [a (range lower upper)
               b (range 2 upper)
               :when (prime? b)
               :when (prime? (+ 1 a b))]
           {:ab (* a b) :cnt (prime-count a b)})
         (apply max-key :cnt)
         :a*b)))
```

실행 결과는 다음과 같다.

<pre class="console">p027> (time (solve1))
"Elapsed time: 581.044129 msecs"
-592??
</pre>

$b$가 소수인지,  확인하기 위해 `prime?` 함수를 사용하고 있는데 이 함수는 인자가 커질 수록 속도가 느려진다.

## 방법 2
`clojure.contrib.lazy-seqs`에 있는 `primes`를 이용하면 $b$에 소수만 지정할 수 있다. 이렇게 하면 $b$가 소수인지 확인하기 위해 `prime?`을 호출하지 않아도 된다.

```clojure
(defn solve2 []
  (->> (for [a (range -999 1000)
             b (take-while #(< % 1000) primes)
             :when (prime? (+ 1 a b))]
         {:ab (* a b) :cnt (prime-count a b)})
       (apply max-key :cnt)
       :a*b))
```

실행 결과는 다음과 같다.

<pre class="console">p027> (time (solve2))
"Elapsed time: 181.99218 msecs"
-592??
</pre>

방법 1보다 3배 이상 빨라졌다.

## 참고
* [프로젝트 오일러 27 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p027.clj)
