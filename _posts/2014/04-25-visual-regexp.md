title: visual-regexp
date: 2014-04-25
tags: [emacs, regexp]

---
Emacs나 Vim을 사용할 때 **정규표현식**을 자주 활용한다. Vim의 정규표현식에는 조금 익숙해 졌는데 Emacs의 정규표현식은 Vim과 미묘하게 달라 가끔 애를 먹일 때가 있다. 그런데 최근 [visual-regexp](https://github.com/benma/visual-regexp.el)를 알게 되었다.<!--more--> Emacs에 원래 있는 `replace-regexp`와 비슷한 녀석인데 정규표현식을 입력하면 편집중인 버퍼에 피드백이 즉시 표시된다. 따라서 입력하고 있는 정규표현식에 대응되는 문자열, 캡쳐링되는 부분까지 바로 확인할 수 있다.

`replace-regexp`를 사용할 때는 열심히 입력한 정규표현식 어딘가에 오류가 있어 텍스트가 잘못 매치되거나 아예 매치되지 않는 경우가 많았다. 이런 경우 입력했던 정규표현식을 뚫어져라 쳐다보며 어디가 잘못됐는지 직접 찾아내는 수밖에 없었다. `visual-regexp`를 사용하면 정규표현식을 입력하는 즉시 매치되는 부분이 버퍼에 표시되고, 바꿀 문자열을 입력할 때도 매치된 문자열이 어떻게 바뀌는지 시각적으로 보여주기 때문에 실수를 예방할 수 있다.

[visual-regexp-steroids](https://github.com/benma/visual-regexp-steroids.el/)도 함께 사용하면 좋다. `visual-regexp-steroids`는 현대적인 정규표현식 엔진을 사용할 수 있게 해준다. 둥근괄호를 사용할 때 더 이상 이스케이프를 하지 않아도 된다.

이제 Emacs에서 정규표현식을 사용하는 것이 전보다 훨씬 즐거워졌다.

## 참고
* [visual-regexp](https://github.com/benma/visual-regexp.el)
* [visual-regexp-steroids](https://github.com/benma/visual-regexp-steroids.el/)
* [visual-regexp 데모 동영상](//www.youtube.com/embed/qm5Fy8PFCjQ)

{% youtube qm5Fy8PFCjQ %}
