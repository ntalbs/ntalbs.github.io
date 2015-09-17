tags: [project-euler, clojure]
date: 2015-06-24
title: 프로젝트 오일러 23
---
> 두 초과수의 합으로 나타낼 수 없는 모든 양의 정수의 합은?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=23) [[영어]](https://projecteuler.net/problem=23)

초과수인지 판단하려면 진약수의 합을 알아야 한다. [문제 21](/2015/06/18/project-euler-021/)에서 구현한 진약수의 합을 구하는 함수를 이용하면 다음과 같이 주어진 수가 초과수인지 판단하는 함수를 간단히 구현할 수 있다.<!--more-->

```clojure
(defn abundant?
  "Returns true if n is abundant number."
  [n]
  (> (aliquot-sum3 n) n))
```

주어진 범위(1~28123) 안에서 초과수 목록을 구할 수 있다.

```clojure
(def limit 28123)

(def abundants (filter abundant? (range 12 (inc (- limit 12)))))
```

가장 작은 초과수는 문제에서 주어졌으므로 이를 이용해 확인하는 범위를 조금 줄였다. 두 초과수의 합으로 나타낼 수 있는 수의 목록은 다음과 같이 구할 수 있다.

```clojure
(for [a1 abundants a2 abundants
      :when (<= a1 a2)
      :when (<= (+ a1 a2) limit)]
  (+ a1 a2))
```

이렇게 구한 목록을 집합에 넣은 다음, 범위 안의 어떤 수가 이 집합에 포함되는지 판단해 두 초과수의 합으로 나타낼 수 있는지를 알 수 있다.

```clojure
(defn solve []
  (let [abundants (filter abundant? (range 12 (inc (- limit 12))))
        sum-of-2-abundants (set (for [a1 abundants a2 abundants
                                      :when (<= a1 a2)
                                      :when (<= (+ a1 a2) limit)]
                                  (+ a1 a2)))]
    (->> (range 1 (inc limit))
         (remove #(sum-of-2-abundants %))
         (apply +))))
```

실행 결과는 다음과 같다.

<pre class="console">p023=> (time (solve))
"Elapsed time: 3153.557972 msecs"
41798??
</pre>

실행 시간이 썩 만족스럽지는 않다. 아직 더 빠르게 하는 방법을 찾지 못했다.

## 참고
* [프로젝트 오일러 문제 23 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p023.clj)
* [프로젝트 오일러 21](/2015/06/18/project-euler-021/)
약수의 합을 구하는 방법 참조.
