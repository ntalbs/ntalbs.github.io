tags: [Project-Euler, Clojure]
date: 2016-06-02
title: 프로젝트 오일러 70
---
> φ(n)이 n의 순열이 되는 수 조사하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=70) [[영어]](https://projecteuler.net/problem=70)

$\phi(n)$이 $n$의 순열이 되는 수 중에서 $n/\phi(n)$이 최소가 되는 $n$을 구해야 한다. $n/\phi(n)$이 다음과 같이 표현될 수 있음을 [문제 69](/2016/project-euler-069/)에서 확인했다.

{% math %}
  \begin{aligned}
    \frac{n}{\phi(n)} = \frac{1}{\prod_{p|n}\left(1-\frac{1}{p}\right)}
  \end{aligned}
{% endmath %}
<!--more-->

$n/\phi(n)$의 값이 최소가 되려면 분모가 최대가 되어야 한다. $n$의 소수인 약수 개수가 늘어날수록 분모는 점점 작아진다. 소수인 약수의 개수는 적을 수록 좋고 소수의 값 자체는 클수록 분모가 커진다. 소수인 약수의 개수가 한 개뿐이고 그 값이 $n$에 최대한 가까운 값을 구하면 $n/\phi(n)$이 최소가 될 것이다. 그러나 이 경우는 $\phi(n) = n-1$이 되어 $\phi(n)$이 $n$의 순열이 될 수 없다.

그 다음 생각할 수 있는 것은 소수인 약수가 두 개이고 각 소수가 모두 $\sqrt{10000000}\,(\approx 3162)$에 가까운 값을 가지는 경우다. 따라서 이 숫자를 기준으로 적절한 범위, 즉 2000에서 4000 사이의 소수를 탐색해 조건을 만족하는 값을 구한다면 답을 찾을 수 있을 것이다.

소수인 약수가 두 개뿐이라면 $\phi(n)$은 다음과 같이 간단히 구할 수 있다.

{% math %}
  \require{cancel}
  \begin{aligned}
  \phi(n) &= p_1p_2 \left(1-\frac{1}{p_1}\right)\left(1-\frac{1}{p_2}\right) \\
          &= \cancel{p_1p_2} \frac{(p_1 - 1)(p_2 - 1)}{\cancel{p_1p_2}} \\
          &= (p_1 - 1)(p_2 - 1)
  \end{aligned}
{% endmath %}

따라서 두 소수를 받아 $\phi(n)$을 구하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn phi [p1 p2]
  (* (dec p1) (dec p2)))
```

한 수가 다른 수의 순열인지 확인하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn permutation? [m n]
  (= (sort (digits m)) (sort (digits n))))
```

이제 2000에서 4000 사이의 소수에 대해 $\phi(n)$을 구해 $\phi(n)$이 $n$의 순열이 되는 경우만 걸러내 $n/\phi(n)$이 최소가 되는 $n$을 구하면 된다.

```clojure
(def ps
  (->> primes
       (drop-while #(< % 2000))
       (take-while #(< % 4000))))

(defn solve []
  (->> (for [p1 ps, p2 ps :when (< (* p1 p2) 10000000)]
         [p1 p2 (phi p1 p2)])
       (filter (fn [[p1 p2 phi]] (permutation? (* p1 p2) phi)))
       (map (fn [[p1 p2 phi]] (/ (* p1 p2) phi)))
       (apply min)
       numerator))
```

실행 결과는 다음과 같다.

<pre class="console">
p070=> (time (solve))
"Elapsed time: 110.29622 msecs"
831??23
</pre>

## 참고
* [프로젝트 오일러 70 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p070.clj)
