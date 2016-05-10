tags: [Project-Euler, Clojure]
date: 2015-10-24
title: 프로젝트 오일러 40
---
> 어떤 무리수에서 소수점 $n$번째 자리 숫자 알아내기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=40) [[영어]](https://projecteuler.net/problem=40)

이 문제를 푸는 데는 특별히 복잡한 알고리즘이 필요하지 않다. 그냥 문제에서 설명한 대로 소수점 아래 수에 대한 시퀀스를 만들고, 1번째, 10번째, ... , 1,000,000번째 요소를 구해 모두 곱하면 그만이다. Clojure로는 특히 이런 문제를 쉽게 풀 수 있는 것 같다.
<!--more-->

먼저 1, 2, ... 로 숫자를 생성해 `digits`로 자릿수 시퀀스로 나눈 다음 그걸 다시 `mapcat`으로 연결한 시퀀스를 만든다. 이렇게 해서 문제에서 설명한 무리수의 소수점 이하 수에 대한 시퀀스를 만들 수 있다.

```clojure
(ns p040
  (:require [util :refer [digits pow]]))

(def ds (mapcat digits (iterate inc 1)))
```

소수점 아래 1, 10, 100, ..., 1,000,000번째 수를 구하기 위해 1, 10, 100, ..., 1,000,000의 시퀀스를 만들어야 한다. 여섯 개 뿐이므로 `[1 10 100 ... 1000000]`과 같이 직접 만들어도 되고, 다음과 같이 `pow` 함수를 써서 만들어도 된다.

```clojure
(->> (range 7)
     (map #(pow 10 %)))
```

이제 `nth` 함수를 써서 위에서 생성한 `ds` 시퀀스에서 n번째 요소를 꺼낸다. 인덱스가 0부터 시작하므로 `dec`를 이용해 1씩 줄여준 것 외에 별다른 조작은 없다. 그리고 꺼낸 요소를 모두 곱하면 답을 구할 수 있다.

```clojure
(defn solve []
  (->> (range 7)
       (map #(pow 10 %))
       (map #(nth ds (dec %)))
       (apply *)))
```

아주 간단하게 문제를 풀었다. 실행 결과는 다음과 같다.

<pre class="console">
p040=> (time (solve))
"Elapsed time: 155.241363 msecs"
21?
</pre>

## 참고
* [프로젝트 오일러 40 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p040.clj)
