tags: [Project-Euler, Clojure]
date: 2016-03-24
title: 프로젝트 오일러 60
---
> 다섯 소수 중 어떤 두 개를 이어붙여도 소수가 되는 수 찾기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=60) [[영어]](https://projecteuler.net/problem=60)

이 문제를 공략하는 기본 아이디어는 다음과 같다.

1. 적정 범위의 소수 집합 `ps1`을 미리 구한다.
1. `ps1`에서 두 수를 골라 앞/뒤로 이어붙여도 소수가 되는 쌍의 집합 `ps2`를 구한다.<!--more-->
1. `ps2`에 `ps1`에서 고른 다른 소수를 추가해 이 중 임의의 두 소수를 이어붙여도 소수가 되는 집합 `ps3`을 구한다.
1. `ps3`에 `ps1`에서 고른 다른 소수를 추가해 이 중 임의의 두 소수를 이어붙여도 소수가 되는 집합 `ps4`를 구한다.
1. `ps4`에 `ps1`에서 고른 다른 소수를 추가해 이 중 임의의 두 소수를 이어붙여도 소수가 되는 집합 `ps5`를 구한다.

이렇게 `ps5`까지 구하면 `ps5`의 첫 번째 요소를 답이라 할 수 있다.

소수 목록은 `clojure.contrib.lazy-seqs/primes`로 쉽게 구할 수 있다. 여러 개의 소수 중에서 임의의 두 개를 골라서 이어붙여도 소수가 되는지 확인하려면, 여러 개 중 두 개를 고르는 모든 경우를 확인해봐야 한다. `clojure.math.combinatorics/combinations`를 이용하면 모든 경우의 조합을 쉽게 만들 수 있다.

두 수를 이어붙이는 것은 두 수를 문자열로 바꿔서 이어붙인 다음 다시 숫자로 바꾸는 방법이 제일 단순해 보인다.

```clojure
(defn concat-nums [a b]
  (Integer/parseInt (str a b)))
```

좀 더 있어 보이게 다음과 같이 계산을 통해 숫자를 이어붙일 수도 있다. 그러나 코드만 복잡할 뿐 이해하기도 쉽지 않고 성능상 큰 이득도 없는 것 같다.

```clojure
(defn concat-nums [a b]
  (let [m (inc (int (Math/log10 b)))]
    (+ (* a (pow 10 m)) b)))
```

두 수가 이어붙인 순서에 상관없이 소수가 되는지 확인하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn concated-prime? [a b]
  (and (prime? (concat-nums a b))
       (prime? (concat-nums b a))))
```

주어진 소수 목록에서 어떤 두 개를 이어붙여도 소수가 되는지 확인하는 함수는 다음과 같이 작성할 수 있다. 모든 조합을 확인하기 위해 `combinations` 함수를 사용했다.

```clojure
(defn any-two-concat-prime? [ps]
  (->> (combinations ps 2)
       (drop-while (fn [[a b]] (concated-prime? a b)))
       empty?))
```

문제를 공략하기 위한 기본 도구를 모두 갖추었다. 이제 앞에서 설명한 순서대로 한 단계씩 문제를 풀어갈 차례다. `ps1`은 `clojure.contrib.lazy-seqs/primes`에서 `limit`(=10,000) 이하의 소수를 구하면 된다. 상한을 10,000으로 잡은 논리적 이유는 없다. 그냥 너무 크게 잡으면 계산하는 데 오래 걸리고 너무 작게 잡으면 답을 찾지 못 할테니 이 정도가 적정할 것이라고 내 마음대로 판단한 값이다. 이 범위에서 답을 구하지 못하면 상한을 올려야 한다.

```clojure
(def limit 10000)

(def ps1
  (take-while #(< % limit) (drop 1 primes)))
```

어떤 수와 이어붙이든 2가 뒤에 오면 짝수가 되므로 2는 제외했다. 위에서 작성한 `concated-prime?` 함수를 이용하면 다음과 같이 `ps2`를 구할 수 있다.

```clojure
(def ps2
  (for [p1 ps1, p2 ps1
        :when (< p1 p2)
        :when (concated-prime? p1 p2)]
    [p1 p2]))
```

`ps3`에서는 세 개의 수 중 두 개를 선택해서 확인해야 한다. 앞에서 구현한 `any-two-concat-prime?` 함수를 사용하면 다음과 같이 `ps3`을 구할 수 있다.

```clojure
(def ps3
  (for [[p1 p2] ps2, p3 ps1
        :when (< p1 p2 p3)
        :when (any-two-concat-prime? [p1 p2 p3])]
    [p1 p2 p3]))
```

`ps4`, `ps5`를 구하는 방법도 비슷하다.

```clojure
(def ps4
  (for [[p1 p2 p3] ps3, p4 ps1
        :when (< p1 p2 p3 p4)
        :when (any-two-concat-prime? [p1 p2 p3 p4])]
    [p1 p2 p3 p4]))

(def ps5
  (for [[p1 p2 p3 p4] ps4 p5 ps1
        :when (< p1 p2 p3 p4 p5)
        :when (any-two-concat-prime? [p1 p2 p3 p4 p5])]
    [p1 p2 p3 p4 p5]))
```

이제 `ps5`의 첫 요소를 구해 그 안의 소수를 모두 더하면 답을 찾을 수 있다.

```clojure
(defn solve []
  (apply + (first ps5)))
```

실행 결과는 다음과 같다.

<pre class="console">
p060=> (time (solve))
"Elapsed time: 4876.066804 msecs"
2??33
</pre>

답을 구하는 데 거의 5초 가까이 걸렸다. 시간을 줄이기 위해 여러 방법을 시도해 봤지만 더 빠르게 만들지 못했다.

## 참고
* [프로젝트 오일러 60 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p060.clj)
