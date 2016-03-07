tags: [Project-Euler, Clojure]
date: 2015-04-03
title: 프로젝트 오일러 14
---
> 백만 이하로 시작하는 우박수 중 가장 긴 과정을 거치는 것은?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=14) [[영어]](https://projecteuler.net/problem=14)

주어진 양의 정수 n에 대한 우박수열을 구하는 함수를 만든 다음, 1백만까지 우박수열을 구하면서 수열의 길이가 가장 길어지는 n을 구하면 된다. 우박수열을 구하는 함수는 다음과 같이 간단히 작성할 수 있다.<!--more-->

```clojure
(defn collatz1 [n]
  (loop [n n, acc []]
    (if (= 1 n)
      (conj acc 1)
      (if (even? n)
        (recur (quot n 2) (conj acc n))
        (recur (+ (* 3 n) 1) (conj acc n))))))
```

1부터 백만까지의 숫자에 대해 우박수열을 구해 길이가 가장 길어지는 n을 구하는 코드는 다음과 같이 작성할 수 있다.

```clojure
(defn solve1 []
  (->> (range 1 1000000)
       (map (fn [n] (collatz1 n)))
       (apply max-key (fn [xs] (count xs)))
       first))
```

이 코드를 실행하면 답을 구하기는 하지만 속도가 만족스럽지 않다.

<pre class="console">
p014=> (time (solve1))
"Elapsed time: 8472.361994 msecs"
837???
</pre>

## 개선 1
`collatz1` 함수는 주어진 수에 대해 우박수열을 구한다. 이를 이용해 문제를 풀 때는 백만 개의 시퀀스가 생성되는데 문제를 푸는 데는 수열의 길이만 있으면 되므로 굳이 수열을 구할 필요는 없을 것 같다. 주어진 수에 대한 우박수열의 길이를 구하는 함수는 다음과 같이 구현할 수 있다.

```clojure
(defn collatz2 [n]
  (loop [n n, cnt 0]
    (if (= 1 n)
      (inc cnt)
      (if (even? n)
        (recur (quot n 2) (inc cnt))
        (recur (+ (* 3 n) 1) (inc cnt))))))
```

코드는 `collatz1`과 거의 비슷하다. 벡터에 결과를 누적해 수열을 구하는 대신 계산이 반복될 때마다 `cnt`만 하나씩 증가시킨다는 점이 다르다. `collatz2`를 이용하면 문제의 답은 다음과 같이 구할 수 있다.

```clojure
(defn solve2 []
  (->> (range 1 1000000)
       (map (fn [n] [n (collatz2 n)]))
       (apply max-key second)
       first))
```

REPL에서 실행시켜보면 처음보다 상당히 빨라진 것을 볼 수 있다.

<pre class="console">
p014=> (time (solve2))
"Elapsed time: 3127.524663 msecs"
837???
</pre>

## 개선 2
문제 설명에 13으로 시작했을 때의 수열이 나와있다. 13에서 시작해 세번째 반복에서 10이 나오는데, 낮은 수부터 차례로 수열의 길이를 구했다면 10에 대한 길이는 이미 구했을 것이다.

<div style="text-align:center">
13 → 40 → 20 → <span style="font-weight:bold;color:red">10</span> → 5 → 16 → 8 → 4 → 2 → 1
</div>

따라서, 각 수에 대한 수열의 길이를 기억해두면 많은 반복 계산을 제거할 수 있게 된다. Clojure에서는 `memoize`를 사용해 간단히 함수 값을 캐시할 수 있다. 다만 `memoize`는 함수의 인자 값에 대한 리턴 값을 캐시하는 것이므로 `recur`를 쓸 수 없게 된다.

`memoize`를 사용한 구현은 다음과 같다.

```clojure
(defn collatz3 [n]
  (if (= n 1)
    1
    (if (even? n)
      (inc (collatz3 (quot n 2)))
      (inc (collatz3 (+ (* 3 n) 1))))))

(def collatz3 (memoize collatz3))

(defn solve3 []
  (->> (range 1 1000000)
       (map (fn [n] [n (collatz3 n)]))
       (apply max-key second)
       first))
```

반복되는 계산을 줄여 훨씬 빠르게 답을 구할 것으로 예상했지만 결과는 실망스럽다. `collatz2`를 사용한 경우보다도 조금 느리다.

<pre class="console">
p014=> (time (solve3))
"Elapsed time: 3641.547009 msecs"
837799
</pre>

물론 한 번 실행한 다음 다시 실행하면 매우 빠르게 답을 구한다. 그러나 이런 퀴즈 문제의 답을 구할 때 그런 식으로 성능이 개선되었다고 말하기는 곤란할 것이다. 처음 답을 빨리 구해야 의미가 있다.

## 참고
* [프로젝트 오일러 14 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p014.clj)
