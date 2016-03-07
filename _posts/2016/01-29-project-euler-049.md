tags: [Project-Euler, Clojure]
date: 2016-01-29
title: 프로젝트 오일러 49
---
> 세 항이 소수이면서 다른 수의 순열이 되는 4자리 숫자의 등차수열 찾기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=49) [[영어]](https://projecteuler.net/problem=49)

네 자리 소수에 대해서만 계산을 해보면 되므로, 무차별 대입법을 이용해도 답을 빠르게 찾아낼 수 있을 것 같다. 다음과 같은 도구가 있다면 문제를 쉽게 풀 수 있다.

* 자릿수가 네 자리인 소수 집합
* 주어진 네 자리 소수의 순열을 구해 이 중 소수만 걸러내 리턴하는 함수
* 주어진 시퀀스에서 등차수열을 찾아내는 함수

<!--more-->

먼저 자릿수가 네 자리인 소수 집합이 필요하다. 이 집합은 다음과 같이 간단히 구할 수 있다. Clojure에서는 `set`을 predicate으로 사용할 수 있으므로, `set`으로 만들어두면 나중에 자릿수를 바꿔서 만든 수가 소수인지 확인할 때 편해진다.

```clojure
(def four-digits-primes
  (->> primes
       (drop-while #(< % 1000))
       (take-while #(< % 9999))
       set))
```

그리고 주어진 네 자리 소수의 순열을 구해 이 중 소수인 수만 리턴하는 함수는 `digits`와 `permutations`를 이용해 다음과 같이 작성할 수 있다.

```clojure
(defn permutation-primes [p]
  (->> (digits p)
       permutations
       (map #(apply str %))
       (map #(parse-int %))
       (filter four-digits-primes)
       sort))
```

주어진 소수를 자릿수의 시퀀스로 만든 다음, 순열을 구하고, 다시 숫자로 만든 다음, 소수만 걸러낸다. 리턴하기 전에 시퀀스를 미리 정렬해 놓으면 등차수열을 찾을 때 편하다.

여기까지는 평이하다. 주어진 시퀀스에서 등차수열을 찾아내는 부분이 조금 힘들었다. 고민 끝에 찾아낸 방법은 다음과 같다.

1. 시퀀스 안에서 임의의 두 수를 골라 차($\Delta$)를 구한다
1. 그 차로 `group-by`하면 차가 같은 숫자 쌍을 모을 수 있다.
1. `group-by`로 모은 값의 시퀀스 길이가 2인 것만 걸러낸다. (그래야 해당 시퀀스에 숫자가 세 개 이상 포함될 수 있다.)
1. 위 결과에서 앞 쌍의 뒷 숫자와 뒷 쌍의 앞 숫자가 같은 것만 걸러낸다.
(`[[a b] [c d]]`의 패턴에서 `b=c`인 녀석들)
1. 위 결과에서 `[a b d]` (또는 `b=c`이므로 `[a c d]`)가 등차수열이다. 등차수열을 찾지 못한 경우에는 빈 시퀀스를 리턴한다.

이 로직을 Clojure 코드로 구현하면 다음과 같이 된다.

```clojure
(defn find-arithmetic-seq [v]
  (->> (for [i v, j v :when (< i j)] [i j])
       (group-by (fn [[a b]] (- b a)))
       (filter (fn [[_ ds]] (= 2 (count ds))))
       (filter (fn [[_ [[_ a] [b _]]]] (= a b)))
       (map (fn [[_ [[a b] [c d]]]] [a b d]))
       first))
```

문제를 푸는 데 필요한 준비가 끝났다. 위에서 준비한 도구를 이용하면 다음과 같이 문제를 풀 수 있다.

```clojure
(defn solve []
  (->> four-digits-primes
       (map permutation-primes)
       (map find-arithmetic-seq)
       (filter not-empty)
       distinct
       (map #(apply str %))
       second))
```

실행 결과는 다음과 같다.

<pre class="console">
p049=> (time (solve))
"Elapsed time: 9.606333 msecs"
"29696299??29"
</pre>

위 풀이는 동일한 계산을 여러 번 반복하는 경우가 있으므로 조금 비효율적일 수 있다. 그러나 충분히 빠르게 답을 구한다.

## 참고
* [프로젝트 오일러 49 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p049.clj)
