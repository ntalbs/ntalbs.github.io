tags: [Java]
date: 2017-09-28
title: HttpClient 테스트
---
Java 9에는 모듈 시스템, 링킹, JShell 등 여러 가지 중요한 기능이 추가됐지만, 새로운 HTTP API에 가장 큰 관심이 갔다. 이 녀석을 활용하면 우리 팀에서 개발하는 서비스 코드를 훨씬 읽기 좋게 바꿀 수 있을 것 같다는 생각이 들었다.
<!--more-->

새로운 [httpclient](http://docs.oracle.com/javase/9/docs/api/jdk.incubator.httpclient-summary.html) 모듈을 사용하면 다음과 같이 간단하고 직관적인 코드로 HTTP 요청을 보낼 수 있다.

```java
HttpClient client = HttpClient.newHttpClient();

HttpRequest request = HttpRequest.newBuilder()
    .uri(new URI("https://ntalbs.github.io"))
    .GET()
    .build();

HttpResponse<String> response = client.send(
    request,
    HttpResponse.BodyHandler.asString()
);
```

그러나 `httpclient`는 인큐베이터 모듈로 제공된다. 인큐베이터 모듈은 API가 확정되지 않은 상태에서 개발자가 테스트해볼 수 있도록 하는 방법으로, 이후 릴리즈에서 변경되거나 삭제될 수 있다고 한다. 간단한 테스트나 개인 프로젝트에는 사용할 수 있겠지만 실제 서비스에 쓰기는 어렵겠다.

Java 8까지는 JDK에 REPL이 포함되어 있지 않아 아쉬운대로 [JavaREPL](/2015/java-repl/)을 썼지만, Java 9부터는 JShell이 제공된다. JShell을 이용해 간단히 `httpclient` 모듈을 테스트해 보았다.

<pre class="console">
$ jshell
|  Welcome to JShell -- Version 9
|  For an introduction type: /help intro

jshell> import jdk.incubator.http.*
|  Error:
|  package jdk.incubator.http is not visible
|    (package jdk.incubator.http is declared in module jdk.incubator.httpclient, which is not in the module graph)
|  import jdk.incubator.http.*;
|         ^----------------^
</pre>

JShell에서 `jdk.incubator.http` 패키지를 `import`하려 했더니 에러가 발생한다. JShell에서  `jdk.incubator.httpclient` 모듈을 사용하려면 JShell을 실행할 때 다음과 같이 해당 모듈을 사용할 수 있도록 해줘야 한다.

<pre class="console">
$ jshell <span style="color:#0e0">--add-modules jdk.incubator.httpclient</span>
</pre>

이제 JShell에서 `jdk.incubator.http` 패키지를 사용할 수 있게 되었다.

<pre class="console">
jshell> import jdk.incubator.http.*
</pre>

다음과 같이 `HttpClient`, `HttpRequest` 객체를 만든다.

<pre class="console">
jshell> HttpClient client = HttpClient.newHttpClient();
client ==> jdk.incubator.http.HttpClientImpl@6913c1fb

jshell> HttpRequest request = HttpRequest.newBuilder().uri(new URI("https://ntalbs.github.io")).GET().build()
request ==> https://ntalbs.github.io GET
</pre>

HTTP 요청은 `HttpClient`의 `send` 메서드로 보낼 수 있다.

<pre class="console">
jshell> HttpResponse<String> response = client.send(request, HttpResponse.BodyHandler.asString());
response ==> jdk.incubator.http.HttpResponseImpl@79d8407f
</pre>

`response`의 HTTP 응답 코드와 본문은 다음과 같이 확인할 수 있다.

<pre class="console">
jshell> response.statusCode()
$21 ==> 200

jshell> response.body()
$22 ==> "&lt;!DOCTYPE html>&lt;html>&lt;head><span style="color:#0d0">...</span>&lt;/html>"
</pre>

응답 본문의 길이가 길기 때문에 콘솔에서 `...`로 축약된 것을 볼 수 있다. `System.out.println`을 이용하면 전체 내용을 출력할 수 있다.

<pre class="console">
jshell> System.out.println(response.body());
// ...
// 생략
// ...
</pre>

어떤 사정으로 `httpclient`가 인큐베이터 모듈로 결정되었는지는 알지 못하지만, 하루빨리 정식 모듈로 제공되길 기대한다.

## 참고
* [JEP 11: Incubator Modules](http://openjdk.java.net/jeps/11)
* [Module jdk.incubator.httpclient](http://docs.oracle.com/javase/9/docs/api/jdk.incubator.httpclient-summary.html)
* [JavaREPL](/2015/java-repl/)
