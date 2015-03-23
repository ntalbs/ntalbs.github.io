tags: [project-euler, clojure]
date: 2015-01-19
title: 프로젝트 오일러 6
---
> 1부터 100까지 "제곱의 합"과 "합의 제곱"의 차는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=6) [[영어]](https://projecteuler.net/problem=6)

문제가 단순하고 범위도 적어 아무렇게나 풀어도 쉽게 답을 구할 수 있다.<!--more-->

## 방법 1
가장 쉽게 생각할 수 있는 방법은 1부터 100까지 루프를 돌리면서 **제곱의 합**을 구하고, 또 1부터 100까지 루프를 돌려 합을 구한 다음 그 결과를 제곱해 **합의 제곱**을 구한 다음, 두 값의 차를 구하는 것이다.

```
(defn using-brute-force [n]
  (let [s (range 1 (inc n))
        sum-of-sq (reduce + (map (fn [n] (* n n)) s))
        sq-of-sum (let [sum (reduce + s)]
                    (* sum sum))]
    (- sq-of-sum sum-of-sq)))
```

겨우 100까지 루프를 돌리는 것이기 때문에 이렇게 해도 답을 구하는 데 내 노트북에서 1.5ms밖에 걸리지 않는다. 그러나 이 방법은 $O(n)$ 복잡도를 가지므로 숫자가 커질수록 시간이 걸린다.

## 방법 2
[문제 1](/2015/01/01/project-euler-001/)에서 공식을 이용해 합을 구하는 방법을 설명했다. 따라서 공식을 이용하면 루프 없이 $O(1)$ 복잡도로 합의 제곱을 구할 수 있다. 그런데 제곱의 합도 이런 식으로 구할 수 있을까? 1부터 n까지 제곱의 합을 다음과 같은 형태라고 가정해보자.

$$
f(n) = an^3 + bn^2 + cn + d
$$

여기서 $a, b, c, d$를 구하면 제곱의 합 $f(n)$을 구할 수 있다. $f(0) = 0$, $f(1) = 1$, $f(2) = 5$, $f(3) = 14$이므로, 다음과 같이 네 개의 방정식을 얻을 수 있다.

{% block math %}
\begin{aligned}
d &= 0\\
a + b + c + d &= 1 \\
8a + 4b + 2c + d &= 5\\
27a + 9b + 3c + d &= 14
\end{aligned}
{% endblock %}

이 방정식을 풀면 다음과 같은 결과를 얻을 수 있다.

$$
a=\frac{1}{3}, b=\frac{1}{2}, c=\frac{1}{6}, d=0
$$

$a, b, c, d$ 값을 대입해 정리하면 다음과 같은 식을 얻을 수 있다.

$$
f(n) = \frac{1}{6}n(n+1)(2n+1)
$$

(이 결과가 맞는지 수학적 귀납법으로 증명할 수 있지만, 증명은 생략한다.)

따라서 **합의 제곱**과 **제곱의 합**을 구하는 함수는 다음과 같이 구현할 수 있다.

```
(defn sq-of-sum [n]
  (let [s (/ (* n (+ n 1)) 2)]
    (* s s)))

(defn sum-of-sq [n]
  (/ (* n (+ n 1) (+ (* 2 n) 1)) 6))
```

여기까지 했으면 문제의 답은 다음과 같이 쉽게 구할 수 있다.

```
(defn using-formula [n]
  (- (sq-of-sum n) (sum-of-sq n)))
```

## 정리
실행시킨 결과는 다음과 같다. 범위가 적어 별 차이 없는 것처럼 보인다. 그러나 첫 번째 방법은 범위에 비례해 속도가 느려질 것이다. 두 번째 방법은 범위와 상관 없이 항상 같은 시간에 결과를 구할 것이다.
<pre class="console">
p006=> (time (using-brute-force 100))
"Elapsed time: 0.076776 msecs"
25164???
p006=> (time (using-formula 100))
"Elapsed time: 0.042433 msecs"
25164???
</pre>

## 참고
* [프로젝트 오일러 문제 6 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p006.clj)
