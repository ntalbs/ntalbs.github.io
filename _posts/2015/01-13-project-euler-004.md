tags: [project-euler, clojure]
date: 2015-01-13
title: 프로젝트 오일러 - 4
---
> 세자리 수를 곱해 만들 수 있는 가장 큰 대칭수는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=4) [[영어]](https://projecteuler.net/problem=4)

세 자리 정수는 100부터 999까지다. 따라서 무식하게 풀어로 루프 회수가 1백만 번을 넘지 않으며, $a \times b = b \times a$임을 고려해 중복을 제거하면 루프 회수를 절반으로 줄일 수 있다. 따라서 대충 풀어도 금방 답을 구할 수 있다.<!--more-->

먼저 대칭수인지를 판단하는 함수를 만들어 놓으면 좋을 듯 하다. 대칭수인지 판단하는 간단한 방법은 문자열로 바꾼 다음 원래 문자열과 거꾸로 바꾼 문자열이 같은지 비교하는 것이다.

```
(defn palindrome? [n]
  (= (str n) (apply str (reverse (str n)))))
```

## 방법1
다음과 같이 무식하게 루프를 돌려도 비교적 빨리 답을 구할 수 있다.

```[clojure]
(def limit 1000)

(defn initial-approach []
  (->> (for [a (range 100 limit) b (range a limit)] (* a b))
       (filter palindrome?)
       (apply max)))
```

## 방법2
문제를 좀더 분석해보면 위 방법보다 빠르게 풀 수 있다. 세 자리 정수 둘을 곱해 만든 수는 다섯 자리 또는 여섯 자리 수가 나올 것이다. 최대값을 구하는 것이므로 여섯 자리 수에 대해 생각해보면, 대칭수는 다음과 같이 표현할 수 있다.

{% math-block %}
\begin{aligned}
a \times b &= 100000x + 10000y + 1000z + 100z + 10y + x \\
&= 100001x + 10010y + 1100z \\
&= 11(9091x + 910y + 100z)
\end{aligned}
{% endmath-block %}

11은 소수이므로 a 또는 b가 11의 배수가 되어야 한다. 따라서 a 또는 b가 11의 배수일 때만 계산하도록 하면 루프 회수를 줄일 수 있다.

```[clojure]
(defn improved []
  (->> (for [a (range 100 limit) b (range a limit)
             :when (or (= 0 (mod a 11)) (= 0 (mod b 11)))]
         (* a b))
       (filter palindrome?)
       (apply max)))
```

## 정리
두 방식을 실행해본 결과는 다음과 같다. 두 번째 방법으로 실행한 결과가 첫 번째 방법보다 네 배 정도 빠르다.

<pre class="console">
p004=> (time (initial-approach))
"Elapsed time: 419.324513 msecs"
******
p004=> (time (improved))
"Elapsed time: 88.696111 msecs"
******
</pre>

## 참고
* [프로젝트 오일러 문제 4 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p004.clj)
