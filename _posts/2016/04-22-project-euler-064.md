tags: [Project-Euler, Clojure]
date: 2016-004-22
title: 프로젝트 오일러 64
---
> 제곱근을 연분수로 나타낼 때 반복 주기가 홀수인 경우 세기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=64) [[영어]](https://projecteuler.net/problem=64)

[위키피디아](https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Algorithm)에 연분수로 제곱근을 구하는 방법이 자세히 설명되어 있다.

{% math %}
  \begin{aligned}
    \sqrt{N} = a_0 + \cfrac{1}{a_1 + \cfrac{1}{a_2 + \cfrac{1}{a_3 + \cfrac{1}{\ddots}}}}
  \end{aligned}
{% endmath %}
<!--more-->

제곱근을 위와 같이 연분수로 나타냈을 때 다음 알고리즘으로 $a_n$을 구할 수 있다. $N$은 자연수이고 완전제곱수가 아니어야 한다.

{% math %}
  \begin{aligned}
    m_0 &= 0,\quad
    d_0 = 1,\quad
    a_0 = \lfloor{\sqrt{N}}\rfloor \\
    m_{n+1} &= d_na_n - m_n \\
    d_{n+1} &= \frac{N - m^2_{n+1}}{d_n} \\
    a_{n+1} &= \left \lfloor \frac{a_0 + m_{n+1}}{d_{n+1}} \right \rfloor
  \end{aligned}
{% endmath %}

$a_i = 2a_0$가 되면 반복이 끝난다. 이 알고리즘을 다음과 같이 Clojure 함수로 옮길 수 있다.

```clojure
(defn expand-continued-fraction [n]
  (let [a0 (int (Math/sqrt n))]
    (loop [m 0, d 1, a a0, acc [a0]]
      (if (= a (* 2 a0))
        acc
        (let [m (- (* d a) m), d (/ (- n (* m m)) d), a (int (/ (+ a0 m) d))]
          (recur m d a (conj acc a)))))))
```

이제 $N \le 10000$일 때 반복주기가 홀수인 경우를 세기만 하면 된다. $N$은 완전제곱수이면 계산할 때 분모가 $0$이 되는 경우가 생겨 `ArithmeticException`이 발생하므로 완전제곱수는 제외하고 계산해야 한다.

```clojure
(defn square [x] (* x x))

(defn solve []
  (->> (range 2 (inc 10000))
       (filter #(not= % (square (int (Math/sqrt %)))))
       (map expand-continued-fraction)
       (filter #(even? (count %)))
       count))
```

실행 결과는 다음과 같다.

<pre class="console">
p064> (time (solve))
"Elapsed time: 135.54102 msecs"
1?22
</pre>

## 참고
* [프로젝트 오일러 64 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p064.clj)
* [Continued fraction expansion](http://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Continued_fraction_expansion)
