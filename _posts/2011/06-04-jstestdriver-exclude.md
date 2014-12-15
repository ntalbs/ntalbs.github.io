title: 커버리지 분석 시 불필요한 js 파일 제외하기
date: 2011-06-04
tags: [ci, hudson, jstestdriver, javascript, coverage, 테스트]

---
[Hudson에서 JsTestDriver를 이용한 커버리지 분석 설정](/2010/11/24/hudson-jstestdriver-coverage/)에서 JsTestDriver로 작성한 테스트에 대해 커버리지를 어떻게 볼 수 있는지 설명했다. 그런데 이렇게 테스트 커버리지를 분석할 때 문제가 하나 있다. 외부 라이브러리가 커버리지 분석 리포트에 포함되어 커버리지 결과가 왜곡된다는 점이다.
<!--more-->

이 문제는 의외로 간단하게 해결할 수 있다. JsTestDriver의 coverage 플러그인은 JsTestDriver 실행시 지정한 testOutput 디렉터리에 LCOV 포맷의 <config filename>-coverage.dat 파일을 생성하는데, 이 파일을 적절히 조작하면 된다. 파일은 텍스트 파일이며 다음과 같은 형식으로 되어 있다.
```
SF:/.../.../.../src1.js
DA:10,1
DA:11,1
DA:12,1
...
end_of_record
SF:/.../.../.../src2.js
DA:12,1
DA:13,1
DA:16,1
...
end_of_record
...
```
각 파일에 대한 커버리지 정보를 가지고 있는데, `SF:{파일경로+파일이름}`으로 시작하고 `end_of_record`로 끝난다. 따라서 간단한 프로그램을 짜서 불필요한 파일에 대한 정보를 날린 다음 커버리지 리포트를 만들면, 제외하고 싶은 파일을 제거한 상태의 커버리지 리포트를 만들 수 있다.

이런 작업은 스크립트 언어로 처리하면 쉬울 것 같다. 회사 CI 서버에 python이 깔려 있어 python으로 간단하게 작성해봤다. (다듬을 여지가 많다. 예를 들어 input_file을 명령행 인수로 받도록 처리할 수도 있겠다.)
```
import shutil
excludeList = open('exclude_coverage.txt').readlines()
input_file = '/.../.../jsTestDriver.conf-coverage.dat'
output_file = '/.../.../excluded.dat'

input = open(input_file, 'r')
output = open(output_file,'w')

skip = False
for l in input:
  if l.startswith('SF:'):
    jsName = l.split('/').pop()
    if excludeList.count(jsName) > 0:
      skip = True
  if not skip:
    output.write(l)
  if l.startswith('end_of_record'):
    skip = False

input.close()
output.close()

shutil.move(output_file, input_file)
```
`exclude_coverage.txt` 파일에 커버리지 분석에서 제외하고 싶은 파일 이름을 넣으면, 이 프로그램이 JsTestDriver의 커버리지 데이터 파일(...-coverage.dat)에서 `exclude_coverage.txt`에 기술한 파일과 관련된 내용을 제외한다. `exclude_coverage.txt` 파일은 다음과 같은 식으로 작성하면 된다.
```
external-lib1.js
external-lib2.js
external-lib3.js
...
```
그리고 CI서버에서 genhtml을 실행하기 전에 위에서 작성한 python 프로그램을 실행하도록 설정한다.

![](2011-06-04-1.png)

빌드해보면 JavaScript 커버리지 리포트에 제외하고 싶었던 파일에 대한 커버리지가 빠져 있는 것을 확인할 수 있다.

## 참조
* [Hudson에서 JsTestDriver를 이용한 커버리지 분석 설정](/2010/11/24/hudson-jstestdriver-coverage/)
* [Hudson에서 JsTestDriver 설정](/2010/11/22/hudson-jstestdriver/)
