tags: [tip]
date: 2015-01-12
title: Mac OS X에서 Eclipse 종료 단축키 변경
---
Eclipse에서 개발할 때 Quick Fix 기능을 자주 사용한다. 입력하던 코드에 빨간색 물결 모양의 밑줄이 표시되면 바로 `Cmd+1`(윈도우에서는 `Ctrl+1`)을 누른다. 대부분의 경우 Quick Fix가 제안하는 대로만 해도 문제가 해결된다. 그런데 맥북에어에서 작업할 때는 `Cmd+1`을 누르려다 `Cmd+Q`를 누르는 실수를 자주 한다. `Cmd+Q`는 Mac OS X의 거의 모든 애플리케이션에서 종료 단축키로 사용된다. `Q`와 `1`이 가까이 있는 데다 맥북에어는 키보드가 일반 키보드에 비해 조밀하기 때문에 `1`을 누르려다 실수로 `Q`를 눌러 의도치 않게 Eclipse가 종료되어 여간 짜증나는 게 아니었다.<!--more-->

Eclipse에서 혹시 종료 단축키를 바꿀 수 있을까 열심히 찾아 봤지만 알아내지 못했다. 혹시나 하는 마음에 스택오버플로우에 질문을 올렸지만 몇 달이 지나도록 답이 달리지 않아 방법이 없나보다 하고 포기하고 있었다. 그런데 얼마 전 답이 달렸다. 방법은 다음과 같다.

## 종료 단축키 변경 방법

1. `System Preferences > Keyboard > Shortcuts > App Shortcuts`로 이동해 `+` 버튼 클릭
{% asset_img 1.png %}
2. Application 항목에 Eclipse를 지정하고, 메뉴 이름과 단축키 지정
{% asset_img 2.png %}
3. Eclipse에서 변경된 단축키 확인
{% asset_img 3.png %}

Mac OS X에서는 OS에서 애플리케이션에 대한 단축키를 제어할 수 있다는 점이 특이하게 생각됐다. 이제 `Cmd+1`을 누르려다 실수로 `Cmd+Q`를 눌러 Eclipse를 종료시켜 놓고 황당해하지 않을 수 있게 되었다.

## 참고
* [Changing Eclipse shortcut for Quit in Mac OS X?](http://stackoverflow.com/questions/25635164/changing-eclipse-shortcut-for-quit-in-mac-os-x/27887306#27887306)
