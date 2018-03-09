tags: [Project-Euler, Clojure]
date: 2018-03-09
title: 프로젝트 오일러 88
---
> 일정한 개수의 숫자들을 더해도 곱해도 같은 값이 되는 경우 조사하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=88) [[영어]](https://projecteuler.net/problem=88)

[문제 83](/2017/project-euler-083/)과 더불어 내게 가장 어려운 문제 중 하나였다. 안타깝지만 이 문제는 내 두뇌 용량을 넘는 문제여서 풀이를 보고도 이해할 수가 없었다. 아래 코드는 다른 블로그에서 찾은 Python 풀이를 Clojure로 옮긴 것에 불과하다.
<!--more-->

<!--
* $k = p - s + n$
인수 집합이 어떻게 주어지든 product-sum number를 구할 수 있다. 예를 들어, 인수 ${2, 3, 4}$가 있는 경우 $2 \times 3 \times 4 = 24$이고 $2 + 3 + 4 = 9$이 되어 product-sum number와 관계가 없어 보인다. 그러나 어떤 수에 1을 곱하면 그대로지만 1을 더하면 1씩 커진다는 특성을 이용하면 $24 - 9 = 15$개의 1을 더해 product-sum number로 만들 수 있다. 물론 이렇게 구한 product-sum number가 최소 product-sum number란 보장은 없다.
* $k \le mps(k) \le 2k$
$k$에 대한 최소 product-sum number를 $mps(k)$라 하면, $mps(k) \ge k$가 되어야 한다. $k$개의 인자가 있고 각 인자가 1보다 크거나 같다면 그 합은 $k$보다 거야 한다. 또 $mps(k)$를 $\\{2, k\\}$로 인수분해하면 곱은 $2k$, 합은 $2+k$가 되는데 여기에 $k-2$개의 1을 더해주면 $mps(k)$가 된다. 따라서 $mps(k)$는 $2k$보다 작거나 같아야 한다.
* 인자 개수 상한은 $\lfloor log_2{24000} \rfloor = 14$
$mps(k)$의 상한은 $2k$이고 $k$의 최대값은 $12000$이므로 문제에서 $mps$의 상한은 $24000$이 된다. 따라서 인자 개수의 상한은 $log_2{24000}=14$가 된다.
-->

```clojure
(ns p088)

(def kmax 12000)

(defn- prodsum [p s c start n]
  (let [k (+ (- p s) c)]
    (if (< k kmax)
      (do
        (if (< p (@n k))
          (swap! n assoc k p))
        (doseq [i (range start (inc (* (quot kmax p) 2)))]
          (prodsum (* p i) (+ s i) (+ c 1) i n))))
    n))

(defn solve []
  (let [n (atom (vec (repeat kmax (* kmax 2))))]
    (->> @(prodsum 1 1 1 2 n)
         (drop 2)
         (distinct)
         (apply +))))
```

실행하면 빠르게 답을 구한다.

<pre class="console">
p088=> (time (solve))
"Elapsed time: 150.085615 msecs"
?58745?
</pre>

`prodsum` 함수는 `Atom`을 인자로 받아 루프를 돌며 업데이트하고 마지막에 다시 `Atom`을 리턴한다. 함수 안에서 `Atom`을 사용한 것이 마음에 들지 않는다. 나중에 로직을 완전이 이해하게 되면 수정해야 겠다. 언제가 될지는 모르겠지만.

## 참고
* [프로젝트 오일러 88 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p088.clj)
* [Dreamshire / Project Euler 88 Solution](https://blog.dreamshire.com/project-euler-88-solution/)
