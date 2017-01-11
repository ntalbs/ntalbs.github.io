tags: [Project-Euler, Clojure]
date: 2017-01-11
title: 프로젝트 오일러 83
---
> 상하좌우로 움직여서 좌상단→우하단으로 가는 경로의 합이 최소인 경우는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=83) [[영어]](https://projecteuler.net/problem=83)

이 문제에는 두 가지 복병이 기다리고 있었다. 하나는 [A* Search Algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm) 알고리즘이었다. 여러 가지 방법을 생각해 보았지만 A\* 알고리즘을 사용하지 않고는 풀 수 없었다. 구글로 검색해보면 A\* 알고리즘에 대한 설명을 찾을 수 있지만 이해하기가 쉽지 않았다. 얼마 전 [Couresra](https://www.coursera.org)에서 [Algorithms, Part I](https://www.coursera.org/learn/algorithms-part1)을 수강한 후에야 A\* 알고리즘을 이해할 수 있었다.
<!--more-->

또 다른 어려움은 알고리즘을 Clojure로 구현하는 것이었다. 일단 Java로 문제를 푼 다음 Clojure로 옮겼다. Java에서는 배열을 만들어놓고 업데이트해가며 문제를 풀 수 있는데, Clojure에서는 그런 식의 접근이 쉽지 않았다. 아직 Clojure에 충분히 익숙하지 않아서 그런 것일 게다.

알고리즘을 간단히 설명하면, 시작 위치에서 이웃 노드를 구해 우선순위 큐에 넣는다. 큐에서의 우선순위는 목표 위치까지의 맨하탄 거리와 해당 노드까지의 경로 합을 이용해 계산한 값으로 정한다. 큐에서 노드 하나를 꺼내 이웃을 구해 중복을 제거해 다시 큐에 넣는다. 이 과정을 반복해 큐에서 나온 값이 목표 위치가 되면 그때까지의 경로 합이 답이 된다.

먼저, 다음과 같이 데이터를 로드한다.

```clojure
(ns p083
  (:require [util :refer [split parse-int]]))

(def ^:private m
  (->> (slurp "data/matrix.txt")
       (split  #"\r\n")
       (mapv (fn [line]
               (mapv (fn [s] {:val (parse-int s)}) (split #"," line ))))))
```

[문제 81](/2017/project-euler-081/), [문제 82](/2017/project-euler-082/)에서는 행렬 안에 숫자만 있었지만, 여기서는 행렬 안에 `{:val 1234}` 형태의 맵을 넣는다. 문제를 풀면서 여기에 해당 위치까지의 누적합 `:sum`을 추가할 것이다. 다음과 같이 상수도 정의해 놓는다.

```clojure
(def ^:private SIZE (count m))

(def ^:private weight 5)

(def ^:private start-node
  (let [v (get-in m [0 0 :val])]
    {:row 0, :col 0, :val v :sum v}))
```

`SIZE`는 전체 배열(실제로는 벡터)의 크기다. 가로 세로 크기가 같으므로 `SIZE` 하나로 충분하다. `weight`는 노드를 비교하는 함수를 만들 때 사용할 것이다. 값을 5로 한 이유는 나중에 설명할 것이다. 노드는 `:row`, `:col`, `:val`, `:sum`, `:prev` 속성을 가지는 해시맵을 사용할 것이다.

목표 위치까지의 맨하탄 거리를 구하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn- manhattan [n]
  (- (* 2 SIZE) (n :row) (n :col)))
```

현재 노드가 목표 위치에 있는지 확인하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn- destination? [n]
  (and (= (:row n) (:col n) (dec SIZE))))
```

두 노드를 비교하는 함수는 다음과 같이 작성할 수 있다. 맨하탄 거리에 `weight`를 곱한 값과 현재 위치까지의 경로합을 더한 값으로 두 노드를 비교한다.

```clojure
(defn- node-comparator [n1 n2]
  (- (+ (n1 :sum) (* weight (manhattan n1)))
     (+ (n2 :sum) (* weight (manhattan n2)))))
```

두 노드가 이웃인지 확인하는 함수도 다음과 같이 작성할 수 있다. 행렬에서 상하좌우로 이동할 수 있으므로, `n1`이 `n2`의 상하좌우에 있다면 이웃으로 판단한다.

```clojure
(defn- neighbor? [n1 n2]
  (cond
    (nil? n1) false
    (nil? n2) false
    :else (let [dr (Math/abs (- (n1 :row) (n2 :row)))
                dc (Math/abs (- (n1 :col) (n2 :col)))]
            (= 1 (+ dr dc)))))
```

목표 위치에 도달했을 때 어떤 경로로 왔는지 확인하기 위해 경로를 구하는 함수를 작성할 수 있다.

```clojure
(defn- path [to-node]
  (loop [n to-node acc '()]
    (if (nil? (n :prev))
      (conj acc [(n :row) (n :col)])
      (recur (n :prev) (conj acc [(n :row) (n :col)])))))
```

현재 노드의 이웃을 구하는 함수는 조금 복잡하다. 불필요한 계산을 피하기 위해 이미 방문했던 노드는 이웃에서 제외한다.

```clojure
(defn- neighbors [current]
  (let [prev1  (current :prev)
        prev2  (if prev1 (prev1 :prev))
        deltas [[-1 0] [0 1] [1 0] [0 -1]]]
    (->> deltas
         (map (fn [[dr dc]] [(+ (current :row) dr) (+ (current :col) dc)]))
         (remove (fn [[r c]] (or (< r 0) (>= r SIZE) (< c 0) (>= c SIZE))))
         (map (fn [[r c]]
                (let [v (get-in m [r c :val])]
                  {:row r, :col c,
                   :prev current, :val v, :sum (+ (current :sum) v)})))
         (remove #(= % prev1))
         (remove #(neighbor? % prev2)))))
```

우선순위 큐로는 `sorted-set`을 사용한다. `corted-set-by`로 `comparator`를 지정한다. `comparator`는 위에서 정의한 `node-comparator`를 사용한다.

```clojure
(defn solve []
  (loop [data    m
         pq      (sorted-set-by node-comparator start-node)
         current (first pq)]
    (if (destination? current)
      (current :sum)
      (let [prev1 (current :prev)
            prev2 (if prev1 (prev1 :prev))
            ns    (->> (neighbors current)
                       (filter (fn [{r :row c :col s :sum}]
                                 (let [prev-sum (get-in data [r c :sum])]
                                   (or (nil? prev-sum) (< s prev-sum))))))
            pq    (apply conj (disj pq current) ns)]
        (recur (reduce (fn [m {r :row c :col s :sum}]
                         (update-in m [r c] assoc :sum s)) data ns)
               pq
               (first pq))))))
```

`neighbors`를 이용해 이웃을 구한 다음 각 이웃 노드에 대해 해당 위치까지의 합이 기존에 구한 합보다 작은지 확인한다. 기존에 구한 합이 작다면 해당 이웃은 버린다. 이렇게 구한 이웃을 다시 우선순위 큐에 넣는다. 그리고 이 이웃을 이용해 행렬에 `:sum`을 업데이트한다.

실행 결과는 다음과 같다. 충분히 빠른 시간 안에 답을 구한다.

<pre class="console">
p083=> (time (solve))
"Elapsed time: 299.122935 msecs"
42??85
</pre>

`weight`에 대해 약간의 부연설명이 필요할 듯 하다. 우선순위 큐에서 노드간 우선순위를 정할 때 어떤 기준을 사용하느냐에 따라 우선순위가 달라질 수 있다. 여기서 기준으로 사용한 값은 $sum + weight \times (manhattan\, distance)$다. 즉, 누적 합이 적을수록, 맨하탄 거리가 가까와질수록 우선순위가 높아진다. 맨하탄 거리에 `weight`를 곱하면 맨하탄 거리의 영향력이 증가한다.

Java로 구현한 풀이에서는 `java.util.PriorityQueue`를 사용했는데, `weight` 값에 0, 5, 10을 주어 계산해도 정답을 구하는 데 아무런 문제가 없었다. 그러나 여기서 사용한 `sorted-set`은 `weight` 값에 민감하게 영향을 받는다. `weight`가 0 또는 10이었을 때는 답을 구하지 못했지만 5로 한 경우에는 정답을 구했다.

## 참고
* [프로젝트 오일러 83 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p083.clj)
* [A* Search Algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm)
* [Coursera: Algorithms, Part I](https://www.coursera.org/learn/algorithms-part1)
