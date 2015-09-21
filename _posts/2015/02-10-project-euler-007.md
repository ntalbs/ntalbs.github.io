tags: [project-euler, clojure]
date: 2015-02-10
title: 프로젝트 오일러 7
---
> 10001번째의 소수?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=7) [[영어]](https://projecteuler.net/problem=7)

[에라토스테네스 체(Sieve of Eratosthenes)](http://en.wikipedia.org/wiki/Sieve_of_Eratosthenes)를 이용하면 소수 목록을 구할 수 있지만, 이 문제의 경우 체의 범위를 어디까지 해야 할지가 애매하다. 대충 50,000 정도까지 해보고 안 되면 다시 100,000 정도까지 해보는 식으로 범위를 늘려가며 문제를 풀 수도 있다.<!--more-->

## 방법 1
어떤 수가 소수인지 빠르게 판단할 수 있다면 숫자를 증가시켜가며 소수만 걸러내는 방법을 사용하는 것도 가능하다. 소수인지 판별하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn prime?
  "Returns true if n is prime."
  [n]
  (cond (< n 2) false
        (< n 4) true                    ; 2, 3
        (even? n) false
        (< n 9) true                    ; 5, 7
        (= 0 (mod n 3)) false
        :else (nil? (take 1 (filter #(= 0 (mod n %))
                                    (range 3 (inc (int (Math/sqrt n))) 2))))))
```

짝수(=2의 배수) 또는 3의 배수는 소수가 아니므로 바로 `false`를 리턴한다. 다른 경우에는 $\sqrt{n}$까지 숫자를 증가시키며 나눠보는 로직이 포함되어 있다. 중간에 하나라도 나눠지는 경우가 있으면 바로 `false`를 리턴할 것이다.

소수인지 판단하는 `prime?` 함수를 구현했다면 10,001번째 소수는 다음과 같이 구할 수 있다.

```clojure
(defn using-predicate []
  (->> (iterate inc 2)
       (filter prime?)
       (drop (dec limit))
       first))
```

## 방법 2
`clojure.contrib.lazy-seqs/primes`를 이용하는 간단한 방법도 있다. 이름이 암시하듯 모든 소수에 대한 지연 시퀀스를 나타낸다. 따라서 10,001번째 소수는 다음과 같이 구할 수도 있다.

```clojure
(require '[clojure.contrib.lazy-seqs :refer [primes]])

(defn using-seq []
  (->> primes
       (drop (dec limit))
       first))
```

## 정리
실행해보면 두 방법 모두 충분히 빠르게 답을 구한다.

<pre class="console">
p007=> (time (using-predicate))
"Elapsed time: 239.324261 msecs"
104???
p007=> (time (using-seq))
"Elapsed time: 107.451821 msecs"
104???
</pre>

## 참고
* [프로젝트 오일러 7 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p007.clj)
