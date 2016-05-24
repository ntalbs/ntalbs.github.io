date: 2014-06-25
tags: Clojure
title: infix 매크로
---
[Clojure에 대한 오해](/2014/clojure-fallacy/)에서 LISP 언어가 널리 사용되지 않는 주요 이유 중 하나로 **전위 표기법**(prefix notation)을 들었다. LISP의 표현력이 뛰어난 이유 중 하나가 전위 표기법 때문인데 이것 때문에 LISP이 널리 사용되지 못한다니 역설이 아닐 수 없다.
<!--more-->

전위 표기법이 아무리 막강하다 해도 수식을 작성할 때는 불편하다. 전위 표기법에 웬만큼 익숙해졌다 싶은데도 수식을 입력할 때는 여전히 번거롭다. 그래서 중위 표기법(infix notation)으로 작성된 수식을 전위 표기법으로 전환해주는 매크로를 만들면 어떨까 생각했다. 사실 아직까지 매크로를 작성해본 적이 없어 약간 망설여지긴 했지만 한번 해보기로 했다.

일반적인 수식을 완벽하게 해석하기는 어려울 것 같아 다음과 같은 제약조건을 두기로 했다.

* 괄호 안에는 한 가지 연산자만 들어갈 수 있다. 즉 `(1 + 2 + 3)`은 유효하지만 `(1 + 2 - 3)`은 유효하지 않다. 이 제약조건으로 연산자 우선순위 문제도 회피할 수 있다.
* 연산자와 피연산자 사이에는 반드시 공백이 있어야 한다.
* 일단 사칙연산만 지원한다. 즉 `+`, `-`, `-`, `/`만 사용할 수 있다.

먼저 다음과 같이 주어진 수식이 유효한지 확인하는 함수를 만들었다. 리스트 안의 요소가 홀수개인지, 연산자 종류가 모두 같은지 확인한다.

```clojure
(defn- valid? [ops]
  (and (odd? (count ops))
       (->> ops
            rest
            (take-nth 2)
            (apply =))))
```

그리고 다음과 같이 매크로를 작성했다. 처음 작성해보는 것이라 어렵지 않을까 생각했는데, 의외로 단순했다.

```clojure
(defmacro infix [ops]
  (if (coll? ops)
    (if (valid? ops)
      (cons (second ops) (for [x (take-nth 2 ops)] `(infix ~x)))
      (throw (Exception. "Invalid expression.")))
    ops))
```

인자가 컬렉션이 아니면 그대로 리턴한다. 컬렉션이면 유효한 수식인지 확인한다. 유효한 수식인 경우 인자의 두 번째 요소를 연산자로 뽑아내고 짝수번째 인자를 모두 뽑아 재귀적으로 자신을 다시 호출한다.

REPL에서 간단히 테스트해보니 잘 된다.

<pre class="console">
user=> (use '[clojure.walk :only (macroexpand-all)])
nil
user=> (macroexpand-all '(infix (1 + 2)))
(+ 1 2)
user=> (macroexpand-all '(infix (1 + 2 + 3)))
(+ 1 2 3)
user=> (macroexpand-all '(infix ((n * (n + 1)) / 2)))
(/ (* n (+ n 1)) 2)
user=> (def n 15)
#'user/n
user=> (infix ((n * (n + 1)) / 2))
120
user=>
</pre>

이제 `infix` 매크로를 사용해 수식을 알아보기 쉽게 작성할 수 있다. `n(n+1)/2`는 `(infix ((n * (n + 1)) / 2))`로 작성하면 된다. `(/ (* n (+ n 1)) 2)`보다 쓰기도 쉽고 읽기도 쉽다.

이 매크로는 매우 초보적인 것이지만, 매크로를 사용해 언어 표기법을 원하는 대로 바꿀 수 있는 강력함을 느끼기에는 부족함이 없을 듯 하다.