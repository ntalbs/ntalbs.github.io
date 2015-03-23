title: 코드 중복과 보이스카우트 규칙
date: 2010-05-16
tags: [refactoring]

---
<blockquote class="blockquote-reverse">캠핑 장은 처음 왔을 때보다 더 깨끗하게 해놓고 떠나라!
보이스카우트 규칙 (클린 코드, p50)
</blockquote>

때로는 아주 사소한 코드 중복이 큰 문제를 만드는 경우도 있다.

```js
var fnCallback = $Fn(function(bSuccess, sMessage, oData) {
  //...
  if (acrobat.isInstalled) {
      this.printUrl = oData.redirectURL + "&isSilent=true";
  } else {
      this.printUrl = oData.redirectURL;
  }
}, this).bind();
```

중복 코드에 민감한 개발자라면 당장에 중복된 부분이 눈에 들어올 것이다. 4째 줄과 6째 줄에 `this.printUrl = oData.redirectURL` 부분이 중복이다. 단순한 코드라서 언듯 보기에는 별 문제가 없어 보일는지 모르겠다. 그러나 꼭 그렇지만은 않다. **문제가 생길 가능성이 있다면 그 문제는 꼭 생긴다.** 결과가 심각할수록 발생할 확율도 높아지는 것 같다.
<!--more-->

얼마 전 일이다. 퇴근하려고 하는데 갑자기 개발자가 달려왔다. 자기 자리에서는 잘 동작하는 기능이 다른 사람 자리에서는 안 된다는 것이다. 보통 이런 현상은 PC마다 환경이 조금이라도 다르기 때문에 발생한다는 것쯤은 예상할 수 있었지만, 이건 웹 프로그램이었고 어떤 차이 때문에 PC마다 다른 현상이 발생하는지 감을 잡을 수 없었다.

한참을 헤매다가 확인한 것은 어도비 리더가 설치된 PC에서는 제대로 동작하지 않고 어도비 리더가 설치되지 않은 PC에서는 제대로 동작한다는 것을 알게 되었다. 소스 코드에서 어도비 리더가 설치되어 있는지를 확인해 다르게 분기하는 부분을 찾았 확인했다. 앞에서 본 코드인데, 약간 수정되어 있었다.

```js
var fnCallback = $Fn(function(bSuccess, sMessage, oData) {
  // ...
  if (acrobat.isInstalled) {
    this.printUrl = this.serverLocation
        + "/" + oData.redirectURL + "&isSilent=true";
  } else {
    $("hidden_download_frame").setAttribute("src", oData.redirectURL );
  }
}, this).bind();
```

즉, 어도비 리더가 설치된 경우에 동작하는 코드에서는 `this.printUrl` 앞에 `this.serverLocation + "/"`가 붙어있지만 어도비 리더가 설치되지 않은 경우에 동작하는 코드 브랜치에는 그렇지 않았다. 누군가 어떤 문제를 해결하기 위해 `this.printUrl` 앞에 `this.serverLocation + "/"`를 붙이도록 했는데 `if` 문의 양쪽 브랜치를 수정하지 않고 한쪽만 수정했다. 그리고 어도비 리더가 설치된 환경에서만 테스트를 했을 것이다. 다른 개발자는 서버쪽에서 또다른 작업을 한 다음, 어도비 리더가 설치되지 않은 환경에서만 테스트를 해보고는 제대로 돌아간다고 생각했을 것이다. 결국 이 부분에서 문제가 터졌다.

**애초에 문제를 유발한 것은 거의 비슷한 코드가 두 곳에 있었다는 것이다.** 이런 경우 대부분 한 곳이 바뀌면 다른 곳도 함께 바뀌어야 한다. 그러나 개발자가 한 쪽을 수정하면서 다른 쪽은 수정하지 않아 문제가 발생핬다. 급하게 수정하다보면 이런 일이 많지만, 이 부분을 수정한 개발자가 *보이스카우트 규칙*에 따라 자신이 수정한 부분을 깔끔하게 정리했더라면 이런 삽질은 없었을 것이다.

최근에 코드를 다시 살펴보니 원래의 모습으로 돌아가 있다. 그러나 마음에 들지 않는다. 다음과 같은 식이 낫지 않을까?

```js
var fnCallback = $Fn(function(bSuccess, sMessage, oData) {
  //...
  this.printUrl = oData.redirectURL
      + ((acrobat.isInstalled)?"&isSilent=true":"");
}, this).bind();
```
개발자라면 코드를 수정할 때 자신의 작업이 어디까지 영향을 미치는지 확인해야 한다. **그리고 수정하는 부분과 그 주변 코드를 깔끔하게 정리해야 한다. 작업하기 전보다 더 깔끔하게 정리해야 한다. 특히 중복된 코드가 눈에 띄면 반드시 제거해야 한다.** 약간의 시간을 들여 정리를 해두면 위 경우처럼 나중에 헤메는 것을 방지할 수 있다.
