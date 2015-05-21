tags: [project-euler, clojure]
date: 2015-03-09
title: 프로젝트 오일러 10
---
> 이백만 이하 소수의 합은?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=10) [[영어]](https://projecteuler.net/problem=10)

[문제 7](/2015/02/10/project-euler-007/)에서 어떤 수가 소수인지 판별하는 함수와 Clojure 라이브버리로 제공되는 소수의 지연 시퀀스를 살펴봤다.<!--more-->

## 방법 1
2백만까지 수를 증가시키면서 `prime?`을 이용해 소수만 뽑아낸 다음 합하는 방식을 생각해볼 수 있다.

```clojure
(def limit 2000000)

(defn using-pred []
  (->> (filter prime? (range 2 (inc limit)))
       (reduce +)))
```

다만 `prime?` 함수 안에서도 주어진 수가 소수인지 판별하기 위해 루프를 돌고 있음을 고려해야 한다. `prime?` 함수도 인자가 커질 수로 소수인지 판별하는 데 걸리는 시간이 늘어난다.

## 방법 2
Clojure 라이브러리로 제공되는 `clojure.contrib.lazy-seqs/primes`를 사용해 문제를 풀 수도 있다.

```clojure
(defn using-seq []
  (->> (take-while #(< % limit) primes)
       (reduce +)))
```

## 정리
소수 판별 함수를 이용한 방법은 예상대로 결과가 빠르게 나오지 않는다. 소수 지연 시퀀스를 사용한 방법도 조금 빨라지긴 했지만 느리긴 마찬가지다.

<pre class="console">
p010=> (time (using-pred))
"Elapsed time: 6076.604045 msecs"
142913828???
p010=> (time (using-seq))
"Elapsed time: 3864.48696 msecs"
142913828???
</pre>

`using-seq`를 다시 실행시키면 매우 빠르게 결과가 나오는데, 이는 지연 시퀀스로 구한 결과가 캐시되기 때문일 것이다. 여기서는 처음 구할 때 걸린 시간을 기준으로 생각해야 한다.

## 참고
* [프로젝트 오일러 문제 10 풀이 코드](https://github.com/ntalbs/euler/blob/master/src/p010.clj)
