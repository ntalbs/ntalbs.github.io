tags: [에디터_개발, javascript]
date: 2015-07-28
title: 에디터 입력기 만들기
---
`contenteditable`을 사용하지 않고 에디터를 개발하기로 했다면 브라우저에서 키 입력 이벤트를 받아 처리할 IME(Input Method Editor)를 만들어야 한다. 텍스트 필드나 `div`에 텍스트를 입력할 수 있게 한 다음 여기서 키 이벤트를 받아 처리하는 방식으로 구현한다. `div`에 텍스트를 입력하려면 `contenteditable`을 써야 하지만, 에디터 창에 `contenteditable`을 써서 편집하는 것과는 다르다. 개발할 때는 입력을 제대로 처리하는 지 확인하기 쉽게 IME를 표시하기도 하지만, 나중에는 IME를 보이지 않게 처리해 에디터 화면에 텍스트가 직접 입력되는 것처럼 보이게 한다.<!--more-->

알파벳이나 숫자, 특수문자가 입력될 때는 `keydown` 이벤트를 받아 처리하면 된다. 그러나 여러 번의 키 입력이 조합되어 글자가 만들어지는 한국어, 중국어, 일본어 문자를 입력하려면 `keydown` 또는 이와 비슷한 유형의 `keyup`, `keypress` 같은 이벤트 만으로는 제대로 처리할 수 없다. 여러 키 입력의 조합으로 문자가 완성되는 글자 입력이 들어오는 경우에는 `CompositionEvent`를 받아 처리해야 한다.

## 입력 컴포넌트
키 입력을 받으려면 이를 위한 컴포넌트(또는 요소)가 필요하다. `<input type="text">` 또는 `<div contenteditable="true">`를 사용해 키 입력을 받을 수 있다. `<input type="text">`을 썼을 때와 `<div contenteditable="true">`를 썼을 때 `CompositionEvent`가 발생하는 양상이 다르므로 주의가 필요하다. 또한 IE의 경우 `compositionend` 이벤트가 기대대로 발생하지 않아 이벤트의 `data` 속성 값 만으로는 입력된 내용을 모두 알 수 없다. 따라서 입력 컴포넌트에 있는 값을 활용해야 한다.

입력 컴포넌트에 입력된 내용을 계속 쌓아둘 수 없으므로 적절한 시점에 비워줘야 한다. 입력 컴포넌트를 비울 수 있는 시점은 다음과 같다.

* 단축키 이벤트 처리 시
* `keypress` 이벤트 처리 후
* `compositionstart` 이벤트 처리 시

## keydown, keypress, keyup
알파벳, 숫자, 특수문자와 같이 키를 누르면 바로 입력되는 글자는 `keydown`, `keypress` 또는 `keyup`에서 처리할 수 있다. 상태 관리와 제어 문제로 단축키는 `keydown`에서 처리하고, 글자 입력은 `keypress`에서 처리했는데, 이 때문에 알파벳이나 숫자, 특수문자 키를 계속 누르고 있어도 입력이 반복되지 않는다. 한글 상태에서는 키를 계속 누르고 있으면 반복 입력되는 것과 비교된다. 이 문제를 해결하려면 글자 입력도 `keydown`에서 처리해야 하지만, 현재로서는 쉽지 않다.

## CompositionEvent
`CompositionEvent`가 발생하는 양상은 운영체계, 브라우저, 운영체계에서 사용하는 IME, 자판(두벌식, 세벌식)에 따라 조금씩 차이가 있다. 심지어 입력 컴포넌트로 텍스트 필드를 사용하느냐 `div`를 사용하느냐에 따라 이벤트 양상이 미묘하게 달라지기도 한다. 모든 조합에서 제대로 동작하게 IME를 만드는 것은 매우 까다로운 작업이다. `CompositionEvent`가 어떤 순서로 발생하는지, 어떤 데이터가 전달되는지를 잘 이해해야 IME를 제대로 구현할 수 있다.

`CompositionEvent`는 `compositionstart`, `compositionupdate`, `compositionend` 순서로 발생한다. `compositionstart`와 `compositionend` 사이 `compositionupdate`는 여러 번 발생할 수 있다. 각 이벤트에는 `data` 속성이 있고 이 값을 통해 입력된 문자를 확인할 수 있다. 예를 들어 세벌식 자판으로 '나라'를 입력할 때는 다음과 같은 순서로 이벤트가 발생한다. 편의상 이벤트 이름과 전달되는 속성 값을 `compositionupdate(data='가')`와 같은 식으로 표기했는데, 발생한 이벤트는 `compositionupdate`고 전달되는 `data` 값은 '가'라는 뜻이다.

