date: 2014-05-14
tags: [Clojure]
title: 구글 앱 엔진에 Clojure 앱 올리기
---
[구글 앱 엔진(Google App Engine)](https://cloud.google.com/products/app-engine/)은 Clojure를 위한 SDK를 따로 제공하지는 않지만 Clojure는 JVM에서 실행되므로 Java가 실행되는 환경이라면 Clojure도 실행할 수 있다.
<!--more-->

## 준비
먼저 Leiningen과 App Engine SDK (for Java)를 설치한다.

* [Leiningen](https://github.com/technomancy/leiningen) 2.x 설치
* [App Engine SDK for Java](https://developers.google.com/appengine/downloads) 설치

MacOS X에서 [Homebrew](http://brew.sh/)를 사용한다면 다음과 같이 간단히 설치할 수 있다.

<pre class="console">
$ brew install leiningen
...
$ brew install app-engine-java-sdk
</pre>

## Clojure 앱 만들기
다음과 같이 [compojure-template](https://github.com/yogthos/compojure-template)을 이용해 프로젝트를 생성한다.

<pre class="console">
$ lein new compojure-app app-test
</pre>

프로젝트를 생성한 다음 아래와 같이 실행하면 브라우저 창에 "Hello World!"를 표시한다.

<pre class="console">
$ lein ring server
</pre>

여기서는 이 상태 그대로 앱 엔진에 배포해 볼 것이다. Clojure로 웹 애플리케이션을 만드는 방법은 [원래 문서](http://flowa.fi/blog/2014/04/25/clojure-gae-howto.html)나 **참고**에 나온 다른 도서를 보기 바란다.

## 배포를 위한 패키징
다음 명령으로 war 파일을 생성한다.

<pre class="console">
$ lein ring uberwar
</pre>

war 파일은 프로젝트 루트 밑의 `target` 디렉터리 안에 생성된다. 다음과 같이 `unzip` 명령을 이용해 압축 해제한다. (파일 이름은 다를 수 있으며, 압축 해제할 디렉터리 이름이 꼭 stage일 필요는 없음)

<pre class="console">
$ unzip -d stage target/test-app-0.1.0-SNAPSHOT-standalone.war
</pre>

`stage/WEB-INF` 디렉터리에 다음과 같은 내용으로 `appengine-web.xml` 파일을 만든다.

```xml
<appengine-web-app xmlns="http://appengine.google.com/ns/1.0">
  <application>your-gae-application-id</application>
  <version>1</version>
  <threadsafe>false</threadsafe>
</appengine-web-app>
```

`your-gae-application-id`는 [https://appengine.google.com/](https://appengine.google.com/)에서 애플리케이션을 생성할 때 지정한 아이디를 넣어주면 된다.

## 앱 엔진에 배포
`<app-engine-sdk>/bin`이 PATH에 잡혀 있어야 한다. MacOS X에서 Homebrew로 설치했다면 이미 PATH에 잡혀있을 것이다. 앱 엔진 서버에 배포하기 전에 로컬에서 테스트 해볼 수 있다

<pre class="console">
$ dev_appserver.sh stage
</pre>

브라우저를 열어 주소창에 `http://localhost:8080`을 입력해보면 실행 결과를 볼 수 있다.

앱 엔진 서버에 올린 준비가 되었다면 다음과 같이 배포한다.

<pre class="console">
$ appcfg.sh update stage
</pre>

서버로 배포하는 데는 시간이 좀 걸린다. 배포가 끝나면 브라우저로 `http://<<your-gae-application-id>>.appspot.com`에 접근해 확인할 수 있다.

## 요약
과정을 요약하면 다음과 같다.

1. `lein new compojure-app <project-name>`으로 프로젝트 생성
2. 웹 애플리케이션 작성
3. `lein ring uberwar`로 war 파일 생성
4. 생성된 war 파일을 압축 해재하고 `WEB-INF` 디렉터리에 `appengine-web.xml` 파일 생성
5. `dev_appserver.sh`로 로컬에서 테스트
6. `appcfg.sh`를 이용해 앱 엔진으로 업로드

## 참고
* [Create and deploy a Clojure app to Google App Engine](http://flowa.fi/blog/2014/04/25/clojure-gae-howto.html)
* [Uploading and Managing a Java App](https://developers.google.com/appengine/docs/java/tools/uploadinganapp)
* [Dmitri Sotnikov, Clojure Web Development](https://pragprog.com/book/dswdcloj/web-development-with-clojure)
얇지만 Clojure로 웹 애플리케이션을 만드는 방법이 자세히 나와있다
* [Chas Emerick, Brian Carper, Christophe Grand, Clojure Programming](http://shop.oreilly.com/product/0636920013754.do)
p557~555, Hiccup 대신 [Enlive](https://github.com/cgrand/enlive)를 사용한다
