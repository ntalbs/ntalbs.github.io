sitemap: false
title: Math Expressions
---

### [프로젝트 오일러 51](/2016/02/24/project-euler-051/)

{% math_block %}
\begin{aligned}
(a \bmod n) \bmod n &= a \bmod n \\
((a \bmod n) + b) \bmod n &= (a + b) \bmod n
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
(a \bmod n) \bmod n &= a \bmod n \\
((a \bmod n) + b) \bmod n &= (a + b) \bmod n
\end{aligned}
```
<br>

### [프로젝트 오일러 50](/2016/02/09/project-euler-050/)

{% math_block %}
\begin{aligned}
s(n) = p_1 + p_2 + ... + p_n
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
s(n) = p_1 + p_2 + ... + p_n
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
s(m, n) &= p_m + p_{m+1} + ... + p_n \\
        &= s(n) - s(m-1)
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
s(m, n) &= p_m + p_{m+1} + ... + p_n \\
        &= s(n) - s(m-1)
\end{aligned}
```
<br>

### [프로젝트 오일러 45](/2015/11/04/project-euler-045/)

{% math_block %}
\begin{aligned}
H_n &= n(2n-1) \\
    &= \frac{2n(2n-1)}{2} \\
    &= \frac{(2n-1)(2n-1+1)}{2} \\
\therefore H_n &= T_{2n-1}
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
H_n &= n(2n-1) \\
    &= \frac{2n(2n-1)}{2} \\
    &= \frac{(2n-1)(2n-1+1)}{2} \\
\therefore H_n &= T_{2n-1}
\end{aligned}
```
<br>

### [프로젝트 오일러 44](/2015/11/03/project-euler-044/)

{% math_block %}
\frac{n(3n-1)}{2} = x \\
\therefore n = \frac{1 \pm \sqrt{1+24x}}{6}
{% endmath_block %}
```tex
\frac{n(3n-1)}{2} = x \\
\therefore n = \frac{1 \pm \sqrt{1+24x}}{6}
```
<br>

{% math_block %}
n = \frac{1 + \sqrt{1 + 24x}}{6}
{% endmath_block %}
```tex
n = \frac{1 + \sqrt{1 + 24x}}{6}
```
<br>

### [프로젝트 오일러 39](/2015/10/23/project-euler-039/)

{% math_block %}
\begin{aligned}
a &= k \cdot (m^2 - n^2)\\
b &= k \cdot (2mn)\\
c &= k \cdot (m^2 + n^2)
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
a &= k \cdot (m^2 - n^2)\\
b &= k \cdot (2mn)\\
c &= k \cdot (m^2 + n^2)
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
 b = & 2mn, m \approx n \\
& 2m^2 < 500 \\
\therefore\,\,\, & m < \sqrt{250}
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
 b = & 2mn, m \approx n \\
& 2m^2 < 500 \\
\therefore\,\,\, & m < \sqrt{250}
\end{aligned}
```
<br>

### [프로젝트 오일러 28](/2015/09/11/project-euler-028/)

{% math_block %}
\begin{matrix}
7 & 8 & 9 \\
6 &   & 2 \\
5 & 4 & 3
\end{matrix}
{% endmath_block %}
```tex
\begin{matrix}
7 & 8 & 9 \\
6 &   & 2 \\
5 & 4 & 3
\end{matrix}
```
<br>

{% math_block %}
\begin{matrix}
21 & 22 & 23 & 24 & 25 \\
20 &    &    &    & 10 \\
19 &    &    &    & 11 \\
18 &    &    &    & 12 \\
17 & 16 & 15 & 14 & 13
\end{matrix}
{% endmath_block %}
```tex
\begin{matrix}
21 & 22 & 23 & 24 & 25 \\
20 &    &    &    & 10 \\
19 &    &    &    & 11 \\
18 &    &    &    & 12 \\
17 & 16 & 15 & 14 & 13
\end{matrix}
```
<br>

