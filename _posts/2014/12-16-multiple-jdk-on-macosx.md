tags: java
date: 2014-12-16
title: MacOS X에서 JDK 버전 전환
---
보통 JDK 최신 버전을 설치해 사용한다. 운영환경에 여전히 JDK7을 쓰고 있지만 개발환경에서는 JDK8을 쓰되 `-target 1.7` 옵션을 주어 컴파일하면 문제가 없지 않을까 생각했다. 그런데 서버를 올릴때 계속 에러가 발생해 인터넷에서 찾아보니 Spring 3.2.8 버그란다. 이 문제는 Spring 3.2.9에서 해결되었다고 하지만 운영환경은 여전히 Spring 3.2.8을 사용하고 있고, 내가 Spring 버전을 올릴 권한도 없다. 어쩔 수 없이 노트북에 JDK7을 설치할 수밖에 없다.<!--more-->

콘솔에서 작업하는 경우도 많아 MacOS X에서 JDK 버전을 쉽게 전환하는 방법을 찾아봤는데 생각보다 어렵지 않았다. 그냥 환경변수만 적절히 바꿔주면 된다. 검색으로 찾은 웹 페이지는 `bash`를 기준으로 되어 있어 내가 사용하는 `fish`에 맞게 조금 바꿨다.

`fish` 설정 파일 `~/.config/fish/config.fish`를 열어 다음 내용을 추가하면 끝이다.

```
set -x JAVA8_HOME (/usr/libexec/java_home -v1.8)
set -x JAVA7_HOME (/usr/libexec/java_home -v1.7)
set -x JAVA_HOME $JAVA8_HOME

alias java8 "set -x JAVA_HOME $JAVA8_HOME"
alias java7 "set -x JAVA_HOME $JAVA7_HOME"
```

위 내용을 이해하려면 먼저 `java_home` 명령을 알아야 한다. `java_home` 명령은 `JAVA_HOME` 환경변수에 설정할 적절한 JDK 설치 경로를 리턴한다.

<pre class="console">
$ /usr/libexec/java_home -v1.7
/Library/Java/JavaVirtualMachines/jdk1.7.0_71.jdk/Contents/Home
$ /usr/libexec/java_home -v1.8
/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home
</pre>

`fish`에서는 환경변수를 설정할 때 `set` 명령을 사용한다. `-x` 옵션을 주면 `bash`에서 `export`를 사용하는 것과 비슷하다. command substitution은 `(COMMAND)`와 같은 식으로 쓰면 된다. 따라서 `set -x JAVA8_HOME (/usr/libexec/java_home -v1.8)`은 JDK1.8 홈 디렉터리를 구해 `JAVA8_HOME` 환경변수에 저장하는 것이 된다.

`java8`, `java7` alias를 실행하면 `JAVA_HOME` 환경변수 값을 `JAVA8_HOME` 또는 `JAVA7_HOME`의 값으로 바꾼다. 이제 콘솔에서 JDK7을 쓰고 싶을 때는 `java7`, JDK8을 쓰고 싶을 때는 `java8`을 입력하면 된다.

<pre class="console">
$ java7
$ java -version
java version "1.7.0_71"
Java(TM) SE Runtime Environment (build 1.7.0_71-b14)
Java HotSpot(TM) 64-Bit Server VM (build 24.71-b01, mixed mode)
$ java8
$ java -version
java version "1.8.0_25"
Java(TM) SE Runtime Environment (build 1.8.0_25-b17)
Java HotSpot(TM) 64-Bit Server VM (build 25.25-b02, mixed mode)
</pre>

## 참고
* [Multiple Java JDK(s), on your MacOSX environment](http://www.javacodegeeks.com/2013/02/multiple-java-jdks-on-your-macosx-environment.html)
* [Java 1.8 ASM ClassReader failed to parse class file - probably due to a new Java class file version that isn't supported yet](http://stackoverflow.com/questions/22526695/java-1-8-asm-classreader-failed-to-parse-class-file-probably-due-to-a-new-java)
* [java_home](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/java_home.1.html) 콘솔에서 `man java_home`을 실행해도 `java_home`에 대한 설명을 볼 수 있다.
