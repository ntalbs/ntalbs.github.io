tags: [Project-Euler, Clojure]
date: 2016-07-28
title: 프로젝트 오일러 73
---
> 분모가 12,000 이하일 때 1/3과 1/2 사이에 위치한 기약 진분수의 개수
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=73) [[영어]](https://projecteuler.net/problem=73)

## 무차별 대입법
분모가 12,000 이하인 경우만 조사하면 되므로 분자와 분모에 12,000 이하의 수를 대입해가며 분수를 만들어 1/3과 1/2 사이의 기약 진부수를 세는 방법으로 답을 구할 수 있을 것 같다. 분모는 3부터 12,000까지, 분자는 분모/3 ~ 분모/2 사이의 정수를 대입해보면 된다.
<!--more-->

```clojure
(ns p073
  (:require [util :refer [gcd infix]]))

;; brute force
(defn reduced-proper-fractions [limit]
  (for [d (range 3 (inc limit))
        n (range (int (/ d 3)) (inc (int (/ d 2))))
        :when (< 1/3 (/ n d) 1/2)
        :when (= 1 (gcd n d))]
    (/ n d)))

(defn solve1 []
  (count (reduced-proper-fractions 12000)))
```

구현은 복잡하지 않지만 답을 구하는 데 시간이 많이 걸린다.

<pre class="console">
p073=> (time (solve1))
"Elapsed time: 7767.04538 msecs"
729??72
</pre>

Clojure에서 분수는 `Ratio`로 표현되는데, 아무래도 숫자 기본 타입보다는 속도가 느리다. 위 코드에서 `(/ n d)`를 `(/ (double n) d)`로만 수정해도 시간이 2초 이상 줄어든다. 그러나 여전히 빠른 속도라 할 수 없다.

## Farey Sequence 이용
[Farey sequence](https://en.wikipedia.org/wiki/Farey_sequence#Next_term)에 Farey 수열을 구하는 파이썬 코드가 있다. 이 코드를 조금 수정해 $F_{12000}$에서 1/3보다 크고 1/2보다 작은 항이 몇 개인지 세도록 할 수 있다. 이 알고리즘을 이용해 Farey 수열의 다음 항을 구하기 위해서는 앞 두 항이 필요하다. 첫 항을 1/3으로 하고 다음 항을 구하면 그 다음부터는 반복적 방법을 통해 수열을 쉽게 구할 수 있다.

[문제 71](/2016/project-euler-071/)에서는 3/7 바로 앞에 오는 수를 구했다. 이때 사용한 코드를 조금 수정하면 분모가 12,000 이하일 때 1/3 바로 다음 항을 구할 수 있다.

```clojure
;; farey sequence
(defn- next-to [a b limit]
  (->> (range 2 limit)                                ; d
       (map (fn [d] [(infix (((a * d) + 1) / b)) d])) ; [c d]
       (filter (fn [[c d]] (integer? c)))
       (map (fn [[c d]] (/ c d)))
       (apply min)))
```

위 함수를 이용해 1/3 바로 다음 항을 구하고 나면 다음과 같이 반복적으로 다음 항을 구하는 함수를 작성할 수 있다. $F_{12000}$을 모두 구하는 게 1/2 직전까지만 구하면 된다.

```clojure
(defn solve2 []
  (let [limit 12000
        a 1
        b 3
        r (next-to a b limit)
        c (numerator r)
        d (denominator r)]
    (loop [a a, b b, c (int c), d (int d), acc 0]
      (if (< (/ c d) 1/2)
        (let [k (quot (+ limit b) d)]
          (recur c d (- (* k c) a) (- (* k d) b) (inc acc)))
        acc))))

```

이 코드의 실행 결과는 다음과 같다.

<pre class="console">
p073=> (time (solve2))
"Elapsed time: 1938.931634 msecs"
729??72
</pre>

무차별 대입법을 이용했을 때보다 훨씬 빨라지긴 했지만 여전히 만족스러운 속도라 할 수는 없다. 이렇게 속도가 느린 이유 중 하나는 앞에서 언급했던 것처럼 `Ratio`가 느리기 때문이다. 따라서 나누기 연산을 하는 `if` 안의 코드를 다음과 같이 수정하면 속도가 훨씬 빨라진다.

```clojure
(loop [...]
  (if (< (/ (double c) d) 0.5) ; Ratio를 사용하지 않도록 수정
  ...))
```

`Ratio`를 사용하지 않고 그냥 실수 연산을 해도 답을 구하는 데는 전혀 문제 없다. 이렇게 수정한 다음 실행한 결과는 다음과 같다. 이 정도면 충분히 빠르게 답을 구했다고 할 수 있겠다.

<pre class="console">
p073=> (time (solve2))
"Elapsed time: 246.291817 msecs"
729??72
</pre>


## 참고
* [프로젝트 오일러 73 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p073.clj)
* [프로젝트 오일러 71](/2016/project-euler-071/)
* [Farey sequence](http://en.wikipedia.org/wiki/Farey_sequence)
