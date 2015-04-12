tags: [hexo, 상념]
date: 2015-04-10
title: Sitemap 생성기
---
블로그를 정적 사이트 생성기로 만들어 GitHup에 처음 올렸을 때가 생각난다. 그전에 사용했던 티스토리나 블로거에서는 글을 올리고 별다른 작업을 하지 않아도 일정 시간이 지난 후 구글에서 검색이 되었다. 그래서 GitHup 페이지로 블로그를 옮긴 다음에도 언제쯤 구글에서 검색이 될까 마냥 기다렸다.<!--more--> 나중에 알고보니 그렇게 기다리기만 한다고 되는게 아니었다. 구글이 내 블로그를 빨리 색인하도록 `sitemap.xml`을 만들어 [구글 웹마스터 도구](https://www.google.com/webmasters/)에 제출해야 했다.

조금 더 검색해보니 [xml-sitemaps.com](https://www.xml-sitemaps.com)와 같이 `sitemap.xml`을 만들어주는 사이트가 있었다. 브라우저로 xml-sitemaps.com에 접속해 내 블로그 URL을 입력하면 `sitemap.xml`을 생성해 다운로드할 수 있게 해 주었다. 이후로는 블로그에 새 글을 쓸 때마다 다음과 같은 무식한 절차를 거쳤다.

1. 블로그를 생성해 GitHup에 배포(푸시)한다.
2. xml-sitemap.com에서 `sitemap.xml`을 생성해 다운로드한다.
3. 다운로드한 `sitemap.cml`을 내 블로그 소스에 포함시켜 사이트를 재생성한다.
4. GitHup에 다시 배포(푸시)한다.

이런 반복적 작업을 감내하고 있었으니 나도 어느 정도 참을성이 있다고 할 수 있을까. 사실은 새 글을 올릴때마다 `sitemap.xml`을 올리는게 귀찮아서 가끔씩, 그러니까 몇 달에 한 번씩만 `sitemap.xml`을 갱신했다.

이렇게 삽질을 계속 하다가 **sitemap 생성기**를 만들어야 겠다는 생각을 했다. 내 블로그 주소를 입력하면 페이지 안의 링크를 따라가며 모든 링크를 수집해 `sitemap.xml` 형식에 맞게 파일을 만들어 주는 명령행 프로그램을 만들면 되겠다는 생각이 들었다. node.js를 이용하면 쉽게 만들 수 있을 것 같았다.

1. 페이지 로딩
2. 페이지에 포함된 링크 중 사이트 안의 링크를 모두 뽑아내서 기록
3. 페이지에 포함된 링크에 대해 하나씩 1-2 반복
4. 더 이상 방문할 링크가 없으면 종료

페이지 로딩은 `http.get`을 이용하면 될 테고, 링크를 추출하는 것은 jQuery를 사용하면 쉬울 것 같았다. node.js에서 jQuery를 사용하는 방법도 찾아봤다. 이렇게 링크 정보를 뽑아낸 다음 `sitemap.xml` 형식에 맞게 파일을 생성하면 될 것이다.

그러다 이걸 아예 Hexo 플러그인으로 만들면 어떨까 생각했다. 참 좋은 생각이란 느낌과 동시에 혹시 누가 이미 만들어놓지 않았을까 하는 생각이 들었다. 검색해보니 역시나, GitHup에서만 sitemap 생성기 프로젝트가 1,400여개나 되었다. 그리고 좀더 찾아보니 이미 [hexo-generator-sitemap](https://github.com/hexojs/hexo-generator-sitemap)이 있었다. 여태 이걸 몰라 삽질을 했단 말인가!

이제 사이트를 생성할 때마다 Hexo가 `sitemap.xml`도 함께 만들어준다. `sitemap.xml`을 갱신하기 위한 무식한 절차를 거치지 않아도 된다. 간만에 쓸모있는 프로그램을 만들게 됐다고 생각했는데... 이미 똑같은 프로그램이 1,400개 이상 존재하는데다 Hexo 원작자가 제공하는 플러그인까지 있는 상황에서 내가 또 삽질할 필요는 없겠다는 생각이 들었다. 그냥 node.js로 이렇게 할 수 있다 정도를 확인한 선에서 만족했다.

## 참고
* [hexo-generator-sitemap](https://github.com/hexojs/hexo-generator-sitemap) Hexo의 sitemap 생성기 플러그인. 사이트 생성 시 sitemap.xml도 함께 생성해준다.
* [xml-sitemaps.com](https://www.xml-sitemaps.com) 지금까지 이 사이트를 이용해 sitemap.xml을 생성했다.
* [Sitemaps](http://en.wikipedia.org/wiki/Sitemaps)
* [Can I use jQuery with Node.js?](http://stackoverflow.com/questions/1801160/can-i-use-jquery-with-node-js)
