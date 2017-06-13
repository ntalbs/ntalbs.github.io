tags: [Java, 리팩터링]
date: 2015-08-21
title: if (cond == true) return true
---
회사에서 코드 리뷰를 할 때 다음과 같은 패턴의 코드가 자주 눈에 띈다.

```java
if (condition == true) {
  return true;
} else {
  return false;
}
```

<!--more-->
조금 줄여서 다음과 같이 쓰인 경우도 있다.

```java
if (condition == true) {
  return true;
}
return false;
```

이 장황한 코드는 다음과 같이 한 줄로 간단히 작성할 수 있다.

```java
return condition;
```

그런데 이렇게 단순하게 쓰는 법을 알려줬을 때의 반응이 놀랍다. 자신은 `if`문을 사용해 길게 늘여 쓴 것이 눈에 더 잘 들어온다는 것이다. 이렇게 말하는 개발자는 수련이 더 필요하다고 생각한다.

## `conditon == true`
먼저 `condition == true`를 살펴보자. 이미 `condition`이 불리언이라면 이 코드는 분명 불필요한 비교를 하고 있다. `true == true` 또는 `false == true`를 한 번 더 평가해야 하기 때문이다. 성능을 말하는 것이 아니라 가독성을 말하는 것이다. 다음 두 코드를 비교해 보자.

```java
if (condition) { ... }         // (1)
if (condition == true) { ...}  // (2)
```

(1)과 같이 작성한 경우는 "`condition`을 만족하면..."으로 코드를 읽을 수 있다. (2)의 경우는 "`condition`이 `true`라면..."으로 읽힌다. 여기서는 별 차이가 없는 것 같다. `condition`에 적절한 이름을 지어 주면 어떨까? 예를 들어 `isActivated`나 `hasSomeValue`과 같은 이름으로 되어 있는 경우를 생각해보자.

```java
if (isActivated) { ... }
if (hasSomeValue) { ... }
```

위 두 `if` 문은 "활성화 되었으면...", "어떤 값을 가지면..."과 같은 식으로 읽을 수 있다.

```java
if (isActivated == true) { ... }
if (hasSomeValue == true) { ... }
```

그러나 `== true`를 덧붙인 코드는 코드 길이만 길어진 게 아니라 읽을 때도 복잡하다. "`isActivated`가 `true`이면...", "`hasSomeValue`가 `true`이면..."과 같이 읽은 다음 "활성화 되었으면...", "어떤 값을 가지면..."으로 다시 해석해야 하기 때문이다. 따라서 ` == true`를 덧붙이지 않는 것이 코드도 짧을 뿐 아니라 읽기도 쉽다.

조건식이 복잡하다면 별도 함수로 작성하는 것도 생각할 수 있다. 그런 경우라면 `if(isActivated()) { ... }`, `if (hasSomeValue()) { ... }`이 될 것이다.

`isActivated == true`가 중복이 아니라고 생각되면 `(isActivated == true) == true`를 생각해보자. 이 코드도 중복이 아닌가? 지나친 억지인가?

## `return true;`
이제 `return true;`, `return false;`를 살펴보자. 앞에서 설명한 대로 `== true`를 덧붙이지 않기로 했다면 `if`문은 다음과 같이 작성할 수 있다.

```java
if (condition) {
  return true;
} else {
  return false;
}
```

`else`를 생략하고 다음과 같이 쓸 수도 있다.

```java
if (condition) {
  return true;
}
return false;
```

이 코드 또한 명백한 중복이다. `condition`이 `true`면 `true`를 리턴하고 `false`면 `false`를 리턴하라는 코드인데, 그럴 거면 그냥 `condition`을 리턴하면 되기 때문이다.

```java
return condition;
```

한 줄이면 되는 것을 복잡하게 여러 줄에 걸쳐 쓸 필요가 있을까? 복잡하게 써서 코드가 더 명확해 졌는가? 단순하고 명확한 코드가 좋은 코드다.

## 결론
글에서도 불필요한 낱말이나 표현이 붙어 있으면 글이 너저분해져 힘을 잃는다. 코드도 마찬가지다. 불필요한 코드는 프로그램를 이해하기 어렵게 만든다. 코드에 추가된 표현식이나 명령문 하나하나는 스스로 자신의 존재 가치를 증명해야 한다. 존재할 가치가 없는 코드는 삭제해야 한다.

## 참고
* [Make a big deal out of == true?](http://programmers.stackexchange.com/questions/12807/make-a-big-deal-out-of-true)
* [Why Use !boolean_variable Over boolean_variable == false](http://programmers.stackexchange.com/questions/136908/why-use-boolean-variable-over-boolean-variable-false)
* [Is it bad to explicitly compare against boolean constants e.g. if (b == false) in Java?](http://stackoverflow.com/questions/2661110/is-it-bad-to-explicitly-compare-against-boolean-constants-e-g-if-b-false-i)
* [CodingBat code practice > Java If and Boolean Logic](http://codingbat.com/doc/java-if-boolean-logic.html)
