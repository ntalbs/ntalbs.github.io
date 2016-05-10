tags: [Project-Euler, Clojure]
date: 2015-04-08
title: 프로젝트 오일러 16
---
> $2^{1000}$의 각 자릿수를 모두 더하면?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=16) [[영어]](https://projecteuler.net/problem=16)

$2^{1000}$은 300자리가 넘는 매우 큰 수다. `int`, `long`과 같은 기본 데이터 타입에는 이렇게 큰 수를 담을 수 없다. `double`은 $10^{308}$ 이상의 매우 큰 수를 표현할 수 있지만 유효자릿수가 15~17자리여서 $2^{1000}$의 모든 자릿수를 담을 수 없다.<!--more-->

## 준비
주어진 수의 자릿수를 모두 더해야 하므로, 주어진 수의 자릿수로 시퀀스를 만들어주는 함수가 있으면 문제를 푸는 데 도움이 될 것이다.

```clojure
(defn digits
  "Retruns the list of digits of n."
  [n]
  (loop [n n acc '()]
    (if (= n 0)
      acc
      (recur (quot n 10) (conj acc (int (rem n 10)))))))
```

이제 $2^{1000}$을 구하는 방법을 생각해보자.

## 방법 1
Clojure에서는 `*'` 함수를 사용해 임의의 자릿수에 대한 곱셈을 계산할 수 있다. 정수인 경우 `long`으로 표현 가능한 범위 안에서는 `long`으로, `long`의 표현 범위를 넘는 경우에는 자동으로 `BigInt`로 전환된다. 따라서 `*'`를 이용해 다음과 같이 거듭제곱수를 구하는 재귀함수를 작성할 수 있다.

```clojure
(defn pow1 [x n]
  (if (zero? n) 1
    (* x (pow1 x (dec n)))))
```

그러나 이렇게 하면 매 재귀호출 때마다 스택을 소비하게 되므로 `n`이 큰 경우 `StackOverflowError`가 발생할 수 있다. 꼬리재귀를 사용하면 스택을 소비하지 않아 큰 수에 대해서도 문제 없이 동작하게 할 수 있다. 꼬리재귀를 사용한 구현은 다음과 같다.

```clojure
(defn pow2 [x n]
  (loop [n n, acc 1]
    (if (zero? n)
      acc
      (recur (dec n) (*' x acc)))))
```

$x^n$은 $x$를 $n$번 곱하는 것이므로 `repeat` 함수를 사용해 $x$가 $n$번 반복되는 시퀀스를 만든 다음 이를 모두 곱하도록 할 수 있다.

```clojure
(defn pow3 [x n]
  (apply *' (repeat n x)))
```

Java의 `BigInteger`를 직접 사용하는 것도 가능하다. `BigInteger`의 `pow` 메서드를 사용하는 코드는 다음과 같다.

```clojure
(defn pow [x n]
  (.pow (java.math.BigInteger. (str x)) n))
```

이제 각 자릿수를 더해주면 된다. 앞에서 만들었던 `digits` 함수를 이용하면 다음과 같이 할 수 있다.

```clojure
(defn solve1 []
  (->> (pow 2 1000)
       (digits)
       (apply +)))
```

실행 결과는 다음과 같다.

<pre class="console">
p016=> (time (solve1))
"Elapsed time: 0.617088 msecs"
13??
</pre>

## 방법 2
이 문제도 `BigInt`를 사용하면 풀이가 너무 쉬워진다. [문제 13](/2015/project-euler-013/)에서와 마찬가지로 `BigInt`를 사용하지 말고 풀어보자. 다행히 [문제 13](/2015/project-euler-013/)에서 만들었던 `digits+` 함수를 활용하면 문제를 쉽게 풀 수 있다. 어떤 수에 2를 곱하는 것은 그 수를 두 번 더하는 것과 같다. 즉 $2x = x + x$이므로, 이를 이용해 다음과 같은 코드를 작성할 수 있다.

```clojure
(defn twice-digits [x]
  (digits+ x x))
```

이제 `[1]`에 `twice-digits`를 1000번 적용하면 된다. `[1]`을 두 배 하고, 그 결과를 다시 두 배 하는 식으로 1000번을 반복하면 된다. `iterate` 함수를 사용하면 이 작업을 쉽게 할 수 있다. `iterate`가 리턴하는 시퀀스의 1001번째 항이 $2^{1000}$에 대한 자릿수이므로 1001번째 항의 모든 수를 모두 더하면 된다.

```clojure
(defn solve2 []
  (->> (iterate twice-digits [1])
       (drop 1000)
       first
       (reduce +)))
```

실행 결과는 다음과 같다.

<pre class="console">
p016=> (time (solve2))
"Elapsed time: 53.205084 msecs"
13??
</pre>

`BigInt`를 사용한 해법보다 거의 백배는 느려졌지만, 그래도 비교적 빠른 시간 안에 답을 구한다.

## 참고
* [프로젝트 오일러 16 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p016.clj)
* [How to do exponentiation in clojure?](http://stackoverflow.com/questions/5057047/how-to-do-exponentiation-in-clojure)
* [프로젝트 오일러 13](/2015/project-euler-013/)
