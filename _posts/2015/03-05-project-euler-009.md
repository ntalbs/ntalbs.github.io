tags: [project-euler, clojure]
date: 2015-03-05
title: 프로젝트 오일러 - 9
---
> a + b + c = 1000 이 되는 피타고라스 수?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=9) [[영어]](https://projecteuler.net/problem=9)

피타고라스 수란 $a^2 + b^2 = c^2$을 만족하는 세 자연수 쌍 $(a, b, c)$를 말한다. $(3, 4, 5), (5, 12, 13)$ 등이 잘 알려진 피타고라스 수다.<!--more-->

## 방법 1
a와 b가 정해지면 c도 정해진다. 따라서 a와 b에 대해 루프를 돌려 값을 찾을 수 있다. 이 경우 루프를 대략 1백만 번 정도$(1000 \times 1000)$ 돌려야 할 것이다. 조건에 $a < b < c$가 명시되어 있으므로 이 조건을 적용하면 루프 회수를 절반 정도로 줄일 수 있다.

따라서 다음과 같이 간단한 방법으로 문제를 풀 수 있다.

```[clojure]
(defn using-brute-force []
  (first (for [a (range 1 1000)
               b (range a 1000)
               c [(- 1000 a b)]
               :when (= (+ (* a a) (* b b)) (* c c))]
           (* a b c))))
```

## 방법 2
[Pythagorean Triplet](http://en.wikipedia.org/wiki/Pythagorean_triple#Parent.2Fchild_relationships)에 보면 (3, 4, 5)로부터 선형 변환(linear transformation)을 통해 다음 피타고라스 수 T1, T2, T3을 구하는 방법이 나와 있다.

{% math-block %}
\begin{aligned}
T1 &= (a − 2b + 2c, 2a − b + 2c, 2a − 2b + 3c) \\
T2 &= (a + 2b + 2c, 2a + b + 2c, 2a + 2b + 3c) \\
T3 &= (−a + 2b + 2c, −2a + b + 2c, −2a + 2b + 3c)
\end{aligned}
{% endmath-block %}

공식을 그대로 적용해 다음과 같이 함수를 만들 수 있다.

```[clojure]
(defn next-triplets [[a b c]]
  [(sort [(+ a (* -2 b) (* 2 c))
          (+ (* 2 a) (- b) (* 2 c))
          (+ (* 2 a) (* -2 b) (* 3 c))])
   (sort [(+ a (* 2 b) (* 2 c))
          (+ (* 2 a) b (* 2 c))
          (+ (* 2 a) (* 2 b) (* 3 c))])
   (sort [(+ (- a) (* 2 b) (* 2 c))
          (+ (* -2 a) b (* 2 c))
          (+ (* -2 a) (* 2 b) (* 3 c))])])
```

중간에 `sort`가 있는 것은 리턴하는 피타고라스 수가 a < b < c를 만족하도록 하기 위해서다. 정렬하지 않으면 a > b인 경우가 생기기도 한다. 위 함수는 피타고라스 수 (a, b, c)가 주어졌을 때 다음 피타고라스 수 세 개 (a1, b1, c1), (a2, b2, c2), (a3, b3, c3)를 구한다.

이제 피타고라스 수의 지연 시퀀스를 만들어보자. (3, 4, 5)를 시작으로 `next-triplets`을 반복해 다음 피타고라스 수 세 개를 생성해야 한다.

```[clojure]
(defn primitive-triplets
  ([ts] (let [more (for [t ts, next-t (next-triplets t)] next-t)]
          (lazy-cat ts (primitive-triplets more))))
  ([] (primitive-triplets ['(3 4 5)])))
```

REPL에서 확인해보면 잘 동작한다.

<pre class="console">
user=> (take 10 (primitive-triplets))
((3 4 5) (5 12 13) (20 21 29) (8 15 17) (7 24 25) (48 55 73) ...)
</pre>

그러나 위 함수를 이용해 생성한 피타고라스 수는 모두 원시 피타고라스 수다. 원시 피타고라스 수의 각 요소에 $k$를 곱해도 여전히 피타고라스 수이므로 문제를 풀 때는 이것도 확인해야 한다.

```[clojure]
(defn side-sum-is-not [sum]
  (fn [[a b c]] (not= sum (+ a b c))))

(defn using-formula []
  (->> (primitive-triplets)
       (mapcat (fn [[a b c]] (->> (for [k (range 100)] [(* k a) (* k b) (* k c)])
                                  (drop-while (side-sum-is-not 1000)))))
       (drop-while (side-sum-is-not 1000))
       (first)
       (apply *)))
```

## 정리
무차별 대입법을 사용한 코드보다 훨씬 길고 복잡해졌지만 답을 구하는 속도는 훨씬 빨라졌다. REPL에서 두 방법 모두 실행해보면 얼마나 차이가 나는지 금방 볼 수 있다.

<pre class="console">
p009=> (time (using-brute-force))
"Elapsed time: 42.426237 msecs"
********
p009=> (time (using-formula))
"Elapsed time: 0.600761 msecs"
********
</pre>

## 참고
* [피타고라스 수](http://ko.wikipedia.org/wiki/피타고라스_수)
* [Pythagorean Triplet > Parent/child relationships](http://en.wikipedia.org/wiki/Pythagorean_triple#Parent.2Fchild_relationships)
* [프로젝트 오일러 문제 9 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p009.clj)
