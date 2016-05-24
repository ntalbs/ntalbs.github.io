tags: [Project-Euler, Clojure]
date: 2016-05-23
title: 프로젝트 오일러 68
---
> 마방진 성질을 갖는 5각 도형에서 얻을 수 있는 16자리 수의 최대값 구하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=68) [[영어]](https://projecteuler.net/problem=68)

5각 도형의 빈 칸을 다음과 같이 $a, b, ..., j$로 지정할 수 있다.

{% asset_img p068.png %}

<!--more-->
각 선을 따라 구한 합이 모두 같으려면 다음 식을 만족해야 한다.

{% math %}
\begin{aligned}
  &a + b + c \\
  =&\,  d + c + e \\
  =&\,  f + e + g \\
  =&\,  h + g + i \\
  =&\,  j + i + b
\end{aligned}
{% endmath %}

이렇게 하면 $1, 2, ..., 10$의 순열을 $a, b, ..., j$에 대입해가며 위 조건을 만족하는 조합을 찾을 수 있다. 가장 작은 수부터 시작해 시계 방향으로 돌아가며 나열해야 하므로 가장 작은 수가 $a$에 오도록 한다. $a, b, c, d, e, c, f, e, g, h, h, i, j, i, b$ 순으로 숫자를 나열해 이어붙여 숫자를 만든 다음, 16자리 수 중 가장 큰 값을 구하면 답이 된다.

```clojure
(ns p068
  (:require [clojure.math.combinatorics :refer [permutations]]))

(defn solve []
  (->> (permutations [1 2 3 4 5 6 7 8 9 10])
       (filter (fn [[a b c d e f g h i j]]
                 (= (+ a b c)
                    (+ d c e)
                    (+ f e g)
                    (+ h g i)
                    (+ j i b))))
       (filter (fn [[a b c d e f g h i j]] (= a (min a d f h j))))
       (map (fn [[a b c d e f g h i j]] (apply str [a b c d c e f e g h g i j i b])))
       (filter #(= 16 (count %)))
       (map #(Long/parseLong %))
       (apply max)))
```

실행 결과는 다음과 같다.

<pre class="console">
user=> (time (p068/solve))
"Elapsed time: 1971.586311 msecs"
653103191484??25
</pre>

## 참고
* [프로젝트 오일러 68 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p068.clj)
