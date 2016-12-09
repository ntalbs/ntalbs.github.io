date: 2014-07-17
tags: 오픈소스
title: 수작업 brew 포뮬러 업데이트
---
[Homebrew](http://brew.sh/)는 Mac OS X를 위한 패키기 관리자다. Homebrew를 이용하면 Mac OS X에 설치되어 있지 않은 다양한 패키지를 쉽게 설치하고 관리할 수 있다. Homebrew로 설치한 패키지의 새 버전이 나왔다면 콘솔에서 `brew upgrade` 명령으로 쉽게 업그레이드 할 수 있다. 웬만한 것은 거의 brew를 통해 설치할 수 있고, 매우 빠르게 업데이트 된다.
<!--more-->

그래서 [구글 앱 엔진 SDK](https://developers.google.com/appengine/downloads)도 brew로 설치해 사용하고 있었는데, brew에 앱 엔진 SDK 업데이트가 반영되지 않은 것을 발견했다. 앱 엔진 개발 서버를 띄우는 데 SDK가 예전 버전이라는 메시지가 표시되었다. brew를 통해 업그레이드를 시도했지만, 웬일인지 brew 포뮬러가 업데이트되지 않은 상태였다. 이래서는 brew를 통해 업그레이드를 할 수 없어 보였다. 그러나 다음과 같은 귀차니즘 때문에 앱 엔진 SDK를 직접 설치하고 싶지는 않았다.

* 어느 디렉터리에 저장해야 할지 고민하기 싫다.
* `PATH` 잡기도 귀찮다.
* 나중에 직접 업그레이드 해야 한다.

어떻게 직접 설치하지 않고 문제를 해결할 수 없을까 고민하면서 구글로 검색하다가 깃헙에서  `app-engine-java-sdk` 포뮬러 소스 코드를 발견했다. ruby를 아는 건 아니지만 `url`과 `sha1`만 수정하면 동작할 것 같았다. ruby니까 아마 내 노트북에 소스 코드가 있겠다 싶어 찾아 보았다. 다행히 포뮬러 위치를 쉽게 찾을 수 있었다. `/usr/local/Library/Formula`에 모든 포뮬러 파일이 모여 있었다. 여기서 `app-engine-java-sdk.rb` 파일을 다음과 같이 수정했다.

```ruby
class AppEngineJavaSdk < Formula
  homepage "https://developers.google.com/appengine/docs/java/gettingstarted/introduction"
  url "https://storage.googleapis.com/appengine-sdks/featured/appengine-java-sdk-1.9.7.zip"
  sha1 "8210a9f0db2254d55aa68431bbbc7570cbaee4a2"
  ...
```

콘솔에서 `brew upgrade`를 실행했더니 잘 동작한다. 내친 김에 [Homebrew](https://github.com/Homebrew/homebrew) 프로젝트에 [Pull Request](https://github.com/Homebrew/homebrew/pull/30903)도 보냈다.

## PS:
알고 보니 포뮬러 파일을 찾으려고 수고할 필요도 없었다. 다음과 같이 `brew edit` 명령으로 포뮬러를 바로 수정할 수 있다.

<pre class="console">
$ brew edit app-engine-java-sdk
</pre>