{% math_block %}
\begin{aligned}
d(1, k) &= 2k + 3 \\
        &= 2(k+1) + 1^2
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
d(1, k) &= 2k + 3 \\
        &= 2(k+1) + 1^2
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
d(2, k) &= 4k + 13 \\
        &= 4(k+1) + 9 \\
        &= 2 \cdot 2(k+1) + 3^2
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
d(2, k) &= 4k + 13 \\
        &= 4(k+1) + 9 \\
        &= 2 \cdot 2(k+1) + 3^2
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
d(3, k) &= 6k + 31 \\
        &= 6(k+1) + 25 \\
        &= 2 \cdot 3(k+1) + 5^2
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
d(3, k) &= 6k + 31 \\
        &= 6(k+1) + 25 \\
        &= 2 \cdot 3(k+1) + 5^2
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
d(n,k) &= 2n(k+1) + (2n-1)^2 \\
n &= 1, 2, 3, ... \\
k &= 0, 1, 2, 3
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
d(n,k) &= 2n(k+1) + (2n-1)^2 \\
n &= 1, 2, 3, ... \\
k &= 0, 1, 2, 3
\end{aligned}
```
<br>

### [정수 자릿수 구하기](/2015/07/14/number-of-digits/)

{% math_block %}
(number\,of\,digits) = \lfloor\log_{10} n\rfloor + 1
{% endmath_block %}
```tex
(number\,of\,digits) = \lfloor\log_{10} n\rfloor + 1
```
<br>

### [블로그에 Progress Bar 추가하기](/2015/07/02/proggres-bar/)

{% math_block %}
base = offsetTop + h_p - h_w
{% endmath_block %}
```tex
base = offsetTop + h_p - h_w
```
<br>

{% math_block %}
progress = \frac{y}{base} \times 100\, (\%)
{% endmath_block %}
```tex
progress = \frac{y}{base} \times 100\, (\%)
```
<br>

### [프로젝트 오일러 21](/2015/06/18/project-euler-021/)

{% math_block %}
n = \prod_k p_k^{a_k}
{% endmath_block %}
```tex
n = \prod_k p_k^{a_k}
```
<br>

{% math_block %}
\sigma(n)=\prod_k\left(\sum_{i=0}^{a_k}p_k^i\right)
{% endmath_block %}
```tex
\sigma(n)=\prod_k\left(\sum_{i=0}^{a_k}p_k^i\right)
```
<br>

{% math_block %}
(2^0 + 2^1 + 2^2 + 2^3) \cdot (3^0 + 3^1) \cdot (5^0 + 5^1)
 = 15 \cdot 4 \cdot 6 =360
{% endmath_block %}
```tex
(2^0 + 2^1 + 2^2 + 2^3) \cdot (3^0 + 3^1) \cdot (5^0 + 5^1)
 = 15 \cdot 4 \cdot 6 =360
```
<br>

{% math_block %}
\sigma(n)=\prod_k\frac{p_k^{a_k+1}-1}{p_k-1}
{% endmath_block %}
```tex
\sigma(n)=\prod_k\frac{p_k^{a_k+1}-1}{p_k-1}
```
<br>

### [프로젝트 오일러 15](/2015/04/06/project-euler-015/)

{% math_block %}
\begin{aligned}
(number\, of\, paths) &= \frac{4!}{2! \times 2!} = 6
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
(number\, of\, paths) &= \frac{4!}{2! \times 2!} = 6
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
(number\, of\, paths) &= \frac{40!}{20! \times 20!}
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
(number\, of\, paths) &= \frac{40!}{20! \times 20!}
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
n! = \begin{cases}
  1 & \mbox{if } n = 0,\\
  n(n-1)! & \mbox {if } n > 0
  \end{cases}
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
n! = \begin{cases}
  1 & \mbox{if } n = 0,\\
  n(n-1)! & \mbox {if } n > 0
  \end{cases}
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
n! = \prod_{k=1}^n k = 1 \times 2\, \times ... \times\, n
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
n! = \prod_{k=1}^n k = 1 \times 2\, \times ... \times\, n
\end{aligned}
```
<br>

### [프로젝트 오일러 9](/2015/03/05/project-euler-009/)

{% math_block %}
\begin{aligned}
T1 &= (a − 2b + 2c, 2a − b + 2c, 2a − 2b + 3c) \\
T2 &= (a + 2b + 2c, 2a + b + 2c, 2a + 2b + 3c) \\
T3 &= (−a + 2b + 2c, −2a + b + 2c, −2a + 2b + 3c)
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
T1 &= (a − 2b + 2c, 2a − b + 2c, 2a − 2b + 3c) \\
T2 &= (a + 2b + 2c, 2a + b + 2c, 2a + 2b + 3c) \\
T3 &= (−a + 2b + 2c, −2a + b + 2c, −2a + 2b + 3c)
\end{aligned}
```
<br>

### [프로젝트 오일러 6](/2015/01/19/project-euler-006/)

{% math_block %}
f(n) = an^3 + bn^2 + cn + d
{% endmath_block %}
```tex
f(n) = an^3 + bn^2 + cn + d
```
<br>

{% math_block %}
\begin{aligned}
d &= 0\\
a + b + c + d &= 1 \\
8a + 4b + 2c + d &= 5\\
27a + 9b + 3c + d &= 14
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
d &= 0\\
a + b + c + d &= 1 \\
8a + 4b + 2c + d &= 5\\
27a + 9b + 3c + d &= 14
\end{aligned}
```
<br>

