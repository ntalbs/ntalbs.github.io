tags: [Project-Euler, Clojure]
date: 2016-05-28
title: 프로젝트 오일러 69
---
> n/φ(n)이 최대가 되는 1백만 이하의 n 찾기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=69) [[영어]](https://projecteuler.net/problem=69)

[Euler's totient function](https://en.wikipedia.org/wiki/Euler%27s_totient_function)을 보면 $\phi(n)$의 공식을 확인할 수 있다. $\phi(n)$을 구하려면 $n$의 모든 소수 약수를 하나씩 넣어가며 곱을 수행해야 한다.

{% math %}
  \require{cancel}
  \begin{aligned}
    \phi(n) = n \prod_{p|n}\left(1-\frac{1}{p}\right)
  \end{aligned}
{% endmath %}
<!--more-->

따라서 $n/\phi(n)$은 다음과 같이 나타낼 수 있다.

{% math %}
  \require{cancel}
  \begin{aligned}
    \frac{n}{\phi(n)} = \frac{\cancel{n}}{\cancel{n} \prod_{p|n}\left(1-\frac{1}{p}\right)}
    = \frac{1}{\prod_{p|n}\left(1-\frac{1}{p}\right)}
  \end{aligned}
{% endmath %}

위 식에서 볼 수 있듯이, $n/\phi(n)$은 $n$의 소수인 약수들에 의해 결정된다. $n/\phi(n)$이 최대가 되려면 분모가 최소가 되어야 한다. $(1-\frac{1}{p})$은 항상 1보다 작다. 1보다 작은 수는 곱할 수록 계속 작아지므로, 1백만 이하의 수 중에서 소수인 약수를 가장 많이 가지는 $n$을 찾으면 $n/\phi(n)$의 값을 최대로 만들 수 있다. 1백만 이하의 수 중에서 소수인 약수를 가장 많이 가지는 수는, 1백만 이하의 수 중 소수의 곱으로만 만들 수 있는 가장 큰 수를 구하면 된다.

소수의 누적곱 시퀀스를 만들어 1백만을 넘지 않는 최대값을 구하면 문제의 답이 된다. Clojure 코드로는 다음과 같이 표현할 수 있다.

```clojure
(ns p069
  (:require [clojure.contrib.lazy-seqs :refer (primes)]))

(defn solve []
  (->> (reductions * primes)
       (take-while #(< % 1000000))
       last))
```

실행 결과는 다음과 같다.

<pre class="console">
p069=> (time (solve))
"Elapsed time: 0.05742 msecs"
51??10
</pre>

## 참고
* [프로젝트 오일러 69 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p069.clj)
* [Euler's totient function](https://en.wikipedia.org/wiki/Euler%27s_totient_function)
* [Arithmetic function > Notation](https://en.wikipedia.org/wiki/Arithmetic_function#Notation)
