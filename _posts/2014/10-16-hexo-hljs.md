title: "Hexo: 소스 코드 하이라이팅 스타일 변경"
tags: hexo
date: 2014-10-16

---
블로그 테마를 수정하면서 소스 코드 하이라이팅 스타일도 바꾸고 싶었다. 내 테마의 스타일은 [stylus](http://learnboost.github.io/stylus/)로 되어 있는데, 파일을 살펴보니 중간에 다음과 같은 부분이 보였다.
<!--more-->

```css
/* Theme: Solarized - Github
 * More theme here: http://softwaremaniacs.org/media/soft/highlight/test.html
 */
pre .comment,
pre .template_comment,
.diff pre .header,
pre .javadoc
  color #998
  font-style italic
...
```

이 부분에서 소스 코드 하이라이팅 스타일을 지정하는 것으로 보였다. 내가 색상을 일일히 편집할 수는 없으므로 다른 테마를 적용할 수 있을까 해서 브라우저로 주석에 나온 URL을 열어 보았다. 리디렉트 되어 [highlight.js](https://highlightjs.org/)의 [데모/테스트 페이지](https://highlightjs.org/static/test.html)가 열렸다. 마음에 드는 스타일을 골라 적용하면 되겠다 싶었다. highlight.js의 소스 코드는 <https://github.com/isagalaev/highlight.js>에 있었고, 각 스타일에 대한 CSS 파일도 찾을 수 있었다. 마음에 드는 스타일 파일을 내 테마 디렉터리에 복사하고, 이 CSS를 블로그 페이지에서 참조하도록 수정했다.

그런데 문제가 있었다. CSS 파일을 살펴보니 모든 클래스에 `hljs-` 접두어가 붙어 있었다. 이래서는 CSS 파일만 추가해 소스 코드 하이라이팅 스타일을 바꿀 수 없었다. 구글에서 'hexo hljs'로 검색하니 [관련 이슈](https://github.com/hexojs/hexo/issues/434)가 나왔는데, 여기서는 내용이 반대였다. 즉 highlight.js가 버전이 올라가면서 `hljs-` 접두어를 붙이는 바람에 기존 코드 스타일이 깨지니 접두어를 붙이지 않도록 설정하자는 것이었다. 그리고 그게 Hexo 소스(`lib/util/highlight.js`)에도 반영이 되어 있었다.

highlight.js의 기능과 스타일을 그대로 사용하기 위해 원래대로 돌려놓아야 했다. 생각해보니 Hexo는 node.js로 작성되었으니 소스 코드는 JavaScript 파일일테고, 내가 찾아 직접 수정할 수 있겠다는 생각이 들었다.

그래서 먼저 hexo가 설치된 디렉터리를 확인했다.

<pre class="console">
$ which hexo
/usr/local/bin/hexo

$ ls -l /usr/local/bin/hexo
lrwxr-xr-x  1 ntalbs  admin  33  9 12 14:43 /usr/local/bin/hexo@ -> ../lib/node_modules/hexo/bin/hexo
</pre>

내 시스템에서는 Hexo가 `/usr/local/lib/node_modules/hexo/`에 설치되어 있는 것을 확인할 수 있었다. 이제 `lib/util/highlight.js` 파일을 찾을 차례다.

<pre class="console">
$ cd /usr/local/lib/node_modules/hexo/
$ ls
LICENSE       README.md     bin/          lib/          package.json
Makefile      assets/       gulpfile.js   node_modules/

$ cd lib
$ ls
box/     error/   hexo.js  loaders/ model/   post/    util/
core/    extend/  init.js  logger/  plugins/ theme/

$ cd util
$ ls
escape.js     file2.js      html_tag.js   permalink.js  spawn.js
exec.js       format.js     index.js      pool.js
file.js       highlight.js  inflector.js  server.js
</pre>

`/usr/local/lib/node_modules/hexo/lib/util`에 `highlight.js` 파일이 있었다. 파일을 열여 다음과 같이 수정했다. 어쩌면 `hljs.configure({...});`를 통째로 날려도 될지 모르겠다.

```diff
  hljs.configure({
-  classPrefix: ''
+  classPrefix: 'hljs-'
  });
```

이렇게 수정한 다음 생성된 HTML을 확인했다. 스타일 CSS 파일에는 `.hljs` 클래스가 정의되어 있지만, 생성된 HTML에서는 `<figure class="highlight>`와 같이 되어 있었다.  `lib/util/highlight.js` 파일을 살표보니 `<figure>`에 `highlight` 클래스를 붙이는 부분이 있었다.

```diff
-  var result = '<figure class="highlight + (options.lang ? ' ' + options.lang : '') + '">' +
+  var result = '<figure class="hljs' + (options.lang ? ' ' + options.lang : '') + '">' +
    (options.caption ? '<figcaption>' + options.caption + '</figcaption>' : '');
```

다시 HTML을 생성해 확인했는데, 소스 코드에서 빈 줄이 있는 경우 달랑 `<div class="line"></div>`만 생성되어 빈 줄이 제대로 표현되지 않았다. 각 행을 렌더링하는 부분을 찾아 빈 줄인 경우 `<div>` 안에 `\ufeff`를 넣도록 수정했다.

```diff
  lines.forEach(function(item, i){
    numbers += '<div class="line">' + (i + firstLine) + '</div>';
-   content += '<div class="line">' + item + '</div>';
+   content += '<div class="line">' + (item?item:'\ufeff') + '</div>';
  });
```

이제 다 된 것 같아 블로그 HTML을 다시 생성해 브라우저에서 확인해 보았다. 잘 된 것 같은데 뭔가 빠진 것 같은 생각이 들었다. 자세히 살펴보니 <https://highlightjs.org/static/test.html>에서 렌더링된 결과와 뭔가 달랐다. 확인해보니 Hexo가 사용하는 `highlight.js` 버전이 `8.1.0`이었다. Hexo의 `package.json` 파일을 편집해 `highlight.js` 최신 버전을 사용하게 했다.

```diff
   "dependencies": {
     ...
-    "highlight.js": "8.1.0",
+    "highlight.js": "8.3.0",
     ...
```

그리고 Hexo 설치 디렉터리에서 `npm update` 명령을 실행했다. `npm list`로 확인해보니 제대로 업데이트 된 것 같다. HTML을 생성해 확인해 보니 제대로 되어 있다. 내 테마 스타일 파일에서 소스 코드 스타일을 지정하는 부분은 더 이상 필요하지 않으므로 삭제해도 된다.

```diff
- /* Theme: Solarized - Github
-  * More theme here: http://softwaremaniacs.org/media/soft/highlight/test.html
-  */
- pre .comment,
- pre .template_comment,
- .diff pre .header,
- pre .javadoc
-   color #998
-   font-style italic
  ...
```

이제 `highlight.js` 스타일을 가져다 마음껏 바꿀 수 있게 되었다. 다만 Hexo가 업데이트 되면 내가 수정한 내용도 날아갈테니 Hexo에 내가 수정한 내용을 Pull Request 해봐야 겠다.
