tags: [project-euler, clojure]
date: 2015-06-20
title: 프로젝트 오일러 22
---
> 영문 이름 점수 합계 구하기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=22) [[영어]](https://projecteuler.net/problem=22)

수학적 사고나 특별한 기교가 필요한 문제는 아니다. 그냥 문제에서 설명한 대로 처리하면 답을 얻을 수 있다. `names.txt` 파일을 열어보면 다음과 같이 이름이 따옴표로 묶여 있고 각 이름 사이에는 쉼표가 있다.<!--more-->

```
"MARY","PATRICIA","LINDA","BARBARA","ELIZABETH",...
```

먼저 파일을 읽어 불필요한 문자(따옴표, 쉼표)를 제거한 이름 목록을 만들고 이후 문제가 요구한 대로 계산하면 된다. Clojure에서는 `slurp` 함수를 사용하면 텍스트 파일을 쉽게 읽을 수 있다.

```clojure
(ns p022
  (:require [clojure.string :as str]))

(def names
  (-> (slurp "data/names.txt") ; 파일 읽기
      (str/replace "\"" "")    ; 따옴표 제거
      (str/split #",")         ; 쉼표로 분리
      sort))                   ; 정렬
```

(1)파일을 읽어서 (2)따옴표를 모두 제거하고 (3)쉼표로 분리한 다음 (4)정렬하면 문제를 풀기 위한 준비가 끝난다.

각 이름의 점수를 계산하는 함수가 있으면 문제를 푸는 데 도움이 될 것이다. 점수를 계산하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn score [name]
  (apply + (map (fn [a] (- (int a) (dec (int \A)))) name)))
```

주어진 알파벳을 정수로 바꾸면 코드 값이 나온다. `\A`를 정수로 바꾸면 65가 나오는데, 각 알파벳에서 64를 빼주면 A는 1, B는 2, ... Z는 26이 된다. 이렇게 나온 숫자를 모두 더하면 점수가 된다.

이제 각 이름의 점수에 순번을 곱해야 한다. `map-indexed`를 사용하면 매핑할 때 순번도 알 수 있다. `map-indexed`의 첫 번째 인자로 전달할 함수는 인덱스와 아이템 두 개의 인자를 받는 함수여야 한다. 인덱스는 0부터 시작하므로 순번은 인덱스에 1을 더해야 한다.

```clojure
(defn solve []
  (->> (map-indexed vector names)
       (map (fn [[i e]] (* (inc i) (score e))))
       (apply +)))
```

실행 결과는 다음과 같다.

<pre class="console">p022> (time (solve))
"Elapsed time: 17.689125 msecs"
8711982??
</pre>

## 참고
* [프로젝트 오일러 22 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p022.clj)
