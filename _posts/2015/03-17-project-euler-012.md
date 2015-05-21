tags: [project-euler, clojure]
date: 2015-03-17
title: 프로젝트 오일러 12
---
> 500개 이상의 약수를 갖는 가장 작은 삼각수는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=12) [[영어]](https://projecteuler.net/problem=12)

삼각수의 시퀀스를 만들어 앞에서부터 하나씩 약수의 개수를 조사하면 될 것 같다. [문제 1](/2015/01/01/project-euler-001/)에서 1부터 n까지 정수 합을 구하는 공식을 살펴봤다. n번째 삼각수는 1부터 n까지 합이므로 공식을 이용해 다음과 같이 n번째 삼각수를 구하는 함수를 만들 수 있다.<!--more-->

```clojure
(defn triangle-number [n]
  (/ (* n (+ n 1)) 2))    ; n(n+1)/2
```

n번째 항을 구하는 함수가 있으므로 다음과 같이 삼각수의 시퀀스를 만들 수 있다.

```clojure
(def triangle-numbers (map triangle-number (iterate inc 1)))
```

이렇게 해도 되지만 다음과 같이 `reductions`를 사용해 누적합을 구하는 게 조금 더 단순해 보인다.

```clojure
(def triangle-numbers (reductions + (iterate inc 1)))
```

어떤 수의 약수가 몇 개인지는 어떻게 알 수 있을까? 인터넷 검색을 통해 간단한 공식을 찾을 수 있었다. 어떤 수 n이 $p^a q^b r^c...$로 소인수분해 된다면, 약수의 개수는 $(a+1)(b+1)(c+1)...$과 같이 된다는 것이다. [문제 3](/2015/01/11/project-euler-003/)에서 만들었던 `factorize` 함수를 사용하면 약수의 개수를 구하는 함수는 다음과 같이 구현할 수 있다.

```clojure
(defn d [n]
  (->> (factorize n)
       (map (fn [[b e]] (+ e 1)))
       (apply *)))
```

이제 삼각수의 시퀀스를 앞에서부터 하나씩 조사하면서 약수의 개수가 500개를 초과하는지 확인하면 된다.

```clojure
(defn solve []
  (->> triangle-numbers
       (drop-while #(< (d %) 500))
       first))
```

실행시켜보면 비교적 빠른 시간 안에 답을 구한다.

<pre class="console">
p012=> (time (solve))
"Elapsed time: 216.886246 msecs"
76576???
</pre>

## 사족
어떤 수 $x$가 $n$ **이상**이란 말은 $x \ge n$을 뜻한다. 프로젝트 오일러 영문 사이트에서 [Problem 12](https://projecteuler.net/problem=12)를 확인해보면 문제가 다음과 같이 기술되어 있다.

> What is the value of the first triangle number to have ***over*** five hundred divisors?

즉 약수의 개수가 500개를 **넘는** 값을 찾는 것이 문제다. 엄밀하게 말하자면 500개 **이상**이라 번역한 것은 잘못이고 **500개를 초과하는**으로 번역하는 것이 옳다. **이상**인지 **초과**인지에 따라 코드에서 `<=`를 쓸지 `<`를 쓸지 결정되기 때문에 미묘한 문제라 할 수 있다.

다행히 여기서는 이 사소한 번역 오류가 정답에 영향을 미치지는 않는다.

## 참고
* [How many divisors does a number have?](http://mathschallenge.net/library/number/number_of_divisors)
* [프로젝트 오일러 문제 12 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p012.clj)
