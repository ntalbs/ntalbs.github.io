tags: [project-euler, clojure]
date:
title: 프로젝트 오일러 - 13
---
> 50자리 숫자 100개를 더한 값의 첫 10자리 구하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=13) [[영어]](https://projecteuler.net/problem=13)

`Long.MAX_VALUE`는 9223372036854775807로 20자리 수를 표현할 수 있다. 문제에서 나오는 숫자는 50자리므로 `Long`의 표현 범위를 벗어난다. 이런 수를 100개 더하려면...<!--more-->

## 방법 1
대부분의 현대적 언어에서는 이런 큰 수를 다루기 위한 별도 타입을 제공하며, 이를 활용하면 문제를 쉽게 풀 수 있다. Java에서는 `java.math.BigInteger`를 쓰면 자릿수에 관계없이 큰 수를 표현할 수 있다. Clojure에서는 `clojure.lang.BigInt`로 큰 수를 표현할 수 있는데 `clojure.lang.BigInt`는 내부적으로 `java.math.BigInteger`를 사용한다. 따라서 `BigInt`를 이용하면 별다른 노력을 들이지 않고 간단히 문제를 풀 수 있다. Clojure에서는 별도로 조치를 취하지 않아도 long 범위를 넘는 수는 `BigInt`로 변환된다.

<pre class="console">
user=> 37107287533902102798797998220837590246510135740250
37107287533902102798797998220837590246510135740250<span style="color:yellow;font-weight:bold">N</span>
user=> (class 37107287533902102798797998220837590246510135740250)
clojure.lang.BigInt
</pre>

`BigInt`라도 Java에서처럼 별도의 메서드를 사용할 필요는 없다. Clojure에서는 `+`도 함수이며 `BigInt`에 대해서도 `+`를 그대로 사용할 수 있다. 따라서 다음과 같이 간단히 문제를 풀 수 있다.

```[clojure]
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

답을 구하는 데 0.05ms밖에 걸리지 않는다.

<pre class="console">
p013=> (time (solve1))
"Elapsed time: 0.056103 msecs"
"5537376???"
</pre>

## 방법 2
`BigInt`를 사용하면 문제 풀이가 너무 쉽기 때문에 문제 본래의 의도를 회피한 것으로 보인다. 여기서는 `BigInt`를 사용하지 않고 큰 수를 숫자 시퀀스(sequence of digits)로 표현해 문제를 풀어보려 한다. 먼저 다음과 같이 숫자를 입력받아 시퀀스로 바꾸는 함수를 작성한다.

```[clojure]
(defn- num->digits [n]
  (loop [n n, acc '()]
    (if (= n 0)
      acc
      (recur (quot n 10) (conj acc (int (rem n 10)))))))
```

이미 `nums`에 `BigInt`로 숫자가 들어있는 것을 숫자 시퀀스로 바꾸려는 것인데, 이게 반칙이라 생각되면 문제에서 주어진 숫자 목록을 문자열로 만든 다음 이를 숫자 시퀀스로 바꿀 수 있다. 이렇게 하는 방법은 [문제 8](/2015/02/25/project-euler-008/)에서 이미 살펴봤으므로 여기서는 생략한다.

이제 숫자 시퀀스 두 개를 더하는 방법을 생각해야 한다. 예를 들어, `(9 8 7 6)`과 `(8 7 6)`을 더하면 `(1 0 7 5 2)`이 나오도록 해야 한다. Java나 C와 같은 언어로 구현한다면 종이에 숫자를 써서 더할 때와 동일한 방법을 적용해, 배열에 숫자를 넣어놓고 각 자리별로 숫자를 더하면서 더한 수가 10을 넘을 때 윗 자리에 1을 더해주는 방법을 사용할 수 있을 것이다.

Clojure로는 그런 식으로 풀 수 없다. 따라서 다음과 같은 방법을 생각했다.

1. 일단 두 시퀀스의 길이를 맞춘다. 더할 때 자리수가 맞아야 하므로 짧은 쪽 앞에 0을 덧붙여 자리수를 맞춰야 한다. `(9 8 7 6)`과 `(8 7 6)`을 더하려면 먼저 `(8 7 6)`을 `(0 8 7 6)`으로 만들어야 한다.
2. 길이를 맞춘 두 시퀀스를 더한다. 간단히 `(map + seq1 seq2)`로 구할 수 있다. `(9 8 7 6)`과 `(0 8 7 6)`에 대해서는 `(9 16 14 12)`가 될 것이다.
3. 뒤에서부터 10의 자리와 1의 자리로 숫자를 나눠 리스트에 넣는다. 리스트의 첫 항목과 10의 자리 수를 더해 이를 다시 10의 자리와 1의 자리수로 나눠 리스트에 넣어야 한다. `foldr` 같은 함수가 있다면 이를 쓰겠지만 표준 라이브러리에서 제공되지 않으므로 다음과 같이 결과를 `reverse`한 다음 `reduce`했다.

```[clojure]
(defn- add-digits [dv1 dv2]
  (let [cnt1 (count dv1)
        cnt2 (count dv2)
        dv1 (if (< cnt1 cnt2) (lpad dv1 (- cnt2 cnt1)) dv1)
        dv2 (if (< cnt1 cnt2) dv2 (lpad dv2 (- cnt1 cnt2)))
        added (reverse (map + dv1 dv2))]
    (->> (reduce (fn [ls x]
                   (if (empty? ls)
                     (list (quot x 10) (rem x 10))
                     (let [d10 (quot (+ x (first ls)) 10), d1 (rem (+ x (first ls)) 10)]
                       (conj (conj (rest ls) d1) d10))))
                 '()
                 added)
         (drop-while #(zero? %)))))
```

두 시퀀스를 더한 결과도 역시 시퀀스다. 경우에 따라 시퀀스의 첫 요소가 0이 될 수도 있는데 이때는 0을 제거해줘야 한다. 제거하지 않으면 나중에 계산을 누적했을 때 결과 시퀀스 앞부분이 0으로 채워질 것이기 때문이다.

함수 안에서 사용하는 `lpad`는 다음과 같이 구현하면 된다.

```[clojure]
(defn- lpad [ds cnt]
  (concat (repeat cnt 0) ds))
```

여기까지 했다면, 답은 다음과 같이 구할 수 있다.

```[clojure]
(defn solve2 []
  (->> (map num->digits nums)
       (reduce add-digits)
       (take 10)
       (apply str)))
```

실행시켜보면 금방 답을 구한다.

<pre class="console">
p013=> (time (solve2))
"Elapsed time: 4.825091 msecs"
"5537376???"
</pre>

이 방법으로는 대략 ~5ms 정도 걸렸는데, `BigInt`를 썼을 때(~0.05ms)보다 백배 정도 느리다. 어설프게 구현하는 것보다는 잘 구현되어 있는 라이브러리를 쓰는 게 훨씬 낫다.

## 참고
* [Clojure의 BigInt 소스 코드](https://github.com/clojure/clojure/blob/master/src/jvm/clojure/lang/BigInt.java)
* [프로젝트 오일러 문제 13 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p013.clj)
