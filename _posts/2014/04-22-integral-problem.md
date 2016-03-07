date: 2014-04-22
tags: 수학
title: 정적분 문제
---
학교를 졸업한지 오래되어 지금은 미적분이 거의 생각나지 않지만, 아직도 기억하고 있는 적분 문제가 하나 있다. 다음 정적분 값을 구하는 문제인데, 적분 자체는 어렵지 않지만 발상의 전환이 필요하다. 선배에게 이 문제 풀이 설명을 듣었을 때의 감동이 아직도 생생하다.

$$I = \int_{-\infty}^{\infty} e^{-x^2} dx $$
<!-- more -->

그냥 $I$ 값을 구하려 하면 문제가 풀리지 않는다. 그러나 $I^2$ 값은 다음과 같은 식으로 구할 수 있다.

{% math_block %}
\begin{aligned}
I^2
&= \left(\int_{-\infty}^{\infty} e^{-x^2} dx\right)^2 \\
&= \int_{-\infty}^{\infty} e^{-x^2} dx \cdot \int_{-\infty}^{\infty} e^{-y^2} dy \\
&= \int_{-\infty}^{\infty}\int_{-\infty}^{\infty} e^{-(x^2+y^2)} dx\,dy \\
\end{aligned}
{% endmath_block %}

정적분 값은 적분변수와 상관 없으므로 $x$를 $y$로 바꿔도 상관 없다. 여기서 굳이 $x, y$로 바꾸는 것은 문제를 $xy$ 평면에서의 적분으로 생각하기 위해서다. 이렇게 하면 문제를 기하학적으로 생각할 수 있게 된다.

{% asset_img graph.png %}

일단 평면에 대한 적분 문제라 생각하고 나면, $xy$ 좌표계에서 극좌표계로 바꿔 평면 전체에 대해 적분해도 결과는 같을 것이다.

{% math_block %}
\begin{aligned}
x &= r\cos \theta \\
y &= r\sin \theta \\
dx\,dy &= r\,dr\,d\theta
\end{aligned}
{% endmath_block %}

$xy$ 평면 전체는 $ -\infty \lt x \lt \infty$, $-\infty \lt y \lt \infty$다. 극좌표로 나타내면 $r, \theta$의 범위는 $0 \le r \lt \infty$, $0 \le \theta \lt 2\pi$라 할 수 있다. 따라서 정적분을 다음과 같이 고쳐 쓸 수 있다. 이제 적분을 쉽게 할 수 있다. (아래 식이 이해되지 않을 경우, $r^2=t$로 치환해 적분하면 쉽다)

{% math_block %}
\begin{aligned}
I^2
&= \int_0^{2\pi}\int_0^\infty e^{-r^2} r\,dr\,d\theta \\
&= 2\pi \int_0^\infty e^{-r^2} r\,dr \\
&= 2\pi \left[-\frac{e^{-r^2}}{2}\right]_{r=0}^{r=\infty} \\
&= {\pi}
\end{aligned}
{% endmath_block %}

따라서...
$$I = \sqrt \pi$$

수학도 그렇고 물리학도 그렇고 좌표를 변환하면 어렵던 문제가 쉽게 풀리는 경우가 많다. 이 적분 문제는 좌표 변환을 통해 어려운 문제를 쉬운 문제로 바꾼 대표적인 예라 할 수 있겠다.

좌표계는 **생각하는 방식** 또는 **생각의 기준**이라 할 수 있다. 프로그램을 작성할 때도 복잡해보이는 문제가 생각의 방식을 바꾸면 쉽게 풀리는 경우가 많다. **어떤 문제가 지나치게 복잡하다면 부적절한 좌표계에서 문제 풀이를 시도하고 있는 것이 아닌지 확인해볼 필요가 있다.**
