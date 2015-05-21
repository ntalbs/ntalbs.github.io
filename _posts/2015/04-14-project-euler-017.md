tags: [project-euler, clojure]
date: 2015-04-14
title: 프로젝트 오일러 17
---
> 1부터 1000까지 영어로 썼을 때 사용된 글자의 개수는?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=17) [[영어]](https://projecteuler.net/problem=17)

별로 어려운 문제는 아니다. 다음과 같은 절차로 풀 수 있다.

1. 숫자를 입력하면 그 수에 대한 영어 문자열을 리턴하는 함수를 작성한 다음
2. 이 함수를 이용해 1~1000을 영어 문자열로 매핑
3. 문자열을 모두 연결해 문자열에서 공백과 하이픈('-')을 제거
4. 3에서 구한 문자열의 길이 계산

즉 주어진 숫자를 문자열로 바꾸는 함수를 구현하면 문제를 간단히 풀 수 있다.<!--more--> 먼저 다음과 같이 1~19까지 숫자를 영어로 표현한 벡터를 만든다. 1~19까지는 특이한 패턴이 없기 때문에 다 써줘야 한다.

```clojure
(def one2nineteen
  ["" "one" "two" "three" "four" "five" "six" "seven" "eight" "nine" "ten"
   "eleven" "twelve" "thirteen" "fourteen" "fifteen"
   "sixteen" "seventeen" "eighteen" "nineteen"])
```

숫자와 인덱스를 일치시키기 위해 맨 앞에 빈 문자열을 추가했다. 이제 20 이하의 수에 대해 다음 함수를 이용해 영어로 바꿀 수 있다.

```clojure
(defn s-under20 [n]
  {:pre [(<= 0 n)]}
  (one2nineteen n))
```

20 이상 100 미만의 수는 10의 자리 수와 1의 자리 수를 나누어 영어로 매핑할 수 있다.

```clojure
(def deca
  ["" "ten" "twenty" "thirty" "forty" "fifty" "sixty" "seventy" "eighty" "ninety"])

(defn s-under100 [n]
  (if (< n 20)
    (s-under20 n)
    (let [d1 (deca (quot n 10))
          d2 (s-under20 (mod n 10))]
      (format "%s %s" d1 d2))))
```

`deca` 벡터에서 앞 두 요소에 빈 문자열과 `"ten"` 역시 숫자와 인덱스를 맞추기 위한 것이다. 인자가 20보다 작으면 `s-under20`을 호출한다. 1의 자리 수를 영어로 매핑하는 데도 `s-under20`을 재활용했다.

100 이상 1000 미만의 수는 100의 자리 수와 나머지 자리 수로 나누어 생각할 수 있다. 100 이상의 수는 항상 "X hundred" 또는 "X hundred and Y"의 패턴으로 표현된다. 100의 자리 수인 X에 대해서는 앞에서 구현한 `s-under20`를, 나머지 자리 수에 대해서는 `s-under100`을 재활용할 수 있다.

```clojure
(defn s-under1000 [n]
  (if (< n 100)
    (s-under100 n)
    (let [d1 (s-under20 (quot n 100))
          last-two-digits (s-under100 (mod n 100))]
      (if (empty? last-two-digits)
        (format "%s hundred" d1)
        (format "%s hundred and %s" d1 last-two-digits)))))
```

문제의 범위가 1000까지이므로, 1000 이하의 숫자를 영어 문자열로 바꿔주는 `num2str`을 다음과 같이 구현한다.

```clojure
(defn num2str [n]
  (cond (< n 1000) (s-under1000 n)
        (= n 1000) "one thousand"
        :else nil))
```

구현이 단순하고 별도 로직이 없으므로 `num2str`을 `s-under1000`과 합칠 수도 있겠지만, 함수 이름과 숫자 범위의 일관성을 고려해 이렇게 남겨 두었다.

이제 다음과 같이 1부터 1000까지 숫자를 문자열로 변환해 공백을 제거한 다음 글자수를 세면 문제의 답을 구할 수 있다.

```clojure
(defn solve []
  (->> (range 1 (inc 1000))
       (map num2str)
       (apply str)
       (filter #(not= % \space))
       count))
```

실행 결과는 다음과 같다.

<pre class="console">
p017=> (time (solve))
"Elapsed time: 29.426658 msecs"
211??
</pre>

## 참고
* [프로젝트 오일러 문제 17 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p017.clj)
* [17번 다른 풀이](http://www.mathblog.dk/project-euler-17-letters-in-the-numbers-1-1000/) 컴퓨터를 사용하지 않고 문자열 패턴 분석과 간단한 계산으로 답을 구한다. 이 풀이를 보면 위와 같이 푼 것이 무식해 보인다.
