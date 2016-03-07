tags: [Project-Euler, Clojure]
date: 2015-05-20
title: 프로젝트 오일러 20
---
> 100! 의 자릿수를 모두 더하면?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=20) [[영어]](https://projecteuler.net/problem=20)

100!은 150자리가 넘는 매우 큰 수라 기본 데이터 타입으로는 이 문제를 해결할 수 없다. 물론 `BigInt`를 사용하면 아주 쉽게 문제를 풀 수 있다. [문제 16](/2015/04/08/project-euler-016/), [문제 13](/2015/03/18/project-euler-013/)에서 썼던 방법을 응용하면 `BigInt`를 사용하지 않고 문제를 풀 수 있다.<!--more-->

## 방법 1
`*'`로 곱셈을 하면 `long`의 범위를 넘는 경우 자동으로 `BigInt`로 전환된다. 따라서 다음과 같이 `factorial` 함수를 작성하면 자릿수에 관계 없이 큰 수를 다룰 수 있다. `factorial` 함수 구현에 대해서는 [문제 15](/2015/04/06/project-euler-015/)에서도 다루었다.

```clojure
(defn factorial [n]
  (apply *' (range 1 (inc n))))
```

100!를 계산한 다음 [문제 16](/2015/04/08/project-euler-016/)에서 작성한 `digits` 함수를 이용해 자릿수를 시퀀스로 만들어 모두 더하면 된다.

```clojure
(defn solve1 []
  (->> (factorial 100)
       (digits)
       (apply +)))
```

실행 결과는 다음과 같다.

<pre class="console">
p020=> (time (solve1))
"Elapsed time: 2.285487 msecs"
??8
</pre>

## 방법 2
[문제 13](/2015/03/18/project-euler-013/)에서 만들었던 `normalize-digits` 함수를 이용하면 다음과 같이 숫자 시퀀스를 곱하는 함수를 작성할 수 있다.

```clojure
(defn digits*
  "Returns product of given digits ds and n."
  [ds n]
  (normailize-digits (map #(* % n) ds)))
```

첫 번째 인자 `ds`에는 숫자 시퀀스(예: `[1 2 3]`)를, 두 번째 인자인 `n`에는 일반 정수를 지정한다. 특이한 것은 `n`에 두 자리 이상의 수가 들어가도 상관 없다는 점이다. 그런 경우도 `normalize-digits`가 알아서 처리해준다. `digits*` 함수를 이용하면 다음과 같이 문제를 풀 수 있다.

```clojure
(defn solve2 []
  (->> (range 1 (inc 100))
       (reduce digits* [1])
       (apply +)))
```

실행 결과는 다음과 같다.

<pre class="console">
p020=> (time (solve2))
"Elapsed time: 15.359809 msecs"
??8
</pre>

## 참고
* [프로젝트 오일러 20 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p020.clj)
* [프로젝트 오일러 16](/2015/04/08/project-euler-016/)
* [프로젝트 오일러 15](/2015/04/06/project-euler-015/)
* [프로젝트 오일러 13](/2015/03/18/project-euler-013/)
