tags: [Project-Euler, Clojure]
date: 2016-03-14
title: 프로젝트 오일러 57
---
> 제곱근 2의 연분수꼴 살펴보기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=57) [[영어]](https://projecteuler.net/problem=57)

문제에 있는 $\sqrt 2$의 연분수꼴 수식은 다음과 같다.

{% math %}
\begin{aligned}
\sqrt 2 = 1 + \cfrac{1}{2 + \cfrac{1}{2 + \cfrac{1}{2 + \cfrac{1}{ \ddots }}}}
\end{aligned}
{% endmath %}

<!--more-->
처음부터 한 단계씩 확장해보면 다음과 같이 된다.

{% math %}
\begin{aligned}
1 + \frac{1}{2} \Longrightarrow
1 + \cfrac{1}{2 + \cfrac{1}{2}} \Longrightarrow
1 + \cfrac{1}{2 + \cfrac{1}{2 + \cfrac{1}{2}}} \Longrightarrow
\cdots
\end{aligned}
{% endmath %}

각 단계를 자세히 살펴보면 현재 단계에 1을 더해 역수로 만든 다음 다시 1을 더하면 다음 단계가 되는 것을 알 수 있다. 즉 $k$번째 항을 $a_k$라 하면 다음과 같은 식을 만들 수 있다.

{% math %}
\begin{aligned}
a_0 &= 1 + \frac{1}{2} \\
a_{k+1} &= 1 + \frac{1}{1 + a_k}
\end{aligned}
{% endmath %}

여기까지 이해했다면 Clojure로 코드를 작성하는 것은 식은 죽 먹기다. 현재 항의 값 `a`를 받아 다음 항의 값을 계산하는 함수는 다음과 같이 작성할 수 있다. 적절한 함수 이름이 생각나지 않아 그냥 conversion을 뜻하는 `conv`라 했다. `->>` 매크로를 이용하면 위해서 설명한 현재 항에 1을 더해 역수로 만든 다음 1을 더하는 절차를 그대로 표현할 수 있다.

```clojure
(defn conv [a]
  (->> (+ 1 a) (/ 1) (+ 1)))
```

첫 항은 다음과 같이 정의할 수 있다.

```clojure
(def a (+ 1 (/ 1 2)))
```

분자와 분모의 자릿수를 세야 하므로 자릿수를 세는 함수도 만들어 두는 것이 좋게다. 자릿수는 그냥 숫자를 문자열로 바꾸어 길이를 계산하면 된다.

```clojure
(defn digit-cnt [n]
  (count (str n)))
```

답을 구하기 위한 준비가 끝났다. `iterate` 함수를 사용해 첫 항에 `conv` 함수를 반복 적용하는 시퀀스를 만들어 1,000개를 취한 다음 분자의 자릿수가 분모의 자리수보다 많은 경우만 걸러내 개수를 세면 된다.

```clojure
(defn solve []
  (->> (iterate conv a)
       (take 1000)
       (filter (fn [r] (> (digit-cnt (numerator r)) (digit-cnt (denominator r)))))
       count))
```

실행 결과는 다음과 같다.

<pre class="console">
p057=> (time (solve))
"Elapsed time: 230.058264 msecs"
1?3
</pre>

## 참고
* [프로젝트 오일러 57 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p057.clj)
