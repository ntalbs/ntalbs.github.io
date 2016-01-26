tags: [project-euler, clojure]
date: 2016-01-22
title: 프로젝트 오일러 47
---
> 서로 다른 네 개의 소인수를 갖는 수들이 처음으로 네 번 연속되는 경우는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=47) [[영어]](https://projecteuler.net/problem=47)

소인수의 개수를 구하는 함수가 있다면 문제를 쉽게 풀 수 있다. [문제 3](/2015/01/11/project-euler-003/)에서 소인수 분해 함수를 구현했으므로, 소인수 개수를 구하는 함수는 다음과 같이 간단히 작성할 수 있다.
<!--more-->

```clojure
(defn count-prime-factors [n]
  (count (factorize n)))
```

서로 다른 네 개의 소인수를 갖는 수가 네 번 연속되는지를 확인하는 데는 `partition` 함수를 사용하면 편하다. 2부터 시작하는 정수 시퀀스를 `[정수, 소인수_개수]` 쌍의 시퀀스로 바꾸고, `partition`을 이용해 네 개씩 묶어낸 다음 묶음 안의 모든 쌍이 소인수가 4개인지 확인하면 된다.

```clojure
(defn solve []
  (->> (iterate inc 2)
       (map (fn [n] [n (count-prime-factors n)]))
       (partition 4 1)
       (filter (fn [ns] (every? #(= 4 %) (map (fn [[_ c]] c) ns))))
       first first first))
```

실행 결과는 다음과 같다.

<pre class="console">
p047=> (time (solve))
"Elapsed time: 11139.792077 msecs"
1340??
</pre>

실행 결과가 만족스럽지 않다. 좀더 빠르게 답을 구하도록 여러 방법을 시도해봤지만 성공하지 못했다.

## 참고
* [프로젝트 오일러 47 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p047.clj)
* [프로젝트 오일러 3](/2015/01/11/project-euler-003/)
