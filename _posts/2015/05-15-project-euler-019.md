tags: [project-euler, clojure]
date: 2015-05-15
title: 프로젝트 오일러 19
---
> 20세기에서, 매월 1일이 일요일인 경우는 몇 번?
> 문제 자세히 보기: [[국어]](http://euler.synap.co.kr/prob_detail.php?id=19) [[영어]](https://projecteuler.net/problem=19)

Java에서 제공하는 `Calendar`를 사용하면 쉽게 답을 구할 수 있다. 그러나 `Calender`는 가변객체(mutable object)인데다 클래스도 잘못 설계되어 있어 코드 모양이 어그러진다. Java 8부터는 거지 같은 `Calendar` 대신 `LocalDate`를 사용할 수 있다. `LocalDate`는 값 객체로 Clojure에서 사용해도 코드가 어그러지지 않는다. 조금 더 생각하면 라이브러리의 도움을 받지 않고도 풀 수 있다.<!--more-->

## 방법 1: Calendar 사용
`Calendar` 인스턴스를 얻은 다음 연도를 1901년부터 2000년까지, 달을 0(1월)부터 11(12월)까지 바꿔가면서 각 달의 1일이 일요일인 경우에만 `[year month 1]`을 만든다. 편의상 `[year month 1]`을 썼지만, 값을 확인하지 않고 `count`만 하므로 `1` 또는 `:x`와 같이 아무 값이나 넣어도 상관 없다. `(for ...)`를 실행한 결과 시퀀스를 `count` 하면 답을 구할 수 있다.

```clojure
(defn solve1 []
  (let [cal (Calendar/getInstance)]
    (count (for [year (range 1901 2001)
                 month (range 0 12)
                 :when (= Calendar/SUNDAY (do (. cal set year month 1)
                                              (. cal get Calendar/DAY_OF_WEEK)))]
             [year month 1]))))
```

`Calendar`는 가변객체이므로 하나의 인스턴스에 값을 계속 설정하면서 조건에 맞는 경우만 값이 나오도록 했다. 인터페이스가 유창하지(fluent) 않으므로 연-월-일을 설정한 다음 요일을 얻기 위해 `(do ...)`를 사용했다. 보기 좋은 코드는 아니다.

## 방법 2: LocalDate 사용
`LocalDate`는 Java 8에서 추가된 새로운 날짜/시간 관련 클래스다. 기존의 `Date`나 `Calendar`와 달리 값 객체이므로 인스턴스에 어떤 연산을 하면 새로운 객체가 리턴된다. 기본 로직은 `Calendar`를 사용했을 때와 동일하다. `Calendar`를 사용했을 때보다 훨씬 나아졌다.

```clojure
(defn solve2 []
  (let [base (LocalDate/of 1901 1 1)]
    (->> (map #(.plusMonths base %) (range))
         (take-while #(<= (.getYear %) 2000))
         (filter #(= (.getDayOfWeek %) DayOfWeek/SUNDAY))
         (count))))
```

## 방법 3: 날짜 더하기 직접 구현
`Calendar`나 `LocalDate`와 같은 날짜 라이브러리 클래스를 사용하면 문제 풀이가 너무 쉽다. 이런 클래스를 이용해 푸는 것은 출제자의 의도가 아닐 것이다. 라이브러리 도움 없이 문제를 풀어 보자.

가장 먼저 생각나는 방법은 1900년 1월 1일(월)부터 하루씩 더해가며 조건을 만족하는 날만 뽑아내 세는 것이다. 다만 달마다 날짜 수가 다르고 윤년도 고려해야 한다.

문제에 윤년의 조건은 다음과 같이 기술되어 있다.

> 윤년은 연도를 4로 나누어 떨어지는 해를 말한다. 하지만 400으로 나누어 떨어지지 않는 매 100년째는 윤년이 아니며, 400으로 나누어 떨어지면 윤년이다

따라서 어떤 해가 윤년인지 판단하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn- divisible? [x n] (zero? (mod x n)))

(defn- leap-year? [year]
  (if (divisible? year 100)
    (divisible? year 400)
    (divisible? year 4)))
