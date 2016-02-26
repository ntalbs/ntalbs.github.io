tags: [project-euler, clojure]
date: 2015-10-19
title: 프로젝트 오일러 37
---
> 왼쪽이나 오른쪽에서 한 자리씩 없애가도 여전히 소수인 수의 합은?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=37) [[영어]](https://projecteuler.net/problem=37)

어떤 수를 왼쪽이나 오른쪽에서 한 자리 없앤 수를 구하는 함수가 있다면 이 문제를 풀 때 도움이 될 것이다. [문제 35](/2015/10/06/project-euler-035/)에서 순환수를 만들 때 사용했던 방법을 활용하면 이 함수를 쉽게 구현할 수 있다. 순환수를 구할 때는 숫자를 잘라 다시 붙여야 했지만 여기서는 그냥 잘라내기만 하면 되므로 오히려 더 간단하다고 할 수 있다.
<!--more-->

## 방법 1
자릿수를 조작하는 연산이 필요한 경우에는 항상 `digits` 함수가 떠오른다. `digits`는 숫자를 각 자릿수의 시퀀스로 만들기 때문에 왼쪽 또는 오른쪽에서 한 자리씩 없앤 다음 시퀀스를 다시 숫자로 바꿔야 한다. 숫자 시퀀스를 그대로 이어붙여 숫자로 만드는 방법은 [문제 32](/2015/10/03/project-euler-032/)에서 설명했다. `digits`와 `to-int`를 이용하면 인자로 받은 수를 오른쪽 또는 왼쪽에서 한 자리씩 없앤 수의 목록을 구하는 함수를 다음과 같이 작성할 수 있다.

```clojure
(defn- truncated-nums
  [num]
  (let [digits (digits num) n (count digits)]
    (->> (for [i (range n)]
           [(to-int (drop i digits)) (to-int (take (inc i) digits))])
         flatten
         set)))
```

중복을 제거하기 위해 마지막에 `set`을 추가했다. 한 자리씩 없앤 수의 목록글 구했으면 이 목록에 있는 수가 모두 소수인지 확인하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn- all-prime? [nums]
  (= (count nums)
     (count (take-while prime? nums))))
```

위 두 함수를 이용하면 문제를 다음과 같이 풀 수 있다. 조건을 만족하는 소수를 11개 찾을 때까지 실행해 모두 더하면 답이 나온다.

```clojure
(defn solve1 []
  (->> (drop 4 primes) ; drop 2, 3, 5, 7
       (filter  (fn [n] (all-prime? (truncated-nums n))))
       (take 11)
       (apply +)))
```

실행 결과는 다음과 같다.

<pre class="console">
p037=> (time (solve1))
"Elapsed time: 849.469653 msecs"
7483??
</pre>

## 방법 2
[문제 35](/2015/10/06/project-euler-035/)에서와 같이 여기서도 `digits`를 쓰는 대신 `quot`와 `rem`으로 직접 계산하면 좀더 빨라지지 않을까? 한번 시도해보자.

먼저 오른쪽에서 한 자리를 없앤 수를 만드는 함수는 `quot`를 이용해 다음과 같이 간단히 작성할 수 있다.

```clojure
(defn- truncate-right [n]
  (quot n 10))
```

그리고 위 함수를 이용해 주어진 수를 오른쪽에서 한 자리씩 없애갔을 때 소수인지 판별하는 함수를 만들어보자.

```clojure
(defn- right-truncatable-prime? [p]
  (loop [n (truncate-right p)]
    (if (prime? n)
      (if (< n 10)
        true
        (recur (truncate-right n))))))
```

중간에 소수가 아닌 수가 나오면 바로 `nil`을 리턴한다. `false`를 리턴하도록 할 수도 있지만 코드를 조금 간단히 하기 위해 그냥 `nil`이 리턴되도록 했다.

왼쪽에서 한 자리를 없앤 수를 만드는 함수는 오른쪽에서 한 자리를 없앤 수를 만드는 함수에 비해 복잡하다. 왼쪽 한 자리를 없애려면 주어진 수의 전체 자릿수를 알아야 하기 때문이다. `Math/log10`을 활용하면 된다.

```clojure
(defn- truncate-left [n]
  (rem n (pow 10 (int (Math/log10 n)))))
```

이제 위 함수를 이용해 주어진 수를 왼쪽에서 한 자리씩 없애갔을 때 소수인지 판별하는 함수를 만들어보자.

```clojure
(defn- left-truncatable-prime? [p]
  (loop [n (truncate-left p)]
    (if (prime? n)
      (if (< n 10)
        true
        (recur (truncate-left n))))))
```

함수 안에서 `truncate-right` 대신 `truncate-left`를 사용한다는 점만 빼고는 오른쪽에서 한 자리씩 없애가며 소수인지 판별하는 함수 `right-truncatable-prime?` 함수와 구조가 동일하다. `truncate-left`와 `truncate-right` 함수를 인자로 넘기도록 하면 거의 동일한 함수를 두 번 구현하지 않아도 될 것 같다. 따라서 코드를 다음과 같이 바꿀 수도 있겠다.

```clojure
(defn- truncatable-prime? [p f]
  (loop [n (f p)]
    (if (prime? n)
      (if (< n 10)
        true
        (recur (f n))))))

(defn- right-truncatable-prime? [p]
  (truncatable-prime? p truncate-right))

(defn- left-truncatable-prime? [p]
  (truncatable-prime? p truncate-left))
```

`left-truncatable-prime?`과 `right-truncatable-prime?` 두 함수를 이용하면 문제를 다음과 같이 풀 수 있다.

```clojure
(defn solve2 []
  (->> primes
       (drop 4) ; drop 2, 3, 5, 7
       (filter #(and (left-truncatable-prime? %) (right-truncatable-prime? %)))
       (take 11)
       (reduce +)))
```

실행 결과는 다음과 같다. **방법 1**보다 훨씬 빨라졌다.

<pre class="console">
p037=> (time (solve2))
"Elapsed time: 114.831724 msecs"
7483??
</pre>

## 참고
* [프로젝트 오일러 37 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p037.clj)
* [프로젝트 오일러 35](/2015/10/06/project-euler-035/)
* [프로젝트 오일러 32](/2015/10/03/project-euler-032/)
