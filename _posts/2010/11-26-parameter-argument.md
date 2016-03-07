date: 2010-11-26
tags: [용어]
title: parameter와 argument
---
일하다가 갑자기 "**parameter**와 **argument**가 어떻게 다를까? 각각의 정확한 뜻은 뭘까?" 하는 궁금증이 생겼다. parameter는 그냥 '파라미터' 또는 '매개변수'고 argument는 '인수' 또는 '인자'란 정도까지만 생각나고 정확한 뜻이나 구체적인 차이점 같은 것은 모르고 있다는 것을 깨달았다.
<!--more-->

Google에서 검색해보니 이걸 궁금해했던게 나만은 아니었다는 걸 알게 되었다. Stack Overflow에도 이에 대한 질문과 대답이 있다.

http://stackoverflow.com/questions/1788923/parameter-vs-argument

검색 결과를 살펴보고 링크를 따라가다보니 parameter와 argument의 차이점을 잘 설명한 페이지도 찾았다.

http://mindprod.com/jgloss/parameters.html
http://mindprod.com/jgloss/arguments.html

결론은, 많은 사람들이 parameter와 argument를 구분없이 사용하고 있지만 이 두 용어는 다르다는 것이다.

* **parameter**: 함수(또는 메서드)를 정의할 때 함수 선언부에 나오는 변수
* **argument**: 함수를 호출하는 곳에서 함수에 넘기는 값(또는 변수)

코드를 보면 이해가 쉬울 것 같다.

```java
...
public static int sum(int a, int b) {
  // a, b는 parameter로 함수 sum이 입력을 받는데 사용하는 변수다.
  return a + b;
}
...
int result1 = sum(10, 20);
// 10, 20은 argument로 함수로 전달되는 값이다.

int a = 10;
int b = 20;
int result2 = sum(a, b);
// 여기서 a, b도 argument다.
...
```
