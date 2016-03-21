tags: [Emacs]
date: 2015-03-26
title: "Emacs: 여러 파일 안의 텍스트 찾기/바꾸기"
---
hexo-math 플러그인에서 사용해 수식을 표현하는데, 예전에는 `{% raw %}{% math-block %}...{% endmath-block %}{% endraw %}`로 수식 블록을 표시했지만 Hexo 3.0에서는 이 부분이 깨졌다. 결국 `{% raw %}{% math_block %}...{% endmath_block %}{% endraw %}`를 사용하도록 hexo-math가 수정되었다. 이에 따라 블로그의 모든 글에서 `math-block`을 사용하는 부분을 찾아 `math_block`으로 바꿔줘야 했다. Emacs를 사용하면서 버퍼 안에서 찾기/바꾸기는 많이 해봐 익숙했지만 여러 파일에 대해 찾기/바꾸기를 해본 적은 없었다.<!--more-->

여러 파일에 대해 찾기를 수행할 때는 `grep-find`를 사용했는데, 바꾸기까지 수행하려면 다음과 같이 약간 다른 절차가 필요하다.

## 절차
1. `M-x find-name-dired` 실행 후 찾기를 수행할 루트 디렉터리와 파일 패턴 지정.
2. `t`를 눌러 모든 파일 마크
3. `Q`를 눌러 찾기/바꾸기 할 정규표현식 입력
4. `y` 또는 `SPC`는 바꾸기, `n`은 통과(skip)
5. `M-x ibuffer`로 열린 파일 목록을 표시한 다음 `* u`로 수정한 파일을 마크하고 `S`를 눌러 마크한 파일을 모두 저장한다. 이후 `D`를 눌러 버퍼를 모두 닫는다.

`find-name-dired` 대신 `find-dired`를 사용할 수도 있지만 파일 패턴을 지정할 때 조금 번거로워진다. 예를 들어 마크다운 파일에 대해서만 작업을 한다면 `find-named-dired`를 사용하는 경우에는 파일 패턴을 지정할 때 `*.md`와 같은 식으로 지정할 수 있지만, `find-dired`를 사용하는 경우는 `-iname \*.md`와 같은 식으로 복잡하게 입력해야 한다.

작업 후 파일을 저장할 때 `ibuffer`를 사용하지 않고 `C-x s !`로 수정한 파일을 한번에 저장할 수 있다. `C-x s`를 하면 수정한 파일이 하나식 미니버퍼에 표시되며 저장할 것인지를 묻는데 이때 `!`를 누르면 대상 파일을 모두 저정한다. 그러나 `ibuffer`를 사용하는 쪽이 좀더 편한 것 같다.

## 참고
* [Hexo: 3.0 업그레이드](/2015/hexo-upgrade/)
* [Using Emacs to recursively find and replace in text files not already open](http://stackoverflow.com/questions/270930/using-emacs-to-recursively-find-and-replace-in-text-files-not-already-open)
* [Emacs: Interactively Find/Replace String Patterns on Multiple Files](http://ergoemacs.org/emacs/find_replace_inter.html)
