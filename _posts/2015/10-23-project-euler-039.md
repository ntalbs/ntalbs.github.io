tags: [Project-Euler, Clojure]
date: 2015-10-23
title: 프로젝트 오일러 39
---
> 가장 많은 직각삼각형이 만들어지는 둘레(≤ 1000)의 길이는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=39) [[영어]](https://projecteuler.net/problem=39)

세 변의 길이가 자연수인 직삼각형을 가장 많이 만들 수 있는 둘레 길이를 찾는 문제다. [Pythagorean triple > Generating a triple](https://en.wikipedia.org/wiki/Pythagorean_triple#Generating_a_triple)에 유클리드 공식을 사용해 피타고라스 수를 구하는 방법이 나와있다.
<!--more-->

{% math_block %}
\begin{aligned}
a &= k \cdot (m^2 - n^2)\\
b &= k \cdot (2mn)\\
c &= k \cdot (m^2 + n^2)
\end{aligned}
{% endmath_block %}

여기서 $m, n, k$는 양의 정수고, $m > n$, $m-n$은 홀수, $m, n$은 서로 소(coprime)여야 한다. $k$가 1일 때 나오는 $(a, b, c)$를 원시 피타고라스 수라 한다. 이 공식을 이용해 피타고라스 수를 구하는 함수를 다음과 같이 작성할 수 있다. 함수 호출부에서 조건에 맞는 적절한 $m, n, k$를 인자로 사용한다고 가정한다.

```clojure
(defn- triple [m n k]
  [(* k (- (* m m) (* n n)))
   (* k 2 m n)
   (* k (+ (* m m) (* n n)))])
```

이제 $m, n, k$의 범위를 어떻게 해야 할 지 생각해야 한다. 다음과 같은 사실을 잘 정리하면 $m, n, k$의 범위를 정할 수 있다.

* $m, n, k$가 **양의 정수**고 $m > n$이므로 $m \ge 2$이어야 한다.
* $a = k \cdot (m^2 - n^2)$이므로 $m$과 $n$의 값이 비슷할 때 $a$ 값이 최소가 된다.
* 각 변의 길이는 $a < b < c$이므로 $b < 500$이어야 한다. $b \le 500$면 둘레 길이가 $1000$보다 커진다.
* 같은 둘레 길이의 직삼각형에서는 $m \approx n$일 때 $a$가 작아지고 $b$가 커진다.
{% math_block %}
\begin{aligned}
 b = & 2mn, m \approx n \\
& 2m^2 < 500 \\
\therefore\,\,\, & m < \sqrt{250}
\end{aligned}
{% endmath_block %}
* 제일 작은 직삼각형이 $(3, 4, 5)$이고 이 때의 둘레 길이는 12이므로, $k < \lfloor \frac{1000}{12} \rfloor$이다.

따라서 다음과 같이 문제를 풀 수 있다. $m, n, k$의 가능한 범위 내에서 피타고라스 수를 만들어 직삼각형 둘레 길이가 1000 이하인 것만 걸러낸 다음 둘레 길이로 `group-by` 해서 직삼각형이 가장 많이 있는 둘레 길이를 구하면 된다.

```clojure
(defn solve []
  (->> (for [m (range 2 (int (Math/sqrt (/ limit 4))))
             n (range 1 m)
             k (range 1 (quot limit 12))
             :when (odd? (- m n))
             :when (= 1 (gcd m n))]
         (triple m n k))
       (filter (fn [[a b c]] (<= (+ a b c) limit)))
       (group-by (fn [[a b c]] (+ a b c)))
       (apply max-key (fn [[p v]] (count v)))
       first))
```

실행 결과는 다음과 같다. 충분히 빠르게 답을 구했다.

<pre class="console">
p039=> (time (solve))
"Elapsed time: 6.948882 msecs"
84?
</pre>

## 참고
* [프로젝트 오일러 39 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p039.clj)
* [Pythagorean triple > Generating a triple](https://en.wikipedia.org/wiki/Pythagorean_triple#Generating_a_triple)
* [프로젝트 오일러 9](/2015/03/05/project-euler-009/)
피타고라스 수와 관련된 다른 문제. 여기서는 다른 공식을 이용해 피타고라스 수를 생성했다.
