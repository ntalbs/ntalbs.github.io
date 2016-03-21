tags: [Project-Euler, Clojure]
date:
title: 프로젝트 오일러 13
---
> 50자리 숫자 100개를 더한 값의 첫 10자리 구하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=13) [[영어]](https://projecteuler.net/problem=13)

`Long.MAX_VALUE`는 9223372036854775807로 20자리 수를 표현할 수 있다. 문제에서 나오는 숫자는 50자리므로 `Long`의 표현 범위를 벗어난다. 이런 수를 100개 더하려면...<!--more-->

## 방법 1
대부분의 현대적 언어에서는 이런 큰 수를 다루기 위한 별도 타입을 제공하며, 이를 활용하면 문제를 쉽게 풀 수 있다. Java에서는 `java.math.BigInteger`를 쓰면 자릿수에 관계없이 큰 수를 표현할 수 있다. Clojure에서는 `clojure.lang.BigInt`로 큰 수를 표현할 수 있다. 따라서 `BigInt`를 이용하면 별다른 노력을 들이지 않고 간단히 문제를 풀 수 있다. Clojure에서는 별도로 조치를 취하지 않아도 long 범위를 넘는 수는 `BigInt`로 변환된다.

<pre class="console">
user=> 37107287533902102798797998220837590246510135740250
37107287533902102798797998220837590246510135740250<span style="color:yellow;font-weight:bold">N</span>
user=> (class 37107287533902102798797998220837590246510135740250)
clojure.lang.BigInt
</pre>

`BigInt`라도 Java에서처럼 별도의 메서드를 사용할 필요는 없다. Clojure에서는 `+`도 함수이며 `BigInt`에 대해서도 `+`를 그대로 사용할 수 있다. 따라서 다음과 같이 간단히 문제를 풀 수 있다.

```clojure
(def nums [37107287533902102798797998220837590246510135740250
           46376937677490009712648124896970078050417018260538
           74324986199524741059474233309513058123726617309629
           ...
           53503534226472524250874054075591789781264330331690])

(defn solve1 []
  (-> (apply + nums)
      str
      (subs 0 10)))
```

다음과 같이 빠르게 답을 구한다.

<pre class="console">
p013=> (time (solve1))
"Elapsed time: 0.356553 msecs"
"5537376???"
</pre>

## 방법 2
`BigInt`를 사용하면 문제 풀이가 너무 쉽기 때문에 문제 본래의 의도를 회피한 것이다. 여기서는 `BigInt`를 사용하지 않고 큰 수를 숫자 시퀀스(sequence of digits)로 표현해 문제를 풀어 보자.

먼저 다음과 같이 숫자를 입력받아 시퀀스로 바꾸는 함수를 작성한다.

```clojure
(defn digits
  "Retruns the list of digits of n."
  [n]
  (loop [n n acc '()]
    (if (= n 0)
      acc
      (recur (quot n 10) (conj acc (int (rem n 10)))))))
```

이미 `nums`에 `BigInt`로 숫자가 들어있는 것을 숫자 시퀀스로 바꾸려는 것인데, 이게 반칙이라 생각되면 문제에서 주어진 숫자 목록을 문자열로 만든 다음 이를 숫자 시퀀스로 바꿀 수 있다. 이렇게 하는 방법은 [문제 8](/2015/project-euler-008/)에서 이미 살펴봤으므로 여기서는 생략한다.

이제 숫자 시퀀스 두 개를 더하는 방법을 생각해야 한다. 예를 들어, `(9 8 7 6)`과 `(8 7 6)`을 더하면 `(1 0 7 5 2)`이 나오도록 해야 한다. 종이에 숫자를 써서 더할 때와 동일한 방법을 적용해, 각 자리별로 숫자를 더하면서 더한 수가 10을 넘을 때 윗 자리에 1을 더하는 작업을 모든 자리에 대해 수행해야 한다.

1. 일단 두 시퀀스의 길이를 맞춘다. 더할 때 자릿수가 맞아야 하므로 짧은 쪽 앞에 0을 덧붙여 자릿수를 맞춰야 한다. `(9 8 7 6)`과 `(8 7 6)`을 더하려면 먼저 `(8 7 6)`을 `(0 8 7 6)`으로 만들어야 한다.
2. 길이를 맞춘 두 시퀀스를 더한다. 간단히 `(map + seq1 seq2)`로 구할 수 있다. `(9 8 7 6)`과 `(0 8 7 6)`에 대해서는 `(9 16 14 12)`가 될 것이다.
3. 뒤에서부터 10의 자리와 1의 자리로 숫자를 나눠 1의 자리수는 `acc`에 누적하고 10의 자리수는 앞자리와 더한다.
4. 모든 자리에 대해 단계 3을 반복한다. 맨 앞자리 수가 10 이상이면 이 또한 10의 자리와 1의 자리로 분해해 단계 3을 반복해야 한다.

여기서 단계 3이 특히 중요하다. 단계 3을 수행하는 함수는 다음과 같이 구현할 수 있다.

```clojure
(defn- normalize-digits
  "Returns a normalized sequence of digits.
  Normalized here means that every digit in the sequence is single digit."
  [ds]
  (loop [ds (reverse ds), acc '()]
    (let [cur (first ds)
          rst (rest ds)
          d10 (quot cur 10)
          d1 (rem cur 10)]
      (if (empty? rst)
        (if (= d10 0)
          (conj acc d1)
          (recur (list d10) (conj acc d1)))
        (recur (add-to-first rst d10) (conj acc d1))))))
```

코드가 조금 복잡한데, 루프를 돌면서 `ds`와 `acc`가 어떻게 바뀌는지 살펴보면 이해하는 데 도움이 된다. 각 자리를 뒤에서부터 (즉 1의자리부터) 처리하며 올라가는 것이 직관적이지만 리스트는 앞에서부터 처리하는 게 편하므로 `ds`를 `reverse`한 다음 진행하지만, 기본적으로 다음과 같이 처리된다고 할 수 있다.

```
1: (12 34 56) | ()
2: (12 39)    | (6)
3: (15)       | (9 6)
4: (1)        | (5 9 6)
5: ()         | (1 5 9 6) => 끝
```

함수의 마지막 행에 있는 `add-to-first`는 리스트와 숫자를 받아 리스트의 맨 앞 요소에 숫자를 더하는 함수다.

```clojure
(defn- add-to-first
  "Returns a new list with its first element is (+ x (first ls)). "
  [ls x]
  {:pre [(list? ls)]}
  (let [fv (first ls)]
    (if (nil? fv)
      nil
      (conj (rest ls) (+ fv x)))))
```

`normalize-digits`가 있다면 두 시퀀스를 더하는 함수는 다음과 같이 쉽게 구할 수 있다.

```clojure
(defn digits+
  "Returns sum of two digits."
  [ds1 ds2]
  (let [cnt1 (count ds1)
        cnt2 (count ds2)
        ds1 (if (< cnt1 cnt2) (lpad ds1 (- cnt2 cnt1)) ds1)
        ds2 (if (< cnt1 cnt2) ds2 (lpad ds2 (- cnt1 cnt2)))
        added  (map + ds1 ds2)]
    (normalize-digits added)))
```

두 시퀀스를 더한 결과도 역시 시퀀스다. 함수 안에서 사용하는 `lpad`는 다음과 같이 구현하면 된다.

```clojure
(defn- lpad [ds cnt]
  (concat (repeat cnt 0) ds))
```

여기까지 했다면, 답은 다음과 같이 구할 수 있다.

```clojure
(defn solve2 []
  (->> (map num->digits nums)
       (reduce add-digits)
       (take 10)
       (apply str)))
```

실행시켜보면 금방 답을 구한다.

<pre class="console">
p013=> (time (solve2))
"Elapsed time: 8.531118 msecs"
"5537376???"
</pre>

`BigInt`를 썼을 때보다 많이 느려졌다. 어설프게 구현하는 것보다는 잘 되어 있는 라이브러리를 쓰는 게 훨씬 낫다.

## 참고
* [Clojure의 BigInt 소스 코드](https://github.com/clojure/clojure/blob/master/src/jvm/clojure/lang/BigInt.java)
* [프로젝트 오일러 13 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p013.clj)
