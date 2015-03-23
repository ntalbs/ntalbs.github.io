tags:
- hexo
- open source
date: 2015-03-22
title: "Hexo: 3.0 업그레이드"
---
정적 사이트 생성기로 [Hexo](http://hexo.io)를 사용하고 있는데, 최근 버전 3.0이 나왔다. 사용하는 소프트웨어를 항상 최신 버전으로 유지하고자 하는 마음 때문에 업그레이드 했는데, 블로그가 아예 뜨지도 않는 난감한 상황이 발생했다. 온갖 삽질 끝에 블로그를 제대로 뜨게 하는 데 며칠이나 허비했다. [Breaking Changes in Hexo 3.0](https://github.com/hexojs/hexo/wiki/Breaking-Changes-in-Hexo-3.0)에서의 Breaking이 기존 것을 다 깨먹는다는 뜻이었나 싶을 정도였다.<!--more-->

## Hexo-math 문제
업그레이드 후 제일 먼저 발생한 문제는 수식을 렌더링 해주는 [hexo-math](https://github.com/akfish/hexo-math)가 제대로 동작하지 않는 것이었다. 블로그에서 수식을 사용하는 글이 적지 않았기 때문에 당황스러웠다. hexo-math가 Hexo 3.0 업그레이드에 제대로 대응하지 않은 것 같았다. 이것 저것 해보다 잘 안 되어 Hexo를 다시 예전 버전으로 되돌리고 싶었지만, 그것도 쉽지 않았다. 예전에 Hexo 2.8.3으로 업그레이드할 때도 Hexo에서 사용하는 일부 서브모듈이 동작하지 않아 서브모듈 버전까지 낮은 버전으로 맞춰준 적이 있었는데, 그 모듈이 무엇이었는지, 버전이 몇이었는지 생각나지 않았다. 인터넷에서 검색해 찾아보았지만 다시 찾을 수 없었다. 결국 이 문제를 해결하지 않으면 안 되었다.

## 대안 플러그인 검토
혹시 다른 플러그인이 있다 찾아보니 [hexo-renderer-mathjax](https://github.com/phoenixcw/hexo-renderer-mathjax)가 보여 테스트해봤다. 그러나 이 역시 Hexo 3.0에서는 제대로 동작하지 않았다. hexo-renderer-mathjax의 문제는 찾기 쉬웠다. 소스 파일은 `index.js` 하나 뿐이었고 그나마도 몇 줄 되지 않았다. `index.js` 파일에서 `hexo.file`을 참조하는 부분이 있었는데 이 부분이 문제였다. Hexo 3.0에서 모듈 구조가 변경되면서 이 부분이 서브모듈로 떨어져 나갔는데, `hexo.file`이라고 되어 있는 부분을 `require('hexo-fs')`로 바꾸어 간단히 해결할 수 있었다.

하지만 안타깝게도 hexo-renderer-mathjax는 사용할 수 없었다. 내 블로그에서는 여러 줄의 수식을 사용하는 글이 꽤 있는데 hexo-renderer-mathjax는 이를 제대로 표현하지 못했다. 할 수 없이 hexo-math의 문제를 해결해야 했다.

## Hexo-math 문제 해결
hexo-math는 CoffeeScript로 작성되었다. node.js도 모르고 CoffeeScript도 모르고 Hexo 플러그인 구조도 잘 모르지만 JavaScript를 조금 아니 해결을 시도해볼 수 있었다. CoffeeScript로 생성한 JavaScript 코드는 읽을 만 했다. 예외 발생 부분을 보니 역시 hexo-renderer-mathjax와 같은 문제였다. 예전에 `hexo.file`, `hexo.util`로 쓰던 부분을 `require 'hexo-fs'`, `require 'hexo-util'`로 수정하니 해당 부분에서 예외가 발생하지 않았다. `Command.coffee`에서 `hexo.theme_dir`을 참조하는 부분은 해결하지 못했다. Hexo 3.0에서는 여기로 `hexo` 객체가 넘어오지 않았다. 이 부분은 어쩔 수 없이 하드코딩으로 해결했다.

여러 줄의 수식을 써야 하는 경우 예전에는 마크다운 파일에서 `{% raw %}{% math-block %}{% endraw %} ... {% raw %}{% endmath-block %}{% endraw %}`을 사용했는데, 이 부분도 문제가 되었다. 중간에 `-`가 들어간 부분이 제대로 처리되지 않는 것 같았다. [Swig 문서](http://paularmstrong.github.io/swig/docs/#tags)를 찾아보니 수식 블록을 `{% raw %}{% block math %}{% endraw %} ... {% raw %}{% endblock %}{% endraw %}`으로 써도 될 것 같았다. 수정해 확인해보니 에러는 발생하지 않지만 한 파일에 여러 수식 블록이 있는 경우 모든 수식 블록이 마지막 수식으로 표시되는 문제가 있었다. 저자가 설명한 대로 `{% raw %}{% math_block %} ... {% endmath_block %}{% endraw %}`를 사용하도록 문서를 업데이트했다.

## 테마 수정
다시 `hexo server` 명령으로 블로그를 띄워보니 에러 없이 잘 표시되는 것 같았다. 그런데 Archive 페이지에 가보니 글이 다섯 개만 표시되는 것이었다. Tags 페이지는 예외가 발생해 아예 표시되지도 않았다. Hexo 3.0으로 넘어가면서 내부에서 사용하는 객체 구조도 바뀐 모양이다. [Local Variables 문서](http://hexo.io/api/locals.html)를 참조하고 변수 값을 `console.log`로 찍어가며 디버깅해 제대로 나오도록 ejs 파일을 수정했다.

## 소스 코드 하이라이트
이제 다 됐겠지 하고 살펴보니 코드 블록의 문법 강조가 제대로 표시되지 않은 게 보였다. 이 부분은 [highlight.js](https://highlightjs.org/)에 맞춰 Hexo의 소스코드를 직접 수정해 사용하던 부분이었는데, Hexo 3.0에서는 관련 부분이 어디인지 찾을 수 없었다. 할 수 없이 CSS 파일을 수정했다. 다행히 클래스 이름 앞에 붙어있던 `hljs` 접두사를 제거하니 해결되었다.

## 정리
Hexo 작성자를 비난하려는 의도는 없다. Hexo는 node.js 기반의 정적 사이트 생성기로 블로그를 다시 시작할 때 많은 고민과 검토 끝에 선택한 도구다. node.js 기반의 도구 중에 문서화가 가장 잘 되어 있었고 개발도 가장 활발하게 진행되고 있었다. 업데이트 할 때 호환성 때문에 생긴 약간의 문제(사실 이번에는 조금 컸지만)를 제외하면 매우 만족스럽게 사용하고 있다. 다만 작성자가 Hexo를 업데이트 할 때 하위 호환성이나 안정성에 신경을 덜 쓰는 게 아닌가 하는 생각이 든다. 이번 Hexo 3.0에서도 내부적으로는 리팩터링도 하고 모듈 구조도 변경해 많은 것이 바뀌었지다지만, 최종 사용자 입장에서는 아직까지 크게 바뀐 점을 모르겠다. 앞으로는 Hexo를 업데이트를 할 때 이번처럼 무작정 하기보다는 롤백을 염두에 두고 조심해 작업해야 겠다는 생각이 든다.

## 참고
* [Breaking Changes in Hexo 3.0](https://github.com/hexojs/hexo/wiki/Breaking-Changes-in-Hexo-3.0)
* [Hexo: Local Variables](http://hexo.io/api/locals.html)
* [hexo-math 수정 부분 Pull Request](https://github.com/akfish/hexo-math/pull/4) `hexo.theme_dir` 부분은 해결하지 못해 저자에게 잘 해결해달라고 부탁했다.
* [hexo-renderer-mathjax 수정 부분 Pull Request](https://github.com/phoenixcw/hexo-renderer-mathjax/pull/2)
* [Hexo: 소스 코드 하이라이팅 스타일 변경](/2014/10/16/hexo-hljs/) 이때 정리했던 내용은 더 이상 유효하지 않지만, 이때 배운 지식을 바탕으로 이번 문제를 해결할 수 있었다.
