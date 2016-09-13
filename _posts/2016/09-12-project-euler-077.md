tags: [Project-Euler, Clojure]
date: 2016-09-12
title: 프로젝트 오일러 77
---
> 소수의 합으로 나타내는 방법이 5000가지가 넘는 최초의 숫자는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=77) [[영어]](https://projecteuler.net/problem=77)

이 문제도 바로 전에 풀었던 [문제 76](/2016/project-euler-076/)과 마찬가지로 [문제 31](/2015/project-euler-031/)비슷하다. 여기서는 동전의 종류가 소수라고 생각하면 된다. 따라서 인덱스를 넣으면 소수가 나오는 맵을 만들어 두면 문제 풀이에 활용할 수 있다. 소수는 100개 정도 준비하면 충분할 것 같다.
<!--more-->

```clojure
(ns p077
    (:require [clojure.contrib.lazy-seqs :refer [primes]]))

(def limit 100)

(def i->p
  (into {} (take limit (map-indexed (fn [i p] [(inc i) p]) primes))))
```

그리고 문제 31의 함수를 조금 변형하면 주어진 수를 소수의 합으로 나타내는 방법을 세는 함수를 만들 수 있다.

```clojure
(defn- cc [n i]
  (cond (= n 0) 1
        (< n 0) 0
        (= i 0) 0
        :else (+ (cc n (dec i)) (cc (- n (i->p i)) i))))
```

이제 이 함수를 이용해 숫자를 증가시키면서 소수의 합으로 나타내는 방법을 세다가, 방법의 가지 수가 처음으로 5000을 넘는 수를 찾으면 된다.

```clojure
(defn solve []
  (->> (iterate inc 2)
       (map (fn [n] [n (cc n limit)]))
       (drop-while (fn [[_ c]] (<= c 5000)))
       ffirst))
```

실행 결과는 다음과 같다.

<pre class="console">
p077=> (time (solve))
"Elapsed time: 87.056027 msecs"
?1
</pre>

## 참고
* [프로젝트 오일러 77 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p077.clj)
* [프로젝트 오일러 76](/2016/project-euler-076/)
* [프로젝트 오일러 31](/2015/project-euler-031/)
