tags: [Project-Euler, Clojure]
date: 2016-04-06
title: 프로젝트 오일러 61
---
> 순환적인 성질을 갖는 4자리 다각수 여섯 개의 합
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id= 61) [[영어]](https://projecteuler.net/problem= 61)

네 자리 다각수의 집합을 구한 다음 앞 두 자리를 키로 하여 맵을 만들어 놓으면 꼬리를 무는 수를 쉽게 찾을 수 있다.<!--more-->

먼저 다각수를 구하는 함수를 구현해 보자. 문제에서 주어진 공식대로 함수를 만들기만 하면 된다. 예전에 만들었던 [infix 매크로](/2014/infix-macro/)를 사용하면 수식을 조금 알아보기 쉽게 기술할 수 있다.

```clojure
(ns p061
  (:require [util :refer (infix)]))

(defn- p [k n]
  (condp = k
    3 (infix ((n * (n + 1)) / 2))
    4 (infix (n * n))
    5 (infix ((n * ((3 * n) - 1)) / 2))
    6 (infix (n * ((2 * n) - 1)))
    7 (infix ((n * ((5 * n) - 3)) / 2))
    8 (infix (n * ((3 * n) - 2)))))
```

네 자리 다각수를 구하는 함수는 다음과 같이 작성할 수 있다. 위에서 구현한 `p`를 이용해 시퀀스를 만들어 1000보다 작은 수는 버리고(`drop`) 10000보다 작은 수만 취하면(`take`) 네 자리 다각수만 남는다.

```clojure
(defn- s [k]
  (->> (iterate inc 1)
       (map #(p k %))
       (drop-while #(< % 1000))
       (take-while #(< % 10000))))
```

`(s 3)`은 네 자리 삼각수, `(s 4)`는 네 자리 사각수가 되는 식이다. 숫자만 보고 그 수가 어떤 다각수인지 알기 어려우므로 각 수가 어떤 다각수인지 쉽게 볼 수 있게 해두면 좋겠다. 다음 함수는 주어진 다각수의 시퀀스를 `{:k k, :n n}` 형태의 시퀀스로 변환해 어떤 수(`n`)가 어떤 다각수(`k`)인지 쉽게 알 수 있게 한다.

```clojure
(defn- ps [k]
  (->> (s k)
       (map (fn [n] {:k k, :n n}))))
```

주어진 숫자에서 앞쪽 두 자리, 뒤쪽 두 자리를 구하는 함수도 간단히 만들 수 있다. 네 자리 숫자만 고려하면 되므로 앞쪽 두 자리를 구할 때는 100으로 나눈 몫을 사용할 수 있다.

```clojure
(defn- first-2-digits [n] (quot n 100))
(defn- last-2-digits [n] (rem n 100))
```

맨 처음 말했던, 앞 두 자리를 키로 하는 다각수의 맵은 다음과 같이 간단히 만들 수 있다.

```clojure
(def M
  (->> (range 3 9)
       (mapcat ps)
       (group-by (fn [e] (first-2-digits (e :n))))))
```

이 맵을 이용해 꼬리를 무는 수를 찾을 차례다. 다각수의 시퀀스 `ps`를 받은 다음 각 수의 뒤쪽 두 자리를 잘라내 이 수로 시작하는 다른 다각수를 `M`에서 찾아 연결하는 함수를 구현해야 한다. 시퀀스의 각 요소 역시 벡터로 만들고 `chain` 함수를 호출할 때마다 벡터의 마지막 요소에서 숫자를 꺼내 뒤쪽 두 자리를 잘라낸 다음 이 수로 `M`에서 다른 다각수를 찾은 다음 원래 벡터에 새로 찾은 다각수를 `conj` 한다.

```clojure
(defn- chain [ps]
  (for [e ps, t (M (last-2-digits (:n (last e))))] (conj e t)))
```

문제를 푸는 데 필요한 부품을 모두 만들었다. 이제 다음과 같이 문제를 풀 수 있다. `chain` 함수로 연결한 다각수 시퀀스(벡터)에 대해 첫 요소와 마지막 요소가 같은 경우만 골라내고, 벡터 안에 삼각수, 사각수, ..., 팔각수가 모두 포함된 경우만 골라낸 다음 숫자를 모두 더하면 된다.

```clojure
(defn solve []
  (->> (map vector (ps 8))
       (chain)
       (chain)
       (chain)
       (chain)
       (chain)
       (chain)
       (filter #(= (first %) (last %))) ; check cycle
       (filter (fn [e] (= #{3 4 5 6 7 8} (set (map #(% :k) e)))))
       first rest
       (map #(:n %))
       (apply +)))
```

함수의 첫 행이 `(ps 8)`로 되어 있는데, `ps` 함수에 3, 4, ..., 8 중 아무 수나 넣어도 답을 구하는 데 지장이 없다. 여기서 굳이 `(ps 8)`을 선택한 것은 `(ps 8)`이 요소의 개수가 가장 적어 답을 가장 빨리 구할 수 있기 때문이다. 마치 관계형 데이터베이스에서 두 테이블을 조인할 때 데이터가 적은 쪽에서 시작하는 편이 성능에 유리한 것과 같은 이치다.

실행 결과는 다음과 같다.

<pre class="console">
p061=> (time (solve))
"Elapsed time: 8.475585 msecs"
28??4
</pre>

`ps` 함수에 다른 수를 넣어 실행해보면 시간이 조금 더 오래 걸리는 것을 확인할 수 있다.

## 참고
* [프로젝트 오일러  61 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p061.clj)
* [infix 매크로](/2014/infix-macro/)
