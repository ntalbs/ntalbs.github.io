title: 뉴튼 법을 이용한 근사값 구하기
date: 2014-07-25
tags: [algorithm, math]

---

$\sqrt x$ 함수의 값을 어떻게 계산할 수 있을까? Java라면 `Math.sqrt(x)` 함수를 통해 제곱근을 구할 수 있는데, `Math.sqrt(x)` 함수는 어떻게 구현한 것일까?
<!--more-->

얼마 전 Martin Odersky가 강의한 [Functional Programming Principle in Scala](https://www.coursera.org/course/progfun)(이하 FPPIS)를 복습하던 중 $\sqrt x$ 값을 구하는 예제를 보게 되었다. 또, 며칠 전부터 [컴퓨터 프로그램의 구조와 해석(Structure and Interpretation of Computer Program, 이하 SICP)](http://www.insightbook.co.kr/books/ppp/컴퓨터-프로그램의-구조와-해석)을 읽기 시작했는데, 앞 부분에 $\sqrt x$ 값을 구하는 예제가 나왔다.

Martin Odersky가 이미 강의에서 밝혔듯 FPPIS에 나오는 많은 예제가 실은 SICP에서 따온 것이므로 이상할 것은 없지만, 짧은 기간 동안 반복해 [뉴튼 법(Newton's method)](http://en.wikipedia.org/wiki/Newton's_method)을 접하니 제대로 이해하고 싶었다.

그러나 두 설명 모두 $\sqrt 2$ 근사값을 구하기 위해 뉴튼 법을 이용한다고 설명할 뿐, 계산할 때 사용하는 다음 공식이 어떻게 유도되었는지는 설명하지 않는다.

$$x_{n+1} = \frac{x_n + \frac{2}{x_n}}{2}$$

FPPIS나 SICP 모두 수학을 알려주는 게 목적이 아니니 당연하지만, **나는 공식이 어떻게 유도되었는지가 궁금했다.** 학교 다닐 때 배웠던 뉴튼 법을 생각해봤다. $f(x) = 0$의 근을 구할 때 특정 위치 $(x_0, f(x_0))$에서 접선을 구한 다음, 이 접선이 $x$축과 만나는 지점($x_1$, 0)을 구하고, 다시 $(x_1, f(x_1))$에서 접선을 구하고, ... 이렇게 계속 반복하다 보면 $f(x) = 0$이 되는 $x$의 근사값을 구할 수 있다. 이것을 정리하면 다음과 같이 쓸 수 있다.

{% math_block %}
x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}
{% endmath_block %}

이제 이 공식을 이용해 제곱근을 구해보자. $f(x) = x^2 - X$로 하면, $x=\sqrt X$일 때 $f(x)=0$이 되므로 $\sqrt X$의 근사값을 구할 수 있다.

{% math_block %}
\begin{aligned}
f(x) &= x^2 - X \\
f'(x) &= 2x \\
\therefore x_{n+1} &= x_n - \frac{x_n^2 - X}{2x_n}
\end{aligned}
{% endmath_block %}

예를 들어 초기값($x_0$)을 1로 해 $\sqrt 2$를 구하는 절차는 다음과 같다.

{% math_block %}
\begin{aligned}
x_1 &= x_0 - \frac{f(x_0)}{f'(x_0)} = 1 - \frac{1^2 - 2}{2 \cdot 1} = 1.5\\
x_2 &= x_1 - \frac{f(x_1)}{f'(x_1)} = 1.5 - \frac{1.5^2 - 2}{2 \cdot 1.5} = 1.4167\\
x_3 &= x_2 - \frac{f(x_2)}{f'(x_2)} = 1.4167 - \frac{1.4167^2 - 2}{2 \cdot 1.4167} = \color{red}{1.4142}\\
...
\end{aligned}
{% endmath_block %}

과정을 반복할수록 $\sqrt 2$의 값에 가까워진다. 이 정도까지 이해했으면 코드로 옮기는 것은 일도 아니다. FPPIS와 SICP에서 이미 코드를 설명하고 있으므로 여기서 반복하지 않는다.

$\sin x$, $\cos x$ 같은 삼각함수나 $\ln x$, $e^x$ 같은 초월함수는 어떻게 계산할까? 이런 함수는 [테일러 급수(Taylor Series)](http://en.wikipedia.org/wiki/Taylor_series)를 이용하면 될 것 같다. <span style="color:gray">(학교다닐 때 열심히 공부한 보람이 있다.)</span>

{% math_block %}
\begin{aligned}
f(x) &= \frac{f'(a)}{1!}(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \frac{f^{(3)}(a)}{3!}(x-a)^3 + ... \\
&= \sum\limits_{n=0}^\infty \frac{f^{(n)}(a)}{n!} (x-a)^n
\end{aligned}
{% endmath_block %}

여기서 $a = 0$인 경우를 [매클로린 급수(Maclaurin Series)](http://en.wikipedia.org/wiki/Taylor_series#List_of_Maclaurin_series_of_some_common_functions)라 하며, 주요 함수에 대한 전개는 다음과 같다.
{% math_block %}
\begin{aligned}
e^x &= \sum\limits_{n=0}^\infty \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + ...\\
\sin x &= \sum\limits_{n=0}^\infty \frac{(-1)^n}{(2n+1)!}x^{2n+1} = x - \frac{x^3}{3!} + \frac{x^5}{5!} - ...\\
\cos x &= \sum\limits_{n=0}^\infty \frac{(-1)^n}{(2n)!}x^{2n} = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - ...\\
\end{aligned}
{% endmath_block %}

함수를 다항식 형태로 만들었으므로 이를 계산하는 프로그램은 쉽게 작성할 수 있다.

## 참고
* [Functional Programming Principle in Scala](https://www.coursera.org/course/progfun)
함수형 프로그래밍 개념을 이해하는 데 아주 좋은 강의다. Scala에 관심이 없더라도 함수형 프로그래밍에 관심이 있다면 들어볼 만 하다.
* [Methods of computing square roots](http://en.wikipedia.org/wiki/Methods_of_computing_square_roots)
제곱근을 구하는 방법은 뉴튼 법 외에도 많다. 물론 다 살펴본 것은 아니고, 다른 방법도 많다는 것을 확인하는 정도만.
* [Maclaurin Series](http://mathworld.wolfram.com/MaclaurinSeries.html)
테일러 급수에서 $a=0$인 경우를 특별히 매클로린 급수라 한다.
