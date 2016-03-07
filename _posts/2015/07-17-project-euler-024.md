tags: [Project-Euler, Clojure]
date: 2015-07-17
title: 프로젝트 오일러 24
---
> 0, 1, 2, 3, 4, 5, 6, 7, 8, 9로 만들 수 있는 1,000,000번째 사전식 순열은?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=24) [[영어]](https://projecteuler.net/problem=24)

`clojure.math.combinatorics`의 `nth-permutation` 함수를 이용하면 바로 답을 구할 수 있다. 다만 인덱스가 0부터 시작한다는 점에 주의해야 한다.<!--more-->

```clojure
(ns p024
  (:require [clojure.math.combinatorics :as c]))

(defn solve []
  (apply str (c/nth-permutation (range 10) (dec 1000000))))
```

실행 결과는 다음과 같다.

<pre class="console">p024=> (time (solve))
"Elapsed time: 0.249825 msecs"
"??83915460"
</pre>

순열을 직접 구현해 풀이를 시도했는데, 답을 구하기는 했지만 결과가 만족스럽지는 못했다. 순열을 구하는 방법은 [순열 구하기](/2015/07/17/permutations/)에 따로 정리했다.

## 참고
* [프로젝트 오일러 24 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p024.clj)
* [clojure.math.combinatorics](https://github.com/clojure/math.combinatorics/)
* [순열 구하기](/2015/07/17/permutations/)
