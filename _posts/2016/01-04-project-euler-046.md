tags: [project-euler, clojure]
date: 2016-01-14
title: 프로젝트 오일러 46
---
> (소수 + 2×제곱수)로 나타내지 못하는 가장 작은 홀수인 합성수는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=46) [[영어]](https://projecteuler.net/problem=46)

홀수인 합성수의 집합에서 (소수 + 2x제곱수) 집합을 뺀 차집합의 최소값을 구하면 된다. 다만 두 집합 모두 크기가 무한대이므로 적절할 상한을 주고 계산해야 한다.<!--more-->

상한을 넘지 않는 범위 안에서 계산하면 복잡할 게 없다. 일단 상한을 10000 정도로 잡아보자. 상한을 넘지 않는 소수 목록은 다음과 같이 구할 수 있다.

```clojure
(ns p046
  (:require [clojure.contrib.lazy-seqs :refer [primes]]
            [clojure.set :refer [difference]]))

(def limit 10000)

(def ps (take-while #(< % limit) primes))
```

홀수인 합성수의 집합은 홀수 집합에서 소수를 제외해 구할 수 있다. `clojure.set/difference`를 쓰면 쉽다.

```clojure
(def odd-composite-nums
  (difference (set (range 3 limit 2))
              ps))
```

(홀수 + 2x제곱수) 집합은 다음과 같이 구할 수 있다.

```clojure
(def goldbach-nums
  (set (for [p ps n (range 1 (Math/sqrt limit))] (+ p (* 2 n n)))))
```

이제 두 집합 `odd-composite-nums`와 `goldbach-nums`의 차집합에서 최소값을 구하면 된다.

```clojure
(defn solve []
  (apply min (difference odd-composite-nums goldbach-nums)))
```

실행 결과는 다음과 같다. 범위(상한) 안에서 문제의 답을 찾았다.

<pre class="console">
p046=> (time (solve))
"Elapsed time: 3.273547 msecs"
57??
</pre>

## 참고
* [프로젝트 오일러 46 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p046.clj)
