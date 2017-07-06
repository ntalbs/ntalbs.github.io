tags: [Project-Euler, Clojure]
date: 2017-07-05
title: 프로젝트 오일러 87
---
> 소수의 제곱 + 소수의 3제곱 + 소수의 4제곱으로 나타낼 수 있는 숫자
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=87) [[영어]](https://projecteuler.net/problem=87)

$a, b, c$를 소수라 했을 때, $a, b, c$의 모든 조합에 대해 $a^2+b^3+c^4$을 구한 다음, $50,000,000$이하의 수를 추려 중복을 제거한 후 개수를 세면 문제의 답을 구할 수 있다. 다만 $a, b, c$를 무한대까지 계산할 수는 없으므로 적절한 범위를 지정해야 한다.
<!--more-->

소수 목록은 `clojure.contrib.lazy-seqs/primes`를 이용해 쉽게 구할 수 있다.

```clojure
(ns p087
  (:require [clojure.contrib.lazy-seqs :refer [primes]]))
```

$a^2+b^3+c^4$를 구하는 함수는 다음과 같이 간단히 작성할 수 있다.

```clojure
(defn calc [a b c]
  (+ (* a a) (* b b b) (* c c c c)))
```

다음 사실을 고려하면 $a, b, c$의 범위도 쉽게 정할 수 있다.

{% math %}
\begin{aligned}
  a^2 < 50,000,000 \qquad &\therefore a < \lfloor \sqrt{50,000,000} \rfloor \\
  b^3 < 50,000,000 \qquad &\therefore b < \lfloor \sqrt[3]{50,000,000} \rfloor \\
  c^4 < 50,000,000 \qquad &\therefore c < \lfloor \sqrt[4]{50,000,000} \rfloor
\end{aligned}
{% endmath %}

$\lfloor\sqrt[n]{x}\rfloor$을 구하는 함수는 다음과 같이 구현할 수 있다.

```clojure
(defn- nth-root [n x]
  (int (Math/pow x (/ 1.0 n))))
```

$a, b, c$에 입력할 소수의 시퀀스 `ps1`, `ps2`, `ps3`는 다음과 같이 정의할 수 있다.

```clojure
(def ps1 (take-while #(< % (nth-root 2 50000000)) primes))
(def ps2 (take-while #(< % (nth-root 3 50000000)) primes))
(def ps3 (take-while #(< % (nth-root 4 50000000)) primes))
```

이제 다음과 같이 $a, b, c$의 모든 조합에 대해 $a^2+b^3+c^4$을 계산한 다음 $50,000,000$미만의 수를 추려서 중복을 제거한 다음 개수를 세면 된다.

```clojure
(defn solve []
  (->> (for [a ps1, b ps2, c ps3] (calc a b c))
       (filter #(< % 50000000))
       set
       count))
```

실행 결과는 다음과 같다.

<pre class="console">
p087=> (time (solve))
"Elapsed time: 1304.593782 msecs"
10??343
</pre>

중복을 제거할 때 `distinct`를 쓸 수도 있으나 `set`이 좀 더 빠르다.

## 참고
* [프로젝트 오일러 87 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p087.clj)
