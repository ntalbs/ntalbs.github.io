tags: [Project-Euler, Clojure]
date: 2016-04-10
title: 프로젝트 오일러 62
---
> 자릿수로 만든 순열 중에서 5개가 세제곱수인 가장 작은 숫자는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=62) [[영어]](https://projecteuler.net/problem=62)

처음 떠오른 생각은 이렇다. 숫자를 증가시키면서 그 수자 세제곱수인지 확인하고, 세제곱수라면 자릿수로 순열을 만들어 그 중 세제곱수인 것만 골라내서 다섯 개가 되는지 확인하는 방법을 생각할 수 있다. 그러나 이 방법은 쉽지도 않고 비효율적이다. 숫자의 대부분이 세제곱수가 아니고 세제곱수의 순열도 대부분 세제곱수가 아닐 것이기 때문이다.<!--more-->

다음 떠오른 생각은, 세제곱수에 대해서만 확인을 하면 좋겠다는 것이었다. 어떤 수가 다른 수 자릿수의 순열로 되어 있는지 확인하는 방법을 안다면 어렵지 않을 것 같다. 그리고 어떤 수가 다른 수 자릿수의 순열로 되어 있는지 확인하는 방법도 알고보면 간단하다. 어떤 수가 다른 수 자릿수의 순열로 되어 있다는 말은 두 수를 이루는 자릿수 숫자가 모두 같다는 말이 된다. 따라서 두 수의 자릿수를 정렬해 비교하면 두 수가 같은 숫자로 되어 있는지를 판단할 수 있다.

```clojure
(defn sorted-digits [n]
  (sort (digits n)))
```

세제곱수의 시퀀스는 다음과 같이 쉽게 만들 수 있다.

```clojure
(def cubics
  (->> (iterate inc 1)
       (map #(* % % %))))
```

이제 세제곱수에 대해 루프를 돌리며 맵에 넣는다. 키는 `sorted-digits`의 리턴값이고 값은 세제곱수의 리스트다. 이렇게 세제곱수를 계속 맵에 넣으면서 세제곱수의 리스트 길이가 5가 되면 그 리스트에서 최소값을 구하면 된다.

```clojure
(defn solve []
  (loop [cs cubics m {}]
    (let [c  (first cs)           ; current cubic number
          k  (sorted-digits c)    ; key from c
          m  (update m k conj c)  ; map
          cl (m k)]               ; cubic list for k
      (if (= 5 (count cl))
        (apply min cl)
        (recur (rest cs) m)))))
```

실행 결과는 다음과 같다.

<pre class="console">
p062=> (time (solve))
"Elapsed time: 24.455178 msecs"
1??035954683
</pre>

## 참고
* [프로젝트 오일러 62 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p062.clj)
