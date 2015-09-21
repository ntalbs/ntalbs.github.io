tags: [project-euler, clojure]
date: 2015-01-11
title: 프로젝트 오일러 3
---
> 600851475143의 가장 큰 소인수는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=3) [[영어]](https://projecteuler.net/problem=3)

백만 정도에 대해서는 루프를 돌려도 비교적 빠르게 답을 얻을 수 있지만, 천만이 넘는 경우에는 무식하게 루프를 돌리는 방법이 통하지 않는다.
<!--more-->

이 문제를 푸는 가장 쉽고 빠른 방법은 정말로 소인수 분해를 해보는 것이다. 소인수 분해 함수를 만들어 놓으면 다른 문제에서도 활용할 수 있을 것 같다. Clojure의 `clojure.contrib.lazy-seqs`에는 소수(primes)에 대한 지연 시퀀스가 있다. 이걸 이용하면 소인수 분해를 조금 더 쉽게 할 수 있다.

```clojure
(ns util
  (:require [clojure.contrib.lazy-seqs :refer (primes)]))

;; ...

(defn factorize
  "Returns a sequence of pairs of prime factor and its exponent."
  [n]
  (loop [n n, ps primes, acc []]
    (let [p (first ps)]
      (if (<= p n)
        (if (= 0 (mod n p))
          (recur (quot n p) ps (conj acc p))
          (recur n (rest ps) acc))
        (->> (group-by identity acc)
             (map (fn [[k v]] [k (count v)])))))))
```

코드가 조금 복잡해 보이지만 알고 보면 이해하기 어렵지 않다. 주어진 수 `n`을 가장 작은 소수(=2)로 나눠본다. 나누어 떨어지면 계속 나눠본다. 나누어 떨어지지 않으면 다음 소수에 대해 나누기를 반복한다. 나누어 떨어질 때마다 `acc`에 해당 소수를 `conj`한다. 소수를 주어진 수까지 계속 증가시키면서 이 작업을 계속한다. 다음 소수가 처음 주어진 수 `n`을 넘으면 그때까지 `acc`에 쌓인 수를 `group-by`로 묶어 적절히 조작하면 소인수 분해 결과를 얻을 수 있다.

소인수 분해 함수가 있다면 이 문제는 쉽게 풀 수 있다. 소인수 분해 함수가 리턴하는 결과는 소수와 지수의 벡터이므로 소수 중 최대값을 구하면 된다.

```clojure
(defn solve []
  (->> (factorize 600851475143)
       (map first)
       (apply max)))
```

<pre class="console">
p003=> (time (solve))
"Elapsed time: 0.636411 msecs"
68??
</pre>

## 참고
* [프로젝트 오일러 3 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p003.clj)
