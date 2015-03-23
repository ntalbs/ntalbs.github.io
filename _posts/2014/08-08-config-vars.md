title: 환경변수에 설정 정보 저장하기
date: 2014-08-08
tags: [clojure, heroku]

---
웹 애플리케이션에서 데이터베이스 계정 정보나 URL, 외부 서비스에 대한 인증 정보는 어떻게 관리하는 것이 좋을까? 설정 파일을 만들어 여기에 관리하는 방법도 있지만, 환경에 따라 설정이 변해야 하는 경우 관리가 까다로워 진다. 어떻게 하는 게 좋을까?
<!--more-->

## 배경
Clojure로 간단한 웹 애플리케이션을 만들었다. 소스코드는 [GitHub](https://github.com/ntalbs/tweetbook)에 올려두었고 [Heroku](https://www.heroku.com/)에 배포했다. 그런데 배포 작업을 하면서 약간 귀찮은 문제에 봉착했다. 바로 설정 정보 관리 문제였다. 지금까지는 그냥 소스 파일에 저장하는 방식을 사용했다. 데이터베이스 계정 정보나 외부 시스템의 OAUTH 키 등을 `config.clj`란 파일에 저장했는데, 이 파일을 GitHub에 올릴 수는 없었다. 아무도 내 코드를 보지 않을 거란 사실은 알지만 대문 앞에 열쇠를 걸어두고 나갈 수는 없지 않은가! 그래서 파일을 복사해 `_config.clj`를 만들고 다음과 같이 중요 정보를 제거해 올렸다.

```clojure
(ns xxx.config)

(def db-uri "mongodb-uri")

(def oauth-settings
  {:consumer-key "consumer-key"
   :consumer-secret "consumer-secret"
   :access-token "access-token"
   :access-token-secret "access-token-secret"})
;...
```

프로젝트를 사용하려면 `_config.clj`의 이름을 `config.clj`로 바꾼 다음 내용을 채우면 된다. 이 방법은 `config.clj`를 커밋하지 않도록 주의해야 하고, 설정 파일 구조를 바꾸거나 새로운 정보를 추가할 때 두 파일을 수정해야 하는 불편함이 있다. 마음에 드는 방법은 아니었지만 일단 동작했고 다른 모르는 것이 많아 설정에 많은 시간을 들이고 싶지 않아 그냥 썼다. 어느 정도 안정화된 후에도 커밋하지 말아야 한다는 점이 거슬리긴 했지만 큰 불편은 없었다.


## 문제
그런데 Heroku에 배포하면서 문제가 생겼다. Heroku는 Git에 `push`하면 알아서 배포하는 구조로 되어 있는데, 배포한 앱이 제대로 실행되려면 `config.clj`도 Heroku의 Git 저장소에 올려야 했다. 이것 때문에 `config.clj`가 GitHub에는 올라가면 안 되고 Heroku의 Git 저장소에는 올라가야 하는 모순이 생겼다. 게다가 Heroku에 배포하는 데 계속 이해되지 않는 에러가 발생했다. 디렉터리를 통째로 다른 곳에 복사해 GitHub과 연결을 끊고 파일을 편집해 Heroku에 올리는 방식으로 문제를 해결하긴 했다. 이 과정을 거치며 설정 정보를 어떻게 저장하고 관리하는 것이 좋을지 생각해보게 되었다.

## 환경변수에 설정 저장하기
어떻게 하는게 좋을지 인터넷에서 조금 찾아보니 환경변수에 설정 정보를 저장하는 방법을 알게 되었다. 로컬에서는 셸에 따라 `set`, `export` 등의 명령으로 환경변수를 설정하면 되고, Heroku에서는 `config:set`을 사용해 환경변수를 설정할 수 있다.

<pre class="console">
$ heroku config:set DB_USERNAME=xxx
Setting config vars and restarting myapp... done, v5
DB_USERNAME: xxx

$ heroku config
=== myapp Config Vars
DB_USERNAME: xxx

$ heroku config:get DB_USERNAME
xxx

$ heroku config:unset DB_USERNAME
Unsetting DB_USERNAME and restarting myapp... done, v6
</pre>

Java에서는 `System.getenv("key")`를 사용해 환경변수의 값을 얻을 수 있다. Clojure에서는 Java 함수를 그대로 사용할 수 있으므로 `(System/getenv key)`와 같이 하면 된다.

## heroku-config 플러그인
`heroku config:set` 명령을 이용해 환경변수를 하나씩 지정해야 한다면 매우 짜증날 것이다. [heroku-config](https://github.com/ddollar/heroku-config) 플러그인을 사용하면 로컬 `.env` 파일의 내용을 Heroku 애플리케이션에 푸시하거나 Heroku 애플리케이션 설정 환경변수을 긁어 로컬 `.env` 파일에 저장하는 작업을 쉽게 할 수 있다. `heroku-config` 플러그인은 다음과 같이 설치한다.

<pre class="console">
$ heroku plugins:install git://github.com/ddollar/heroku-config.git
heroku-config installed
</pre>

`.env` 파일에 다음과 같은 식으로 변수명과 값을 지정할 수 있다.

```bash
DB_URI=mongodb://id:pw@domain:port/db-name
USERID=xxx
```

로컬 `.env` 파일의 설정 내용을 Heroku 애플리케이션으로 푸시할 때는 다음과 같이 한다.
<pre class="console">
$ heroku config:push
</pre>

Heroku 애플리케이션 설정 환경변수를 긁어 로컬 `.env` 파일에 저장할 때는 다음과 같이 한다.
<pre class="console">
$ heroku config:pull
</pre>

`--interactive` 옵션을 사용하면 환경변수 하나하나에 대해 덮어쓸지 물어보게 할 수 있다.
<pre class="console">
$ heroku config:pull --interactive
DB_URI: mongodb://id:pw@domain:port/db-name
Overwrite? (y/N) y
USERID: xxx
Overwrite? (y/N)
...
</pre>

## 결론
애플리케이션 설정을 파일(XML이든 properties 파일이든)에 저장하는 것보다는 환경변수에 저장해 사용하는 것이 좀더 융통성 있다. 특히 소스코드를 GitHub과 같은 공개 저장소에 올린다면 민감한 정보는 더더욱 이렇게 관리하는 것이 좋겠다.

## 참고
* [Heroku Dev Center > Configuration and Config Vars](https://devcenter.heroku.com/articles/config-vars)
