tags: [Project-Euler, Clojure]
date: 2016-11-27
title: 프로젝트 오일러 79
---
> 접속 기록으로부터 비밀번호 알아내기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=79) [[영어]](https://projecteuler.net/problem=79)

접속 기록 데이터가 많지 않으므로 코드를 아무렇게나 짜도 답을 빠르게 구할 수 있을 것이다. 먼저 다음과 같이 접속 기록을 읽는 코드를 작성한다.

```clojure
(def keylog
  (-> (slurp "data/keylog.txt")
      (clojure.string/split #"\r\n")
      distinct
      sort))
```

중복을 제거하면 접속 기록이 서른 세 개밖에 되지 않는다.
<!--more-->

<pre class="console">
p079=> keylog
("129" "160" "162" "168" "180" "289" "290" "316" "318" "319"
 "362" "368" "380" "389" "620" "629" "680" "689" "690" "710"
 "716" "718" "719" "720" "728" "729" "731" "736" "760" "762"
 "769" "790" "890")
p079=> (count keylog)
33
</pre>

[위상 정렬(topological sort)](https://en.wikipedia.org/wiki/Topological_sorting)과 같은 거창한 알고리즘을 생각할 수도 있겠지만, 단순 무식한 방법을 사용해 문제를 풀여보려 한다. 접속 기록을 가만히 살펴보면 몇 가지 사실을 알 수 있다.

* `7`은 항상 맨 앞에만 나오고 중간이나 마지막에 나오는 경우가 없다. 따라서 비밀번호의 맨 앞자리는 `7`이다.
* `0`은 항상 마지막에만 나오고 중간이나 처음에 나오는 경우가 없다. 따라서 비밀번호의 마지막 자리는 `0`이 되어야 한다.
* 접속 기록에 `4`와 `5`는 나오지 않는다. 따라서 비밀번호에는 `4`와 `5`가 포함되지 않는다. (비밀번호에 `4`나 `5`가 포함된다면 이 접속 기록으로는 해당 비밀번호를 알아낼 수 없다.)

이걸 코드로 어떻게 구할 수 있을까? 여기서 사용할 로직은 이렇다. 첫째 자리 수만 모아 집합 $S_1$을 만들고 다른 자리에 나오는 수를 모아 집합 $S_2$를 만든 다음 집합 $S_1 - S_2$ 구하면 비밀번호의 첫 자리를 구할 수 있다. 첫 자리를 제외한 나머지 수에 대해 이 과정을 반복하면 전체 비밀번호를 구할 수 있을 것이다.

접속 기록은 세 개의 숫자로 되어 있지만, 숫자를 두 개씩 끊어 쌍으로 묶으면 생각하기가 편해진다. 즉, 접속 기록이 `[1 2 3]`였다면 이를 `[1 2]`, `[2 9]`와 같이 수의 쌍으로 표현하는 것이다. `keylog`를 이와 같은 형식으로 바꾸는 코드는 다음과 같이 작성할 수 있다.

```clojure
(def pairs
  (->> keylog
       (map #(parse-int %))
       (map digits)
       (mapcat #(partition 2 1 %))
       distinct))
```

차집합은 `clojure.set/difference`를 이용하면 쉽게 구할 수 있다.

```clojure
(defn minus [s1 s2]
  (set/difference s1 s2))
```

이제 비밀번호를 구하는 함수를 작성할 차례다.

```clojure
(defn find-key [ps acc]
  (let [ps (filter #(not= (last acc) (first %)) ps)]
    (if (= 1 (count ps))
      (into acc (first ps))
      (recur ps
             (into acc (minus (set (map first ps)) (set (map second ps))))))))
```

위 함수는 비밀번호를 숫자의 시퀀스로 리턴한다. 다음과 같이 숫자를 모두 모아 문자열로 만들면 비밀번호가 완성된다.

```clojure
(defn solve []
  (apply str (find-key pairs [])))
```

실행 결과는 다음과 같다. 예상대로 빠르게 답을 구한다.

<pre class="console">
p079=> (time (solve))
"Elapsed time: 1.564309 msecs"
"731??890"
</pre>

사실 이 방법에는 한 가지 가정이 들어가 있다. 비밀번호에 동일한 숫자가 반복되지 않는다는 가정. 다행히 접속 기록에 같은 숫자가 반복되는 경우가 없었고, 답으로 구한 비밀번호에서도 동일한 숫자가 반복되지 않았다. 비밀번호에 같은 숫자가 두 번 이상 반복되었다면 위 방법을 사용하지 못할 것이다.

## 참고
* [프로젝트 오일러 79 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p079.clj)
