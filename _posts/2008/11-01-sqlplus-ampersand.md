title: SQL*Plus에서 '&'가 포함된 문자열을 변수로 인식하지 않게 하기
date: 2008-11-01
tags: [db, oracle, sql*plus]

---
문자열 자체에 `&`가 포함되어 있는 경우 SQL*Plus에서 `&` 뒤의 단어를 변수로 인식해 그에 대한 값의 입력을 요구한다.
<!--more-->

<pre class="console">
SQL> update tbl set a = 'hello&world' where ...
Enter value for world: _  < -- 입력을 기다림
</pre>

## 해결 방법 1
다음 명령을 실행시킨 후 SQL 실행.

<pre class="console">
SQL> set define off
</pre>

(SQL*Plus User's Guide and Reference 참조.)

## 해결 방법 2
다음과 같은 식으로 문자여 변경 (편법...)

<pre class="console">
'hello&world' --> 'hello&'||'world'
</pre>

(문자열이 많을 경우 노가다 작업이 될 수 있음.)
