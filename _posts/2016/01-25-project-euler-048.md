tags: [project-euler, clojure]
date: 2016-01-25
title: 프로젝트 오일러 48
---
> 1<sup>1</sup> + 2<sup>2</sup> + 3<sup>3</sup> + ... + 1000<sup>1000</sup> 의 마지막 10자리는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=48) [[영어]](https://projecteuler.net/problem=48)

이 문제 역시 아주 큰 숫자를 다루는 문제지만, Java의 `BigInteger`나 Clojure의 `BigInt`를 쓰면 쉽게 풀 수 있다.<!--more-->

계산은 복잡하지 않다. 그냥 1부터 1000까지 루프를 돌며 $n^n$을 구해 모두 더한 다음 `mod`를 이용해 마지막 10자리를 구하면 된다. `pow` 메서드가 있는 Java의 `BigInteger` 클래스를 사용하는 게 좀 더 편하겠다.

```clojure
(defn solve []
  (->> (range 1 (inc 1000))
       (map biginteger)
       (map #(.pow % %))
       (apply +')
       (#(mod % 10000000000))))
```

실행 결과는 다음과 같다.

<pre class="console">
p048=> (time (solve))
"Elapsed time: 11.002665 msecs"
9110??6700N
</pre>

물론 이렇게 푸는 것은 문제의 의도를 회피한 것이겠지만, `BigInteger`를 사용하지 않고 큰 수를 다루는 방법은 문제 [20](/2015/05/20/project-euler-020/), [16](/2015/04/08/project-euler-016/), [13](/2015/03/18/project-euler-013/)에서 충분히 시도해 봤으므로, 여기서는 생략한다.

## 참고
* [프로젝트 오일러 48 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p048.clj)
* 프로젝트 오일러 [20](/2015/05/20/project-euler-020/), [16](/2015/04/08/project-euler-016/), [13](/2015/03/18/project-euler-013/)
`BigInteger`를 사용하지 않고 큰 수를 다루는 방법을 설명했다.
