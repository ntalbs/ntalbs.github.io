tags: [clojure]
date: 2015-06-11
title: if, cond, condp, case
---
흔히 접하는 프로그래밍 언어에는 `if`~`else if`가 연달아 나온다고 해서 코드 모양이 이상해지지는 않는다. 다음 Java 코드와 같이 그냥 순서대로 쓰면 되고 코드를 읽는 것도 어렵지 않다.<!--more-->

```java
if (a == 1) {
  return f1();
} else if (a == 2) {
  return f2();
} else if (a == 3) {
  return f3();
} else {
  return fx();
}
```

그런데 LISP 계열 언어에서는 `if`를 이런 식으로 쓸 수 없다. `(if test then else?)` 형태로 만들어야 하는데 여기에 `if`를 추가하려면 `then`이나 `else?`에 `if` 폼을 넣어야 하기 때문에 괄호가 중첩되어 보기 흉한 코드가 된다.

```clojure
(if (= a 1)
  (f1)
  (if (= a 2)
    (f2)
    (if (= a 3)
      (f3)
      (f4))))
```

다행히 `cond`를 사용하면 위 코드를 다음과 같이 바꿀 수 있다. `cond`는 매크로다. 확장하면 위 `if`로 작성한 것과 동일한 코드가 된다.

```clojure
(cond (= a 1) (f1)
      (= a 2) (f2)
      (= a 3) (f3)
      :else   (fx))
```

코드를 보면 `(= a ?)` 패턴이 반복된다. `condp`를 이용하면 이런 반복도 제거할 수 있다. `condp` 역시 매크로로 확장하면 위 `if`로 작성한 것과 동일한 코드가 나온다.

```clojure
(condp = a
  1 (f1)
  2 (f2)
  3 (f3)
  (fx))
```

predicate이 `=`이라면 다음과 같이 `case`를 사용할 수도 있다. `case`도 매크로이긴 하지만 확장했을 때의 모양이 `cond`나 `condp`와는 다르다. 그러나 실행 결과는 동일하다.

```clojure
(case a
  1 (f1)
  2 (f2)
  3 (f3)
  (fx))
```

처음에 나온 Java 코드와 비교해보기 바란다. 얼마나 간결한가! Java도 `switch~case`를 사용하면 코드를 좀더 간결하게 만들 수 있긴 하다.

```java
switch (a) {
  case 1: return f1();
  case 2: return f2();
  case 3: return f3();
  default: return fx();
}
```

그러나 Clojure의 간결함과는 비교가 되지 않는다.
