tags: [emacs, regexp]
date: 2014-12-05
title: 정규 표현식을 이용한 찾기/바꾸기 시 카운터 사용
---

반복된 패턴을 찾아 다른 문자열로 치환하고 싶을 때 정규 표현식을 사용하면 편리하다. 지금까지는 정규 표현식을 사용해 문자를 치환할 때 고정된 패턴만 지정할 수 있다고 생각했다. 그래서 스택오어플로우에서 정규 표현식으로 문자열을 치환할 때 카운터(counter)를 사용할 수 있냐는 질문을 봤을 때 '되지도 않는 질문'이라 속단했다.<!--more-->

그러나 정규 표현식으로 문자열을 치환할 때 카운터를 사용하는 방법이 있었다. [gVim find/replace with counter](http://stackoverflow.com/questions/5942360/gvim-find-replace-with-counter)에 Vim에서 정규 표현식 사용 시 카운터를 사용하는 방법이 나와 있다. Emacs에서는 어떻게 할까 궁금해 구글에서 `emacs regexp counter`로 검색해 봤는데, 쉽게 방법을 찾을 수 있었다.

## 문제
``` html
<p>lorem</p>
<p>ipsum</p>
<p>dolor</p>
...
```

위와 같은 텍스트를 정규 표현식을 사용해 다음과 같이 바꿀 수 있을까?

``` html
<p id="1">lorem</p>
<p id="2">ipsum</p>
<p id="3">dolor</p>
...
```

## query-replace-regexp
Emacs의 정규 표현식 치환 명령인 `query-replace-regexp`를 사용할 때는 치환 문자열에서 `\#`로 카운터를 지정할 수 있다. 위 경우라면 다음과 같이 할 수 있겠다.

```
M-x query-replace-regexp RET <p> RET <p id="\#"> RET
```

`C-M-%` 단축키를 사용해도 된다. `\#`는 0부터 시작하는데, 이를 조정하는 방법은 알아내지 못했다.

## query-replace-regexp-eval
`query-replace-regexp-eval`을 이용하면 대치할 문자열에 Lisp 표현식을 사용할 수 있다. 조금 번거롭지만 막강한 기능이라 할 수 있다. 치환 시 카운터는 `replace-count` 변수에 바인드된다. 위 문제는 다음과 같이 간단히 풀 수 있다.

```
M-x query-replace-regexp-eval RET <p> RET (format "<p id=\"%d\">" replace-count) RET
```

`(format ...)`은 Lisp 함수를 호출하는 것이다. C의 `printf` 함수 사용법과 거의 비슷한 것 같다. `%s`는 문자열 인자를, `%d`는 정수 인자를 받는 식이다. `query-replace-regexp`를 썼을 때와 마찬가지로 `replace-count` 역시 0부터 시작한다. 그러나 여기서는 대치할 문자열로 Lisp 표현식을 사용했으므로 이 부분을 다음과 같이 수정해 1부터 시작하도록 바꿀 수 있다.

```
... RET (format "<p id=\"%d\">" (+ replace-count 1)) RET
```

`replace-count` 자리에 `\#`을 써도 된다.

```
... RET (format "<p id=\"%d\">" (+ \# 1)) RET
```

## Visual-regexp-steroides를 사용하는 경우
[visual-regexp](https://github.com/benma/visual-regexp.el)와 [visual-regexp-steroids](https://github.com/benma/visual-regexp-steroids.el/)를 사용하면 정규 표현식에 매치되는 텍스트와 치환될 텍스트가 버퍼에 즉시 표시되므로 문자열 치환 작업을 좀더 쉽게 수행할 수 있다. visual-regexp-steroids에서는 `i`가 카운터 변수다.

`vr/replace`(`C-c r`)를 실행해 찾을 문자열을 입력한 다음 `RET` 하면 치환할 문자열을 입력할 수 있다. 이때 `C-c C-c`를 눌러 수식 입력 모드로 바꾼 다음 다음과 같은 식으로 수식을 입력할 수 있다.

```
"<p id=\""+str(i+1)+"\">"
```

수식 입력 모드에서는 입력 내용이 수식으로 인식된다. 문자열을 `"`로 감싸줘야 하므로 입력하는 내용이 조금 지저분해진다. 매치되는 텍스트와 치환될 텍스트가 버퍼에 바로 표시되는 점을 고려한다면 이 정도 불편은 충분히 감수할 수 있을 것이다.

## 참고자료
* [ReplaceCount](http://www.emacswiki.org/emacs/ReplaceCount) Emacs에서 정규 표현식 치환 시 카운터를 사용하는 방법
* [visual-regexp-steroids](https://github.com/benma/visual-regexp-steroids.el/) visual-regexp-steroids에서 정규 표현식 치환 시 카운터를 사용하는 방법. README.md의 마지막 부분에 수식 사용 예제가 있음
* [Using a regular expression in VIM, how do I replace the asterisks of an unordered list with numbers?](http://stackoverflow.com/questions/27308231/using-a-regular-expression-in-vim-how-do-i-replace-the-asterisks-of-an-unordere) 스택오버플로우에서 발견한 질문. 다른 질문과 중복 처리됨
* [gVim find/replace with counter](http://stackoverflow.com/questions/5942360/gvim-find-replace-with-counter) Vim에서 정규 표현식 치환 시 카운터를 사용하는 방법에 대한 질문과 대답
* [visual-regexp](/2014/04/25/visual-regexp/)
