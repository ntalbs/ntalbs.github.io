title: 오라클에서 factorial 구하기
date: 2008-11-03
tags: [db, oracle]

---
오라클에 `factorial` 함수가 없지만 다음과 같이 구할 수 있다.
<!--more-->

```
select exp(sum(ln(level)))
from dual
connect by level <= N
```

## 원리
$a = e^{\ln a}$임을 이용하면 $n!$을 다음과 같이 표현할 수 있다.
{% math-block %}
\begin{aligned}
n! &= 1 \times\ 2 \times\ ... \times\ n \\
&= e^{\ln 1} \times\ e^{\ln 2} \times\ ... \times\ e^{\ln n} \\
&= e^{\ln 1 + \ln 2 + \ ... \ + \ln n}
\end{aligned}
{% endmath-block %}

```
n! =  1 * 2 * ... * n
   = exp(ln 1) * exp(ln 2) * ... * exp(ln n)
   = exp(ln 1 + ln 2 + ... + ln n)
```

##참조
* [무한 row 생성 쿼리](/2008/11/03/row-generator/)
