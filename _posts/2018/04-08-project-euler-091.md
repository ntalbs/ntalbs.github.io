tags: [Project-Euler, Clojure]
date: 2018-04-08
title: 프로젝트 오일러 91
---
> 사분면 안의 직각삼각형 개수 세기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=91) [[영어]](https://projecteuler.net/problem=91)

1사분면 $0 \le x, y \le 50$에서 P의 가능한 위치는 모두 $51 \times 51$이고 Q의 가능한 위치도 $51 \times 51$이다. 무차별 대입법으로 문제를 푼다면 $51^4 = 6,765,201$번의 루프를 돌면서 직각인지 확인해야 하므로 빠른 시간에 답을 구하지 못한다. 이 방법으로 문제를 풀면 내 환경에서는 답을 구하는 데 7초 이상 걸린다.
<!--more-->

1사분면 위의 임의의 점 P와 Q가 있을 때 $\angle{POQ}$가 직각이 되는 경우는 P가 $x$축 위에, Q가 $y$축 위에 있는 (또는 그 반대) 경우뿐이다. P가 1사분면 안쪽에 있는 경우에는 $\angle{OPQ}$가 직각이 되어야 한다.

P가 $x$축에 있는 경우는 선분 $\overline{OP}$에 수직인 직선이 수직선이 되어 기울기가 $\infty$가 되고, P가 $y$축에 있는 경우는 직선 $\overline{OP}$의 기울기가 $\infty$가 되므로 별도 처리해야 한다.

$\angle{POQ}$가 직각이 되는 경우는 $P(x, 0)$, $Q(0, y)$인 경우뿐이다. P 또는 Q가 원점에 있으면 안 되므로 $0 \lt x, y \le 50$이어야 한다. 따라서 경우의 수는 $50 \times 50 = 2,500$이다.

P가 $x$축 위에 있는 경우, P의 가능한 위치는 $(1, 0)$부터 $(50, 0)$까지 50가지고, 각 경우에 $y$는 1부터 50까지 가능하므로 경우의 수는 $50 \times 50 = 2500$이다.

P가 $y$축 위에 있는 경우, P의 가능한 위치는 $(0, 1)$부터 $(0, 50)$까지 50가지고, 각 경우에 $x$는 1부터 50까지 가능하므로 경우의 수는 $50 \times 50 = 2500$이다.

P가 $x$축 또는 $y$축에 있지 않고 1사분면 안쪽에 있는 경우는 P를 지나면서 선분 $\overline{OP}$에 수직인 직선의 방정식을 구한 다음, $x$를 0부터 50까지 바꿔가며 $y$값을 구해 $0 \le y \le 50$이면서 정수인 경우를 구하는 방식으로 Q를 구하면 문제를 빠르게 풀 수 있다. 이렇게 하면 $51^3 = 132,651$의 경우의 수에 대해서만 계산하면 된다. $x$축 또는 $y$축 위에 있지 않은 점의 집합은 다음과 같이 구할 수 있다.

```clojure
(def LIMIT 50)

(def points
  (for [x (range 1 (inc LIMIT)) y (range 1 (inc LIMIT))]
    [x y]))
```

이제 직선 $\overline{OP}$에 직각이고 점 P를 지나는 직선의 방정식을 구할 차례다. 점 P를 $(a, b)$라 했을 때  직선 $\overline{OP}$의 기울기는 $b/a$다. 직선 $\overline{OP}$에 수직인 직선의 기울기는 $-a/b$이므로, 이 직선의 방정식은 다음과 같이 작성할 수 있다.

{% math %}
\begin{aligned}
y = - \frac{a}{b} x + y_0
\end{aligned}
{% endmath %}

이 직선은 점 $(a, b)$를 지나야 하므로, 위 방정식에 $x=a,\, y=b$를 대입하면 $y_0$를 구할 수 있다.

{% math %}
\begin{aligned}
y_0 = b + \frac{a^2}{b}
\end{aligned}
{% endmath %}

따라서 직선 $\overline{OP}$에 수직이고 점 P를 지나는 직선의 방정식은 다음과 같다.

{% math %}
\begin{aligned}
y = - \frac{a}{b} x + b + \frac{a^2}{b}
\end{aligned}
{% endmath %}

주어진 점 P$(a, b)$에 대해 직선 $\overline{OP}$에 수직이며 점 P를 지나는 직선의 방정식을 리턴하는 함수는 다음과 같이 작성할 수 있다. 전위 표기법을 사용해 수식을 읽기가 거지 같긴 하지만, 위에서 구한 직선의 방정식을 Clojre 코드로 옮긴 것일 뿐이다. 이 함수는 함수를 리턴하는 함수임에 유의한다.

```clojure
(defn fn-line-perpendicular-to [[a b]]
  (fn [x] (+ (/ (* (- a) x) b) b (/ (* a a) b))))
```

이제 P에 각 점을 대입하면서 $\overline{OP}$에 직각인 동시 점 P를 지나는 직선의 방정식을 구한 다음, $x$를 0부터 50까지 바꿔가며 $y$값을 구해 $0 \le y \le 50$이면서 정수인 경우를 세면 된다.

따라서 직각 삼각형의 개수는 다음과 같이 구할 수 있다. $x$ 값을 0부터 50까지 바꿔가며 $y$를 구할 때 P = Q인 경우는 제외해야 하므로 개수에서 1을 빼야 한다.

```clojure
(defn solve []
  (->> points
       (map fn-line-perpendicular-to)
       (map (fn [f] (->> (range (inc LIMIT))
                         (map f)
                         (filter integer?)
                         (filter #(<= 0 % 50))
                         count
                         dec)))  ; P=Q인 경우는 제외
       (apply +)
       (+ 2500)                  ; P, Q가 각각 x축, y축에 있는 경우
       (+ 2500)                  ; P는 x축, Q는 1사분면 안에 있는 경우
       (+ 2500)))                ; P는 y축, Q는 1사분면 안에 있는 경우
```

실행 결과는 다음과 같다.

<pre class="console">
p091=> (time (solve))
"Elapsed time: 98.809821 msecs"
??234
</pre>


## 참고
* [프로젝트 오일러 91 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p091.clj)