{% math_block %}
a=\frac{1}{3}, b=\frac{1}{2}, c=\frac{1}{6}, d=0
{% endmath_block %}
```tex
a=\frac{1}{3}, b=\frac{1}{2}, c=\frac{1}{6}, d=0
```
<br>

{% math_block %}
f(n) = \frac{1}{6}n(n+1)(2n+1)
{% endmath_block %}
```tex
f(n) = \frac{1}{6}n(n+1)(2n+1)
```
<br>

### [프로젝트 오일러 5](/2015/01/16/project-euler-005/)

{% math_block %}
lcm(a,b) = \frac{\lvert a \times b \rvert}{gcd(a,b)}
{% endmath_block %}
```tex
lcm(a,b) = \frac{\lvert a \times b \rvert}{gcd(a,b)}
```
<br>

### [프로젝트 오일러 4](/2015/01/13/project-euler-004/)

{% math_block %}
\begin{aligned}
a \times b &= 100000x + 10000y + 1000z + 100z + 10y + x \\
&= 100001x + 10010y + 1100z \\
&= 11(9091x + 910y + 100z)
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
a \times b &= 100000x + 10000y + 1000z + 100z + 10y + x \\
&= 100001x + 10010y + 1100z \\
&= 11(9091x + 910y + 100z)
\end{aligned}
```
<br>

### [프로젝트 오일러 2](/2015/01/08/project-euler-002/)

{% math_block %}
\begin{aligned}
F_n &= F_{n-1} + F_{n-2}, \\
F_2 &= F_1 = 1
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
F_n &= F_{n-1} + F_{n-2}, \\
F_2 &= F_1 = 1
\end{aligned}
```
<br>

### [프로젝트 오일러 1](/2015/01/01/project-euler-001/)

{% math_block %}
S(n) = \frac{n(n+1)}{2}
{% endmath_block %}
```tex
S(n) = \frac{n(n+1)}{2}
```
<br>

{% math_block %}
\begin{aligned}
S(n, m) &= m + 2m + 3m + ... + n \\
        &= m \times (1 + 2 + 3 + ... + n/m) \\
        &= m \times S(n/m)
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
S(n, m) &= m + 2m + 3m + ... + n \\
        &= m \times (1 + 2 + 3 + ... + n/m) \\
        &= m \times S(n/m)
\end{aligned}
```
<br>

### [매클로린 급수를 이용한 sin(x) 구현](/2014/07/28/implementing-sin-x/)

{% math_block %}
\begin{aligned}
\sin x &= \sum\limits_{n=0}^\infty \frac{(-1)^n}{(2n+1)!}x^{2n+1}\\
       &= x - \frac{x^3}{3!} + \frac{x^5}{5!} - \frac{x^7}{7!} + ...
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
\sin x &= \sum\limits_{n=0}^\infty \frac{(-1)^n}{(2n+1)!}x^{2n+1}\\
       &= x - \frac{x^3}{3!} + \frac{x^5}{5!} - \frac{x^7}{7!} + ...
\end{aligned}
```
<br>

### [뉴튼 법을 이용한 근사값 구하기](/2014/07/25/newtons-method/)

{% math_block %}
x_{n+1} = \frac{x_n + \frac{2}{x_n}}{2}
{% endmath_block %}
```tex
x_{n+1} = \frac{x_n + \frac{2}{x_n}}{2}
```
<br>

{% math_block %}
x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}
{% endmath_block %}
```tex
x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}
```
<br>

