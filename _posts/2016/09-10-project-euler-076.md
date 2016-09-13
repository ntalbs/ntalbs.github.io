tags: [Project-Euler, Clojure]
date: 2016-09-10
title: 프로젝트 오일러 76
---
> 숫자 100을 두 개 이상의 자연수의 합으로 나타내는 방법은 모두 몇 가지?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=76) [[영어]](https://projecteuler.net/problem=76)

이 문제는 영국 화폐 액면가를 조합하는 수를 계산했던 [문제 31](/2015/project-euler-031/)과 비슷하다. 문제 31에서는 동전의 종류가 여덟가지 였지만, 이 문제에서는 동전의 종류가 1, 2, ..., 99까지 99가지가 있다고 생각할 수 있다.
<!--more-->

숫자가 동전 값을 나타낸다고 생각하면 되므로 동전 종류 숫자를 동전 값으로 변환하는 함수는 필요하지 않다. 문제 31에의 함수를 조금 수정하면 다음과 같이 두 개 이상의 자연수 합으로 나타내는 방법이 몇 가지인지 세는 함수를 작성할 수 있다.

```clojure
(defn p [n k]
  (cond (= k 0) 0
        (= n 0) 1
        (= n 1) 1    ; (p 1 k) always goes to 1
        (< n 0) 0
        :else (+ (p n (dec k)) (p (- n k) k))))
```

100을 두 개 이상의 자연수 합으로 나타내는 방법의 가지수는 다음과 같이 구할 수 있다.

```clojure
(defn solve []
  (p 100 99))
```

실행 결과는 다음과 같다.

<pre class="console">
p076=> (time (solve))
"Elapsed time: 42313.721019 msecs"
19056??91
</pre>

답을 구하는 데 40초 이상의 시간이 걸린다. 계산할 때 동일한 계산을 반복해 실행하기 때문이다. 다음과 같이 메모이제이션을 적용하면 답을 구하는 속도가 훨씬 빨라진다.

```clojur
(def p (memoize p))
```

메모이제이션을 적용해 실행한 결과는 다음과 같다. 메모이제이션을 적용하기 전과는 비교할 수 없을 만큼 빨리 답을 구한다.

<pre class="console">
p076=> (time (solve))
"Elapsed time: 7.948763 msecs"
19056??91
</pre>

## 참고
* [프로젝트 오일러 76 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p076.clj)
* [프로젝트 오일러 31](/2015/project-euler-031/)
* [Integer Partition (algorithm and recursion)](http://stackoverflow.com/questions/14053885/integer-partition-algorithm-and-recursion)
