tags: [emacs]
date: 2015-10-30
title: "Emacs에서 £ 기호 입력하기"
---
최근 영국과 메일을 주고 받다 보니 영국 화폐 단위인 파운드 기호(£)를 입력하는 일이 잦아졌다. 처음에는 Mac OS X에서 제공하는 특수문자 입력 기능을 사용했지만 너무 불편했다. 영국 키보드로는 파운드 기호를 쉽게 입력할 수 있겠다 생각되어 시스템 설정에서 입력 소스를 British로 바꾸니 `Shift+3`으로 파운드 기호를 쉽게 입력할 수 있었다.<!--more-->

그러나 여전히 다음과 같은 불편함이 있었다.

* 입력 소스가 British, U.S, 한글 세 가지가 되어 한영 전환할 때 너무 불편하다.
* 영국 키보드는 `Shift+3`을 누르면 `£`가 입력되는데 이렇게 하니 `#`을 입력하기가 불편해졌다.
* 겨우 영국 키보드에서 `Alt+3`을 누르면 `#`이 입련된다는 사실을 알게 되었지만, Emacs에서 `Alt+(숫자)` 키는 명령에 숫자 인자를 전달할 때 사용되고 있어 `Alt+3`을 사용할 수 없다.

[StackExchange에 질문](http://emacs.stackexchange.com/questions/17546/how-to-input-in-emacs-with-uk-keyboard)도 올리고, 구글로 검색한 결과 다음과 같은 사실을 알게 되었다.

* 영국 키보드에서 `Shift+3`은 `£`, `Alt+3`은 `#`가 입력된다.
* 미국 키보드에서 `Shift+3`은 `#`, `Alt+3`은 `£`가 입력된다.

나머지 일반 알파벳이나 숫자, 특수 기호에 대한 레이아웃은 동일한 것으로 보였다. Emacs에서 `Alt+(숫자)` 키의 특수한 동작 문제만 해결할 수 있다면 굳이 영국 키보드를 쓸 필요는 없어 보였다.

해결 방법은 다음과 같다.

## `Alt+3` 키 바인딩 변경
`Alt+3` 키 바인딩을 오버라이드 하는 방법이다. 다음과 같이 £ 기호를 입력하는 `insert-pound` 함수를 작성하고 `M-3`을 눌렀을 때 `insert-pound`를 호출하도록 하면 된다.

```lisp
(defun insert-pound ()
  "Inserts a pound into the buffer"
  (interactive)
  (insert "£"))
(global-set-key (kbd "M-3") 'insert-pound)
```

이렇게 하면 `M-3`으로 숫자 인자를 전달하는 것은 포기해야 한다. `C-3`으로 대신할 수는 있겠지만 마음이 편하지는 않다.

## 오른쪽 `Alt`키 설정 변경
`ns-right-alternate-modifier`를 `none`으로 설정하면 오른쪽 `Alt`키를 Emacs가 처리하지 않도록 할 수 있다. 이렇게 한 후 오른쪽 `Alt`키와 `3`을 동시에 누르면 다른 일반 에디터에서 `Alt+3`을 눌렀을 때와 동일하게 동작하므로 `£`이 입력될 것이다. 다음과 같이 `ns-right-alternate-modifier` 설정값을 바꿀 수 있다.

```
M-x customize-variable <RET> ns-right-alternate-modifier
```

Emacs를 사용할 때 `M-`를 사용는 경우 왼쪽 `Alt` 키를 사용하고 오른쪽 `Alt` 키를 사용하는 경우는 없었다. 맥 키보드에서는 `Alt` 키와 다른 키를 조합해 다양한 기호를 입력할 수 있는데, 오른쪽 `Alt`키의 설정을 변경하면 Emacs 사용에 영향을 주지 않으면서 다양한 기호를 입력할 수 있게 된다. `Alt+3`만 오버라이드 하는 것보다 이 방법이 더 좋아 보인다.

## `C-x 8 L`로 £ 입력
`C-x 8 C-h`를 누르면 `C-x 8` 변환으로 입력할 수 있는 문자 목록이 나온다. `£` 기호는 `C-x 8 L`(대문자 L)로 입력할 수 있다. 이 방법은 Emacs에서만 가능한 것이다.

메일을 보낼 때는 브라우저에서 `£` 기호를 사용해야 하므로 오른쪽 `Alt` 키 설정을 변경하는 방법이 더 마음에 든다. 사용하는 프로그램에 관계 없이 같은 방법으로 `£`를 입력할 수 있기 때문이다.

## 참고
* [Typing the pound, or hash (#) key in emacs on Uk Macbook](http://jimbarritt.com/non-random/2010/11/07/typing-the-pound-or-hash-key-in-emacs-on-uk-macbook/)
영국 키보드에서 `Alt+3`을 오버라이드 해 `#`이 입력되도록 하는 방법을 설명한다. `Alt+3` 키 바인딩 변경 방법을 설명하면서 보인 코드는 여기 나온 코드를 조금 수정한 것이다.
* [Emacs question - hash key](http://stackoverflow.com/questions/3977069/emacs-question-hash-key)
스택오버플로우에도 관련 질문이 올라와 있다. 여기에도 `Alt+3`을 오버라이드 하는 방법과 `ns-right-alternate-modifier` 설정을 바꾸는 방법에 대한 설명이 있다.
* [How to input '#' in emacs with UK keyboard?](http://emacs.stackexchange.com/questions/17546/how-to-input-in-emacs-with-uk-keyboard)
