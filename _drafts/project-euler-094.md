tags: [project-euler, clojure]
date: 2015-05-30
title: 프로젝트 오일러 94
---
피타고라스 정리에 따라 다음 식을 얻을 수 있다.

{% math_block %}
\begin{aligned}
a^2 &= h^2 + \left(\frac{b}{2}\right)^2
\end{aligned}
{% endmath_block %}

문제의 정의에 따라 밑변 $b$는 다음과 같이 쓸 수 있다.

{% math_block %}
\begin{aligned}
b &= a \pm 1
\end{aligned}
{% endmath_block %}




$b$를 대입해 전개한다.

{% math_block %}
\begin{aligned}
a^2 = h^2 + \left(\frac{a \pm 1}{2}^2\right) = h^2 + \frac{a^2 \pm 2a + 1}{4} \\
\end{aligned}
{% endmath_block %}

정리하면 다음과 같이 된다.

{% math_block %}
\begin{aligned}
3a^2 &\mp 2a -4h^2 = 1
\end{aligned}
{% endmath_block %}

양변에 3을 곱한다.

{% math_block %}
\begin{aligned}
9a^2 \mp 6a -12h^2 = 3
\end{aligned}
{% endmath_block %}

양변에 1을 더한다

{% math_block %}
\begin{aligned}
9a^2 \mp 6a + 1 -12h^2 &= 3 + 1 \\
(3a \mp 1)^2 - 12h^2 &= 4 \\
\left(\frac{3a \mp 1}{2}\right)^2 - 3h^2 &= 1
\end{aligned}
{% endmath_block %}

$(3a \mp 1)/2 = x, h = y $로 놓으면 다음과 같이 펠 방정식(Pell's equation)을 얻는다.

{% math_block %}
\begin{aligned}
x^2 - 3y^2 = 1
\end{aligned}
{% endmath_block %}

[문제 66]()에서 위 펠 방정식의 기본해(fundamendal solution)는 $(x_1, y_1) = (2, 1)$임을 확인했다. 위 펠 방정식의 추가해(additional solution)는 다음과 같이 쓸 수 있다.

{% math_block %}
\begin{aligned}
x_{k+1} &= x_1x_k + 3y_1y_k \\
y_{k+1} &= x_1y_k + y_1x_k
\end{aligned}
{% endmath_block %}

이제 펠 방정식의 해를 구해 $a$를 구하고 이를 이용해 둘레길이와 넓이가 정수인 삼각형을 찾으면 된다. 삼각형의 둘레길이($L$)와 넓이($A$)는 다음과 같이 구할 수 있다.

{% math_block %}
\begin{aligned}
a &= \frac{2x \pm 1}{3} \\
L &= (3a \pm 1) = 2x \pm 2 \\
A &= \frac{1}{2}bh = \frac{1}{2}(a \pm 1)h = \left(\frac{x \pm 2}{3}\right)y
\end{aligned}
{% endmath_block %}
