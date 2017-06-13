tags: [Java, 리팩터링]
date: 2017-05-01
title: 리팩터링
---
API Gateway를 수정하는 작업을 하다가 다음 메서드를 보았다. 주어진 문자열에서 괄호 짝이 맞는지 확인하는 함수로 파라미터가 포함된 URI를 검증할 때 사용되고 있었다.
<!--more-->

```java
public static boolean isBalancedOnCharacters(String testString, char left, char right) {
  Queue<Character> stack = Collections.asLifoQueue(new ArrayDeque<>());
  for (int i = 0; i < testString.length(); i++) {
    if (testString.charAt(i) == left)  {
      if (stack.size() > 0 || testString.charAt(i + 1) == right) {
        return false;
      }
      stack.add(left);
    } else if (testString.charAt(i) == right) {
      if (stack.size() == 0 || stack.remove() != left) {
        return false;
      }
    }
  }
  return stack.size() == 0;
}
```

예를 들어 `"https://api.gw.com/${stage}/${ver}"`와 같은 식으로 URL이 문자열로 주어졌을 때, 다음과 같이 `{`와 `}`가 짝이 맞는지 확인할 수 있다.

```java
isBalancedOnCharacters("https://api.gw.com/${stage}/${ver}", '{', '}');
```

코드를 읽어보면 URL 문자열은 다음 조건을 만족해야 함을 알 수 있다.
* `left` 문자와 `right` 문자 짝이 맞아야 한다.
* `left` 문자 후 바로 `right` 문자가 나오면 안 된다. 즉 `{}`와 같이 나오면 파라미터 이름이 없는 것이므로 유효한 URL이 아니다.
* 중첩될 수 없다. 즉 `${param${nested}}`와 같은 형식은 지원하지 않는다.

원래 구현에서는 스택을 사용하고 있는데 이런 간단한 작업에 굳이 스택이 필요할까 하는 생각이 들었다. `testString`을 스캔하면서 `left` 문자가 나오면 스택에 `left` 문자를 넣고 `right` 문자가 나오면 스택에 넣었던 문자를 꺼내고 있다. 스택에 넣는 문자는 항상 `left`이므로, 스택에서 꺼낸 문자가 `left`인지 비교하는 코드는 불필요하다.

불필요한 코드를 제거하고 스택 대신 카운터를 사용하도록 코드를 수정해봤다.

```java
private static boolean isBalanceOnCharacters(String testString, char left, char right) {
  int level = 0;
  for (int i=0, len = testString.length(); i < len; i++) {
    if (testString.charAt(i) == left) {
      level++;
      if (level > 1 || testString.charAt(i + 1) == right) break;
    }
    if (testString.charAt(i) == right) {
      level--;
      if (level < 0) break;
    }
  }
  return level == 0
}
```

위 코드에서 `level`이 카운터다. `testString`을 스캔하면서 `left` 문자가 나오면 카운터를 증가시키고 `right` 문자가 나오면 카운터를 감소시킨다. 즉, 스택에 문자럴 넣고 빼는 대신 카운터를 증가시키거나 감소시키고, 스택 크기를 검사하는 대신 카운터 값을 검사하면 된다.

코드 길이가 눈에 띄게 줄어들지는 않았지만, 메소드를 호출할 때마다 스택을 생성하지 않게 되었다. 스택을 생성하지 않는다고 해서 성능이 얼마나 개선될지는 모르겠다. 그러나 스택을 만들지 않고도 똑같은 로직으로 문제를 해결할 수 있는데 굳이 스택을 생성할 필요는 없지 않은가.
