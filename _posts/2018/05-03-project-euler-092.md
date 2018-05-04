tags: [Project-Euler, Clojure]
date: 2018-05-03
title: 프로젝트 오일러 92
---
> 자릿수를 제곱해서 더해가는 수열의 신기한 성질
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=92) [[영어]](https://projecteuler.net/problem=92)

## 무차별 대입법
일단 무식한 방법으로 풀어보자. 1부터 1천만까지 숫자를 대입하면서 자릿수를 제곱해 더한 수가 89에 도달하는지 확인하는 방법이다. 자릿수를 제곱해 더한 수를 구하는 함수는 다음과 같이 간단히 작성할 수 있다.
<!--more-->

```clojure
(defn- sum-sq-digits [n]
  (->> (digits n)
       (map #(* % %))
       (reduce +)))
```

어떤 수가 자릿수를 제곱해 더했을 때 89에 도달하는지 확인하는 함수는 다음과 같이 작성할 수 있다. 어떤 수를 입력하든 1 또는 89에 도달하므로 1을 만나면 `false`를, 89를 만나면 `true`를 리턴하고, 그 외 경우는 `sum-sq-digits`를 계산해 89에 도달하는지 다시 확인한다.

```clojure
(defn- reach89? [n]
  (cond (= n 1) false
        (= n 89) true
        :else (reach89? (sum-sq-digits n))))
```

이 두 함수를 이용하면 다음과 같이 문제를 풀 수 있다.

```clojure
(defn solve1 []
  (->> (range 1 10000000)
       (filter reach89?)
       (count)))
```

실행 결과는 다음과 같다. 답을 구하는 데 거의 50초 가까이 걸린다.

<pre class="console">
p092=> (time (solve1))
"Elapsed time: 49322.342829 msecs"
858??46
</pre>

## 순열조합 활용
생각해보니 문제를 풀 때 다음 특성을 활용하면 시간을 단축할 수 있을 것 같다.

* 0은 값에 영향을 미치지 않는다.
* 숫자의 순서는 값에 영향을 미치지 않는다.

따라서 123을 확인했다면 1230, 12300, 123000 등은 확인할 필요가 없다. 또한 123, 132, 213 등도 같은 결과가 나올 것이다. 따라서 1천만 개의 숫자를 모두 확인하는 대신, 0과 숫자의 순서를 무시했을 때 나타나는 유일한 패턴에 대해서만 계산한 다음 해당 패턴으로 만들 수 있는 수의 개수를 구해 더하면 답을 구할 수 있다.

10,000,000은 암산으로도 결과가 1임을 알 수 있으므로 고려하지 않아도 된다. 따라서 $a \le b \le c \le d \le e \le f \le g$인 7자리 자연수 $abcdefg$에 대해서만 계산을 해보면 된다. ($0 \le a, b, ..., g \le 9$)

또한 각 패턴에 대한 경우의 수 $C$는 다음과 같이 구할 수 있다.

{% math %}
\begin{aligned}
C = \frac{7!}{C_0! \times C_1! \times ... \times C_9!}
\end{aligned}
{% endmath %}


$C_k$는 패턴에 나타나는 숫자 $k$의 개수다.

$a \le b \le c \le d \le e \le f \le g$인 7자리 자연수 $abcdefg$는 다음과 같이 간단히 생성할 수 있다. 처리 상 편의를 위해 숫자 벡터로 생성하는 게 좋겠다. $a = b = c = d = e = f = g = 0$인 경우는 자연수가 아니므로 제외한다.

```clojure
(let [r (range 0 10)]
  (for [a r
        b r
        c r
        d r
        e r
        f r
        g r
        :when (<= a b c d e f g)
        :when (not= 0 a b c d e f g)] [a b c d e f g]))
```

주어진 숫자 패턴으로 만들 수 있는 경우의 수를 구하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn- cnt [ds]
  (->> ds
       (group-by identity)
       (map (fn [[_ d]] (count d)))
       (map factorial)
       (apply *)
       (quot (factorial 7))))
```

숫자 패턴을 숫자로 바꾸는 함수도 필요하다.

```clojure
(defn- vn [digits]
  (reduce (fn [a b] (+ (* 10 a) b)) digits))
```

이 두 함수를 이용하면 다음과 같이 문제를 풀 수 있다. 주어진 수가 89에 도달하는지 확인하는 함수는 위에서 구현한 `reach89?`를 그대로 사용한다.

```clojure
(defn solve2 []
  (let [r (range 0 10)]
    (->> (for [a r
               b r
               c r
               d r
               e r
               f r
               g r
               :when (<= a b c d e f g)
               :when (not= 0 a b c d e f g)] [a b c d e f g])
         (map (fn [ds] [(vn ds) (cnt ds)]))
         (filter (fn [[k cnt]] (reach89? k)))
         (map (fn [[k cnt]] cnt))
         (apply +))))
```

실행 결과는 다음과 같다. 1초도 안 걸려 답을 구한다.

<pre class="console">
p092=> (time (solve2))
"Elapsed time: 927.414462 msecs"
858??46
</pre>

## 참고
* [프로젝트 오일러 92 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p092.clj)
