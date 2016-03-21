tags: [Project-Euler, Clojure]
date: 2015-10-12
title: 프로젝트 오일러 36
---
> 10진법과 2진법으로 모두 대칭수인 1,000,000 이하 숫자의 합
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=36) [[영어]](https://projecteuler.net/problem=36)

어떤 수가 대칭인지 확인하는 방법은 이미 [문제 4](/2015/project-euler-004/)에서 설명했다. 이진수는 어차피 문자열로 표현해야 하므로 여기서는 다음과 같이 문자열을 인자로 받아 대칭인지 확인하는 함수를 만들어 두는 것이 좋겠다.<!--more-->

```clojure
(ns p036
  (:require [clojure.string :as s]))

(defn- palindromic? [s]
  (= s (s/reverse s)))
```

십진수가 대칭인지 확인하는 함수 `dec-palindromic?`과 이진수가 대칭인지 확인하는 `bin-palindromic?` 함수는 각각 다음과 같이 구현할 수 있다. `Integer/toBinaryString` 메서드를 이용하면 십진수를 쉽게 이진수 문자열로 바꿀 수 있다.

```clojure
(defn- dec-palindromic? [n]
  (palindromic? (str n)))

(defn- bin-palindromic? [n]
  (palindromic? (Integer/toBinaryString n)))
```

이제 백만 이하의 수에 대해 십진수와 이진수 표현 모두 대칭인 수를 찾아서 더하면 된다.

```clojure
(defn solve []
  (->> (range 1 (inc 1000000))
       (filter (fn [n] (and (dec-palindromic? n) (bin-palindromic? n))))
       (apply +)))
```

실행 결과는 다음과 같다.

<pre class="console">
p036=> (time (solve))
"Elapsed time: 156.677595 msecs"
8721??
</pre>

## 십진수를 이진수로 변환하기
`Integer/toBinaryString` 메서드를 사용하면 문제 풀이가 너무 쉽다. 따라서 십진수를 이진수 문자열로 바꾸는 함수를 직접 작성해보자. 십진수를 이진수로 바꾸는 것은 생각보다 쉽다.

1. 십진수 수를 2로 나눠 몫과 나머지로 분리한다.
2. 나머지를 리스트에 추가한다.
3. 몫이 0보다 크면 몫을 새로운 수로 하여 단계 1-2를 반복한다.
4. 리스트의 수를 모아 문자열로 만든다.

리스트에 `conj`로 항목을 추가하면 앞으로 붙기 때문에 리스트의 순서 그대로가 이진수가 된다. 인자가 0인 경우에 빈 문자열을 리턴하지 않도록 약간의 코드를 추가했다.

```clojure
(defn to-binary-str [n]
  (loop [n n acc '()]
    (if (< 0 n)
      (recur (quot n 2) (conj acc (rem n 2)))
      (if (empty? acc)
        "0"
        (apply str acc)))))
```

간단히 테스트해보면 잘 동작함을 확인할 수 있다.

<pre class="console">
user=> (pprint (map-indexed (fn [i n] [i (to-binary-str n)]) (range 0 20)))
([0 "0"]
 [1 "1"]
 [2 "10"]
 [3 "11"]
 [4 "100"]
 ...
 [18 "10010"]
 [19 "10011"])
</pre>

그러나 이 구현은 완벽하지 않다. `Integer/toBinaryString`은 음수 인자에 대해 2의 보수법으로 32비트 이진수 문자열을 리턴하지만, 위에서 구현한 `to-binary-str`은 음수 인자에 대해 고려하지 않았다. 음수를 전달하면 그냥 `"0"`을 리턴한다.

<pre class="console">
user=> (Integer/toBinaryString -1)
"11111111111111111111111111111111"
user=> (to-binary-str -1)
"0"
</pre>

따라서 음수에 대해서는 아예 동작하지 않도록 함수에 선행조건(precondition)을 추가할 수 있다.

```clojure
(defn to-binary-str [n]
  {:pre [(<= 0 n)]}
  ...
```

`Integer/toBinaryString`보다 좋은 점도 있다. `Integer/toBinaryString`는 `Integer`범위 안의 수에 대해서만 동작하지만 `to-binary-str`은 `Integer`뿐 아니라 `Long`의 범위를 벗어나는 수에 대해서도 동작한다.

<pre class="console">
user=> (Integer/toBinaryString (inc Integer/MAX_VALUE))

IllegalArgumentException Value out of range for int: 2147483648  clojure.lang.RT.intCast (RT.java:1191)
user=> (to-binary-str (inc Integer/MAX_VALUE))
"10000000000000000000000000000000"
user=> (to-binary-str (inc' Long/MAX_VALUE))
"1000000000000000000000000000000000000000000000000000000000000000"
</pre>

`to-binary-str` 함수가 음수도 처리할 수 있게 개선하고 싶지만, 오늘은 여기까지. 나중에 시간이 생기면 그때 시도해보자.

## 참고
* [프로젝트 오일러 36 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p036.clj)
* [프로젝트 오일러 4](/2015/project-euler-004/)
