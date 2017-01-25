tags: [Project-Euler, Clojure]
date: 2017-01-22
title: 프로젝트 오일러 84
---
> 모노폴리 게임을 4면체 주사위로 할 때 가장 많이 방문하는 칸은?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=84) [[영어]](https://projecteuler.net/problem=84)

이 문제를 수학적으로 푸는 방법이 있는지 모르겠다. 여기서는 문제에 주어진 게임 규칙을 모두 구현한 후, 직접 사면체 주사위를 1백만 번 던져 어느 칸을 가장 많이 방문했는지 세는 방법으로 문제를 풀었다.
<!--more-->

코드가 조금 길긴 하지만, 게임 규칙을 구현한 것에 불과하며 특별히 복잡한 알고리즘이 있는 것은 아니다.

```clojure
(def board (atom (vec (repeat 40 0)))) ; 게임보드에서 각 칸 방문 회수
(def pos (atom 0))                     ; 현재 위치
(def double-cnt (atom 0))              ; 더블 회수
(def chi (atom 0))                     ; 공동기금 카드 인덱스
(def cci (atom 0))                     ; 찬스 카드 인덱스

(defn- roll []
  [(inc (rand-int 4)) (inc (rand-int 4))])

(defn- init []
  (reset! board (vec (repeat 40 0)))
  (reset! pos 0)
  (reset! double-cnt 0))

(defn- visit [n]
  (reset! pos n)
  (swap! board assoc n (inc (nth @board n))))

(defn- go-to [dest]
  (let [n ({:start 0, :jail 10, :c1 11, :e3 24, :h2 39, :r1 5} dest)]
    (visit n)))

(defn- forward [n]
  (let [p (mod (+ @pos n) 40)]
    (if (= 30 p)
      (go-to :jail)
      (visit p))))

(defn- next-pos [n dest]
  (cond (= dest :r) (condp = n 7 15 22 25 36 5)
        (= dest :u) (condp = n 7 12 22 28 36 12)))

(defn- roll []
  [(inc (rand-int 4)) (inc (rand-int 4))])

(defn- inc-index
  "increase the card index"
  [n]
  (mod (inc n) 16))

(defn- cc-instruction
  "community chest"
  [pos]
  (swap! cci inc-index)
  (condp = @cci
    1 #(go-to :start)
    2 #(go-to :jail)
    #(visit pos)))

(defn- chance-instruction
  "chance"
  [pos]
  (swap! chi inc-index)
  (condp = @chi
    1 #(go-to :start)
    2 #(go-to :jail)
    3 #(go-to :c1)
    4 #(go-to :e3)
    5 #(go-to :h2)
    6 #(go-to :r1)
    7 #(visit (next-pos pos :r))
    8 #(visit (next-pos pos :r))
    9 #(visit (next-pos pos :u))
    0 #(forward -3)
    #(visit pos)))

(defn- follow [instruction]
  (if instruction (instruction)))

(defn- roll-and-move []
  (let [[r1 r2] (roll) p (+ r1 r2 @pos)]
    (if (= r1 r2)
      (swap! double-cnt inc)
      (reset! double-cnt 0))
    (cond (= 3 @double-cnt) (go-to :jail)
          (#{2 17 33} p) (follow (cc-instruction p))
          (#{7 22 36} p) (follow (chance-instruction p))
          :else (forward (+ r1 r2)))))

(defn run [n]
  (->> (repeatedly n roll-and-move)
       (last)
       (map-indexed (fn [i v] [i v]))
       (sort-by second #(compare %2 %1))
       (take 3)
       (map first)
       (map #(format "%02d" %))
       (apply str)))

(defn simulate []
  (init)
  (run 100000))

(defn solve []
  (->> (repeatedly 10 simulate)
       (group-by identity)
       (map (fn [[k xs]] [k (count xs)]))
       (sort-by second)
       (ffirst)))
```

실행 결과는 다음과 같다.

<pre class="console">
p084=> (time (solve))
"Elapsed time: 5255.086709 msecs"
"1015??"
</pre>

운이 좋아 답을 구하기는 했지만, 실행 결과가 항상 정답을 구한다는 보장은 없다. D1(16)과 E3(24)의 방문 확률의 차이가 크지 않아 1백만번을 돌려도 종종 D1이 이기는 경우가 있다. 1백만번 돌리는 시뮬레이션을 10번 수행해서 많이 나오는 쪽으로 판단했지만, 이렇게 해도 D1이 이기는 경우가 있다.

## 참고
* [프로젝트 오일러 84 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p084.clj)
