tags: [project-euler, clojure]
date: 2015-10-03
title: 프로젝트 오일러 32
---
> 1~9 팬디지털 곱셈식을 만들 수 있는 모든 수의 합
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=32) [[영어]](https://projecteuler.net/problem=32)

$a \times b = c$가 1-9 팬디지털이 되려면 다음과 같은 이유로 $c$가 네 자리 숫자여야 한다.
<!--more-->

* $c$가 다섯 자리라면 $a$와 $b$의 자릿수 합이 4가 되어야 한다. 이때 $a$와 $b$의 가능한 자릿수 조합은 (1, 3) 또는 (2, 2)가 된다. (3, 1)은 앞의 경우와 대칭이고 곱셈은 교환법칙이 성립하므로 고려하지 않아도 된다. 그러나 한 자리 숫자와 세 자리 숫자를 곱해 만들 수 있는 수나, 두 자리 숫자 두 개를 곱해 만들 수 있는 수는 네 자리를 넘지 못한다. 따라서 $c$는 다섯 자리 수가 될 수 없다. 마찬가지 논리로 $c$가 여섯 자리 이상이 될 수 없음을 확인할 수 있다.
* $c$가 세 자리라면 $a$와 $b$의 자릿수 합이 여섯 자리가 되어야 한다. 이때 $a$와 $b$의 가능한 자릿수 조합은 (1, 5), (2, 4), (3, 3)이 된다. 그러나 이 자리수 조합으로 만들 수 있는 가장 작은 수도 다섯 자리 이상이 된다. 따라서 $c$는 세 자리 수가 될 수 없다. 마찬가지 논리로 $c$가 두 자리 이하가 될 수 없음을 확인할 수 있다.

$c$가 네 자리 숫자라면 $a$와 $b$의 자릿수 합은 5가 되어야 하고, 이때 가능한 자릿수 조합은 (1, 4), (2, 3)이다. $a \times b = c$가 1-9 팬디지털이어야 하므로 1, 2, ... , 9의 순열을 구해 여기서 특정 순열의 일부를 취해 $a, b, c$를 구해 $a \times b = c$가 1-9 팬디지털이 되는지 확인하면 문제를 쉽게 풀 수 있다.

먼저 순열을 쉽게 구하기 위해 `clojure.math.combinatorics`의 `permutations`를 로드한다.

```clojure
(ns p032
  (:require [clojure.math.combinatorics :refer [permutations]]))
```

이제 `(permutations (range 1 10))`으로 1-9의 순열을 구할 수 있다. `permutations` 함수는 벡터의 시퀀스로 결과를 리턴한다. 따라서 다음과 같이 벡터의 받아 $a, b, c$를 구하고 해당 수가 1-9 팬디지털인지 확인하는 함수를 만들 수 있다.

```clojure
(defn- check-pattern [v n1 n2]
  (let [a (to-int (subvec v 0 n1))
        b (to-int (subvec v n1 (+ n1 n2)))
        c (to-int (subvec v (+ n1 n2)))]
    (if (= (* a b) c) c)))
```

`v`에는 1-9의 순열 중 하나가 전달된다. `n1`, `n2`에는 1, 4 또는 2, 3을 전달할 것이다. `v`에서 앞 `n1` 자리를 `a`로, `a` 뒤 `n2` 자리를 `b`로, 나머지는 `c`로 한 다음 $a \times b = c$를 만족하는 경우는 `c`를 리턴하고, 만족하지 않는 경우는 `nil`을 리턴한다.

숫자 벡터를 정수로 바꾸는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn- to-int [v]
  (Integer/parseInt (apply str v)))
```

그리고 다음과 같이 `check` 함수를 작성한다. 순열을 하나 받아 (1, 4), (2, 3) 조합에 대해 `check-pattern`을 호출한다.

```clojure
(defn- check [v]
  [(check-pattern v 1 4)
   (check-pattern v 2 3)])
```

이제 다음과 같이 문제를 풀 수 있다.

```clojure
(defn solve []
  (->> (permutations (range 1 10))
       (mapcat check)
       (remove #(nil? %))
       (distinct)
       (reduce +)))
```

코드는 직관적이다. 1-9 순열에 대해 조건을 만족하는 순열에서 `c`만 뽑아내 중복을 제거한 다음 모두 더하면 된다. `check-pattern` 함수는 조건을 만족하지 않는 경우에 대해서는 `nil`을 리턴하므로 중간에 `remove`로 `nil`을 제거했다.

실행 결과는 다음과 같다.

<pre class="console">p032=> (time (solve))
"Elapsed time: 793.940029 msecs"
452??
</pre>

## 참고
* [프로젝트 오일러 32 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p032.clj)
