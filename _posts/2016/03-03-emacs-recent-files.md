tags: [Emacs]
date: 2016-03-03
title: "Emacs: 최근 사용한 파일 목록"
---
최근 사용한 파일 기능은 그리 자주 사용하는 편은 아니었다. 파일을 찾을 때 그 파일을 최근 열었는지 생각하기 보다는 직접 찾는 게 더 빠르다고 생각했기 때문이다. IDE를 쓸 때는 소스 파일을 쉽게 찾을 수 있는 기능을 활용했다. 문서 작업을 할 때도 원하는 파일을 특정 디렉터리에서 빠르게 찾을 수 있었다. 아마도 문서 파일을 보관하는 디렉터리 구조도 복잡하지 않았고 파일도 많지 않았기 때문일 것이다.<!--more--> Emacs에서 파일을 편집할 때도 마찬가지였다. 특정 디렉터리에 필요한 파일이 거의 다 있었고 Dired로 디렉터리를 연 다음 검색해서 원하는 파일을 쉽게 찾을 수 있었다.

그런데 최근 디렉터리 구조가 복잡한 환경에서 파일을 편집할 일이 자주 생겼다. 디렉터리 깊숙한 곳까지 들어가 열었던 파일을 편집하고 닫았는데 다시 열어야 할 일이 생기는 빈도가 늘어나면서 조금씩 짜증이 나기 시작했다. 그러다 문득 Emacs에서 최근 사용한 파일을 다시 열 수 있는 기능이 있을텐데 하는 생각이 들었다. 구글에서 검색해보니 금방 답을 찾을 수 있었다.

별도 패키지를 다운로드할 필요도 없이 `.emacs` 또는 `init.el` 파일에서 `recentf-mode`를 활성화시켜주면 된다. `C-x C-r` 키는 원래 `find-file-read-only`와 연결되어 있는데 이 기능을 사용할 일은 없을 것 같아 `ivy-recentf`로 연결되도록 설정을 바꿨다. 최근 본 파일 목록은 25개 정도만 관리해도 충분할 것 같다.

```lisp
;; recent file list
(require 'recentf)
(recentf-mode t)
(global-set-key (kbd "C-x C-r") 'ivy-recentf)
(setq recentf-max-saved-items 25)
```

Emacs 초기화 파일에 위 내용을 추가한 다음 Emacs를 다시 시작하면 최근 사용한 파일을 쉽게 다시 열 수 있게 된다. 자주 사용하지는 않겠지만 메일 메뉴에도 `Open Recent` 항목이 생긴다. `ivy-mode`와도 잘 동작한다.

{% asset_img ivy-mode.png %}

`M-x customize-mode <RET> recentf-mode`로 `recentf-mode`의 여러 설정을 입맛에 맞게 바꿀 수 있다. 주 메뉴의 `File > Open Recent`를 선택하면 최근 열었던 파일 목록이 표시되고 목록을 삭제하거나 편집할 수 있는 메뉴를 제공한다. 그렇지만 메뉴를 활용하기 보다는 Emacs 명령을 직접 실행하는 경우가 많을 것 같다.

## 참고
* [Find files faster with the recent files package](https://www.masteringemacs.org/article/find-files-faster-recent-files-package)
`recentf` 패키지에 대해 설명한 글이다. `ido-mode`와 연동하는 방법도 설명하지만 여기서는 `ivy-mode` 연동하도록 설정했다.
* [Introducing ivy-mode](http://oremacs.com/2015/04/16/ivy-mode/)
`ivy-mode` 소개 글. 이 글을 보고 `ido-mode`에서 `ivy-mode`로 바꿨다.
