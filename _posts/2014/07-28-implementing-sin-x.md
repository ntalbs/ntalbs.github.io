tags: [알고리즘, 수학, Clojure]
date: 2014-07-28
title: 매클로린 급수를 이용한 sin(x) 구현
---

[뉴튼 법을 이용한 근사값 구하기](/2014/07/25/newtons-method/)에서 매클로린 급수를 이용해 $\sin x$와 같은 초월함수의 값을 구할 수 있다고 했다. 여기서 clojure를 이용해 직접 구현해보려 한다.<!--more--> $\sin x$의 매클로린 급수는 다음과 같다.

{% math %}
\begin{aligned}
\sin x &= \sum\limits_{n=0}^\infty \frac{(-1)^n}{(2n+1)!}x^{2n+1}\\
       &= x - \frac{x^3}{3!} + \frac{x^5}{5!} - \frac{x^7}{7!} + ...
\end{aligned}
{% endmath %}

먼저 `factorial` 함수가 필요하다. `factorial` 함수는 매우 빠르게 증가하는 함수라 인자가 조금만 커져도 금방 정수 허용 범위를 넘는다. 여기서는 비교적 적은 수($n \le 10$)에 대해서만 고려할 것이므로 다음과 같이 간단하게 구현할 수 있다.

```clojure
(defn- factorial [n]
  (apply * (range 1 (inc n))))
```

구현은 쉽다. 1부터 n까지 숫자를 만들어 모두 곱하면 된다. 굳이 재귀를 쓸 필요도 없다.

급수의 맨 앞 몇개 항만 사용한다면 그냥 하드코딩 해도 되겠지만, 나중에 항 수를 쉽게 늘릴 수 있도록 n번째 항을 구하는 함수도 만들자.

```clojure
(defn- nth-term [n x]
  (* (/ (Math/pow -1 n) (factorial (+ (* 2 n) 1)))
     (Math/pow x (+ (* 2 n) 1))))
```

코드가 무척 복잡해 보인다. LISP 계열 언어로 수식을 작성할 때 이런 점이 불편하다. [infix 매크로](/2014/06/25/infix-macro/)를 적용할 수도 있겠지만, 여기서는 일단 그냥 쓰자. 이 정도는 충분히 커버할 수 있다.

항을 무한대로 전개하면 $x$도 아무거나 받아도 되겠지만, 여기서는 앞의 몇 개 항만 사용할 것이므로 $x$의 범위도 $ -\pi \le x \le \pi$로 제한하자. $\sin x$는 주기가 $2\pi$인 주기 함수이므로 어떤 입력이 들어오든 제한된 범위로 매핑할 수 있다.

```clojure
(defn- normalize [x]
  (let [pi Math/PI x (mod x (* 2 pi))]
    (if (> x pi) (- x (* 2 pi)) x)))
```

준비가 모두 끝났다. 이제 `sin` 함수를 구현할 차례다.

```clojure
(defn sin [x]
  (let [x (normalize x) n 5] ; 다섯째 항까지...
    (->> (range n)
         (map #(nth-term % x))
         (apply +))))
```

`sin` 함수 내부에서만 사용하는 함수가 `sin` 함수 밖에 너저분하게 널려 있으면 보기가 좋지 않으므로 `sin` 함수 안으로 넣는 것이 좋겠다.

```clojure
(defn sin [x]
  (letfn [(factorial [n] (apply * (range 1 (inc n))))
          (nth-term [n x]
            (* (/ (Math/pow -1 n) (factorial (+ (* 2 n) 1)))
               (Math/pow x (+ (* 2 n) 1))))
          (normalize [x]
            (let [pi Math/PI x (mod x (* 2 pi))]
              (if (> x pi) (- x (* 2 pi)) x)))]
    (let [x (normalize x) n 10] ; 열째 항까지...
      (->> (range n)
           (map #(nth-term % x))
           (apply +)))))
```

Java에 있는 `Math/sin`과 여기서 구현한 `sin` 함수의 값이 얼마나 비슷한지 확인해보는 것도 재미있겠다. 테스트를 쉽게 하기 위해 다음과 같이 주어진 값에 대해 두 함수의 값과 값의 차를 구하는 함수를 만들어보자.

```clojure
(defn diff [x]
  (let [y1 (Math/sin x) y2 (sin x)]
    (format "%f\t%f\t%f\n" y1 y2 (- y1 y2))))
```

REPL에서 다음 코드를 입력하면 $-2\pi \le x \le 2\pi$ 범위에서 $x$를 0.1 간격으로 증가시키며 `Math/sin`과 `sin`의 값을 비교할 수 있다.

```clojure
(->> (range (* Math/PI -2) (* Math/PI 2) 0.1)
     (map diff)
     (println))
```

항 수를 늘릴수록 오차가 줄어들긴 하지만, 만족스러운 정도는 아니다. 항 수가 10개를 초과하면 `factorial`을 구할 때 정수 오버플로우가 발생해 그 이상 늘릴 수도 없다. 게다가 속도도 `Math/sin`보다 훨씬 느리다. 여기서는 $\sin x$와 같은 초월함수의 값을 어떤 식으로 구할 수 있는지 확인하는 정도로 만족해야 할 듯 하다.
