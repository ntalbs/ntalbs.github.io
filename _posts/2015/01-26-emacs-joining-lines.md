tags: [emacs]
date: 2015-01-26
title: "Emacs: 행 연결"
---
코드를 편집하다 보면 여러 줄을 한 줄로 합치고 싶을 때가 종종 생긴다. 예를 들어 다음과 같은 코드가 있다고 하자.

```
func(arg1,
     arg2,
     arg3);
```

이걸 다음과 같이 바꾸고 싶다.

```
func(arg1, arg2, arg3);
```

<!--more-->Vim에서는 이 작업이 아주 쉽다. 첫 줄 아무 곳이나 커서를 위치시키고 명령 모드에서 `J`를 연달아 누르면 된다. Visual-mode로 세 줄을 선택한 다음 `J`를 누르면 선택한 행을 한 줄로 합쳐준다.

Emacs에서도 작업이 불가능한 것은 아니지만, 기본으로 제공되는 기능은 덜 직관적이고 조금 불편하다. Vim에서와 달리 Emacs에서는 합치려는 코드 블록의 마지막 줄로 커서를 이동한 다음 `M-^`(`delete-indentation`)를 눌러야 한다. 여러 줄을 선택해 `M-^`를 누른 경우 선택 영역의 행을 한 행으로 합쳐주지 않는다. Vim에서 `J`는 다음 행을 현재 행과 연결하지만, Emacs의 `M-^`은 현재 행을 이전 행에 연결한다. 현재 행을 다음 행과 합치려면 `C-u M-^`로 가능하지만, 이걸 반복해서 누르기는 쉽지 않다.

행을 합치는 작업이 아주 빈번한 것도 아니고, 행 합치기 기능이 없더라도 약간의 반복 작업으로 행을 합칠 수 있기 때문에 불편함을 감수했다. 보통은 다음과 같은 식으로 작업했다.

* 현재 행을 다음 행과 합칠 때: 현재 행 맨 뒤로 커서 이동 후 `C-k`(`kill-visual-line`), `M-SPC`(`just-one-space`)를 이용한다.
* 현재 행을 이전 행과 합칠 때: Mac OS X에서는 일반 에디터에서 `Cmd-delete`를 누르면 현재 커서 위치부터 행의 맨 앞까지 삭제한다. 동일한 기능을 Emacs에서도 구현해 `s-backspace`에 바인딩해 두었다. 따라서 `s-backspace`, `backspace`로 현재 행을 이전 행과 합칠 수 있다. 또는 `C-a`, `backspace`, `M-SPC`를 이용할 수도 있다.

그러나 [Joining Lines](http://emacsredux.com/blog/2013/05/30/joining-lines/)에 더 좋은 방법이 정리되어 있다. 현재 행을 다음 행과 합치는 기능을 구현해 놓았는데, 댓글 중에 선택 영역의 행을 합쳐주는 기능의 코드가 보였다. 이 둘을 통합해 다음과 같이 코드를 작성했다.

```
(defun join-lines-in-region (beg end)
  "Apply join-line over region."
  (interactive "r")
  (if mark-active
      (let ((beg (region-beginning))
            (end (copy-marker (region-end))))
        (goto-char beg)
        (while (< (point) end)
          (join-line 1)))
      (delete-indentation 1)))

(global-set-key (kbd "C-^") 'join-lines-in-region)
```

선택 영역이 있는 경우에는 선택 영역에 포함된 모든 행을 하나로 합치고, 선택 영역이 없는 경우에는 현재 행과 다음 행을 하나로 합친다. 이 코드를 `.emacs`에 포함시키면 `C-^`로 편리하게 행을 합칠 수 있다.

## 참고
* [Joining Lines](http://emacsredux.com/blog/2013/05/30/joining-lines/) Emacs에서 행을 합치는 방법에 대해 자세히 정리되어 있다. 댓글 중에 선택 영역의 행을 합쳐주는 eLisp 코드도 있다.
