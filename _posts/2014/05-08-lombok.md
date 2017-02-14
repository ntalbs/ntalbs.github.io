date: 2014-05-08
tags: Java
title: Project Lombok
---
Java로 프로그램을 작성할 때 [Lombok](http://projectlombok.org/)을 이용하면 보일러플레이트 코드를 줄여 코드를 깔끔하게 유지할 수 있다. 사용하기도 편하고 IDE와도 잘 통합되기 때문에(안타깝게 IntelliJ와는 궁합이 안 맞는듯 하다. 하지만 난 Eclipse를 사용하니까...) 널리 사용될 줄 알았는데 의외로 모르는 개발자가 많은 것 같다.
<!--more-->

Lombok 어노테이션을 붙이면 컴파일을 하면서 보일러플레이트 코드를 자동으로 생성해준다. 기본적인 `getter/setter`뿐 아니라 `toString()`, `equals()`, `hashCode()` 메서드도 어노테이션으로 생성할 수 있다.

Eclipse와 같은 IDE에서도 보일러플레이트 코드를 생성하는 기능을 제공한다. 필드를 선택해 getter/setter를 생성할 수도 있고, `equals()`, `hashCode()` 메서드를 생성할 수도 있다. 그렇다면 굳이 lombok을 사용해야 하는 이유는 무엇일까? 코드가 짧고 깔끔해진다는 점도 있지만, **가장 중요한 것은 소스 코드 관리 부담이 줄어든다는 점이 아닐까 싶다.**

예를 들어, Eclipse에서도 `Generate Getters and Setters` 기능을 이용하면 getter/setter 코드를 생성할 수 있다. 그러나 생성된 코드를 관리하는 책임은 개발자에게 돌아온다. 나중에 클래스에 필드가 추가되면 getter/setter를 또 생성해야 한다. 필드가 삭제되면 getter/setter로 직접 삭제해야 한다. `equals()`, `hashCode()`도 마찬가지다. **필드가 추가 또는 삭제된 경우, 직접 코드를 편집하든 아니면 IDE의 기능을 활용해 재생성하든, 코드를 수정해줘야 한다.** Lombok을 사용했다면 필드만 추가/삭제하면 된다.

IntelliJ를 쓰던 팀원에게 불평을 듣긴 했지만, 내가 애용했던(?) `val`도 유용하다. `val`을 이용하면 Scala에서 `val`을 쓰는 것과 비슷하게 변수(아니 상수)를 정의할 수 있다. Java에서 변수를 선언할 때 똑같은 타입을 반복적으로 써야 하는데, `val`을 사용하면 코드를 깔끔하게 할 수 있다.

```java
// vanila java
final List<String> list = new ArrayList<String>();

// with lombok
val list = new ArrayList<String>();
```

Project Lombok에 대해서는 논란이 있는 듯하다. 어노테이션을 이런 식으로 사용해선 안된다, Lombok의 구현이 non-public API를 사용했기 때문에 향후 JDK 새 버전이나 IDE에서 제대로 동작하지 않을 수 있다 등등. 나는 Lombok의 기능이 JDK에 흡수되어야 하는 게 아닌가 하는 생각이 든다. 그렇게 한다면 논란도 잠재우고, Java도 한단계 더 발전하게 된다.

Lombok과 관련해 다음 글을 읽으면 도움이 될 것 같다.

* [Lombok features](http://projectlombok.org/features/index.html)
여기서 Lombok의 기본 기능을 살펴볼 수 있다
* [Reducing Boilerplate Code with Project Lombok](http://jnb.ociweb.com/jnb/jnbJan2010.html#controversy)
튜토리얼이라 할 수 있다. 소개, 설치, 활용방법 등이 설명되어 있다
* [How to Write an Equality Method in Java](http://www.artima.com/lejava/articles/equality.html)
이건 Lombok에 대한 글은 아니지만 읽어두면 도움이 될 듯
* [Lombok을 사용하여 Java 소스의 가독성을 높이고 코딩량도 줄이자](http://kwon37xi.egloos.com/4710018)
Lombok을 소개한 권남님의 블로그
* http://kwonnam.pe.kr/wiki/java/lombok
권남님의 Lombok 위키 페이지
