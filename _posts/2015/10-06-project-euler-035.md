tags: [project-euler, clojure]
date: 2015-10-06
title: 프로젝트 오일러 35
---
> 백만 이하인 circular prime 개수 구하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=35) [[영어]](https://projecteuler.net/problem=35)

백만 이하의 소수는 `clojure.contrib.lazy-seqs`의 `primes`를 이용해 구할 수 있다. `digits`를 이용해 숫자의 시퀀스를 만들고 `cycle`과 `partition`을 이용하면 순환수(circular number)도 쉽게 구할 수 있다.<!--more-->

```clojure
(ns p035
  (:require [clojure.contrib.lazy-seqs :refer [primes]]
            [util :refer [parse-int digits prime?]]))

(defn circular-nums [n]
  (let [ds (digits n) len (count ds)]
    (->> (cycle ds)
         (partition len 1)
         (take len)
         (map #(parse-int (apply str %))))))
```

`circular-nums`는 순환수 리스트를 리턴한다. 리스트에 포함된 모든 수가 소수인지를 판별하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn all-prime? [coll]
  (every? prime? coll))
```

이 두 함수를 이용하면 문제는 다음과 같이 간단히 풀 수 있다.

```clojure
(defn solve0 []
  (->> primes
       (take-while #(< % 1000000))
       (filter (fn [n] (all-prime? (circular-nums n))))
       count))
```

다만 실행 속도가 썩 만족스럽지는 않다.

<pre class="console">p035=> (time (solve0))
"Elapsed time: 1630.826804 msecs"
5?
</pre>

## 개선 1
위 풀이는 비효율적인 부분이 있다. 순환수의 리스트를 만들기 위해 `digits`, `cycle`, `partition` 등을 사용하는 것도 무거워 보인다. 순환수를 만들다 하나라도 소수가 아닌 수를 만나면 바로 `false`를 리턴하는 방식이 아니라 일단 주어진 수에 대해 모든 순환수를 미리 만들어 놓는 부분도 개선할 수 있을 것 같다.

위에서와 같이 한꺼번에 순환수의 리스트를 구하는 대신 주어진 수의 다음 단계 순환수만 만드는 함수를 작성한 다음 필요한 만큼만 호출하면 좀더 효율적일 것 같다. 따라서 다음과 같이 한 단계만 순환시키는 함수를 만들어보자.

```clojure
(ns p035
  (:require [clojure.contrib.lazy-seqs :refer [primes]]
            [util :refer [parse-int digits prime? pow]])) ; pow 추가

(defn- cycle1 [n p]
  (let [i (quot n 10) l (rem n 10)]
    (+ (* l (pow 10 p)) i)))
```

이 구현에서는 `digit`, `cycle`, `partition`을 사용하지 않기 때문에 내부적으로 중간 단계 시퀀스를 생성하지 않으므로 `circular-nums`보다 훨씬 가볍다 할 수 있다. `pow`를 호출할 때의 지수 `p`는 `Math/log10` 함수로 값을 구할 수 있지만, 동일한 자릿수의 숫자에 대해 반복적으로 구하는 것을 회피하고자 인자로 받게 했다. 어찌 보면 어설픈 최적화라 할 수도 있겠지만, 뻔히 아는 것을 매번 다시 구하지 않도록 하면 그만큼 더 빨라질 것이다.

이제 `circular-prime?` 함수를 구현할 차례다. `circular-nums`를 사용할 때처럼 미리 순환수 리스트를 구한 다음 리스트 안의 모든 수가 소수인지 검사하는 방법 대신, 한 단계씩 순환수를 만들어가며 중간에 소수가 아닌 수가 나오면 바로 `false`를 리턴하도록 구현했다. 루프를 몇 번 돌지는 주어진 수의 `log10` 값으로 알 수 있다.

```clojure
(defn- circular-prime1? [n]
  (let [p (int (Math/log10 n))]
    (loop [n n, cnt p]
      (cond
        (= 0 cnt) (prime? n)
        (prime? n) (recur (cycle1 n p) (dec cnt))
        :else false))))
```

`cycle1`과 `circular-prime1?` 함수를 이용한 풀이는 다음과 같다.

```clojure
(defn solve1 []
  (->> primes
       (take-while #(< % 1000000))
       (filter circular-prime1?)
       count))
```

실행 결과는 다음과 같다. 개선되긴 했지만 아직 충분히 빠르지는 않다.

<pre class="console">p035=> (time (solve1))
"Elapsed time: 1241.998528 msecs"
5?
</pre>

## 개선 2
**개선 1** 풀이에서는 `circular-prime1?`에 소수만 전달하면서도 그 수가 소수인지 다시 확인하고 있다. `prime?` 함수에 큰 소수가 입력되면 비용이 많이 든다. 따라서 소수를 `prime?`으로 확인하는 단계를 제거하면 성능이 향상될 것이다.

```clojure
(defn- circular-prime2? [n] ;; 처음 전달된 n은 prime이라고 가정
  (let [p (int (Math/log10 n))]
    (loop [n (cycle1 n p), cnt (dec p)]
      (cond
        (<= cnt 0) (prime? n)
        (prime? n) (recur (cycle1 n p) (dec cnt))
        :else false))))
```

`circular-prime2?`는 인자로 전달되는 수가 소수라 가정해 인자가 소수인지 확인하는 단계를 생략했다. 이 함수를 이용한 풀이는 다음과 같다.

```clojure
(defn solve2 []
  (->> primes
       (take-while #(< % 1000000))
       (filter circular-prime2?)
       count))
```

`circular-prime1?`을 쓰던 부분을 `circular-prime2?`로 바꿨을 뿐이다. 실행 결과는 다음과 같다.

<pre class="console">p035=> (time (solve2))
"Elapsed time: 285.24435 msecs"
5?
</pre>

시간이 **개선 1** 풀이의 1/4 이하로 단축되었다.

## 참고
* [프로젝트 오일러 35 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p035.clj)
* [프로젝트 오일러 13](/2015/03/18/project-euler-013/)
`digits` 함수 구현을 확인할 수 있다.
* [프로젝트 오일러 7](/2015/02/10/project-euler-007/)
`prime?` 함수 구현에 대한 설명을 볼 수 있다.
