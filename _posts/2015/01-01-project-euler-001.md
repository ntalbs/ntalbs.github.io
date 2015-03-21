tags: [project-euler, clojure]
date: 2015-01-01
title: 프로젝트 오일러 1
---
> 1000보다 작은 자연수 중에서 3 또는 5의 배수를 모두 더하면?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=1) [[영어]](https://projecteuler.net/problem=1)

프로젝트 오일러 문제 중 가장 쉬운 문제일 것이다. 처음에는 문제가 이렇게 쉽지만 뒤로 갈수록 조금씩 어려워져 나중에는 문제가 무슨 뜻인지 이해하기도 힘들어진다. 이 문제는 너무 단순해 아무렇게나 풀어도 답을 구할 수 있다.<!--more-->

## 방법 1
1부터 1000까지 루프를 돌리면서 3 또는 5의 배수만 더하면 된다. Clojure로는 다음과 같이 짤 수 있다.

```
(defn using-brute-force [n]
  (->> (range 1 n)
       (filter #(or (= 0 (mod % 3) (mod % 5))))
       (apply +)))
```

대부분의 사람들이 이렇게 풀었다.

## 방법 2
1부터 n까지 자연수의 합 $S(n)$을 구하는 공식은 다음과 같다.

{% block math %}
S(n) = \frac{n(n+1)}{2}
{% endblock %}

$n$이하 $m$의 배수의 합을 $S(n, m)$이라 하면, 다음과 같이 구할 수 있다.

{% block math %}
\begin{aligned}
S(n, m) &= m + 2m + 3m + ... + n \\
        &= m \times (1 + 2 + 3 + ... + n/m) \\
        &= m \times S(n/m)
\end{aligned}
{% endblock %}

3 또는 5의 배수의 합을 구해야 하므로, `(3의 배수의 합) + (5의 배수의 합) - (15의 배수의 합)`을 계산하면 된다.

```
(defn s
  ([n] (/ (* n (+ n 1)) 2))
  ([n m] (* m (s (quot n m)))))

(defn using-formula [n]
  (let [n (dec n)]
    (-> (s n 3) (+ (s n 5)) (- (s n 15)))))
```

## 정리
두 방식의 결과는 다음과 같다.

<pre class="console">
p001=> (time (using-brute-force 1000))
"Elapsed time: 0.743249 msecs"
233???
p001=> (time (using-forumla 1000))
"Elapsed time: 0.046294 msecs"
233???
</pre>

`int`, `long` 표현 가능 범위와 관련된 문제는 잠깐 접어두고, 숫자가 커짐에 따라 각 접근법이 어떻게 달라질지 생각해보자. 무식한 방법을 사용할 경우의 복잡도는 $O(n)$이다. 요즘 같이 컴퓨터 속도가 빠른 세상에 단순한 계산은 루프를 1,000이 아니라 1,000,000까지 돌려도 순식간에 답을 얻을 수 있다. 그러나 숫자가 커질수록 속도가 느려질 것이다. 공식을 이용할 경우의 복잡도는 $O(1)$으로, n 크기에 상관 없이 바로 답을 얻을 수 있다.

## 참고
* [프로젝트 오일러 문제 1 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p001.clj)
