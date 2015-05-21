tags: [project-euler, clojure]
date: 2015-04-06
title: 프로젝트 오일러 15
---
> 20×20 격자의 좌상단에서 우하단으로 가는 경로의 수?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=15) [[영어]](https://projecteuler.net/problem=15)

격자에서 오른쪽으로 이동하는 경로를 `r`(right), 아래쪽으로 이동하는 경로를 `d`(down)라 하면 2x2 격자의 좌상단에서 우하단으로 가는 경로는 다음과 같은 식으로 표현할 수 있다.<!--more-->

```
rrdd, rdrd, rddr
drrd, drdr, ddrr
```

결국 이 문제는 `rrdd`에 대한 순열을 구하는 문제가 된다. `r` 끼리 또는 `d`끼리는 순서가 바뀌어도 상관이 없다. 따라서 2x2 격자의 좌상단에서 우하단으로 가는 경로의 수는 다음과 같이 구할 수 있다.

{% math_block %}
\begin{aligned}
(number\, of\, paths) &= \frac{4!}{2! \times 2!} = 6
\end{aligned}
{% endmath_block %}

20x20 격자라면 `r` 20개, `d` 20개를 일렬로 늘어놓을 수 있는 경우의 수를 구하는 문제가 된다. 따라서 다음 식을 계산하면 문제의 답을 구할 수 있다.

{% math_block %}
\begin{aligned}
(number\, of\, paths) &= \frac{40!}{20! \times 20!}
\end{aligned}
{% endmath_block %}

`n!`을 구하는 함수가 있다면 답을 구한 것이나 마찬가지다. `factorial`이 구현되어 있다고 한다면 답은 다음과 같이 구할 수 있다.

```clojure
(defn solve []
  (let [f40 (factorial 40) f20 (factorial 20)]
    (/ f40 (*' f20 f20))))
```

결과는 다음과 같다.

<pre class="console">
p015=> (time (solve))
"Elapsed time: 0.16456 msecs"
13784652????N
</pre>

문제 풀이에 대해서는 더 이상 설명할 것이 없으므로, Factorial 함수를 구현하는 방법에 대해 정리해보려 한다.

## Factorial 함수 구현
Factorial은 보통 다음과 같이 재귀적으로 정의된다.

{% math_block %}
\begin{aligned}
n! = \begin{cases}
  1 & \mbox{if } n = 0,\\
  n(n-1)! & \mbox {if } n > 0
  \end{cases}
\end{aligned}
{% endmath_block %}

Clojure 코드로는 다음과 같이 구현할 수 있다.

```clojure
(defn fact1 [n]
  (if (= 0 n)
    1
    (*' n (fact1 (dec n)))))
```

`factorial`은 매우 빠르게 커지는 함수로 $21!$만 되어도 `Long`의 표현 범위를 넘는다. 범위에 관계 없이 `factorial`을 구할 수 있도록 `*'`을 이용해 곱셈을 구했다. 그러나 이렇게 작성하면 매 재귀호출 때마다 스택을 소비하므로 큰 수의 Factorial을 구할 때는 `StackOverflowError`가 발생할 수 있다.

<pre class="console">
user=> (fact1 20000)

StackOverflowError   clojure.lang.Util.equiv (Util.java:30)
</pre>

꼬리재귀(Tail Recursion)을 사용하면 `StackOverflowError`를 피할 수 있다. Clojure에서 꼬리재귀를 사용하려면 `recur` Special Form을 사용해야 한다. `recur`는 tail position에서만 사용할 수 있는데, 위 `factorial` 구현에서 재귀호출하는 부분은 tail position이 아니다. 따라서 꼬리재귀를 사용하려면 다음과 같이 보조 함수를 도입해 함수 형태를 변경할 수 있다.

```clojure
(defn fact-helper [n acc]
  (if (= 0 n)
    acc
    (recur (dec n) (*' n acc))))

(defn fact2 [n]
  (fact-helper n 1))
```

이렇게 하면 큰 수에 대해서도 `StackOverflowError`가 발생하지 않고 잘 동작한다.

<pre class="console">
user=> (factorial 20000)
18192063202303451348276417568...
</pre>

그러나 `fact-helper`와 같은 보조 함수가 `factorial` 밖에서 보이는 게 불만이다. `letfn`을 사용하면 보조 함수를 `factorial` 함수 안으로 숨길 수 있다.

```clojure
(defn fact3 [n]
  (letfn [(f [n acc]
            (if (= 0 n)
              acc
              (recur (dec n) (* n acc))))]
    (f n 1)))
```

또는 `loop`를 사용할 수도 있다.

```clojure
(defn fact4 [n]
  (loop [n n, acc 1]
    (if (= 0 n)
      acc
      (recur (dec n) (*' n acc)))))
```

Factorial 함수는 0 또는 양의 정수에 대해서만 유효하다. `fact1`의 경우 인자가 음수일 경우 `StackOverflowError`가 발생할 것이고, `fact2`, `fact3`, `fact4`는 무한루프에 빠질 것이다. 따라서 다음과 같이 선행조건(precondition)을 추가할 수 있다.

```clojure
(defn fact4 [n]
  {:pre [(or (pos? n) (zero? n)) (integer? n)]}
  ...
```

Factorial을 다음과 같이 정의할 수도 있다.

{% math_block %}
\begin{aligned}
n! = \prod_{k=1}^n k = 1 \times 2\, \times ... \times\, n
\end{aligned}
{% endmath_block %}

이 정의를 그대로 Clojure 코드로 옮기면 다음과 같다.

```clojure
(defn factorial [n]
  (apply *' (range 1 (inc n))))
```

`apply` 대신 `reduce`를 사용할 수도 있다.

이 구현이 0에 대해서도 유효할까?

<pre class="console">
user=> (factorial 0)
1
</pre>

특별히 해준 것도 없는데 0을 입력했을 때 결과가 제대로 나오는 이유는 `*'` 함수(`*`도 마찬가지)에 있다. `*'` 함수는 인자가 없는 경우 1을 리턴하도록 되어 있다. 위 `factorial` 함수에 0을 입력한 경우 `(range 1 (inc 0))`은 `()` 즉 빈 리스트가 될 테고 빈 리스트에 `*'`를 `apply`하면 `*'`의 정의에 따라 1이 리턴된다. 인자가 없는 경우 `*'`가 1을 리턴하도록 한 이유는 1이 곱셈에 대한 항등원이기 때문일 것이다. `+'` 함수(`+`도 마찬가지)의 경우는 인자가 주어지지 않으면 0을 리턴하는데 이 또한 0이 덧셈에 대한 항등원이기 때문일 것이다.

## 참고
* [Factorial](http://en.wikipedia.org/wiki/Factorial)
* [Navigate a Grid Using Combinations And Permutations](http://betterexplained.com/articles/navigate-a-grid-using-combinations-and-permutations/)
* [프로젝트 오일러 문제 15 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p015.clj)
