tags: [project-euler, clojure]
date: 2015-10-04
title: 프로젝트 오일러 33
---
> 이상한 방법으로 약분할 수 있는 분수 찾기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=33) [[영어]](https://projecteuler.net/problem=33)

값이 1보다 작고 분모와 분자가 모두 두 자릿수인 분수는 모두 4005개다. 이 정도라면 그냥 루프를 돌려 확인해도 금방 답을 찾을 수 있다. 이상한 방법으로 약분하는 함수는 다음과 같이 작성할 수 있다. `n`은 numerator, 즉 분자를 나타내며, `d`는 denominator, 즉 분모를 나타낸다.<!--more-->

```clojure
(ns p033
  (:require [util :refer [digits]]))

(defn st-cancel "strange cancel" [[n d]]
  (let [[n1 n2] (digits n) [d1 d2] (digits d)]
    (cond (= n1 d1) (/ n2 d2)
          (= n1 d2) (/ n2 d1)
          (= n2 d1) (/ n1 d2)
          (= n2 d2) (/ n1 d1)
          :else nil)))
```

이상한 방법으로 약분되는 경우만 쉽게 필터링할 수 있도록 이상한 방법으로 약분되지 않는 경우에는 `nil`을 리턴하도록 했다.

분자, 분모 모두 두 자리 정수이고 값이 1보다 작은 수 중에서 문제의 조건을 만족하는 수를 찾아야 한다. 값이 1보다 작으려면 분자가 분모보다 작아야 하므로 조사할 대상 분수는 다음과 같이 만들 수 있다.

```clojure
(def rs
  (for [n (range 10 100) d (range (inc n) 100)
        :when (not= 0 (mod n 10))
        :when (not= 0 (mod d 10))]
    [n d]))
```

이제 `rs`의 각 요소 중에서 문제의 조건을 만족하는 요소만 추려내면 된다. `[n d]`를 받아 `(/ n d)`와 `(st-cancel n d)`가 같은 경우만 `filter`로 추려낸 다음 `(/ n d)`를 계산해 모두 곱한 다음 분모를 구하면 된다. 코드로 작성하면 다음과 같이 된다.

```clojure
(defn solve []
  (->> rs
       (filter (fn [[n d]] (= (/ n d) (st-cancel [n d]))))
       (map (fn [[n d]] (/ n d)))
       (reduce *)
       denominator))
```

실행 결과는 다음과 같다.

<pre class="console">p033=> (time (solve))
"Elapsed time: 6.042714 msecs"
?00
</pre>

## 참고
* [프로젝트 오일러 33 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p033.clj)
