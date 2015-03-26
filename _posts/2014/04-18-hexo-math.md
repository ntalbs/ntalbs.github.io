title: "Hexo: 블로그에 수식 표현하기"
date: 2014-04-18
tags: [math, hexo]

---
블로그에 수식을 쓰는 일이 많지는 않지만 종종 아쉬울 때가 있다. 지금까지는 MS 파워포인트에서 수식편집기를 사용해 수식을 입력한 다음 수식 영역을 스크린 캡쳐해 이미지로 저장해 사용했다. 처음의 번거로운 작업은 참을 수 있지만, 수식을 변경할 일이 생기면 여간 짜증나는 게 아니었다.
<!-- more -->

내가 사용하는 [Hexo](http://hexo.io)에서 혹시 이런 걸 편하게 해주는 도구가 있을까 찾아봤는데 역시 있었다. [MathJax](http://www.mathjax.org/)를 사용해 수식을 쉽게 사용할 수 있게 해주는 [hexo-math](https://www.npmjs.org/package/hexo-math)란 플러그인이 있었다.

설치 및 설정 방법은 간단하다. 먼저 블로그 홈 디렉터리로 이동해 `hexo-math`를 설치한다.

<pre class="console">
$ cd blog
$ npm install hexo-math --save
...
$ hexo math install
</pre>

그리고 `_config.yml` 파일을 열어 `plugins:` 설정부분을 찾아 `hexo-math`를 추가한다.

```
plugins:
- hexo-math
```

현재 사용중인 [Casper](https://github.com/kywk/hexo-theme-casper) 테마에서는 웹페이지의 설명대로 깔끔하게 설치되지는 않았지만, 약간의 수작업을 통해 문제를 해결할 수 있었다. Casper 테마의 디렉터리 구조가 다른 테마와 조금 달라 생긴 문제인듯 하다. `math-jax.ejs` 파일을 `casper/layout/casper` 디렉터리에 복사해주니 잘 동작했다.

시험 삼아 간단한 수식을 입력해봤는데, 잘 나온다.

$$\frac{\partial L}{\partial q_j} - \frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}_j}\right) = 0$$
