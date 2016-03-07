tags: [Project-Euler, Clojure]
date: 2016-03-01
title: 프로젝트 오일러 53
---
> 1 ≤ n ≤ 100 일때 nCr의 값이 1백만을 넘는 경우는 모두 몇 번?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=53) [[영어]](https://projecteuler.net/problem=53)

$r \le n$이므로 $n$, $r$의 범위는 각각 $1 \le n \le 100$, $1 \le r \le 100$이다. 모든 $n$, $r$ 조합에 대해 $_nC_r$을 구한다 해도 경우의 수는 $100 \times 100 = 10,000$이므로 금방 구할 수 있다.<!--more-->

## 방법 1
`factorial` 함수를 이용하면 $_nC_r$을 구하는 함수는 다음과 같이 간단히 작성할 수 있다.

```clojure
(ns p053
  (:require [util :refer [factorial]]))

(defn c [n r]
  (/ (factorial n) (*' (factorial r) (factorial (- n r)))))
```

이제 $n$과 $r$을 $1$부터 $100$까지 바꿔가며 $_nC_r$ 값을 구한 다음 $1,000,000$ 이상의 값만 필터링해 개수를 세면 된다.

```clojure
(defn solve []
  (->> (for [n (range 1 101) r (range 1 101)] (c n r))
       (filter #(>= % 1000000))
       count))
```

실행 결과는 다음과 같다.

<pre class="console">
p053=> (time (solve))
"Elapsed time: 485.574244 msecs"
40??
</pre>

이렇게 풀고 나니 문제가 너무 쉽다. 사실 이 문제의 의도는 큰 수를 계산하는 방법에 관한 것일 듯 하다. 팩토리얼은 매우 빠르게 증가하기 때문에 $21!$ 정도만 돼도 `Long/MAX_VALUE`를 가볍게 넘는다. 따라서 Clojure의 `BigInt`와 `*'` 함수가 아니었다면 답을 구하기가 쉽지 않았을 것이다.

## 방법 2
$_nC_r$을 구할 때 팩토리얼을 먼저 계산하지 않고 나눗셈을 먼저 계산하면 계산 과정에서 숫자가 지나치게 커지는 문제를 피할 수 있다.

{% math_block %}
\begin{aligned}
_nC_r &= \frac{n!}{r!(n-r)!} \\
&= \frac{n \times (n-1) \times ... \times 1}{r \times (r-1)\times ... \times 1 \times (n-r) \times (n-r-1) \times ... \times 1} \\
&= \left(\frac{n}{r}\right) \times \left(\frac{n-1}{r-1}\right) \times ... \times \left(\frac{n-r}{n-r}\right) \times ... \times \left(\frac{1}{1}\right)
\end{aligned}
{% endmath_block %}

수식을 잘 보면 알겠지만 분모와 분자의 항 수가 항상 같다. 그리고 C/C++ 또는 Java의 `/` 연산자는 결과가 항상 정수인 것과 달리 Clojure의 `/` 함수는 분수(`clojure.lang.Ratio`)를 리턴할 수 있다. 이 두 가지를 이용하면 다음과 같이 나눗셈을 먼저 계산하로록 함수를 작성할 수 있다.

```clojure
(defn c [n r]
  (let [nu (range 1 (inc n))
        de (concat (range 1 (inc r)) (range 1 (inc (- n r))))]
    (->> (map / nu de)
         (reduce *))))
```

`factorial`을 사용하지 않고도 비교적 간단하게 $_nC_r$을 계산할 수 있게 되었다. 계산하면서 중간 결과가 `BigInt`로 확장되지 않아서 그런지 실행 속도도 빨라졌다.

<pre class="console">
p053=> (time (solve))
"Elapsed time: 161.206506 msecs"
40??
</pre>

수식을 자세히 살펴보면 뒷부분은 1로 약분되기 때문에 굳이 계산하지 않아도 된다.

{% math_block %}
\begin{aligned}
\require{cancel}
_nC_r &= \left(\frac{n}{r}\right) \times \left(\frac{n-1}{r-1}\right) \times ... \times \left(\frac{\cancel{n-r}}{\cancel{n-r}}\right) \times ... \times \left(\frac{\cancel{1}}{\cancel{1}}\right) \\
& = \left(\frac{n}{r}\right) \times \left(\frac{n-1}{r-1}\right) \times ... \times \left(\frac{n-r+1}{1}\right)
\end{aligned}
{% endmath_block %}

따라서 함수를 다음과 같이 수정할 수 있다.

```clojure
(defn c [n r]
  (let [nu (range (inc (- n r)) (inc n))
        de (range 1 (inc r))]
    (->> (map / nu de)
         (reduce *))))
```

## 참고
* [프로젝트 오일러 53 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p053.clj)
* [프로젝트 오일러 15](/2015/04/06/project-euler-015/)
팩토리얼 함수를 구현하는 방법에 대해 설명했다.
