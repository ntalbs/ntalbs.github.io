tags: [Project-Euler, Clojure]
date: 2017-02-01
title: 프로젝트 오일러 85
---
> 사각 격자 안에 포함된 사각형 개수 세기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=85) [[영어]](https://projecteuler.net/problem=85)

가로 $m$ 세로 $n$인 격자에서 각 크기의 사각형이 몇 개씩 들어가는지 생각해보자. 크기(가로$\times$세로)가 $1 \times 1$인 사각형은 생각할 것도 없이 $m \times n$개가 들어간다. 크기가 $1 \times 2$인 사각형은 가로 방향으로는 $m$개, 세로 방향으로는 $n-1$개가 들어갈 수 있으므로 개수는 $m \times (n-1)$이 될 것이다.
<!--more-->

가로 크기를 $1$로 고정시킨 상태에서 세로 크기를 $1$부터 $n$까지 바꿔가며 격자에 포함될 수 있는 사각형의 개수를 구하면 다음과 같다.

{% math %}
\begin{aligned}
1 \times 1 &= m \times n \\
1 \times 2 &= m \times (n-1) \\
1 \times 3 &= m \times (n-2) \\
&\vdots\\
1 \times n &= m \times 1
\end{aligned}
{% endmath %}

격자에 포함될 수 있는 사각형 중 가로가 1인 사각형의 개수를 $N(1)$이라 하면 다음과 같이 나타낼 수 있다.

{% math %}
\begin{aligned}
N(1) &= m (n + (n-1) + (n-2) + ... + 1)\\
     &= m \times \frac{n(n+1)}{2}
\end{aligned}
{% endmath %}

가로가 $x$인 사각형의 개수 $N(x)$는 다음과 같이 나타날 수 있다.

{% math %}
\begin{aligned}
N(x) = (m - x + 1) \times \frac{n(n+1)}{2}
\end{aligned}
{% endmath %}

따라서 $m \times n$ 격자에 들어갈 수 있는 사각형 갯수 $N$은 다음과 같이 나타낼 수 있다.

{% math %}
\begin{aligned}
N(m, n) &= \sum_{x=1}^m N(x) \\
  &= \frac{m(m+1)}{2} \times \frac{n(n+1)}{2} \\
  &= \frac{m(m+1) \cdot n(n+1)}{4}
\end{aligned}
{% endmath %}

이 공식을 이용해 $m \times n$ 격자에 들어갈 수 있는 사각형의 개수를 구하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn rect-cnt [m n]
  (/ (* m (inc m) n (inc n)) 4))
```

격자에 포함될 수 있는 사각형의 개수가 2백만 개에 가까운 격자 크기를 구해야 하므로 다음과 같이 주어진 수와 2백만의 차(절대값)를 구하는 함수도 작성해 놓으면 도움이 될 것이다.

```clojure
(defn delta [n]
  (Math/abs (- 2000000 n)))
```

이제 격자 크기를 바꿔가며 격자에 포함될 수 있는 사각형의 개수가 2백만에 가장 가까운 경우를 찾으면 된다. 격자 한 변의 최대 크기를 100 이하로 구해보면 될 것 같다. 그래봤자 루프를 1만 번만 돌면 된다.

```clojure
(defn solve []
  (let [MAX 100]
    (->> (for [x (range 1 MAX)
               y (range 1 MAX)
               :let [cnt (rect-cnt x y)]]
           [x y cnt (delta cnt)])
         (apply min-key last)
         ((fn [[x y _ _]] (* x y))))))
```

실행 결과는 다음과 같다. 빠른 시간에 답을 구한다.

<pre class="console">
p085=> (time (solve))
"Elapsed time: 91.497031 msecs"
2??2
</pre>

## 참고
* [프로젝트 오일러 85 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p085.clj)
