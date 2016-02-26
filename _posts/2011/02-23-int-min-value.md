title: Integer.MIN_VALUE
date: 2011-02-23
tags: java

---

[Effective Java](http://www.amazon.com/Effective-Java-2nd-Joshua-Bloch/dp/0321356683)로 유명한 [Joshua Bloch](https://twitter.com/joshbloch)의 트윗에 재미있는 글이 올라왔다. 엥, 어떤 수에 -1을 곱했는데 자기 자신이 된다고? 곧장 테스트 프로그램을 만들어 돌려봤더니 정말 그렇다.

<!--more-->
{% asset_img 2011-02-23-1.png %}

확인을 해보니 예전에 학교에서 배웠던 게 생각이 났다. 정수형을 표현할 때 **2의 보수법**을 사용해 표현한다는 것! 정확한 내용이 생각나지 않아 잠시 인터넷에서 검색해보니 잘 설명된 자료(2의 보수 표기법)가 있다.

3비트 정수를 2의 보수법으로 표현했을 때 MIN_VALUE=100, -1=111이 될 것이다.

```
      -1 = 111
  x  MIN = 100
  ------------
         11100 --> 100 = MIN
```

따라서 MIN 값을 -1과 곱하면 다시 자기 자신이 되는 것이다. 실제 `Integer`나 `Long`도 자릿수만 더 많다뿐이지 원리는 동일하다. 따라서 `Integer.MIN_VALUE = -Integer.MIN_VALUE`다. 테스트해보지 않아도 알겠지만 `Long`도 마찬가지다

```java
Integer.MIN_VALUE == -Integer.MIN_VALUE
Integer.MIN_VALUE = Math.abs(Integer.MIN_VALUE)
Long.MIN_VALUE == -LONG.MIN_VALUE
```

조금 더 테스트해보면 `Integer.MIN_VALUE와 Integer.MAX_VALUE`와의 재미있는 관계도 알 수 있다. 이것도 생각을 쉽게 하기 위해 3비트 정수로 계산해보면...

```
     MAX = 011
  +    1 = 001
  ------------
           100 --> MIN
```

```
     MIN = 100
  +   -1 = 111
  ------------
          1011 --> 011 --> MAX
```

따라서...

```java
Integer.MAX_VALUE + 1 == Integer.MIN_VALUE
Integer.MAX_VALUE == Integer.MIN_VALUE - 1
```

`Long`도 마찬가지다. 프로그램을 작성하면서 `Integer.MIN_VALUE`나 `Integer.MAX_VALUE`를 쓸 일이 없어 미처 깨닫지 못했었는데, 재미있는 사실을 알게 되었다.
