tags: [project-euler, clojure]
date: 2015-10-21
title: 프로젝트 오일러 38
---
> 어떤 수에 (1, 2, ... )를 곱해서 이어붙여 얻을 수 있는 가장 큰 1 ~ 9 팬디지털 숫자
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=38) [[영어]](https://projecteuler.net/problem=38)

(1, 2, ...)를 곱해서 이어붙일 어떤 수는 네 자리 이하의 수여야 한다. n이 1보다 커야 하므로, 어떤 수가 다섯 자리라면 (1, 2)를 곱해 이어붙일 경우 아홉 자리를 넘어버리기 때문이다. 따라서 네 자리 수 중 가장 큰 9999부터 숫자를 줄여가며 답을 찾으면 문제를 쉽게 풀 수 있다.
<!--more-->

어떤 수에 (1, 2, ...)를 곱해 이어붙인 수를 구하는 함수는 다음과 같이 작성할 수 있다. 인자로 받은 수에 (1, 2, ...)를 곱해 이어붙여 나가되 이어붙인 숫자의 길이가 9자리가 되면 그때까지 이어붙인 수를 리턴한다.

```clojure
(defn prod-concat [n]
  (loop [i 1 acc ""]
    (if (< (count acc) 9)
      (recur (inc i) (str acc (* n i)))
      acc)))
```

숫자를 이어붙일 때는 숫자를 문자열로 바꿔 연결한다. 팬디지털인지 확인할 때도 문자열로 확인하는 것이 편하므로 값을 리턴할 때 굳이 숫자로 바꾸지 않고 문자열을 그대로 리턴한다.

어떤 수가 1-9 팬디지털 숫자인지 확인하는 함수가 필요하다.

```clojure
(defn pandigital? [numstr]
  (= "123456789" (apply str (sort numstr))))
```

이 두 함수를 이용하면 다음과 같이 문제를 풀 수 있다.

```clojure
(defn solve []
  (->> (range 9999 1 -1)
       (map prod-concat)
       (drop-while #(not (pandigital? %)))
       first))
```

실행 결과는 다음과 같다.

<pre class="console">
p038=> (time (solve))
"Elapsed time: 1.30696 msecs"
"932???654"
</pre>

## 참고
* [프로젝트 오일러 38 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p038.clj)
