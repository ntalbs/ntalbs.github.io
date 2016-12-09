tags: [알고리즘, Clojure]
date: 2015-07-14
title: 정수 자릿수 구하기
---
어떤 정수가 몇 자리 수인지 어떻게 판단할 수 있을까? 몇 가지 방법이 떠오른다. 사람에 따라 다르겠지만 내게 가장 먼저 떠오른 방법은 로그 함수를 사용하는 것이었다. 정수를 문자열로 바꾼 다음 문자열의 길이를 구하는 방법도 생각할 수 있다. 10으로 몇 번 나눌 수 있는지 확인하는 방법도 있다.<!--more-->

## 문자열로 변환해 길이 구하기
보통 이 방법을 가장 먼저 떠올리지 않을까 생각된다. 정수를 문자열로 바꾸는 것은 간단한 작업이고, 문자열의 길이를 구하는 것도 간단한 작업이다.

```clojure
(defn count-digits-str [n]
  (count (str n)))
```

## 10으로 나누어지는 횟수 구하기
주어진 숫자가 10으로 몇 번 나누어 지는지를 확인하는 방법도 있다.

```clojure
(defn count-digits-div [n]
  (loop [n n acc 1]
    (if (< n 10)
      acc
      (recur (quot n 10) (inc acc)))))
```

## 상용로그 사용
상용로그(밑이 10인 로그)를 사용해 자릿수를 구하는 것도 가능하다.

{% math %}
\begin{aligned}
(number\,of\,digits) = \lfloor\log_{10} n\rfloor + 1
\end{aligned}
{% endmath %}

따라서 코드는 다음과 같이 쓸 수 있다.

```clojure
(defn count-digits-log [n]
  (if (= n 0)
     1
     (inc (int (Math/log10 n)))))
```

$log_{10} 0 = -\infty$이므로 입력이 0인 경우에 대해서는 별도로 처리해야 한다.

## 무적의 if
숫가자 특정 범위 내에서만 주어진다면 `if`를 사용해 구현하는 것도 가능하다. Clojure에서는 `if` 대신 `cond`나 `condp`를 사용할 수 있다.

```clojure
(defn count-digits-if [n]
  (cond (< n 10) 1
        (< n 100) 2
        (< n 1000) 3
        (< n 10000) 4
        (< n 100000) 5
        (< n 1000000) 6
        (< n 10000000) 7
        (< n 100000000) 8
        (< n 1000000000) 9
        (< n 10000000000) 10
        :else (count (str n))))
```

11자리 이상의 숫자에 대해서는 문자열로 변환해 길이를 구하도록 했다. 다른 방법에 비해 길이는 길지만 코드는 직관적이라 할 수 있겠다.

## 참고
* [Is there a Scala-way to get the length of a number?](http://stackoverflow.com/questions/11922686/is-there-a-scala-way-to-get-the-length-of-a-number/11922854#11922854)
Scala로 정수 자릿수를 구하는 방법을 묻는 질문. 답변 중 위의 `if`를 사용한 것과 비슷한 방법이 있다.
