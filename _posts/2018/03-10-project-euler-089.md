tags: [Project-Euler, Clojure]
date: 2018-03-10
title: 프로젝트 오일러 89
---
> 로마숫자 최적화하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=89) [[영어]](https://projecteuler.net/problem=89)

먼저 다음과 같이 텍스트 파일을 읽어 시퀀스로 만들어둔다.

```clojure
(ns p089
  (:require [clojure.string :as str]))

(def romans (str/split (slurp "data/roman.txt") #"\r\n"))
```
<!--more-->

로마숫자 최적화는 다음과 같은 간단한 로직으로 수행할 수 있다.

* `DCCCC`는 `CM`으로 치환한다.
* `CCCC`는 `CD`로 치환한다.
* `LXXXX`는 `XC`로 치환한다.
* `XXXX`는  `XL`로 치환한다.
* `VIIII`는 `IX`로 치환한다.
* `IIII`는  `IV`로 치환한다.

이를 Clojure 함수로 구현하면 다음과 같다.

```clojure
(defn shorten [r]
  (-> r
      (str/replace "DCCCC" "CM")
      (str/replace "CCCC"  "CD")
      (str/replace "LXXXX" "XC")
      (str/replace "XXXX"  "XL")
      (str/replace "VIIII" "IX")
      (str/replace "IIII"  "IV")))
```

시퀀스에 있는 문자의 개수를 구하는 함수가 있으면 문제를 푸는 데 도움이 된다.

```clojure
(defn count-chars [coll]
  (->> (map count coll)
       (apply +)))
```

위 두 함수를 이용해 다음과 같이 문제를 풀 수 있다. 최적화 전 문자수와 최적화 후 문자수의 차를 구하면 된다.

```clojure
(defn solve []
  (let [cnt0 (count-chars romans)
        cnt1 (count-chars (map shorten romans))]
    (- cnt0 cnt1)))
```

실행 결과는 다음과 같다.

<pre class="console">
p089=> (time (solve))
"Elapsed time: 3.597621 msecs"
7?3
</pre>

## 참고
* [프로젝트 오일러 89 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p089.clj)
