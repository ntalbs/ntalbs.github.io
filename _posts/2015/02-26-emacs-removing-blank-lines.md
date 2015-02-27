tags: [emacs]
date: 2015-02-26
title: Emacs에서 빈 줄 지우기
---
편집중인 버퍼에서 빈 줄을 모두 지우고 싶으면 어떻게 해야 할까? 코드를 작성할 때는 이런 경우가 거의 없지만 다른 파일을 편집할 때는 빈 줄을 모두 삭제해야 하는 경우가 종종 생긴다.<!--more-->

Vim이라면 `:g/^$/d`로 가능하다. `:g[lobal]`는 정규표현식에 매치되는 행에 대해 명령을 실행하라는 뜻이고 `^$`가 빈 줄을 뜻하는 정규표현식이다. 행의 시작과 끝 사이에 아무 것도 없으면 빈 줄이다. 약간 응용해서 공백문자만 포함한 행도 삭제하고 싶다면 정규표현식을 `^\s*$`로 할 수 있다. `:d` 명령은 삭제(delete)를 뜻한다.

Emacs에서는 `flush-lines` 함수를 사용한다. 적용할 영역을 선택(mark)한 후 다음 명령을 실행하면 된다.

```
M-x flush-lines RET ^$ RET
```

`flush-lines`는 정규표현식에 매치되는 행을 삭제하는 함수다. `^$`는 Vim에서와 마찬가지로 빈 줄을 뜻하는 정규표현식이다. 공백만 포함한 행도 삭제하고 싶다면 정규표현식으로 `^\s-*$`를 입력해야 한다. Emacs에서는 `\s-`가 공백문자를 나타내는 정규표현식이다.

```
M-x flush-lines RET ^\s-*$ RET
```

[Removing blank lines in a buffer](http://www.masteringemacs.org/article/removing-blank-lines-buffer)에서는 여러 개의 빈 줄을 하나로 합치는 방법도 설명한다. 정규표현식을 사용하는 방법과 키보드 매크로를 사용하는 방법 두 가지를 설명하는데, 정규표현식을 사용하는 방법이 조금 더 간단해 보인다.

여기서는 [visual-regexp](https://github.com/benma/visual-regexp.el) + [visual-regexp-steroids](https://github.com/benma/visual-regexp-steroids.el/)를 사용해 빈 줄을 제거하는 방법과 여러 개의 빈 줄을 하나로 합치는 방법을 추가하려 한다. 빈 줄을 삭제하는 방법은 다음과 같다.

1. `M-<`로 커서를 버퍼 시작 부분으로 이동
2. `C-c r`로 `vr/replace` 명령을 실행
3. `Regexp:`에 `^\n` 입력
4. `Replace with:`에 `RET` 입력 (아무 것도 입력하지 않고 Enter 키 누름)

빈 줄을 뜻하는 정규표현신 `^$` 대신 `^\n`을 사용하는 것에 주의해야 한다. 행 시작 후 바로 `\n`(new line)이 나오면 빈 줄로 보고 여기에 매치되는 경우 `\n`을 빈 문자열로 대체(결과적으로 삭제)하겠다는 뜻이다.

비슷한 방식으로 빈 줄 여럿을 하나로 합치는 것도 가능하다. `^\n{2,}`를 찾아 `\n`으로 바꾸면 되기 때문이다.

## 참고
* [Removing blank lines in a buffer](http://www.masteringemacs.org/article/removing-blank-lines-buffer) 단순히 빈 줄을 지우는 방법뿐 아니라 빈 줄 여럿을 빈 줄 하나로 합치는 방법도 설명한다.
* [Emacs Wiki - Regular Expression](http://www.emacswiki.org/emacs/RegularExpression)
* [visual-regexp](/2014/04/25/visual-regexp/)
* [Stackoverflow - Vim delete blank lines](http://stackoverflow.com/questions/706076/vim-delete-blank-lines)
