tags: [Project-Euler, Clojure]
date: 2017-01-10
title: 프로젝트 오일러 82
---
> 맨 왼쪽 열에서 맨 오른쪽 열까지 가는 경로의 합이 최소인 경우는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=82) [[영어]](https://projecteuler.net/problem=82)

시작 위치와 종료 위치가 고정되어 있지 않다. 맨 왼쪽 열의 아무 곳에서 시작해 맨 오른쪽 열의 아무 곳에나 도착하기만 하면 된다. 위/아래/오른쪽 세 방향으로 이동할 수 있다. 왼쪽으로는 이동할 수 없다.
<!--more-->

맨 오른쪽 열에서 시작해 왼쪽으로 가면서 오른쪽으로 이동할 때 합이 최소가 되는 경우를 구하면 될 것 같다. 아마도 `reduce`를 쓰게될 것이다.

데이터를 읽어들이는 코드는 [문제 81](/2017/project-euler-081/)과 똑같다.

```clojure
(ns p082
  (:require [util :refer [parse-int split]]))

(def ^:private m
  (->> (slurp "data/matrix.txt")
       (split  #"\r\n")
       (mapv (fn [line] (mapv parse-int (split #"," line ))))))
```

열의 숫자가 `xs`와 `ys`로 주어진다면 `xs` 열에서 `ys`열로 갈 때 각 쎌까지 도달하는 데 최소가 되는 합은 다음 함수로 구할 수 있다.

```clojure
(defn sweep [xs ys]
  (let [cs1 (reduce min-sum [] (map vector xs ys))
        cs2 (reverse (reduce min-sum [] (reverse (map vector xs ys))))]
    (map min cs1 cs2)))
```

이 함수에서 호출하는 `min-sum` 함수는 첫 인자로 시퀀스를 받는데 이 시퀀스의 마지막 요소가 바로 위 셀까지 도달하는 데 필요한 최소합이다. 따라서 시퀀스가 비어있을 때는 인수로 받은 `x`, `y`의 합을 `vs`에 추가해 리턴하지만, 시퀀스에 요소가 있을 때는 `x`, `y`의 합과 시퀀스의 마지막 요소와 `y`의 합을 비교해 작은 값을 `vs`에 추가해 리턴한다.

```clojure
(defn min-sum [vs [x y]]
  (if (empty? vs)
    (conj vs (+ x y))
    (conj vs (min (+ x y) (+ y (last vs))))))
```

이 함수는 왼쪽 열에서 오른쪽 열로 이동할 때, 왼쪽에서 오는 경우와 위에서 오는 경우는 고려하지만 아래서 오는 경우는 고려하지 않는다. `sweep` 함수에서는 위쪽에서 오는 경우와 아래쪽에서 오는 경우 모두 고려하기 위해 `min-sum` 함수를 두 번 호출한다. `cs1`은 위에서 오는 경우를 고려한 시퀀스이고 `cs2` 아래에서 오는 경우를 고려한 시퀀스다. `sweep` 함수는 리턴하기 전에 `cs1`과 `cs2`를 비교해 작은 값을 골라 시퀀스를 만들어 리턴한다.

따라서 `sweep` 함수는 `xs`에서 `ys`열로 갈 때 `ys`의 각 셀에 도달하는 최소 합을 나타내는 시퀀스를 리턴하게 된다.

`sweep` 함수를 이용하면 문제의 답을 쉽게 구할 수 있다. 열 별 조작을 쉽게 하기 위해 행렬을 전치(transpose)한 후, 오른쪽에서 왼쪽으로 (전치된 행렬에서는 아래서 위로) `reduce` 하기 위해 순서를 거꾸로(reverse) 바꾼다. 이제 `sweep`로 `reduce`한 다음 최소값을 구하면 답이 된다.

```clojure
(defn solve []
  (->> (apply mapv vector m) ; transpose
       (reverse)
       (reduce sweep)
       (apply min)))
```

실행 결과는 다음과 같다. 빠르게 답을 구한다.

<pre class="console">
p082=> (time (solve))
"Elapsed time: 39.575654 msecs"
26??24
</pre>

생각해보니, 합이 최소가 되는 경로가 왼쪽에서 오른쪽으로 갈 때와 오른쪽에서 왼쪽으로 갈 때가 다를 리 없을 것 같다. `reverse`가 없어도 되지 않을까?

```clojure
(defn solve []
  (->> (apply mapv vector m) ; transpose
       (reduce sweep)
       (apply min)))
```

수정 후 실행해보면 결과가 같음을 확인할 수 있다.

## 참고
* [프로젝트 오일러 82 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p082.clj)