```

그리고 어떤 달의 날짜 수를 리턴하는 함수는 다음과 같이 작성할 수 있다. 2월은 윤년인 경우는 29, 윤년이 아닌 경우는 28을 리턴해야 한다. 따라서 인자로 연도와 달을 전달해야 한다.

```clojure
(defn- days-in-month [year month]
  {:pre [(<= 1 month 12)]}
  (cond (#{1 3 5 7 8 10 12} month) 31
        (#{4 6 9 11} month) 30
        (leap-year? year) 29
        :else 28))
```

이제 주어진 날의 다음 날을 구하는 함수를 작성해보자. 날짜는 `vector`를 사용해 `[year month day-of-month day-of-week]`와 같은 형태로 표현하려 한다. 날짜가 해당 월의 마지막 날이면 다음 월로 바꾸고 날짜를 1일로 바꾼다. 마지막 달의 마지막 날(12월31일)이면 연도가 하나 증가하고 날짜는 1월 1일로 바꿔주면 된다. 요일(day-of-week)은 0부터 6까지의 숫자로 나타내며 0은 일요일, 1은 월요일, ..., 6은 토요일이다. 따라서 다음 날을 구하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn- next-date [[year month dm dw]]
  (let [last-day (days-in-month year month)
        next-dw (fn [dw] (mod (inc dw) 7))]
    (if (< dm last-day)
      [year month (inc dm) (next-dw dw)]
      (if (< month 12)
        [year (inc month) 1 (next-dw dw)]
        [(inc year) 1 1 (next-dw dw)]))))
```

이제 1900년 1월 1일부터 시작해 다음 날을 구해가면서 조건에 맞는 날만 세면 된다. 1900-01-01부터 시작하지만 1901년 1월 1일부터 2000년 12월 31일 사이의 기간 중 매월 1일이 일요일인 경우만 세면 된다.

```clojure
(defn solve3 []
  (->> (iterate next-date [1900 1 1 1])
       (drop-while (fn [[year _ _ _]] (<= year 1900)))
       (take-while (fn [[year _ _ _]] (<= year 2000)))
       (filter (fn [[_ _ dm dw]] (and (= 1 dm) (zero? dw))))
       (count)))
```

## 방법 4: 월 더하기 직접 구현
방법 3과 같이 해도 답을 잘 구한다. 100년이라 해봐야 대략 36,500일고 이 정도 루프는 1초도 안 걸린다. 다만 `Calendar`나 `LocalDate`를 사용했을 때는 한 달씩 더했는데 지금은 하루씩 더하는 것은 비효율적이라는 생각이 든다. 한 달씩 더하는 방식으로 개선해보자.

여기서는 항상 1일만 생각하면 된다. 현재 달 1일의 요일을 알 때 다음 달 1일의 요일을 구하려면 그냥 그 달 날짜 수를 더한 다음 7로 나눈 나머지를 구하면 된다. 따라서 현재 달 1일을 알 때 다음 달 1일을 구하는 함수는 다음과 같이 작성할 수 있다.

```clojure
(defn- next-month [[year month dm dw]]
  (let [dw (mod (+ dw (days-in-month year month)) 7)]
    (if (= month 12)
      [(inc year) 1 1 dw]
      [year (inc month) 1 dw])))
```

이 함수를 이용하면 문제를 다음과 같이 풀 수 있다. `next-date` 대신 `next-month`를 사용한 것만 빼면 `solve3`과 동일하다.

```clojure
(defn solve4 []
  (->> (iterate next-month [1900 1 1 1])
       (drop-while (fn [[year _ _ _]] (<= year 1900)))
       (take-while (fn [[year _ _ _]] (<= year 2000)))
       (filter (fn [[_ _ dm dw]] (and (= 1 dm) (zero? dw))))
       (count)))
```

## 결과
실행 결과는 다음과 같다.

<pre class="console">
user=> (do
  #_=>   (time (print "1: " (solve1) "\t"))
  #_=>   (time (print "2: " (solve2) "\t"))
  #_=>   (time (print "3: " (solve3) "\t"))
  #_=>   (time (print "4: " (solve4) "\t")))
1:  ??1     "Elapsed time: 1.614267 msecs"
2:  ??1     "Elapsed time: 7.282205 msecs"
3:  ??1     "Elapsed time: 24.905548 msecs"
4:  ??1     "Elapsed time: 0.741834 msecs"
</pre>

예상대로 `solve3`이 가장 느리다. `solve4`가 다른 방식에 비해 월등히 빠르다는 점이 놀랍다. `Calendar`나 `LocalDate`는 날짜 외의 다른 부가정보를 가지고 있어 정수 네 개만 담은 Clojure의 `vector`보다 무거워서 그런게 아닐까 추측해본다.

## 참고
* [프로젝트 오일러 문제 19 풀이 소스 코드](https://github.com/ntalbs/euler/blob/master/src/p019.clj)
* [What's wrong with Java Date & Time API?](http://stackoverflow.com/questions/1969442/whats-wrong-with-java-date-time-api) Java의 `Date`와 `Calendar` 클래스의 잘못된 점이 잘 정리되어 있다.