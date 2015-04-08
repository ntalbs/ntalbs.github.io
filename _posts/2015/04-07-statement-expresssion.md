tags: [용어]
date: 2015-04-07
title: statement와 expression
---
언젠가 동료 한 명이 'statement와 expression의 차이가 뭔지 아냐?'고 물어본 적이 있다. 프로그래밍 책에서 자주 접했던 용어지만 명확히 답할 수 없었다. statement는 명령문이고 expression은 표현식인데...<!--more-->

지금은 둘의 차이를 알고 있지만 정확한 설명을 위해 위키피디어에서 검색했더니 설명이 자세히 나와 있다. 간단히 정리하면 다음과 같다.

* **statement**: 명령형 언어(imperative programming language)에서 어떤 동작을 수행하는 가장 기본이 되는 요소.
* **expression**: 어떤 다른 값을 산출하는 값, 상수, 변수, 연산자, 함수의 조합.

statement는 값을 산출하지 않으며 부수효과(side effect)를 일으킨다. 콘솔에 메시지를 표시한다든지 파일에 값을 쓴다든지 하는 동작은 모두 부수효과라 할 수 있다. expression은 항상 값을 산출해 리턴하며 많은 경우 부수효과는 없다.

한 가지 놀라운 것은, C나 C로부터 파생된 언어에서 리턴 타입이 `void`인 함수를 호출하는 것도 유효한 expression이란 점이다. 다만 `void` 타입의 값은 사용할 수 없으므로 항상 버려진다.

많은 프로그래밍 언어에서 함수가 부수효과를 포함할 수 있는데, 부수효과를 포함한 함수는 보통 참조 투명성(referential transparency)이 없다. 순수 함수형 프로그래밍에서는 statement가 없고 모두 expression이다.

## 참고
* [Statement (Computer Science)](http://en.wikipedia.org/wiki/Statement_(computer_science))
* [Expression (Computer Science)](http://en.wikipedia.org/wiki/Expression_(computer_science))
