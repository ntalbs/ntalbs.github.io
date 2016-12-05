tags: [Project-Euler, Clojure]
date: 2016-11-30
title: 프로젝트 오일러 80
---
> 무리수인 제곱근들의 자릿수 더하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=80) [[영어]](https://projecteuler.net/problem=80)

이 문제를 푸는 데 `Math.sqrt`를 사용할 수는 없다. `Math.sqrt`가 리턴하는 `double` 형의 유효자리 숫자는 고작 17자리에 불과하다. 제곱근의 자릿수를 원하는 만큼 구할 수 있는 다른 방법이 필요하다. 다행히 [Sqrt root by substraction](http://www.afjarvis.staff.shef.ac.uk/maths/jarvisspec02.pdf)에 정수의 제곱근을 구하는 방법이 자세히 나와 있다.
<!--more-->

정수 $n$의 제곱근을 구하는 방법은 다음과 같다.

* $a=5n$, $b=5$로 놓는다.
* 다음을 반복한다.
(R1) $a \ge b$면 $ a \leftarrow a-b,\, b \leftarrow b+10$
(R2) $a < b$면 $a$에 $100$을 곱하고, $b$의 마지막 자리 바로 앞에 $0$을 추가한다.

따라서 제곱근의 처음 $100$자리를 구하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn sqrt
  "Compute the first 100 digits of sqrt(n)."
  [n]
  (loop [a (* 5 n) b 5]
    (if (<= (Math/log10 b) (inc 100)) ; b가 101자리까지 계산해야 100자리까지 값이 정확함
      (if (>= a b)
        (recur (-' a b) (+' b 10))
        (recur (*' 100 a) (+' (*' (quot b 10) 100) (rem b 10))))
      (quot b 10))))                  ; 101째 자리 제거
```

이제 $1$부터 $100$까지의 자연수 중 제곱근이 무리수인 경우에 대해 `sqrt` 함수로 제곱근의 처음 $100$자리를 구한 다음 모두 더하면 된다.

```clojure
(defn solve []
  (->> (range 1 (inc 100))
       (remove perfect-square?)
       (map sqrt)
       (map digits)
       (flatten)
       (apply +)))
```

실행 결과는 다음과 같다. 빠르게 답을 구한다.

<pre class="console">
p080=> (time (solve))
"Elapsed time: 92.033557 msecs"
4??86
</pre>


## 참고
* [프로젝트 오일러 80 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p080.clj)
* [Sqrt root by substraction](http://www.afjarvis.staff.shef.ac.uk/maths/jarvisspec02.pdf)
