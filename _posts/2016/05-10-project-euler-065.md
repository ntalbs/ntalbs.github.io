tags: [Project-Euler, Clojure]
date: 2016-05-10
title: 프로젝트 오일러 65
---
> $e$의 100번째 연분수 확장 값의 분자 자릿수를 모두 더하면?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=65) [[영어]](https://projecteuler.net/problem=65)

$e$의 연분수를 꼴을 $[a\_0; a\_1, a\_2, a\_3, ...]$이라 했을 때, 100번째 연분수 확장 값을 계산하려면 $a\_{99}$(100번째 항)부터 값을 계산해 올라가야 한다. 문제에서 $e$의 연분수 꼴이 $[2; 1,2,1, 1,4,1, 1,6,1, ..., 1,2k,1, ... ]$로 나타낼 수 있다고 되어 있으므로 $n$이 주어졌을 때 $a\_{n-1}, a\_{n-2}, ..., a\_0$을 구하는 함수는 다음과 같이 만들 수 있다.
<!--more-->

```clojure
(defn- xs
  "a(n-1) a(n-2) ... a0"
  [n]
  (->> (iterate inc 1)
       (mapcat #(vector 1 (* 2 %) 1))
       (take (dec n))
       (cons 2)
       reverse))
```

다음과 같이 $a, b$가 주어졌을 때 $b + \frac{1}{a}$를 구하는 함수를 정의하면 이 함수를 `xs`에 `f`를 적용해 `reduce` 해 연분수 값을 구할 수 있다.

```clojure
(defn- f [a b]
  (+ b (/ 1 a)))
```

이제 $a_n$의 처음 100개 항을 구해 `f`를 적용해 `reduce`한 다음 분모를 구해 각 자릿수를 모두 더하면 문제의 답을 구할 수 있다.

```clojure
(defn solve []
  (->> (xs 100)
       (reduce f)
       numerator
       digits
       (apply +)))
```

실행 결과는 다음과 같다.

<pre class="console">
p065=> (time (solve))
"Elapsed time: 2.597584 msecs"
2?2
</pre>

## 참고
* [프로젝트 오일러 65 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p065.clj)
