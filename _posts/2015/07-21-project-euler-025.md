tags: [project-euler, clojure]
date: 2015-07-21
title: 프로젝트 오일러 25
---
> 피보나치 수열에서 처음으로 1000자리가 되는 항은 몇 번째?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=25) [[영어]](https://projecteuler.net/problem=25)

피보나치 수열을 구하는 방법은 [프로젝트 오일러 2번 풀이](/2015/01/08/project-euler-002/)에서 설명했다. 2번에서는 4백만 이하의 항을 다루었지만 이 문제에서는 1,000자리가 되는 항을 구해야 하므로 피보나치 수열을 계산할 때 `+` 대신 자리수에 관계 없이 계산할 수 있는 `+'`를 사용해야 한다.<!--more-->

```clojure
(def fibo-iter
  (->> (iterate (fn [[a b]] [b (+' a b)]) [1 1])
       (map first)))
```

처음으로 1,000자리라 되는 항이 **몇 번째**인지를 구해야 하므로 `map-indexed`를 사용했다. 자릿수는 [여러 가지 방법](/2015/07/14/number-of-digits/)으로 구할 수 있지만, 여기서는 숫자를 문자열로 변환해 길이를 구하는 방식을 사용했다.

```clojure
(defn solve []
  (->> fibo-iter
       (map-indexed (fn [i e] [(inc i) e]))
       (drop-while (fn [[_ a]] (< (count (str a)) 1000)))
       ffirst))
```

실행 결과는 다음과 같다.

<pre class="console">p025=> (time (solve))
"Elapsed time: 146.081263 msecs"
47??
</pre>

## 참고
* [프로젝트 오일러 25 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p025.clj)
* [프로젝트 오일러 2](/2015/01/08/project-euler-002/)
* [정수 자릿수 구하기](/2015/07/14/number-of-digits/)
