tags: [project-euler, clojure]
date: 2015-10-27
title: 프로젝트 오일러 42
---
> 주어진 텍스트 파일에 들어있는 '삼각단어'의 개수는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=42) [[영어]](https://projecteuler.net/problem=42)

쉬운 문제다. 파일에 들어있는 단어 목록에서 단어값이 삼각수인 삼각단어의 수를 세기만 하면 된다.
<!--more-->

$n$번째 삼각수를 구하는 함수는 다음과 같이 작성할 수 있다. Clojure는 전위표기법을 써야 하기 때문에 수식을 작성할 때는 조금 불편한다. 그러나 $t(n) = n(n+1)/2$ 정도의 단순한 수식이라면 `->` 매크로를 써서 조금 알아보기 쉽게 표현할 수 있다.

```clojure
(defn- t [n]
  (-> (+ n 1) (* n) (/ 2)))
```

삼각수의 목록을 구해 `set`에 넣어두면 문제를 풀 때 어떤 수가 삼각수인지를 빠르게 판단할 수 있다.

```clojure
(def t-set
  (set (map t (range 1 100))))
```

이 `set`을 이용하면 어떤 수가 삼각수인지 판단하는 함수를 다음과 같이 작성할 수 있다.

```clojure
(defn- triangle-number? [n]
  (contains? t-set n))
```

단어값을 구하는 함수도 필요하다. 단어는 모두 대문자로 되어 있고, `(int \A)`의 값은 `65`이므로 알파벳 코드 값에서 `64`를 빼면 각 알파벳에 해당하는 순서를 구할 수 있다.

```clojure
(defn- word-value [word]
  (->> word
       (map #(- (int %) 64))
       (apply +)))
```

이제 파일을 읽어 단어 목록을 만들 차례다. 별로 크지 않은 텍스트 파일이르모 `slurp`으로 읽어들인 다음 정규표현식으로 `split` 하면 쉽게 단어 목록을 만들 수 있다.

```clojure
(clojure.string/split (slurp "data/words.txt") #"\"(,\")?")
```

답을 구할 준비가 끝났다. 단어를 읽어 단어값으로 `map`한 다음 단어값이 삼각수인 것만 `filter` 해서 개수를 `count` 하면 된다.

```clojure
(defn solve []
  (->> (clojure.string/split (slurp "data/words.txt") #"\"(,\")?")
       (map word-value)
       (filter triangle-number?)
       count))
```

실행 결과는 다음과 같다.

<pre class="console">
p042=> (time (solve))
"Elapsed time: 5.036627 msecs"
1?2
</pre>

## 참고
* [프로젝트 오일러 42 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p042.clj)
