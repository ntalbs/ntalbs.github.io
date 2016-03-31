tags: [Project-Euler, Clojure]
date: 2016-03-22
title: 프로젝트 오일러 59
---
> XOR 방식으로 암호화된 메시지 깨기
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=59) [[영어]](https://projecteuler.net/problem=59)

암호화 키가 영어 소문자 세 개로 되어 있으므로, `aaa`부터 `zzz`까지 모두 시도해본다 해도 경우의 수는 $26^3=17,576$밖에 되지 않는다. 이 정도면 무차별 대입법으로 공략해도 충분할 것 같다.
<!--more-->

문제를 풀기 전에 암호화된 메시지가 들어있는 파일을 읽어 정수의 ASCII 코드의 시퀀스로 만들어 둔다.

```clojure
(ns p059
  (:require [util :refer [parse-int]]
            [clojure.string :refer [split trim]]))

(def encrypted-message
  (->> (split (slurp "data/cipher1.txt") #",")
       (map trim)
       (map parse-int)))
```

암호화된 메시지를 복호화하는 함수는 다음과 같이 작성할 수 있다. 암호화된 메시지에 비밀키를 반복적으로 돌아가며 적용해야 하는데, `repeat` 함수를 이용해 비밀키가 반복되는 시퀀스를 만들고 이것을 메시지와 `XOR` 하면 복호화된 메세지를 얻을 수 있다.

```clojure
(defn decipher [encrypted key]
  (let [key (mapcat identity (repeat key))]
    (->> (map bit-xor encrypted key)
         (map char)
         (apply str))))
```

이제 `aaa`부터 `zzz`까지 모든 키 조합을 입력해가며 복호화를 시도할 차례다. Clojure에서는 `a`부터 `z`까지 시퀀스를 만들 때 다음과 같이 할 수 있다. 물론 이렇게 나온 결과는 `a`부터 `z`까지 ASCII 코드 값의 시퀀스다. 어차피 `XOR` 해야 하므로 `char`로 바꿀 필요는 없다. 정말 `a`부터 `z`까지 `char`의 시퀀스가 필요하다면 `(map char ...)`를 적용해야 한다.

```clojure
(range (int \a) (inc (int \z)))
```

`for`를 이용해 `aaa`부터 `zzz`까지 키를 생성해 복호화를 시도하다가 성공하면 멈출 수 있다. 그런데 복호화에 성공했다는 것을 어떻게 알 수 있을까? 여기서는 복호화한 메시지에 정규표현식을 적용해 컨트롤 문자나 `` `, `~`가 나오지 않는 경우를 걸러내게 했다.

```clojure
(defn solve []
  (let [a2z (range (int \a) (inc (int \z)))]
    (->> (for [a a2z b a2z c a2z] [a b c])
         (map #(decipher encrypted-message %))
         (filter #(re-matches #"[^`~\p{Cntrl}]+" %))
         (first)
         (map int)
         (apply +)))
```

컨트롤 문자는 그렇다 치겠지만 `` `, `~`만 걸러내면 된다는 것은 어떻게 알았을까? 사실 이건 복호화한 메시지를 확인하면서 알아낸 것이다.

메시지 언어가 영어라는 점에 착안해 영어 문장에 흔하게 포함되는 단어인 `the`나 `and`가 있는지 확인하는 방법을 사용하는 것도 가능하다. 위 코드에서 `filter`를 적용하는 부분을 다음과 같이 수정해도 답을 찾는다. `the`나 `and` 앞뒤로 공백이 있는 것에 유의해야 한다.

```clojure
(defn solve []
  (let ...
    (->> ...
         (filter #(< -1 (.indexOf % " the ")))
         ;; " the " 대신 " and "를 사용해도 된다.
         ...
```

실행 결과는 다음과 같다.

<pre class="console">
p059=> (time (solve))
"Elapsed time: 1444.532458 msecs"
10??59
</pre>

## 참고
* [프로젝트 오일러 59 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p059.clj)
* [Generate character sequence from 'a' to 'z' in clojure](http://stackoverflow.com/questions/11670941/generate-character-sequence-from-a-to-z-in-clojure)
Clojure에서 `a`~`z` 시퀀스를 만드는 방법에 대한 질문. Clojure에도 Scala의 `('a' to 'z')`와 같은 우아한 방법이 없을까 질문 했는데, 없었다.
