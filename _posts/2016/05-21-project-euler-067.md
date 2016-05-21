tags: [Project-Euler, Clojure]
date: 2016-05-21
title: 프로젝트 오일러 67
---
> 삼각형에서 경로의 합 중 최대값을 구하는 효율적인 방법은?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=67) [[영어]](https://projecteuler.net/problem=67)

[문제 18](/2015/project-euler-018/)과 동일한 문제다. 문제 18에서는 삼각형이 15층에 불과했지만, 여기서는 100층이다. 문제 18에서 이미 제대로 된 방법으로 문제를 풀었기 때문에 똑같은 방법을 사용해 문제를 풀 수 있다. 텍스트 파일로 주어진 데이터를 읽어들이는 코드만 추가해주면 된다.
<!--more-->

데이터 파일을 읽어 문제 18에서 사용했던 `triangle` 구조를 만드는 코드는 다음과 같이 작성할 수 있다.

```clojure
(ns p067
  (:require [util :refer [parse-int]]
            [clojure.string :refer [split]]))

(defn- split-by-line [content]
  (split content #"\r\n"))

(defn- parse-line [line]
  (->> (split line #" ") (map parse-int)))

(def triangle
  (->> (slurp "data/triangle.txt")
       split-by-line
       (map parse-line)
       reverse))
```

풀이는 문제 18과 동일하다.

```clojure
(defn find-max [t]
  (reduce (fn [ls vs] (map max (map + ls vs) (map + (rest ls) vs))) t))

(defn solve []
  (first (find-max (reverse triangle))))
```

실행 결과는 다음과 같다. 충분히 빠르게 답을 구한다.

<pre class="console">
p067=> (time (solve))
"Elapsed time: 14.006805 msecs"
7??3
</pre>

## 참고
* [프로젝트 오일러 67 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p067.clj)
* [프로젝트 오일러 18](/2015/project-euler-018/)
