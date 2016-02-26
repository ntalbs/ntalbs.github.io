tags: [project-euler, clojure]
date: 2016-02-26
title: 프로젝트 오일러 52
---
> 2배, 3배, 4배, 5배, 6배의 결과도 같은 숫자로 이루어지는 가장 작은 수?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=52) [[영어]](https://projecteuler.net/problem=52)

어떤 두 수가 같은 숫자로 이루어져 있는지 비교하려면 두 수를 모두 자릿수로 분해한 다음 정렬해 결과가 같은지 확인하면 된다. `str` 함수로 숫자를 문자열로 바꾼 다음 `sort`로 정렬하면 각 자릿수가 정렬된 시퀀스를 얻을 수 있다. `comp`로 `sort`와 `str`을 합성하면 인자를 문자열로 바꿔 정렬하는 함수를 만들 수 있다. 주어진 여러 개의 숫자가 모두 같은 숫자로 이루어져 있는지 확인하는 함수는 다음과 같이 쉽게 구현할 수 있다.
<!--more-->

```clojure
(defn all-has-same-digits? [v]
  (->> v
       (map (comp sort str))
       (apply =)))
```

이제 숫자를 증가시키며 1, 2, ..., 6을 곱해 나온 숫자들이 같은 숫자로 되어 있는지 `all-has-same-digits?`로 확인하기만 하면 된다.

```clojure
(defn solve []
  (->> (iterate inc 1)
       (map #(for [i [1 2 3 4 5 6]] (* i %)))
       (filter #(all-has-same-digits? %))
       ffirst))
```

실행 결과는 다음과 같다.

<pre class="console">
p052=> (time (solve))
"Elapsed time: 729.828531 msecs"
1428??
</pre>

## 참고
* [프로젝트 오일러 52 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p052.clj)
