tags: [Project-Euler, Clojure]
date: 2016-08-18
title: 프로젝트 오일러 74
---
> 자릿수의 계승값을 더해갈 때, 반복이 일어나기 전의 단계가 60번인 경우 찾기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=74) [[영어]](https://projecteuler.net/problem=74)

각 자릿수의 계승값을 더하는 함수는 다음과 같이 간단히 작성할 수 있다.

```clojure
(defn- fact-sum [n]
  (->> (digits n)
       (map factorial)
       (apply +)))
```
<!--more-->

단계의 길이를 구하는 함수는 다음과 같이 작성할 수 있다. 위에서 작성한 `fact-sum`을 반복 적용해가며 결과를 집합에 넣고 길이를 1씩 증가시킨다. 새로 구한 `fact-sum` 값이 이미 집합에 포함되어 있다면 그때까지의 길이가 단계의 길이가 된다.

```clojure
(defn- chain-length [n]
  (loop [s n chain #{n} cnt 1]
    (let [x (fact-sum s)]
      (if (contains? chain x)
        cnt
        (recur x (conj chain x) (inc cnt))))))
```

이제 1부터 1000000까지 숫자를 대입해가며 단계 길이가 60인 경우만 세면 된다.

```clojure
(defn solve1 []
  (->> (range 1 (inc 1000000))
       (filter #(= 60 (chain-length %)))
       count))
```

실행 결과는 다음과 같다.

<pre class="console">
p074=> (time (solve1))
"Elapsed time: 66647.941342 msecs"
4?2
</pre>

답을 구하는 데 너무 오래 걸린다. 좀더 빠른 방법이 없을까?

## 개선 1
위에서 사용한 `factorial` 함수는 [문제 15](/2015/project-euler-015/)에서 구현한 것을 그대로 가져다 썼다. 이 문제에서는 0~9의 숫자에 대해서만 계승을 구하면 되므로 계승을 구하는 함수를 다음과 같이 최적화할 수 있을 것 같다.

```clojure
(defn- fact [n]
  (case n
    0 1
    1 1
    2 2
    3 6
    4 24
    5 120
    6 720
    7 5040
    8 40320
    9 362880))
```

새로 작성한 `fact` 함수를 사용하도록 수정한 후 실행한 결과는 다음과 같다.

<pre class="console">
p074=> (time (solve1))
"Elapsed time: 36881.277101 msecs"
4?2
</pre>

실행 시간이 절반 가까이 줄어들긴 했지만 여전히 만족스럽지 못하다.

## 개선 2
가만히 생각해보면 `fact-sum`의 값은 주어진 숫자가 어떤 숫자를 포함하고 있느냐에 의해서만 결정됨을 알 수 있다. 즉 `fact-sum`는 169나 691이나 916이나 모두 값을 리턴한다.

<pre class="console">
p074=> (fact-sum 169)
363601
p074=> (fact-sum 691)
363601
p074=> (fact-sum 916)
363601
</pre>

따라서 169의 `fact-sum`을 구했으면 196, 691, 619 등 1, 6, 9의 순열로 된 다른 수에 대해 반복해서 계산할 필요가 없을 것이다. 각 자릿수의 순열로 된 수를 하나의 그룹으로 묶는 방법 중 하나는 자릿수로 정렬해 다시 숫자로 만든 값을 키로 사용해 묶는 것이다. $0! = 1$이므로 자릿수를 정렬할 때 내림차순으로 정렬해 0이 사라지지 않도록 해야 한다.

```clojure
(defn- sorted-digits-num [n]
  (->> (digits n)
       (sort >)
       (apply str)
       (Integer/parseInt)))
```

이 함수를 이용해 다음과 같이 문제를 풀 수 있다. `sorted-digits-num`와 `frequencies`를 이용해 특정 수의 순열로 된 수를 한 그룹으로 묶으면 `chain-length`를 호출하는 횟수를 1백만 번에서 8천 번으로 줄일 수 있다.

```clojure
(defn solve2 []
  (->> (range 3 (inc 1000000))
       (map sorted-digits-num)
       frequencies
       (map (fn [[k cnt]] [(chain-length k) cnt]))
       (filter (fn [[k _]] (= k 60)))
       (map second)
       (apply +)))
```

실행 결과는 다음과 같다.

<pre class="console">
p074=> (time (solve2))
"Elapsed time: 1324.311954 msecs"
4?2
</pre>

전과 비교해 상당히 빨라졌다고 할 수 있다.

## 참고
* [프로젝트 오일러 74 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p074.clj)
