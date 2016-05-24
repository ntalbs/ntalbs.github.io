date: 2008-10-28
tags: [DB, Oracle]
title: 올바른 데이터 타입 사용하기
---
데이터베이스에 테이블을 만들 때 각 컬럼의 데이터 타입을 정하는 것은 무척 쉬워 보인다. 데이터베이스에서 기본으로 제공하는 데이터 타입 종류가 엄청나게 많은 것도 아니고, 테이블에 저장할 데이터란 것도 대부분의 경우는 뻔하기 때문이다. 그러나 실제 데이터베이스를 보면 데이터 타입이 잘못 지정된 컬럼을 매우 자주 볼 수 있으며, 신규 테이블 생성을 요청할 때나 또는 컬럼 추가를 요청할 때도 데이터 타입을 잘못 지정해 요청하는 경우가 많다.
<!--more-->
일단 테이블에 데이터가 쌓이기 시작하면 잘못된 것을 알아도 바꾸기가 쉽지 않은 경우가 대부분이므로, 컬럼의 데이터 타입을 정할 때는 신중하게 생각해 저장하고자 하는 데이터에 맞는 데이터 타입을 선정해야 한다. 다음은 오라클 데이터베이스에서 기본적인 데이터 타입을 선택하는 방법이다.

### CHAR vs. VARCHAR2
`CHAR`는 고정길이 문자열 데이터에, `VARCHAR2`는 가변길이 문자열 데이터에 사용하면 되는데, 이걸 이해하지 못해 가변길이 문자열 데이터에 `CHAR` 타입을 사용하는 경우가 종종 있다. 또는 나중에 데이터 길이가 늘어나게 되었는데, 과거 데이터는 예전 길이 그대로 두고, 새로 들어가는 데이터만 늘어난 길이를 사용하게 될 수도 있다. 이렇게 되면 공간을 낭비하게 될 뿐 아니라(요즘은 디스크 값이 싸니 이런 얘기는 씨알도 먹히지 않을 수 있음), 코드에서 컬럼 값을 비교할 때마다 `trim()`을 해주어야 하는 상황이 발생할 수 있으며, 해당 컬럼이 조인 조건으로 사용될 경우에는 더욱 심각한 문제를 유발할 수 있다. 따라서 `CHAR` 타입은 길이가 절대 변할 일이 없는 컬럼에만 사용해야 한다.

### CHAR, VARCHAR2 vs. DATE
날짜 형식의 데이터를 저장할 때 많은 곳에서 데이터 타입을 `CHAR(8)` 또는 `VARCHAR2(8)`로 설정하고 `YYYYMMDD` 형식으로 데이터를 저장한다. 일단 오라클의 경우 `DATE`는 7바이트이고, `CHAR` 또는 `VARCHAR2`로 하면 8바이트는 차지하게 되며 길이를 저장하는 오버헤드까지 합치면 그보다 더 차이가 날 수 있다(이 역시 요즘 디스크 값이 싸니 별 문제 없다고 우기면 할 말 없음). 보다 중요한 문제는 데이터 정합성이 깨질 수 있다는 것이다. `DATE`형식이라면 `"2007년2월31일"` 같은 존재하지 않는 날짜가 데이터베이스에 저장되는 것을 방지할 수 있지만, `CHAR`나 `VARCHAR2`로 날짜를 저장할 경우에는 `'20070231'`이 저장되지 말라는 법이 없다. 게다가 해당 컬럼에 `'ABC'`, `'XYZ'` 같은 문자열을 넣어도 아무런 에러가 발생하지 않으니 시간이 지나면서 잘못된 데이터가 점점 늘어날 수 있다. 애플리케이션에서 데이터를 확인하고 입력하기 때문에 그럴 수 없다고 주장할 수도 있다. 당신이 작성한 프로그램은 정확하다고 할 수 있을지 모르겠으나, 다른 사람이 작성한 프로그램의 정확성까지도 보장할 수 있는가? DBMS 차원에서 그런 말도 안되는 데이터가 애초에 존재할 수 없도록 하는 것이 가장 확실한 방법이다.

### VARCHAR2 vs. NUMBER
숫자 형식의 데이터는 `NUMBER`를 써야 한다. 숫자를 저장하는 데 `VARCHAR2`를 쓰는 것도 잘못된 데이터가 들어갈 수 있도록 문을 열어놓는 것과 마찬가지다. 1, 10, 100과 같은 숫자가 들어가야 하는 컬럼을 `VARCHAR2`로 잡았다면 그 컬럼에 `'ABC'`, `'XYZ'`와 같은 숫자가 아닌 문자열 데이터가 들어가는 것을 어떻게 막을 것인가? 숫자 형식의 데이터를 위한 컬럼이라면 타입 자체를 `NUMBER`로 하는 것이 이를 막는 가장 확실한 방법이다.

### 결론
규칙은 간단하다. 날짜는 `DATE` 타입으로 저장하고, 숫자는 `NUMBER` 타입으로 저장하고, 문자열은 고정길이일 경우(현재도 고정이고 앞으로도 절대 길이가 바뀔 일이 없다는 확신이 있는 경우) `CHAR`, 가변길이인 경우 `VARCHAR2`에 저장하면 된다. 또한 `NUMBER`나 문자열을 저장할 때는 항상 적절한 길이를 지정하는 것이 좋다. 그렇지 않을 경우 데이터의 정합성에 문제가 생길 수 있을 뿐 아니라 성능에도 문제를 일으킬 수 있다.
그리고 `CHAR` 타입에 대해 첨언 하자면, 가변길이와 고정길이에 대한 이해를 제대로 하지 못하는 개발자들이 상당 수 있는 것 같다. '설마 그럴 리가?' 하고 생각할 수도 있겠지만, 여러 프로젝트를 돌아다니면서 보니 정말 그랬다. 또한 처음에는 고정길이였는데, 나중에 자릿수가 늘어난다든가 해서 결국은 데이터 길이가 불규칙해지는 경우도 있는데 이 때는 자릿수를 늘리며 과거 데이터도 수정을 하든가(이러면 프로그램도 손봐야 할 가능성이 매우 크다), 아니면 타입을 `VARCHAR2`로 바꾸는 것이 맞지만 아무 생각 없이 `CHAR` 타입으로 자릿수만 늘리는 경우도 많다. 이런 경우를 대비해 약간의 손해를 감수하더라도 문자열 데이터에 대해서 `CHAR`를 쓰지 않고 무조건 `VARCHAR2`를 쓰는 것도 방법이다. (실제로 그 손해가 얼마나 큰지는 모르겠지만 대세에 영향을 미칠 정도가 아닌 것은 분명하고, `CHAR`가 잘못 사용되었을 때의 위험을 고려한다면 이게 더 이익인지도 모른다.)

### 참고
* Thomas Kyte, Effective Oracle by Design, p374~ (Use the Correct Datatype)
* [날짜 데이터 저장](/2008/storing-dates/)