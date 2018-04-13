date: 2010-11-24
tags: [테스팅]
title: Hudson에서 JsTestDriver를 이용한 커버리지 분석 설정
---
[Hudson에서 JsTestDriver 설정](/2010/hudson-jstestdriver/)에서 Hudson에서 JsTestDriver를 설정하는 방법을 설명했다. 여기서는 Hudson에서 JsTestDriver를 이용해 테스트 커버리지 리포트를 생성하는 방법을 살펴보자.
<!--more-->

JsTestDriver에 coverage 플러그인을 설치하면 단위테스트에 대한 라인 커버리지를 볼 수 있다. Hudson에서 JsTestDriver 설정에서 설명한 대로 설치했다면 이미 coverage 플러그인도 설치되어 있는 상태다. coverage 플러그인은 JsTestDriver 실행시 지정한 testOutput 디렉터리에 LCOV 포맷의 <config filename>-coverage.dat 파일을 생성한다. 이 파일은 LCOV의 genhtml을 통해 HTML 형식의 리포트로 만들 수 있다.

## LCOV 설치﻿
1. [http://ltp.sourceforge.net/coverage/lcov.php](http://ltp.sourceforge.net/coverage/lcov.php)에서 lcov 최신버전 다운로드
2. 설치할 디렉터리(여기서는 `/opt/`)에 압축 해제

## jsTestCoverage.conf 설정
jsTestCoverage.conf 파일에 다음 내용을 추가한다.

```
plugin:
  - name: "coverage"
    jar: "plugins/coverage-1.2.2.jar"
    module: "com.google.jstestdriver.coverage.CoverageModule"
```

## Hudson 설정
1. HTML Publisher Plugin을 설치
(http://wiki.hudson-ci.org/display/HUDSON/HTML+Publisher+Plugin 참조)
LCOV의 `genhtml`로 생성한 HTML 리포트를 Hudson에서 보는 데 필요하다
플러그인을 설치한 다음 Hudson을 재시작해야 한다.
2. 프로젝트 설정 페이지의 Build 섹션에 genhtml 실행 명령 추가
{% asset_img 2010-11-24-1.png %}
이렇게 하면 빌드 실행 후 `report/js_coverage_report` 디렉터리에 HTML 형식의 테스트 커버리지 리포트가 생성된다.
<div style="background-color:#eeeeee;padding:10px">**JsTestDriver 실행 시 주의사항**
coverage를 설정한 경우 임의의 위치에서 JsTestDriver를 실행시키면 `com.google.jstestdriver.coverage.CoverageModule` 클래스를 찾지 못하는 문제(`ClassNotFoundException`)가 발생한다. 실행 위치를 JsTestDriver 설치 디렉터리(`/opt/jsTestDriver`)로 옮긴 다음 JsTestDriver를 실행하면 이런 문제가 발생하지 않는다.
따라서 그림과 같이 cd 명령으로 jsTestDriver 설치 디렉터리로 이동한 다음 JsTestDriver를 실행하고, 옵션에서 허드슨 환경변수(`$WORKSPACE`)를 사용해 설정 파일과 테스트 결과 파일의 위치를 지정한다.
</div>
3. 프로젝트 설정 페이지의 Post-build Actions 섹션에서 HTML Publisher Plugin 설정을 추가한다.
{% asset_img 2010-11-24-2.png %}
  * `HTML directory to archive` - HTML 리포트를 포함하는 디렉터리를 입력. 여기서는 trunk/report/js_coverage_report
  * `Index page[s]` - 표시할 파일 (디폴트는 index.html)
  * `Report title` - 리포트 제목, 여기서는 JsCoverage
빌드가 끝나면 프로젝트 페이지에 JsCoverage 링크가 생기고, 이 링크를 클릭하면 HTML 리포트를 볼 수 있다.
