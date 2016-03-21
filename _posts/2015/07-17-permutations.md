tags: [알고리즘, Clojure]
date: 2015-07-17
title: 순열 구하기
---
[프로젝트 오일러 24번](/2015/project-euler-024/)은 `clojure.math.combinatorics`에 있는 `nth-permutation`을 이용해 문제를 너무 쉽게 풀었다. 그런데 순열을 직접 구하려면 어떻게 해야 할까?<!--more-->

## 알고리즘
한참 동안 고민한 끝에 다음과 같은 알고리즘을 생각해냈다.

1. 요소가 한 개 뿐일 때는 순열도 하나 뿐이다.
   `[1]` &#8594; `[1]`
2. 요소가 두 개일 때는 두 개의 순열이 생긴다.
   `[1 2]` &#8594; `([1 2] [2 1])`
3. 요소가 세 개일 때: 첫 번째 요소를 꺼내면 남는 요소가 두 개가 된다. 선택한 요소를 맨 앞에 두고 나머지 두 요소의 순열을 구해 선택한 요소 뒤에 연결한다. 두 번째 요소, 세 번째 요소를 선택해 같은 작업을 반복한다.
4. 요소가 $n$개일 때: 요소 하나를 꺼내면 남는 요소가 $(n-1)$개가 된다. 선택한 요소를 맨 앞에 두고 나머지 $(n-1)$개 요소의 순열을 구해 선택한 요소 뒤에 연결한다. 나머지 요소에 대해 같은 작업을 반복한다.

3, 4에 대해서는 예를 들어 설명하는 것이 좋겠다. `[1, 2, 3]`의 순열을 구하는 경우는 `[1]` + `[2 3]`과 같이 나눈 다음 `[2 3]`에 대한 순열을 구해 `[1]`과 합친다. `[2 3]`에 대한 순열은 단계 2에서 설명한 것과 같이 `([2 3] [3 2])`두 가지가 나온다. 따라서 `[2 3]`의 각 순열에 `[1]`을 합치면 `([1 2 3] [1 3 2])`가 된다. 나머지 요소 2, 3에 대해서도 같은 작업을 할 수 있다. 2에 대해서는 `([2 1 3] [2 3 1])`이 나오고 3에 대해서는 `([3 1 2] [3 2 1])`이 나온다. 이 결과를 모두 합치면 `([1 2 3] [1 3 2] [2 1 3] [2 3 1] [3 1 2] [3 2 1])`이 될 것이다.

요소가 네 개라면 각 요소를 하나씩 선택하고 나머지 세 요소에 대한 순열을 구한 다음 앞에 선택했던 요소 뒤에 붙여주면 된다. 예를 들어 `[1 2 3 4]`에 대한 순열을 구하려면 `[1] + 순열[2 3 4]`, `[2] + 순열[1 3 4]`, `[3] + 순열[1 2 4]`, `[4] + 순열 [1 2 3]`을 구해 합치면 된다.

## 구현
위에서 설명한 로직은 Clojure로 다음과 같이 구현할 수 있다. 먼저 인자로 리스트를 받는다고 가정하면, 주어진 리스트에서 요소를 하나씩 뽑아 맨 앞으로 재배치한 결과의 목록을 리턴하는 함수가 필요하다. 이 함수는 다음과 같이 작성할 수 있다. 함수 이름이 마음에 들지 않지만 더 좋은 이름을 생각해내지 못했다.

```clojure
(defn- picks [coll]
  (for [i (range (count coll))]
    (let [f (take i coll) b (drop i coll)]
      (concat (take 1 b) f (rest b)))))
```

이 함수에 `[1 2 3]`을 전달하면 `((1 2 3) (2 1 3) (3 1 2))`를 리턴할 것이다.

이제 순열을 구하는 함수를 작성할 차례다. 인자로 주어진 리스트의 길이가 1 또는 2인 경우는 바로 순열을 구할 수 있다. 3 이상인 경우는 리스트 길이를 줄여가며 재귀 호출하게 된다. 재귀 호출을 하면서 리턴하는 리스트가 중첩되지 않도록 하기 위해 인자를 둘로 나누었다. `front`는 구한 순열(리스트)을, `back`은 순열을 구할 리스트를 나타낸다.

```clojure
(defn- perms [front back]
  (condp = (count back)
    1 (list back)
    2 (list (concat front back)
            (concat front (reverse back)))
    (mapcat
     (fn [ps]
       (perms (concat front (take 1 ps)) (rest ps)))
     (picks back))))
```

순열을 구하는 함수 `permutations`는 다음과 같이 작성할 수 있다. 핵심 로직은 위에서 구현한 `picks`와 `perms`에 있고 `permutations`는 외부에서 사용하기 위한 인터페이스일 뿐이다. `perms`를 호출할 때 `front`의 값으로 빈 벡터를 전달한다.

```clojure
(defn permutations [xs]
  (perms [] xs))
```

기능 하나가 여러 함수로 되어 있으면 보기 좋지 않으므로 `picks`와 `perms`를 다음과 같이 내부 함수로 만들면 코드가 깔끔해진다.

```clojure
(defn permutations [xs]
  (letfn [(picks [coll]
            (for [i (range (count coll))]
              (let [f (take i coll) b (drop i coll)]
                (concat (take 1 b) f (rest b)))))
          (perms [front back]
            (condp = (count back)
              1 (list back)
              2 (list (concat front back)
                      (concat front (reverse back)))
              (mapcat
               (fn [ps]
                 (perms (concat front (take 1 ps)) (rest ps)))
               (picks back))))]
    (perms [] xs)))
```

## 정리
여기서 구현한 함수는 `clojure.math.combinatorics`에서 제공하는 `permutations`(이하 `c/permutations`)에 비교해 다음과 같은 점에 있어 매우 초보적인 구현이다.

* **게으르지 않다.** 예를 들어 `[1 2 3 ... 10]`과 같이 제법 긴 리스트의 순열 중 앞 열 개를 구하는 경우 `c/permutations`는 매우 빠르게 결과를 리턴한다. 여기서 구현한 함수는 먼저 모든 순열을 구한 다음 그 중 열 개를 리턴하게 되어있어 매우 느리다.
* **요소의 중복을 고려하지 않았다.** 성능을 고려하지 않는다면 그냥 `set`에 넣어 중복을 제거하는 방법을 생각할 수도 있겠다.

여기서 구현한 `permutations` 함수를 이용하면 해답을 구하는 데 매우 오래 걸린다. 그저 이런 식으로 순열을 구할 수 있다는 것을 확인한 정도에 만족해야 할 것 같다.

나중에 알고 보니 이 로직은 [Steinhaus–Johnson–Trotter 알고리즘](https://en.wikipedia.org/wiki/Steinhaus–Johnson–Trotter_algorithm)와 비슷한 것 같다. 그러나 페이지 중간 쯤에 '순열을 재귀로 구현하는 것도 가능하지만, **실제 Steinhaus–Johnson–Trotter 알고리즘은 재귀를 사용하지 않고 반복적인 방법으로 순열을 구한다**'는 설명이 나온다.

나중에 시간 날 때 Steinhaus–Johnson–Trotter 알고리즘으로 제대로 구현해봐야 겠다.

## 참고
* [Steinhaus–Johnson–Trotter 알고리즘](https://en.wikipedia.org/wiki/Steinhaus–Johnson–Trotter_algorithm)
