tags: [Project-Euler, Clojure]
date: 2015-01-16
title: 프로젝트 오일러 5
---
> 1 ~ 20 사이의 어떤 수로도 나누어 떨어지는 가장 작은 수는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=5) [[영어]](https://projecteuler.net/problem=5)

1~20의 최소공배수(Least Common Multiple)를 구하는 문제다. 최소공배수는 다음 식으로 간단히 구할 수 있다.<!--more-->

{% math %}
\begin{aligned}
lcm(a,b) = \frac{\lvert a \times b \rvert}{gcd(a,b)}
\end{aligned}
{% endmath %}

최대공약수(Greatest Common Divisor)를 구하면 최소공배수를 구할 수 있다. 최대공약수와 최소공배수를 구하는 함수는 다음과 같이 구현할 수 있다.

```clojure
(defn gcd [a b]
  (if (= b 0) a (recur b (rem a b))))

(defn lcm [a b]
  (/ (* a b) (gcd a b)))
```

위 함수는 주어진 두 수의 최대공약수, 최소공배수를 구한다. 세 수에 대한 최소공배수를 구하려면 먼저 두 수에 대한 최소공배수를 구한 다음 그 결과와 나머지 수의 최소공배수를 구하면 된다. 따라서 1~20의 최소공배수는 다음과 같이 구할 수 있다.

```clojure
(defn solve []
  (reduce lcm (range 1 21)))
```

실행시켜보면 다음과 같이 빠르게 답을 구하는 것을 확인할 수 있다.

<pre class="console">
p005=> (time (solve))
"Elapsed time: 0.163887 msecs"
232792???
</pre>


## 참고
* [프로젝트 오일러 5 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p005.clj)
