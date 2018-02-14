tags: Java
date: 2015-02-02
title: Java REPL
---
코드를 작성하다 보면 작은 코드 조각을 간단히 테스트해보고 싶을 때가 자주 생긴다. 간단한 계산이 필요할 수도 있고 특정 함수를 호출했을 때의 결과를 확인하고 싶을 수도 있다. 코드가 어떻게 동작하는지 간단히 확인해보고 싶을 수도 있다.<!--more--> REPL이 있다면 이런 궁금한 점을 즉시 확인할 수 있다. 그냥 REPL에서 코드를 입력하고 결과를 확인하면 된다. Clojure나 Scala는 REPL을 제공한다. Ruby나 Python 같은 언어도 REPL을 제공한다. JavaScript도 브라우저 콘솔이나 node.js를 REPL로 사용할 수 있다.

처음부터 REPL을 중요하게 생각했던 것은 아니다. 예전에는 'Eclipse에서 다 되는데 REPL이 왜 필요하다는 거지?' 하고 의아해했다. 그러나 Scala나 Clojure를 공부하면서 REPL에 익숙해지고 나니 REPL이 없는 Java가 너무 불편하게 느껴졌다. 간단한 아이디어가 맞는지 확인하기 위해 별도로 클래스를 만들어 테스트 코드를 작성하고 결과를 확인하기 위해 `System.out.println(...)`을 추가한 다음 컴파일하고 실행해야 했다. 객체나 배열, 컬렉션 안을 보려면 이를 출력하는 로직을 따로 작성해야 할 수도 있다. 이렇게 복잡한 작업을 거쳐야 비로소 결과를 확인할 수 있었다. 한동안 테스트 코드와 씨름하다 보면 원래 뭘 하려 했었는지 까먹을 수도 있다.

그동안 Java에서 작업할 때 REPL이 없어 답답했는데, 최근 우연히 Java REPL이 있다는 사실을 알게 되었다. 콘솔에서 `brew search java`를 실행했더니 나열된 목록에 `javarepl`이 보였다. 어, 이게 뭐지? 바로 설치해 테스트를 조금 해봤다.

<pre class="console">
$ javarepl
Welcome to JavaREPL version 272 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_25)
Type expression to evaluate, <span style="color:#00cc00">:help</span> for more options or press <span style="color:#00cc00">tab</span> to auto-complete.
java> import java.util.stream.*
<span style="color:#00cc00">Imported java.util.stream.*</span>
java> String s = "apple, orange, banana, strawberry"
<span style="color:#00cc00">java.lang.String s = "apple, orange, banana, strawberry"</span>
java> s.split(",")
<span style="color:#00cc00">java.lang.String[] res1 = ["apple", " orange", " banana", " strawberry"]</span>
java> Arrays.stream(res1).map(s->s.trim()).collect(Collectors.toList())
<span style="color:#00cc00">java.util.ArrayList res2 = [apple, orange, banana, strawberry]</span>
java> List&lt;String> fruits = res2
<span style="color:#00cc00">java.util.List<java.lang.String> fruits = [apple, orange, banana, strawberry]</span>
java> fruits.stream().map(x->x.length()).collect(Collectors.toList())
<span style="color:#00cc00">java.util.ArrayList res3 = [5, 6, 6, 10]</span>
</pre>

Java는 코드가 장황해 콘솔에서 긴 코드를 입력해 테스트하는 것이 쉽지는 않지만, 그래도 REPL이 없는 것보다는 낫다고 할 수 있겠다.

## 참고
* [Java REPL](http://www.javarepl.com/)

## 업데이트
* Java 9부터는 JDK에 포함되어 있는 JShell을 사용하면 된다.
