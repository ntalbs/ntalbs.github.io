date: 2014-04-08
tags: Clojure
title: Clojure에 대한 오해
---
Clojure는 LISP 방언으로 LISP이 가진 한계(?)를 그대로 가지고 있다. 여기서 한계란 언어 자체의 한계를 뜻하는 것이 아니라 LISP을 사용하지 않는 사람들의 선입견, 오해, 편견을 말하는 것이다. 알고나면 오해였다는 것을 깨닫겠지만 그 전에 이 선입견을 극복하기는 쉬워 보이지 않는다. 사람들이 LISP에 거부감을 느끼는 가장 큰 이유는 다음 두 가지가 아닐까 생각한다.
<!-- more -->

* 괄호, 괄호, 괄호
* 전위 표기법 (prefix notation)

## 괄호
괄호에 대해서는 억울한 면이 있다. 사람들은 코드 블록 뒤에 `))))`와 같이 괄호가 무더기로 붙어 있는 것을 보고 기겁을 하지만, 알고보면 중괄호(`{`와 `}`)를 사용하는 언어에 비해 괄호가 많은 것이 결코 아니기 때문이다. 간단히 코드를 비교해보면 알 수 있다. 다음은 절대값을 구하는 다음 함수를 Clojure와 Java로 구현한 것이다.

```clojure
(defn abs [x]
  (if (>= x 0) x (- x)))
```
Clojure 코드에는 모두 다섯 개의 괄호 쌍이 있다. 같은 함수를 Java로 구현해보자.

```java
public double abs(double x) {
  if (x >= 0) {
    return x;
  } else {
    return -x;
  }
}
```
Java 또한 (둥근)괄호, 중괄호를 모두 세면 다섯 개의 괄호 쌍을 사용한다. Java는 위와 같이 함수만 있을 수 없고 모든 코드를 클래스로 감싸야 하기 때문에 클래스 정의에 필요한 중괄호까지 포함시키면 괄고 개수가 하나 들어난다. 물론 Java에서 삼항연산자를 사용해 다음과 같이 간단하게 할 수도 있다.

```java
public static double abs(double x) {
  return (x >= 0) ? x : -x;
}
```
물론 이건 특별한 경우다. 조금 다른 경우를 생각해보자. 정수 `n`을 입력받아 1부터 n까지 합을 구하는 함수를 구현해보자. Clojure 구현은 다음과 같다.

```clojure
(defn sum-to [n]
  (apply + (range 1 n)))
```
대괄호까지 포함해 네 개의 괄호쌍이 사용되었다. 같은 함수를 Java로 구현하면 다음과 같다.

```java
public static int sumTo(int n) {
  int sum = 0;
  for (int i=1; i <= n; i++) {
    sum += i;
  }
  return sum;
}
```
여기서는 네 개의 괄호쌍이 사용되었다. 함수를 감쌀 클래스의 괄호까지 합하면 다섯 개가 될 것이다.

코드를 간단히 비교해보면 Clojure 코드에서 괄호가 무지막지하게 많은 것은 아님을 알 수 있다. 단지 LISP에서는 모든 것을 둥근 괄호로 감싸다 보니 괄호가 많아 보일 뿐이다. Clojure는 이런 부분을 어느 정도 보완했다. 둥근 괄호뿐 아니라 대괄호, 중괄호를 적절히 혼합해 다른 LISP 언어처럼 괄호만 많아 보이는 단점을 보완했고, 코드의 가독성도 높아졌다.

중괄호를 사용하는 언어도 조금 복잡한 프로그램의 경우 다음과 같은 식으로 끝나는 경우도 많다.

```java
        ...
      }
    }
  }
}
```
이걸 LISP 식으로 쓴다면 `}}}}`와 같이 될 것이다. 괄호가 많다는 것은 단지 선입견일 뿐이다. 실제로는 생각보다 많지 않다.

## 전위 표기법
어렸을때부터 수학을 배우며 중위 표기법을 사용했기 때문에 우리는 중위 표기법(infix notation)에 익숙하다. 따라서 `n * (n + 1) / 2`와 같은 식을 `(/ (* n (+ n 1)) 2)`와 같은 식으로 써야 한다면 마음이 매우 불편해진다. 괄호도 많아졌을 뿐 아니라 전위 표기법으로 인해 읽기도 매우 어려워졌다. 이것은 괄호 문제보다 더 심각하다.

그러나 처음의 불편한 마음을 극복하면 LISP 문법이 코드를 읽거나 쓸 때 인지적 부담을 얼마나 많이 줄여주는지를 알게 될 것이다. 생각해보자. 비트 연산자 `<<`와 `&`중 어느 것이 우선순위가 높을까? 이런 사소한 것까지 모두 기억하기는 어렵다. 그렇다고 이런 부분을 간과하는 것은 코드에 잠재적 오류를 작성하는 것과 같다. 결국은 정확한 우선순위를 알지 못해 매뉴얼을 찾아보거나 괄호로 수식을 감싸 우선순위를 명확히 한다. Clojure에는 연산자 우선순위 같은 걸로 고민하지 않아도 된다. 어차피 괄호로 감싸야 하니까.

이항 연산자(binary operator)의 경우에는 중위 표기법으로 쓰는 것이 익숙하지만 모든 코드가 이항 연산자로 되어 있는 것은 아니다. 함수를 호출하는 경우를 생각해보자. `Math.sin(x)`와 `(Math/sin x)`는 괄호 위치가 약간 다를 뿐이다. `add(x, y)`를 `(add x y)`로 쓰는 것도 마찬가지다. 수학에서 `a < b < c`로 표기하는 것을 Java에서는 `a < b && b < c`로 써야 한다. 그런데 `&&`가 `<`보다 우선순위가 낮은게 확실할까? 미심쩍다면 안전을 기해 `(a < b) && (b < c)`로 써야 할 것이다. Clojure에서는 `(< a b c)`로 쓰면 된다.

기본적으로 Clojure(또는 LISP)에 문법은 하나밖에 없다고 볼 수 있다. `(f a b c ...)`만 기억하면 된다. `f`는 함수(또는 매크로 또는 special form)고 `a`, `b`, `c`는 인자다. 모든 코드가 이 형식을 따른다. 다른 프로그래밍 언어처럼 `for`문, `if`문, `while`문, 함수 정의/호출 문법, 각 연산자 사용법 등을 따로 외울 필요가 없다. 거의 모든 경우가 `(f a b c ...)` 범주에 포함된다.

## 결론
* 괄호만 무지막지하게 많다는 것은 선입견 또는 오해다. 언듯 보기에 그럴 뿐 실제로는 그렇게 많지 않다. 다른 익숙한 언어와 비슷하거나 약간 많을 뿐이다.
* 전위 표기법은 처음에 불편하게 느껴질 것이다. 그러나 조금 자세히 살펴보면 이항 연산자 부분만 다른 언어와 다를뿐 함수를 호출하는 부분은 근본적 차이가 있는 것은 아니다. 처음을 불편함을 극복하면 새로운 세계가 열릴 것이다. 전위 표기법은 Clojure 문법을 단순하고 일관성있게 해주는 역할을 한다.

Clojure가 대중화 되기는 어려울 것으로 보인다. 대부분의 사람들은 기존의 익숙함 속에서 안주할 것이다. 위 설명이 논리적으로는 맞을 지 몰라도 어쨌든 LISP은 마음에 안 들어 할 것이다. **이미 거부하기로 결심한 사람의 마음을 돌리기란 쉽지 않다.**