tags: [Project-Euler, Clojure]
date: 2016-07-14
title: 프로젝트 오일러 72
---
> 분모가 1백만 이하인 기약 진분수의 개수
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=72) [[영어]](https://projecteuler.net/problem=72)

분모가 $d$인 경우 기약 진분수의 개수는 $d$와 서로 소인 정수의 개수와 같다. 이는 [Euler’s totient function](https://en.wikipedia.org/wiki/Euler%27s_totient_function)의 정의와 동일하다. 따라서 분모가 1백만 이하인 기약 진분수의 개수를 $S$라 하면 $S$는 다음과 같이 구할 수 있다.
<!--more-->

{% math %}
  \begin{aligned}
    S = \sum_{n=2}^{1000000} \phi(n)
  \end{aligned}
{% endmath %}

$n$이 $p_1^{k_1}p_2^{k_2}...p_r^{k_r}$로 소인수분해 될 때 $\phi(n)$는 다음과 같이 나타낼 수 있다.

{% math %}
  \begin{aligned}
    \phi(n)
    &= \phi(p_1^{k_1})\phi(p_2^{k_2})...\phi(p_r^{k_r}) \\[5pt]
    &= p_1^{k_1}\left(1 - \frac{1}{p_1}\right)
    p_2^{k_2}\left(1 - \frac{1}{p_2}\right)
    ...
    p_r^{k_r}\left(1 - \frac{1}{p_r}\right)
  \end{aligned}
{% endmath %}

따라서 $\phi(n)$을 구하는 함수를 다음과 같이 Clojure 코드로 옮길 수 있다.

```clojure
(ns p072
  (:require [util :refer [pow factorize]]))

(defn phi
  ([p k]
   (* (pow p k) (- 1 (/ 1 p))))
  ([n]
   (->> (factorize n)
        (map (fn [[p k]] (phi p k)))
        (apply *))))
```

$\phi(2)$부터 $\phi(1000000)$까지 더하는 코드는 다음과 같이 작성할 수 있다.

```clojure
(def limit 1000000)

(defn solve []
  (->> (range 2 (inc limit))
       (pmap phi)
       (apply +)))
```

답을 구하기는 하지만 속도는 매우 실망스럽다. 조금이라도 빠르게 해보려고 `pmap`까지 동원했지만 만족스럽지 않다.

<pre class="console">
p072=> (time (solve))
"Elapsed time: 191991.51059 msecs"
303963??2391N
</pre>

이렇게 속도가 느린 이유는 `phi`를 구할 때 같은 계산을 반복하는 회수가 많기 때문일 것이다. 숫자의 앞부분부터 $\phi(n)$이 어떻게 계산되는지를 살펴보면 힌트를 얻을 수 있을지도 모르겠다.

{% math %}
\begin{aligned}
  \phi(2) &= 2 (1 - \frac{1}{2}) \\
  \phi(3) &= 3 (1 - \frac{1}{3}) \\
  \phi(4) &= 4 (1 - \frac{1}{2}) \\
  \phi(5) &= 5 (1 - \frac{1}{5}) \\
  \phi(6) &= 6 (1 - \frac{1}{2})(1 - \frac{1}{3}) \\
  \phi(7) &= 7 (1 - \frac{1}{7}) \\
  \phi(8) &= 8 (1 - \frac{1}{2}) \\
  \phi(9) &= 9 (1 - \frac{1}{3}) \\
\end{aligned}
{% endmath %}

위 식을 가만히 보면 $(1 - \frac{1}{2})$, $(1 - \frac{1}{3})$, $(1 - \frac{1}{5})$을 반복해 계산해야 함을 알 수 있다. $\phi(2)$부터 $\phi(1000000)$까지 계산하는 과정에서 동일한 $(1 - \frac{1}{p})$를 얼마나 많이 계산해야 할까. 이런 반복 계산을 줄인다면 속도를 크게 향상시킬 수 있을 것이다.

여기서도 소수를 구할 때 사용하는 에라스토테네스 체와 비슷한 방법을 사용할 수 있다. 에라스토테네스 체에서는 숫자 목록을 만들어 놓고 첫 소수를 취한 다음 그 소수의 모든 배수를 제거해 가지만, 여기서는 소수에 $(1 - \frac{1}{p})$를 곱해가야 한다. 이렇게 하면 결과적으로 각 수에 모든 소인수에 대한 $(1 - \frac{1}{p})$를 곱하게 된다.

이런 계산은 배열에 숫자를 넣어두고 루프를 돌며 배열의 숫자를 업데이트 하는 방법으로 구현하면 쉽다. Java로는 다음과 같이 구현할 수 있다.

```java
public long solve() {
  int limit = 1000000;
  int[] phi = IntStream.range(0, limit + 1).toArray();
  long result = 0;
  for (int i = 2; i <= limit; i++) {
    if (phi[i] == i) {
      for (int j = i; j <= limit; j += i) {
        phi[j] = phi[j] / i * (i - 1);
      }
    }
    result += phi[i];
  }
}
```

이 코드를 실행시켜보면 답을 구하는 150ms 정도 걸린다. 처음 시도했던 방법과 비교하면 엄청나게 빠름을 알 수 있다. 아직 함수형 프로그래밍에 대한 이해가 부족해서인지 이런 식의 코드는 Clojure로 어떻게 작성해야 할지 잘 모르겠다. 고민끝에 다음과 같이 Clojure에서 Java 배열을 사용하도록 코드를 작성했다.

```clojure
(defn solve []
  (let [limit 1000000
        phi (int-array (range (inc limit)))]
    (loop [i 2 acc 0]
      (if (= i (aget phi i))
        (loop [j i]
          (if (<= j limit)
            (do (aset-int phi j (/ (* (aget phi j) (dec i)) i))
                (recur (+ j i))))))
      (if (< i limit)
        (recur (inc i) (+ acc (aget phi i)))
        acc))))
```

이 코드는 논리적으로 Java 코드와 동일하지만 속도는 두 배 이상 느리다. 그래도 처음 방법에 비하면 엄청난 발전이라 할 수 있겠다.

<pre class="console">
p072=> (time (solve3))
"Elapsed time: 350.048542 msecs"
303963??2391
</pre>

## 참고
* [프로젝트 오일러 72 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p072.clj)
* [Euler’s totient function](https://en.wikipedia.org/wiki/Euler%27s_totient_function)
* [Clojure performance for solving Project Euler 72 (counting proper reduced fractions)](http://codereview.stackexchange.com/questions/135238/clojure-performance-for-solving-project-euler-72-counting-proper-reduced-fracti)
`aset-int` 대신 `aset`을 쓰면 답을 구하는 데 25초 이상 걸린다. `aset-int`으로 나아졌지만 여전히 Java보다 두 배 이상 느린 것은 `(aget phi i)`가 `phi[i]`보다 느리기 때문일 것 같다. 아직 이 부분을 개선할 방법을 찾지 못했다.
