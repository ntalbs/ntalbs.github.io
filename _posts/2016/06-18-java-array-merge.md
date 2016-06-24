tags: [Java]
date: 2016-06-18
title: Java에서 배열 합치기
---
옆 자리 동료가 Java에서 배열을 합치는 간단한 방법이 있는지 질문했다. 열 개 정도의 배열을 하나로 합치고 싶다는 것이었다. 당장 떠오른 방법은 `System.arraycopy`를 사용하는 것이었지만 이걸 몰라서 물어보지는 않았을 것이다. `System.arraycopy`를 사용하면 효율적이긴 하겠지만 코드는 별로 예쁘지 않을 것이다. 혹시 이미 이 기능을 구현한 라이브러리가 있나 확인했지만 찾을 수 없었다.
<!--more-->

간단하지만 재미있는 문제 같아 Java에서 배열을 병합하는 함수를 작성해보기로 했다.

```java
public static <T> T[] merge1(T[]... arrays) {
  int length = Arrays.stream(arrays).mapToInt(a -> a.length).sum();

  T[] merged = (T[]) Array.newInstance(
    arrays[0].getClass().getComponentType(),
    length
  );
  int destPos = 0;
  for (T[] arr : arrays) {
    System.arraycopy(arr, 0, merged, destPos, arr.length);
    destPos += arr.length;
  }
  return merged;
}
```

이렇게 함수를 만들어 놓으면 다음과 같은 식으로 배열을 쉽게 합칠 수 있다.

```java
  String[] merged = merge1(arr1, arr2, arr3);
```

구현이 복잡하지는 않지만 아름답지도 않다. `for` 루프를 돌면서 `System.arraycopy`를 호출하는 것도 마음에 들지 않고, 리플렉션을 사용해야 하는 것도 마음데 들지 않는다.

좀더 아름다운 방법이 없을까 해서 인터넷을 찾다가 좋은 방법을 알게 되었다. 배열을 스트림으로 바꾼 다음 `flatMap`을 적용해 합치는 방법이다.

```java
public static <T> T[] merge2(T[]... arrays) {
  return (T[]) Stream.of(arrays).flatMap(a -> Stream.of(a)).toArray();
}
```

내가 좋아하는 Clojure 코드만큼 아름답지는 않지만, 처음에 작성한 `System.arraycopy`를 사용한 방법보다는 훨씬 아름답다. Java로 이정도 했다면 선방한 셈이다.

단점은 느리다는 것이다. 간단히 테스트해보니 스트림 API를 사용한 `merge2`는 `System.arraycopy`를 사용한 `merge1`에 비해 5~10배 정도 느린 것 같다. 아름다운 코드의 대가 치고는 너무 큰 것 같다.

## 참고
* [Concat Streams in Java 8](http://www.programcreek.com/2014/01/concat-streams-in-java-8/)
