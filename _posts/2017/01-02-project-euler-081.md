tags: [Project-Euler, Clojure]
date: 2017-01-02
title: 프로젝트 오일러 81
---
> 오른쪽과 아래로만 움직이면서 좌상단→우하단으로 가는 경로의 합이 최소인 경우는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=81) [[영어]](https://projecteuler.net/problem=81)

이 문제는 앞에서 풀었던 [문제 18](/2015/project-euler-018/)과 매우 비슷하다. 행렬을 시계 방향으로 45° 돌려놓고 생각하면 편하다. 문제 18에서는 삼각형 바닥부터 위로 올라가면서 계산하면 됐다. 여기서는 삼각형뿐 아니라 역삼각형도 고려해야 한다는 차이가 있을 뿐이다.
<!--more-->

{% asset_img matrix.png %}

데이터는 다음과 같이 로드할 수 있다.

```clojure
(ns p081
  (:require [util :refer [split parse-int]]))

(def ^:private m
  (->> (slurp "data/matrix.txt")
       (split  #"\r\n")
       (mapv (fn [line] (mapv parse-int (split #"," line ))))))
```

`clojure.string/split` 함수는 문자열을 첫 번째 인자로 받으므로 `->>` 매크로와 함께 사용할 수 없다. 여기서는 `->>` 매크로에서 쉽게 사용할 수 있도록 인자 순서를 바꾼 `split` 함수를 사용한다.

개념상 마름모의 맨 아래부터 숫자를 읽어 시퀀스를 만들어야 하지만 실제로는 사각형의 맨 아래 오른쪽부터 대각선 방향으로 숫자를 읽어 시퀀스를 만들어야 한다. 아래 함수는 행렬의 맨 아래 오른쪽부터 대각선 방향으로 원소의 인덱스를 생성한다. 이렇게 인덱스를 생성하면 나중에 `get-in`을 이용해 원하는 형태로 데이터를 읽을 수 있다.

```clojure
(defn- t [n]
  (concat (for [i (range n)]
            (for [j (range (inc i))]
              [(- n j 1) (+ (- n i 1) j)]))
          (for [i (range (dec n))]
            (for [j (range (- (dec n) i))]
              [(- (dec n) j i 1) j]))))
```

삼각형의 밑변부터 계산해 올라가는 로직은 문제 18과 동일하다. 다만 여기서는 경로 합이 최소가 되는 경우를 찾아야 하므로 `max` 대신 `min`을 사용하는 것이 다르다. 행렬의 처음 절반은 역삼각형의 꼭지점부터 위로 올라가며 계산해야 하는데 가만히 생각해보면 이 계산도 복잡하지 않다.

{% asset_img inverse.png %}

그림에서 마름모 부분은 삼각형의 밑변부터 계산해 올라가는 것과 동일하다. 마름모의 왼쪽과 오른쪽은 각 시퀀스의 맨 앞 숫자, 맨 나중 숫자를 더하면 된다.

```clojure
(defn- min-sum [xs ys]
  (if (< (count xs) (count ys))
    (concat [(+ (first xs) (first ys))]
            (min-sum xs (->> ys rest butlast))
            [(+ (last xs) (last ys))])
    (map min (map + xs ys) (map + (rest xs) ys))))
```

`xs`의 길이가 `ys`의 길이보다 작을 때는 역삼각형을 올라가며 계산하는 경우고, 그 반대인 경우는 삼각형의 밑변부터 계산해 올라가는 경우다.

이제 다음과 같이 문제를 풀 수 있다.

```clojure
(defn solve []
  (->> (t (count m))
       (map (fn [ks] (for [k ks] (get-in m k))))
       (reduce min-sum)
       first))
```

실행 결과는 다음과 같다. 충분히 빠르게 답을 구한다.

<pre class="console">
p081=> (time (solve))
"Elapsed time: 8.737974 msecs"
427??7
</pre>

문제를 이런 방식으로 풀 수 있는 것은 행렬의 너비와 높이가 같기 때문이다. 너비와 높이가 다르다면 다른 방법을 생각해야 한다.

## 참고
* [프로젝트 오일러 81 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p081.clj)
* [프로젝트 오일러 18](/2015/project-euler-018/)
