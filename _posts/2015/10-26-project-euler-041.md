tags: [Project-Euler, Clojure]
date: 2015-10-26
title: 프로젝트 오일러 41
---
> n자리 팬디지털 소수 중에서 가장 큰 수
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=41) [[영어]](https://projecteuler.net/problem=41)

두 가지 방법이 떠오른다. 하나는 `clojure.contrib.lazy-seqs`의 `primes`를 이용하는 방법이다. 가장 큰 팬디지털 수는 987654321이므로 이걸 상한으로 소수를 하나씩 조사해가며 팬디지털 수인지 확인해 가장 큰 수를 구하면 된다. 그러나 이 방법은 987654321보다 작은 수 중 가장 큰 소수에 도달할 때까지 확인을 해야 하므로 답을 빠르게 구하기는 어려워 보인다.
<!--more-->

다른 방법은 `clojure.contrib.combinatorics`의 `permutations`를 이용하는 방법이다. `[9 8 7 6 5 4 3 2 1]`의 순열을 구해 이 중 소수가 있는지 확인하고, 없으면 그 다음에는 `[8 7 6 5 4 3 2 1]`의 순열을 구해 소수가 있는지 확인하는 방법이다. 1부터 `n`까지 하나씩 들어있는 시퀀스의 순열을 구하므로 시퀀스의 순열을 이어붙인 숫자는 팬디지털 수다. 큰 수부터 작은 수 순으로 순열을 구하므로 위에서부터 찾아 내려가다가 소수를 만나면 그 소수가 답이라 할 수 있다.

큰 수부터 탐색해 나가기 위해서는 `[9 8 7 ... 1]`, `[8 6 5 ... 1]`, .. `[2 1]`과 같은 시퀀스를 만들 필요가 있다. 이 시퀀스는 `[1 2]`, `[1 2 3]`, ... , `[1 2 3 ... 9]`와 같은 시퀀스를 만든 다음 시퀀스 자체와 시퀀스 안의 시퀀스를 `reverse` 해 구하는 것이 쉽다.

그 다음 순열을 구해 나온 숫자가 소수인지 확인한다. 큰 수부터 탐색해 내려가므로 처음 찾은 소수가 답이다.

```clojure
(ns p041
  (:require [util :refer [parse-int prime?]]
            [clojure.contrib.combinatorics :refer [permutations]]))

(defn solve []
  (->> (reverse (reductions conj [1] (range 2 10)))
       (map reverse)
       (mapcat permutations)
       (map #(parse-int (apply str %)))
       (filter prime?)
       first))
```

직관적인 코드다. 위에서 설명한 절차대로 코드가 씌어 있다. 실행 결과는 다음과 같다.

<pre class="console">
p041=> (time (solve))
"Elapsed time: 778.938065 msecs"
7652???
</pre>

## 참고
* [프로젝트 오일러 41 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p041.clj)
