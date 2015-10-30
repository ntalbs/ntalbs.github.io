tags: [project-euler, clojure]
date: 2015-10-28
title: 프로젝트 오일러 43
---
> 부분열에 관련된 특이한 성질을 가진 모든 팬디지털 숫자의 합
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=43) [[영어]](https://projecteuler.net/problem=43)

언듯 보면 복잡해 보이지만 조건만 많을 뿐 아주 단순한 문제다. [문제 32](/2015/10/03/project-euler-032/), [문제 41](/2015/10/26/project-euler-041/)에서 `clojure.contrib.combinatorics`의 `permutations`를 사용해 팬디지털 수를 만드는 방법을 살펴봤다. 이 문제에서도 0-9 팬디지털 수를 구해 문제에서 설명한 조건을 만족하는 수만 걸러낸 다음 그 합을 구하면 된다.
<!--more-->

`permutations`는 벡터의 시퀀스를 리턴한다. 시퀀스 안의 벡터 하나 하나가 팬디지털 수다. 이 벡터에서 필요한 자리수를 꺼내 조건에 맞는지 확인해야 한다.

```clojure
(ns p043
  (:require [clojure.math.combinatorics :refer [permutations]]))

(defn- svn
  "subvector number"
  [ds start-pos]
  (->> (subvec ds start-pos (+ start-pos 3))
       (apply str)
       Integer/parseInt))
```

`svn` 함수는 두 개의 인자를 받는다. `ds`는 팬디지털 수의 각 자리수를 벡터로 나타낸 것이고, `start-pos`는 시작 위치(인덱스)다. `ds`에서 `start-pos`부터 3개의 숫자를 뽑아내 정수로 만들어 리턴하는 게 이 함수가 하는 일이다. 이렇게 하면 `filter`를 사용해 문제의 조건을 하나씩 확인할 수 있게 된다. 맨 앞이 0인 수는 무의미하므로 첫 자리가 0인 순열은 모두 제외한 다음 `filter`를 시작한다.

```clojure
(defn solve1 []
  (->> (permutations (range 10))
       (drop-while #(= 0 (first %)))
       (filter #(= 0 (rem (svn % 1) 2)))
       (filter #(= 0 (rem (svn % 2) 3)))
       (filter #(= 0 (rem (svn % 3) 5)))
       (filter #(= 0 (rem (svn % 4) 7)))
       (filter #(= 0 (rem (svn % 5) 11)))
       (filter #(= 0 (rem (svn % 6) 13)))
       (filter #(= 0 (rem (svn % 7) 17)))
       (map #(apply str %))
       (map #(Long/parseLong %))
       (reduce +)))
```

실행 결과는 다음과 같다.

<pre class="console">
p043=> (time (solve1))
"Elapsed time: 3190.889845 msecs"
166953348??
</pre>

답을 구하는 데 3초가 조금 넘게 걸린다. 좀더 빠르게 할 수 없을까? 생각해보니 17의 배수인지 먼저 확인하고 그 다음 13의 배수인지 확인하는 식으로 순서를 바꾸면 다음 단계 `filter`를 실행할 대상이 줄어들어 속도가 빨라지지 않을까 하는 생각이 든다.

```clojure
(defn solve2 []
  (->> (permutations (range 10))
       (drop-while #(= 0 (first %)))
       (filter #(= 0 (rem (svn % 7) 17)))
       (filter #(= 0 (rem (svn % 6) 13)))
       (filter #(= 0 (rem (svn % 5) 11)))
       (filter #(= 0 (rem (svn % 4) 7)))
       (filter #(= 0 (rem (svn % 3) 5)))
       (filter #(= 0 (rem (svn % 2) 3)))
       (filter #(= 0 (rem (svn % 1) 2)))
       (map #(apply str %))
       (map #(Long/parseLong %))
       (reduce +)))
```

`filter`의 순서만 변경했다. 실행 결과는 다음과 같다.

<pre class="console">
p043=> (time (solve))
"Elapsed time: 2471.395316 msecs"
166953348??
</pre>

아주 만족스러운 결과는 아니지만, `filter`의 순서만 변경해 23% 정도 실행 시간을 단축했으니 그럭저럭 괜찮다고 할 수 있겠다.

## 참고
* [프로젝트 오일러 43 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p043.clj)
* [프로젝트 오일러 41](/2015/10/26/project-euler-041/)