1. 'ㄴ' 입력: `compositionstart()`, `compositionupdate(data='ㄴ')` 연달아 발생. 브라우저에 따라 `compositionstart(data='ㄴ')`, `compositionupdate(data='ㄴ')`로 발생할 수도 있다.
2. 'ㅏ' 입력: `compositionupdate(data='나')`
3. 'ㄹ' 입력: `compositionend(data='나')`, `compositionstart()`, `compositionupdate(data='ㄹ')` 연달아 발생. 세벌식 자판에서는 'ㄹ'(초성)이 입력되는 순간에 앞에서 입력한 '나'의 조합이 끝났음을 알 수 있다. 두벌식 자판이라면 `compositionend`가 발생하지 않고 `compositionupdate('날')`이 발생할 것이다.
4. 'ㅏ' 입력: `compositionupdate(data='라')`. 두벌식 자판이라면 이제서야 앞 글자에 대한 `compositionend('나')`가 발생하고 연달아 `compositionstart()`, `compositionupdate(data='라')`와 같은 식으로 발생할 것이다.
5. 뒤에 입력되는 키에 따라 '라' 글자가 완성될 수도 있고 다른 글자로 업데이트될 수도 있다. 공백이나 숫자, 특수문자가 입력되면 한글 조합 상태가 끝나면서 `compositionend`가 발생할 것이다. 한영 입력 상태를 전환해도 마찬가지다.

지금 설명한 이벤트 발생 순서와 양상, `data` 속성으로 전달되는 값은 브라우저마다, 자판마다, 운영체계에서 사용하는 IME마다 조금씩 다르다. 심지어 브라우저 버전에 따라 달라질 수도 있다. 브라우저 종류, 버전, 자판 종류, 운영체계 종류, 사용하는 IME 종류를 모두 고려하면 조합의 수가 엄청나게 늘어나, 모든 경우에 대해 테스트하는 것도 어려워진다.

## TextInput 이벤트
브라우저에 따라 `compositionend` 이벤트의 `data` 속성 값으로 빈 문자열(`''`)이 전달될 수 있다. `compositionend` 시점에 완성된 글자를 알아내기 위해 다른 방법을 조사하던 중, `compositionend`의 `data` 값이 없는 경우(즉 빈 문자열인 경우)에는 `textinput` 이벤트의 `data` 속성에서 완성된 글자를 알아낼 수 있다는 사실을 발견했다. 다만 항상 `textinput` 이벤트를 사용할 것은 아니므로 플래그를 추가해 상태에 따라 `textinput` 이벤트에서 완성된 글자를 알아내도록 해야 한다. 이벤트 이름이 IE에서는 `textinput`(전부 소문자)이고, 웹킷에서는 `textInput`('I'가 대문자)이란 점에 주의해야 한다.

참고: `textinput` 이벤트는 `keypress`를 원래 대체하려고 제안되었지만 지금은 제거되었다. 대신 `beforeinput`과 `input` 이벤트를 사용해야 한다. 즉, 예전에 만들었던 IME를 수정해야 한다는 뜻이다.

## 에디터와 연결
에디터에는 `insertText`, `updateText` 두 메서드가 있어야 한다. `insertText`는 새로운 글자를 입력하는 메서드고, `updateText`는 현재 입력 중인 글자를 업데이트하는 메서드다. 한글은 글자 단위로 완성되지만 일본어의 경우는 한꺼번에 여러 글자를 업데이트하고 완성할 수 있기 때문에 메서드 이름을 `insertText`, `updateText`로 했다.

IME에서는 상황에 따라 두 메서드를 적절히 호출해야 한다. `CompositionEvent`를 사용하지 않는 일반 알파벳이나 숫자, 특수문자 등이 입력된 경우에는 `insertText`를 호출하면 되고, `compositionupdate`가 발생한 경우는 `updateText`를, 나머지 `CompositionEvent`의 경우에는 `insertText`를 호출하면 된다.

입력할 텍스트는 이벤트로 전달되는 키 코드 값이나 `CompositionEvent`의 `data` 값을 사용하면 되지만, 브라우저에 따라 `CompositionEvent`의 발생 양상과 `data` 속성 값이 다르기 때문에 예외 처리가 필요한 경우도 있다. 예를 들어 IE의 경우 한글이 한 글자씩 완성될 때 `compositionend` 이벤트가 제대로 발생하지 않기 때문에 별도 처리가 필요하다.

## 기타
IME 관련 코드는 잘 정리하면 그리 길지 않게 작성할 수 있지만, 테스트하기는 어렵고 깨지기는 쉽다. 특히 브라우저가 업데이트될 때 `CompositionEvent` 발생 양상이 조금 바뀌면 입력이 제대로 안 되거나 이상해지는 문제가 생긴다. IME 코드는 디버거를 써서 디버깅하기도 어렵다. 포커스가 디버거로 가는 순간 컴포지션 상태가 깨지고 기대하지 않게 `compositionend`가 발생할 수 있기 때문이다. IME를 개발할 때는 디버거를 쓰기 보다는 로깅을 활용하는 편이 좋다.

## 참고
* [UI Events Specification (formerly DOM Level 3 Events)](https://w3c.github.io/uievents/)
