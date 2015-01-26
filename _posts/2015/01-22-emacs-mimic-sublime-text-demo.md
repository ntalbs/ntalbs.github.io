tags: [emacs]
date: 2015-01-22
title: Emacs에서 Sublime Text 데모 편집 흉내내기
---
[Sublime Text 에디터](http://www.sublimetext.com/) 홈페이지에 있는 데모 화면을 보고 감탄했던 적이 있다. 특히 데모 2/6에 감탄해 Emacs에서 비슷하게 해보려 했지만 성공하지 못했다. 그동안 에디터가 많이 발전했음을 느끼며 주 사용 에디터를 Sublime Text로 바꿔볼까 생각했다. 사용해보고 마음에 들면 기꺼이 정품을 구입할 생각이었다.<!--more-->

그러나 Sublime Text만의 독특한 단축키 체계에 적응할 수 없었다. 그전에 JetBrain의 [WebStorm](https://www.jetbrains.com/webstorm/)을 구입하려다 포기했을 때와 같은 이유였다. WebStorm도 정말 훌륭해 보였지만 단축키에 적응하는 것은 불가능해 보였다. 아마 키 매핑을 모두 바꿀 수도 있겠지만, 그렇게 하면서까지 사용하고 싶지는 않았다.

최근 [multiple-cursors](https://github.com/magnars/multiple-cursors.el)와 [paredit-mode](http://emacswiki.org/emacs/ParEdit) 기능을 조합해 Sublime Text에서 감탄했던 데모를 Emacs에서 그대로 재현할 수 있는 방법을 알게 되었다.

multiple-cursors와 paredit-mode가 활성화되어 있다면 다음 절차대로 하면 된다.

1. `C->`x5, (`mc/mark-next-like-this`) `Mon`부터 `Sat`까지 각 행 앞에 커서를 복사한다.
2. `M-"`, (`paredit-meta-doublequote`) 각 행을 따옴표로 감싼다.
3. `C-e`, 각 행의 맨 뒤로 커서(multiple cursors)를 옮긴 후 각 행 뒤에 `,`가 입력한다.
4. `M-^`, (`delete-indentation`) `"Mon"`부터 `"Sat"`까지 각 행을 한 줄로 합친다.
5. `C-g`, 커서를 하나로 만든다
6. `C-e`로 행의 맨 뒤로 커서를 옮겨 마지막 `,`를 삭제한다.
7. `C-S-a`로 행 전체를 선택한 다음 `[`를 눌러 행 전체를 `[`와 `]`로 감싼다.
8. `C-a`로 행의 맨 앞으로 커서를 옮겨 `days = `를 입력한다.

이 과정을 동영상으로 만들어봤다. Sublime Text의 데모 2/6과 비교해 전혀 꿀리지 않는다.

{% youtube PSwGFCBoMsk %}
