tags: [Project-Euler, Clojure]
date: 2016-03-08
title: 프로젝트 오일러 54
---
> 포커 게임에서 이긴 회수 구하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=54) [[영어]](https://projecteuler.net/problem=54)

이 문제를 푸는 데 수학적인 지식이나 통찰은 전혀 필요하지 않은 것으로 보였다. 그저 주어진 카드 패가 어떤 계급인지 판단하는 방법을 구현하고 계급에 따라 승패를 정해 1번 선수가 이긴 횟수를 구하기만 하면 되는 단순한 문제로 보였다. 이렇게 해도 답을 구하는 데는 전혀 문제가 없었지만, 마음에 들지 않았다. 패가 특정 계급인지 판단하는 여러 개의 함수와 연속된 조건문... 더 좋은 방법이 없을까?
<!--more-->

그러다 [Dreamshire](http://blog.dreamshire.com/project-euler-54-solution/)에서 새로운 풀이를 보게 되었다. 패를 정량화할 수 있다면 빠르게 승패를 알 수 있다. 계급의 순서는 문제에 주어졌다. 스트레이트와 플러시(스트레이트 플러시와 로열 플러시 포함)를 제외한 다른 패는 모두 같은 숫자가 몇 개인지에 따라 계급이 결정된다. 스트레이트와 플러시 계열은 별도 절차를 통해 확인해야 한다.

먼저 카드의 숫자를 진짜 숫자로 바꾸는 함수가 있어야 한다. 카드 숫자 중 일부가 알파벳으로 되어 있으므로 이를 숫자로 바꿔 놓아야 정렬하기가 쉽다.

```clojure
(defn n->p "Convert number on card to point" [c]
  (case c
    \2 2, \3 3, \4 4, \5 5, \6 6, \7 7, \8 8, \9 9,
    \T 10, \J 11, \Q 12, \K 13, \A 14))
```

패가 스트레이트인지 확인하는 함수와 플러시인지 확인하는 다음과 같이 작성할 수 있다.

```clojure
(def straight-set
  (->> "A23456789TJQKA"
       (partition 5 1)
       (map set)
       set))

(defn straight? [hand]
  (let [card-nums (->> hand (map first) set)]
    (contains? straight-set (set card-nums))))

(defn flush? [hand]
  (= 1 (->> hand (map second) set count)))
```

카드 숫자를 정렬해 파티션한 다음 각 파티션의 원소 수를 나타낸 패턴을 구하면 그 패턴으로 계급을 알 수 있다.

```
[1 1 1 1 1] => high card
[2 1 1 1]   => one pair
[2 2 1]     => two pairs
[3 1 1]     => threee of a kind
[]          => straight
[]          => flush
[3 2]       => full house
[4 1]       => four of a kind
```

플러시인 동시에 스트레이트면 스트레이트 플러시가 되고, 스트레이트 플러이인데 카드 숫자가 10, J, Q, K, A면 로열 플러시다. 이 사실을 이용해 패의 계급을 구하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn rank [hand]
  (let [ranks [[1 1 1 1 1] [2 1 1 1] [2 2 1] [3 1 1] [] [] [3 2] [4 1]]
        nums   (->> hand (map first) (map n->p) (sort desc) (partition-by identity))
        r1     (->> nums (map count) (sort desc) (.indexOf ranks))
        r2     (->> nums (sort-by count desc) (map first) vec)
        str?   (straight? hand)
        flush? (flush? hand)]
    (cond
      (and flush? (= r2 [14 13 12 11 10])) [9 r2]   ; royal straight flush
      (and flush? str?) [8  r2]                     ; straight flush
      flush?            [5  r2]                     ; flush
      str?              [4  r2]                     ; straight
      :else             [r1 r2])))
```

`sort`와 `sort-by` 함수는 비교 함수를 따로 지정하지 않으면 `compare` 함수를 사용해 정렬한다. 내림차순으로 정렬하기 위해서는 비교 함수를 따로 전달해야 한다. 위에서 사용한 `desc` 함수는 다음과 같이 작성하면 된다. `compare`의 인자 순서만 바꿔주면 정렬 순서가 반대로 될 것이다.

```clojure
(defn desc [x y] (compare y x))
```

위 `rank` 함수는 패의 계급뿐 아니라 패의 숫자도 함께 리턴한다. 패의 계급이 같을 때는 패의 숫자를 비교해 승패를 가리기 위해서다. 패의 숫자는 패의 계급을 결정하는 숫자가 먼저 나오고 나머지 숫자는 그냥 내림차순으로 나오면 된다. 즉 패의 숫자가 5, 5, 8, 9, 10이라면 5가 두 개 있으므로 계급은 one pair가 되고 5가 계급을 결정하는 숫자가 될 것이다. 따라서 `rank` 함수는 `[5 10 9 8]`을 함께 리턴하게 된다.

게임 파일을 읽어 각 선수별로 패를 저장해 놓으면 문제를 푸는 데 도움이 될 것이다. 다음은 `games`에 각 게임을 `{:p1 ("8C" "TS" "KC" "9H" "4S"), :p2 ("7D" "2S" "5D" "3S" "AC")}` 형식의 시퀀스로 저정한다. `:p1`은 1번 선수, `:p2`는 2번 선수를 뜻한다.

```clojure
(def games
  (->> (clojure.string/split (slurp "data/poker.txt") #"\r\n")
       (map #(clojure.string/split % #" "))
       (map (fn [g] {:p1 (take 5 g) :p2 (drop 5 g)}))))
```

이제 1번 선수가 이긴 횟수만 구하면 된다. 다행히 Clojure의 `compare` 함수는 `rank`가 리턴한 결과도 비교할 수 있다. 두 선수의 계급을 `compare`로 비교해 결과가 양수인 것만 세면 답을 구할 수 있다.

```clojure
(defn solve []
  (->> games
       (map #(compare (rank (:p1 %)) (rank (:p2 %))))
       (filter pos?)
       count))
```

실행 결과는 다음과 같다.

<pre class="console">
p054=> (time (solve))
"Elapsed time: 32.488653 msecs"
3?6
</pre>

예전 방식과 비교해 라인 수도 절반 이하로 줄었고, 코드도 훨씬 아름다워 졌다.

## 참고
* [프로젝트 오일러 54 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p054.clj)
[Dreamshire](http://blog.dreamshire.com/project-euler-54-solution/)의 풀이를 참고해 다시 작성한 코드.
* [프로젝드 오일러 54 풀이 소스 (기존 버전) 코드](https://github.com/ntalbs/euler/blob/3007c3ba398efc2cee7e0c11e07b07f353db68f2/src%2Fp054.clj)
처음 풀이. 새 풀이와 비교해 코드가 훨씬 길 뿐 아니라 아름답지도 않다.
* [Dreamshire > Project Euler 54 Solution](http://blog.dreamshire.com/project-euler-54-solution/)
