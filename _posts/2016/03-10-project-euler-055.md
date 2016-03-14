tags: [Project-Euler, Clojure]
date: 2016-03-10
title: 프로젝트 오일러 55
---
> 10000 미만의 라이크렐 수 (Lychrel number) 세기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=55) [[영어]](https://projecteuler.net/problem=55)

숫자를 뒤집어서 더한 후 대칭수인지 확인해야 하므로 다음과 같이 숫자를 뒤집는 함수와 숫자가 대칭수인지 확인하는 함수를 미리 만들어 두면 문제를 푸는 데 도움이 될 것이다.
<!--more-->

```clojure
(defn reverse-num [n]
  (bigint (clojure.string/reverse (str n))))

(defn palindrome? [n]
  (= n (reverse-num n)))
```

숫자를 뒤집는 데는 여러 방법이 있겠지만 여기서는 숫자를 문자열로 바꾼 다음 `clojure.string/reverse` 함수를 이용해 뒤집었다. 숫자를 뒤집는 함수를 이용하면 대칭수인지 확인하는 함수도 쉽게 구현할 수 있다.

이제 라이크렐 수인지 확인하는 함수를 구현해야 한다. 다행히 1만 이하의 수는 50번 미만의 반복으로 라이크렐 수인지 확인할 수 있다. 50번을 반복했는데도 대칭수가 안 되면 라이크렐 수라 할 수 있겠다.

```clojure
(defn lychrel? [n]
  (loop [n n cnt 1]
    (if (< 50 cnt)
      true
      (let [sn (+' n (reverse-num n))]
        (if (palindrome? sn)
          false
          (recur sn (inc cnt)))))))
```

라이크렐 수인지 확인하는 함수가 있으므로 1만 이하의 수 중에서 라이크렐 수만 골라 개수를 세면 된다. 한 자리 숫자는 라이크렐 수가 될 수 없으므로 계산에 포함시키지 않아도 된다.

```clojure
(defn solve []
  (->> (range 10 (inc 10000))
       (filter lychrel?)
       count))
```

실행 결과는 다음과 같다.

<pre class="console">
p055=> (time (solve))
"Elapsed time: 126.086214 msecs"
2?9
</pre>

## 참고
* [프로젝트 오일러 55 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p055.clj)
