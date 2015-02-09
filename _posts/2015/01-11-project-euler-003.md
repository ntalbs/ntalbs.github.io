tags: [project-euler, clojure]
date: 2015-01-11
title: 프로젝트 오일러 - 문제 3
---
<div class="box">[600851475143의 가장 큰 소인수는?](http://euler.synap.co.kr/prob_detail.php?id=3)</div>

백만 정도에 대해서는 루프를 돌려도 비교적 빠르게 답을 얻을 수 있지만, 천만이 넘는 경우에는 무식하게 루프를 돌리는 방법이 통하지 않는다.
<!--more-->

이 문제를 푸는 가장 쉽고 빠른 방법은 정말로 소인수 분해를 해보는 것이다. 소인수 분해 함수를 만들어 놓으면 다른 문제에서도 활용할 수 있을 것 같다.

```
(ns util
  (:require [clojure.contrib.lazy-seqs :refer (primes)]))

; ...

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

Clojure의 `clojure.contrib.lazy-seqs`에는 소수(primes)에 대한 지연 시퀀스가 있다. 이걸 이용하면 소인수 분해를 조금 더 쉽게 할 수 있다.

소인수 분해 함수가 있다면 이 문제는 쉽게 풀 수 있다. 소인수 분해 함수가 리턴하는 결과는 소수와 지수의 벡터이므로 소수 중 최대값을 구하면 된다.

```
(defn solve []
  (->> (factorize 600851475143)
       (map first)
       (apply max)))
```
