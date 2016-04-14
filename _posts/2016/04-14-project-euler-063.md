tags: [Project-Euler, Clojure]
date: 2016-04-14
title: 프로젝트 오일러 63
---
> n자리 숫자이면서 n제곱수도 되는 양의 정수는 모두 몇 개?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=63) [[영어]](https://projecteuler.net/problem=63)

어떤 수가 $n$제곱수라면 $x^n$으로 표현할 수 있다. 어떤 수가 $n$제곱수인 동시에 $n$자리 숫자가 되려면 다음 부등식을 만족해야 한다.

{% math %}
  \begin{aligned}
    10^{n-1} \le x^n \lt 10^n \quad (n \ge 1)
  \end{aligned}
{% endmath %}
<!--more-->

위 부등식에서 $1 \le x \lt 10$임을 알 수 있다. $x$는 정수여야 하므로 $x$에 들어갈 수 있는 값은 $1, 2, ..., 9$다. $n$의 범위는 다음과 같이 구할 수 있다.

{% math %}
  \begin{aligned}
    10^{n-1} \le 9^n
  \end{aligned}
{% endmath %}

부등식의 양변에 상용로그를 취해 정리하면 다음과 같은 결과를 얻는다.

{% math %}
  \begin{aligned}
    \log_{10} 10^{n-1} \le 9^n \\
    n-1 \le n \log_{10} 9 \\
    \therefore n \le \frac{1}{1- \log_{10}9}
  \end{aligned}
{% endmath %}

우변을 계산해보면 $21.854...$가 나오므로, 위 조건을 만족하는 정수 $n$의 최대값은 $21$임을 알 수 있다. 이제 두 변수 $n$과 $x$의 범위를 알았으므로, $n$자리 수이면서 $n$제곱수가 되는 정수의 개수를 구할 수 있다.

먼저 자리수 $n$이 정해졌을 때 $n$자리 수이면서 $n$제곱수도 되는 수를 찾는 함수를 작성해보자.

```clojure
(defn power [x n] (apply *' (repeat n x)))

(defn digits&power [n]
  (for [x (range 1 10)
        :when (<= (/ (dec n) n) (Math/log10 x))]
    (power x n)))
```

이 함수를 이용해 다음과 같이 $n$자리 수이면서 $n$제곱수도 되는 정수의 개수를 구할 수 있다.

```clojure
(def limit (/ 1 (- 1 (Math/log10 9))))

(defn solve []
  (->> (range 1 limit)
       (mapcat digits&power)
       count))
```

실행 결과는 다음과 같다.

<pre class="console">
p063=> (time (solve))
"Elapsed time: 1.769826 msecs"
49
</pre>

## 참고
* [프로젝트 오일러 63 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p063.clj)
