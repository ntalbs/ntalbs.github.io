tags: [Project-Euler, Clojure]
date: 2018-04-01
title: 프로젝트 오일러 90
---
> 정육면체 두 개로 제곱수 만들기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=90) [[영어]](https://projecteuler.net/problem=90)

100 미만의 제곱수는 아홉 가지 뿐이고, 숫자 10개 중 6개를 고르는 경우의 수도 210($_{10}C_6 = 210$)으로 비교적 작으므로, 모든 조합을 구해 계산해 보는 무식한 방법을 적용해도 문제를 풀 수 있을 것 같다.
<!--more-->

먼저 다음과 같이 조합을 구할 때 사용할 `combination`, 차집합을 구할 때 사용할 `difference`를 사용할 수 있도록 네임스페이스를 설정해둔다.

```clojure
(ns p090
  (:require [clojure.math.combinatorics :refer [combinations]]
            [clojure.set :refer [difference]]
            [util :refer [parse-int]]))
```

100 미만의 제곱수 집합을 미리 구해두면 문제를 풀 때 유용하다. 100 미만 제곱수 집합은 다음과 같이 간단히 구할 수 있다.

```clojure
(def sqnums (set (map #(* % %) (range 1 10))))
```

0부터 9 중 6개의 수를 고른 모든 조합은 다음과 같이 `combinations` 함수로 쉽게 구할 수 있다.

```clojure
(def digits-sets
  (->> (combinations (range 10) 6)
       (map set)))
```

이 조합 중 첫 번째 주사위와 두 번째 주사위에 배정할 조합을 선택해야 한다. `digits-sets`에서 두 집합을 선택하는 모든 조합은 다음과 같이 구할 수 있다.

```clojure
(def set-pairs
  (set (map set (combinations digits-sets 2))))
```

문제에서 6과 9는 뒤집었을 때 같은 모양이 되므로 뒤집는 것을 허용한다. 이렇게 6과 9를 뒤집는 경우를 고려하려면 숫자 집합에 6이 포함되어 있는 경우 9를 추가하고, 숫자 집합에 9가 포함되어 있는 경우는 6을 추가해야 한다.

```clojure
(defn adjust-ds [ds]
  (cond (contains? ds 6) (conj ds 9)
        (contains? ds 9) (conj ds 6)
        :else ds))
```

숫자 두 집합으로 만들 수 있는 숫자를 구한 다음 100 미만의 제곱수를 모두 나타낼 수 있는지 확인하는 함수를 만들 차례다. `for`를 이용해 두 숫자 집합 `ds1`과 `ds2`로 만들 수 있는 숫자를 모두 포함하는 집합을 구한다. 100 미만의 제곱수를 모두 포함하고 있는 `sqnums`에서 이 집합을 뺀 차집합을 구한다. 결과가 공집합이면 100 미만의 모든 제곱수를 나타낼 수 있는 조합이라 할 수 있다.

```clojure
(defn check [ds1 ds2]
  (->> (for [d1 (adjust-ds ds1), d2 (adjust-ds ds2)] [(+ (* d1 10) d2) (+ (* d2 10) d1)])
       flatten
       set
       (difference sqnums)
       empty?))
```

이제 다음과 같이 답을 구할 수 있다. `set-pairs` 중 `check` 함수를 통과하는 조합만 구해 세면 된다.

```clojure
(defn solve []
  (->> set-pairs
       (filter (fn [pair] (check (first pair) (second pair))))
       count))
```

실행 결과는 다음과 같다. 답을 구하는 데 거의 2초 가까이 걸린다.

<pre class="console">
p090=> (time (solve))
"Elapsed time: 1991.128349 msecs"
12?7
</pre>


## 참고
* [프로젝트 오일러 90 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p090.clj)
