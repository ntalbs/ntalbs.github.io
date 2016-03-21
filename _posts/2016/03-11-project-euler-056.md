tags: [Project-Euler, Clojure]
date: 2016-03-11
title: 프로젝트 오일러 56
---
> a<sup>b</sup> 형태의 자연수에 대해 자릿수 합의 최대값 구하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=56) [[영어]](https://projecteuler.net/problem=56)

[문제 16](/2015/project-euler-016/)에서 만든 `pow` 함수를 이용하면 문제를 쉽게 풀 수 있다.
<!--more-->

```clojure
(ns p056
  (:require [util :refer (pow digits)]))

(defn solve []
  (->> (for [a (range 1 100) b (range 1 100)] (pow a b))
       (map digits)
       (map #(apply + %))
       (apply max)))
```

여기서 사용한 `pow` 함수는 Clojure의 `BigInt`를 사용하는데, 이는 문제의 의도를 회피한 것이라 할 수 있다. [문제 20](/2015/project-euler-020/)에서 사용했던 방법을 응용해 $a^b$를 숫자 시퀀스로 바꾼 다음 거듭제곱을 구하는 방법을 생각할 수 있겠지만, 여기서는 시도하지 않는다.

## 참고
* [프로젝트 오일러 56 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p056.clj)
* [프로젝트 오일러 20](/2015/project-euler-020/)
`BigInt`를 쓰지 않고 큰 수를 숫자 시퀀스로 바꿔 계산하는 방법을 설명한다.
* [프로젝트 오일러 16](/2015/project-euler-016/)
`pow` 함수 구현 방법에 대해 설명했다.
