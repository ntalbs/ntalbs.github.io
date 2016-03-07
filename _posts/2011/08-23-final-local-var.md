date: 2011-08-23
tags: [Java]
title: 지역 변수에 final을 붙여야 하나
---
회사에서 작성하는 모든 소스 코드에 대해 Quality Practice(이하 QP)를 적용하려 하고 있다. Java 코드에 대해서는 [Findbugs](http://findbugs.sourceforge.net/), [PMD](http://pmd.sourceforge.net/), [Checkstyle](http://checkstyle.sourceforge.net/)과 같은 도구를 사용해 소스 코드를 분석한다. 물론 각 도구를 적용할 때의 규칙(rule)은 QP 담당자였던 내 주관적 판단(또는 취향)에 따라 조정한다.<!--more--> <span style="color:lightgray">(지금은 QP 담당자가 다른 사람으로 바뀌었지만, 각 규칙을 조정할 정도로 관심을 가지지는 않는 듯 하다.)</span>

이런 도구를 사용하면 코딩 표준을 강제할 수 있을뿐 아니라 잠재적 문제가 있는 코드, 비효율적인 코드 등을 쉽게 발견해준다. 그러나, 각 도구의 규칙이 서로 충돌하는 경우도 있고, 심지어 한 도구 내에서도 서로 충돌하는 규칙도 있다. 따라서 모든 규칙을 만족하도록 코드를 작성하는 것은 바보같은 짓이다. **각 규칙을 확인하고 자신의 개발 조직에 맞도록 규칙을 지속적으로 조정해가는 것이 좋다.**

그런데 가끔 고민을 하게 만드는 규칙이 있다. 예를 들면 PMD의 `LocalVariableCouldBeFinal`과 같은 규칙이 그렇다. 이 규칙의 의도는 이해할만 하다. 지역변수라도 변하지 않는 것은 `final`로 선언해 의도를 명확히 하자는 것이다. 그런데 변하지 않는 지역변수에 모두 `final`을 붙이는 것은 소스 코드를 너저분하게 만든다는 문제가 있다. 바로 이 부분에서 개인적으로 취향이 갈릴 것이다. 좋은 규칙을 따르는 것이 좋지만 너저분한 것은 싫어한다는 것에서 내 고민이 시작된다. 업계의 Best Practice가 `final`을 붙이는 것이라면 따지지 말고 그냥 붙이자는 심산으로 인터넷을 검색해보기도 했지만, 붙여어 된다, 필요없다 의견이 갈리는 것 같다.

[Do you “final”ize local variables and method parameters in Java?](http://stackoverflow.com/questions/316352/why-would-one-mark-local-variables-and-method-parameters-as-final-in-java)

공통된 업계 의견이 없다면 이 규칙을 적용하는 것이 어떤 도움이 될지를 생각해보는 것이 좋겠다. 이 규칙을 적용한 다음 개발자에게 이 규칙을 따르라고 압박하면 아마 개발자들은 기계적으로 지역변수 선언부에 `final`을 붙일 것이다. 이렇게 된다면 어떤 좋은 점이 있을까?

PMD는 지역변수 중 한 번만 할당되는 것을 찾아 `final`을 붙일 수 있다고 알려줄 뿐이다.
