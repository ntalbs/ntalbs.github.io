tags: [Project-Euler, Clojure]
date: 2015-09-17
title: 프로젝트 오일러 29
---
> $2 \le a \le 100$ 이고 $2 \le b \le 100$인 $a$, $b$로 만들 수 있는 $a^b$의 개수
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=29) [[영어]](https://projecteuler.net/problem=29)

$a$가 대략 100가지, $b$가 대략 100가지이므로 $a^b$는 대략 10,000가지 수가 나올 것이다. 여기서 중복을 제거하면 답을 구할 수 있다.<!--more-->

지수가 커지면 숫자가 엄청나게 커지는 문제가 있지만, Clojure의 `BigInt`를 사용하면 쉽게 해결된다. 먼저 거듭제곱을 구하는 함수가 필요하다. 다음과 같이 `pow` 함수를 정의한다.

```clojure
(defn pow [x n]
  (loop [n n acc 1]
    (if (<= n 0)
      acc
      (recur (dec n) (*' acc x)))))
```

코드는 직관적이다. `(pow x n)`은 $x^n$을 구하는데, `x`를 `n`번 곱하면 된다. 곱셈을 할 때 임의의 자릿수에 대해 계산할 수 있도록 `*'` 함수를 썼다.

이제 루프를 돌리며 $a$와 $b$를 2부터 100까지 변화시키며 $a^b$를 계산해 `Set`에 넣어 중복을 제거한 다음 개수를 세면 된다.

```clojure
(defn solve []
  (let [rng (range 2 (inc 100))]
    (count (into #{} (for [a rng b rng] (pow a b))))))
```

실행 결과는 다음과 같다.

<pre class="console">p029=> (time (solve))
"Elapsed time: 70.068858 msecs"
91??
</pre>

이렇게 큰 수를 다루는 문제를 풀 때 `BigInt`를 사용하는 것은 사실 문제의 의도를 회피한 것이라 볼 수 있다. [문제 20](/2015/project-euler-020/)에서 사용했던 방법을 응용해 $a$를 숫자 시퀀스로 바꾼 다음 거듭제곱을 구하는 방법을 생각할 수 있다. 여기서는 시도하지 않는다.

## 참고
* [프로젝트 오일러 29 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p029.clj)
* [프로젝트 오일러 20](/2015/project-euler-020/)
`BigInt`를 쓰지 않고 큰 수를 숫자 시퀀스로 바꿔 계산하는 방법을 설명한다.
