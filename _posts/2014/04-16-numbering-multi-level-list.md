date: 2014-04-16
tags: [에디터_개발, 알고리즘, Clojure]
title: 다단계 번호 매기기
---
요즘은 간단한 로직을 테스트할 때 Clojure로 코드를 작성해 확인해보곤 한다. 다단계 번호매기기도 Clojure를 사용해 로직을 구현해보고 생각대로 잘 되는 것을 확인한 다음 JavaScript로 옮기는 방법을 사용했다.

MS워드에는 다단계 번호매기기 기능을 사용하면 다음과 같은 식으로 다단계 번호를 매길 수 있다.
<!-- more -->

```
1. 항목 1
  1.1 항목 11
  1.2 항목 12
    1.2.1 항목 121
    1.2.2 항목 122
  1.3 항목 13
2. 항목 2
```

다단계 번호는 어떻게 구현할 수 있을까? 문서 모델이 다음과 같이 되어 있다면 목록(list)을 선택해 수준(level)의 배열을 만들어 각 수준에 맞는 번호를 생성하면 될 것 같다.

```html
<p class="list" level="1">항목 1</p>
<p class="list" level="2">항목 11</p>
<p class="list" level="2">항목 12</p>
<p class="list" level="3">항목 121</p>
<p class="list" level="3">항목 122</p>
<p class="list" level="2">항목 13</p>
<p class="list" level="1">항목 2</p>
```

따라서 이 예제 모델에 대한 다단계 번호를 생성한다면 입력을 다음과 같이 줄 수 있다.

```clojure
(def levels [1 2 2 3 3 2 1])
```
목록의 번호는 **이전 번호**(`ns`)와 현재 항목의 **수준**(`level`)에 따라 결정되므로 항목의 번호를 구하는 함수는 다음과 같이 구현할 수 있다.
```clojure
(defn item-number [level ns]
  (if (<= level (count ns))
    (let [ns (vec (take level ns))]
      (assoc ns (dec level) (inc (last ns))))
    (vec (concat ns (repeat (- level (count ns)) 1)))))
```

항목 번호는 `1.2.2`와 같은 식으로 표현되겠지만 문자열로 다룬다면 처리가 복잡해질 것이므로 이 함수에서는 `[1 2 2]`와 같은 식의 번호 벡터를 인자로 받고 리턴할 때도 번호 벡터를 리턴한다. 목록의 첫 항목 이전은 번호가 없으므로 처음 호출할 때는 `(item-number 1 [0])`과 같은 식으로 하면 될 것이다.

이제 `levels`를 받아 항목 번호를 생성하는 함수를 만들 수 있다.

```clojure
(defn numbers [levels]
  (loop [prev-number [0], levels levels, acc []]
    (if (seq levels)
      (let [curr-number (item-number (first levels) prev-number)]
        (recur curr-number, (rest levels), (conj acc curr-number)))
      acc)))
```

REPL에서 테스트해보면 잘 동작한다.
<pre class="console">
user> (numbers levels)
[[1] [1 1] [1 2] [1 2 1] [1 2 2] [1 3] [2]]
</pre>

이제 에디터에서 jQuery 선택자로 목록을 선택한 다음 루프를 돌며 번호를 구해 렌더링 마크업을 만들어주면 된다. 에디터를 개발하는 데 ClojureScript를 사용하고 있지는 않으므로 코드를 JavaScript로 옮겨야 한다. [underscore.js](http://underscorejs.org/)나 [lo-dash](http://lodash.com/)를 사용하면 대략 비슷하게 옮길 수 있다.