{% math_block %}
\begin{aligned}
f(x) &= x^2 - X \\
f'(x) &= 2x \\
\therefore x_{n+1} &= x_n - \frac{x_n^2 - X}{2x_n}
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
f(x) &= x^2 - X \\
f'(x) &= 2x \\
\therefore x_{n+1} &= x_n - \frac{x_n^2 - X}{2x_n}
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
x_1 &= x_0 - \frac{f(x_0)}{f'(x_0)} = 1 - \frac{1^2 - 2}{2 \cdot 1} = 1.5\\
x_2 &= x_1 - \frac{f(x_1)}{f'(x_1)} = 1.5 - \frac{1.5^2 - 2}{2 \cdot 1.5} = 1.4167\\
x_3 &= x_2 - \frac{f(x_2)}{f'(x_2)} = 1.4167 - \frac{1.4167^2 - 2}{2 \cdot 1.4167} = \color{red}{1.4142}\\
...
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
x_1 &= x_0 - \frac{f(x_0)}{f'(x_0)} = 1 - \frac{1^2 - 2}{2 \cdot 1} = 1.5\\
x_2 &= x_1 - \frac{f(x_1)}{f'(x_1)} = 1.5 - \frac{1.5^2 - 2}{2 \cdot 1.5} = 1.4167\\
x_3 &= x_2 - \frac{f(x_2)}{f'(x_2)} = 1.4167 - \frac{1.4167^2 - 2}{2 \cdot 1.4167} = \color{red}{1.4142}\\
...
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
f(x) &= \frac{f'(a)}{1!}(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \frac{f^{(3)}(a)}{3!}(x-a)^3 + ... \\
&= \sum\limits_{n=0}^\infty \frac{f^{(n)}(a)}{n!} (x-a)^n
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
f(x) &= \frac{f'(a)}{1!}(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \frac{f^{(3)}(a)}{3!}(x-a)^3 + ... \\
&= \sum\limits_{n=0}^\infty \frac{f^{(n)}(a)}{n!} (x-a)^n
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
e^x &= \sum\limits_{n=0}^\infty \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + ...\\
\sin x &= \sum\limits_{n=0}^\infty \frac{(-1)^n}{(2n+1)!}x^{2n+1} = x - \frac{x^3}{3!} + \frac{x^5}{5!} - ...\\
\cos x &= \sum\limits_{n=0}^\infty \frac{(-1)^n}{(2n)!}x^{2n} = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - ...\\
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
e^x &= \sum\limits_{n=0}^\infty \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + ...\\
\sin x &= \sum\limits_{n=0}^\infty \frac{(-1)^n}{(2n+1)!}x^{2n+1} = x - \frac{x^3}{3!} + \frac{x^5}{5!} - ...\\
\cos x &= \sum\limits_{n=0}^\infty \frac{(-1)^n}{(2n)!}x^{2n} = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - ...\\
\end{aligned}
```
<br>

### [정적분 문제](/2014/04/22/integral-problem/)

{% math_block %}
I = \int_{-\infty}^{\infty} e^{-x^2} dx
{% endmath_block %}
```tex
I = \int_{-\infty}^{\infty} e^{-x^2} dx
```
<br>

{% math_block %}
\begin{aligned}
I^2
&= \left(\int_{-\infty}^{\infty} e^{-x^2} dx\right)^2 \\
&= \int_{-\infty}^{\infty} e^{-x^2} dx \cdot \int_{-\infty}^{\infty} e^{-y^2} dy \\
&= \int_{-\infty}^{\infty}\int_{-\infty}^{\infty} e^{-(x^2+y^2)} dx\,dy \\
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
I^2
&= \left(\int_{-\infty}^{\infty} e^{-x^2} dx\right)^2 \\
&= \int_{-\infty}^{\infty} e^{-x^2} dx \cdot \int_{-\infty}^{\infty} e^{-y^2} dy \\
&= \int_{-\infty}^{\infty}\int_{-\infty}^{\infty} e^{-(x^2+y^2)} dx\,dy \\
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
x &= r\cos \theta \\
y &= r\sin \theta \\
dx\,dy &= r\,dr\,d\theta
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
x &= r\cos \theta \\
y &= r\sin \theta \\
dx\,dy &= r\,dr\,d\theta
\end{aligned}
```
<br>

{% math_block %}
\begin{aligned}
I^2
&= \int_0^{2\pi}\int_0^\infty e^{-r^2} r\,dr\,d\theta \\
&= 2\pi \int_0^\infty e^{-r^2} r\,dr \\
&= 2\pi \left[-\frac{e^{-r^2}}{2}\right]_{r=0}^{r=\infty} \\
&= {\pi}
\end{aligned}
{% endmath_block %}
```tex
\begin{aligned}
I^2
&= \int_0^{2\pi}\int_0^\infty e^{-r^2} r\,dr\,d\theta \\
&= 2\pi \int_0^\infty e^{-r^2} r\,dr \\
&= 2\pi \left[-\frac{e^{-r^2}}{2}\right]_{r=0}^{r=\infty} \\
&= {\pi}
\end{aligned}
```
<br>

{% math_block %}
I = \sqrt \pi
{% endmath_block %}
```tex
$I = \sqrt \pi
```
<br>

### [Hexo: 블로그에 수식 표현하기](/2014/04/18/hexo-math/)

{% math_block %}
\frac{\partial L}{\partial q_j}
 - \frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}_j}\right)
 = 0
{% endmath_block %}
```tex
\frac{\partial L}{\partial q_j}
 - \frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}_j}\right)
 = 0
```
<br>
