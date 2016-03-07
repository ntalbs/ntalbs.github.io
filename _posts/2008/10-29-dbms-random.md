date: 2008-10-29
tags: [DB, Oracle, SQL]
title: DBMS_RANDOM 패키지 사용법
---
랜덤한 숫자나 문자열을 만들 때 `DBMS_RANDOM` 패키지를 사용하면 된다.
<!--more-->

<pre class="console">
SQL> -- 랜덤 넘버 생성 (양수 또는 음수)
SQL> select dbms_random.random from dual;

 RANDOM
 ----------
 921647445

SQL> -- 0 ~ 1 사이의 랜덤 넘버 생성
SQL> select dbms_random.value from dual;

 VALUE
 ----------
 .892830585

SQL> -- 1 ~ 1000 사이의 랜덤 넘버 생성
SQL> select dbms_random.value(1,1000) num from dual;

 NUM
 ----------
 323.803995

SQL> -- 12자리 랜덤 넘버 생성.
SQL> select dbms_random.value(100000000000, 999999999999) num from dual;

 NUM
 -------------
 477515452657

SQL> -- 대문자 20자리 랜덤 문자열 생성
SQL> select dbms_random.string('U', 20) str from dual;

 STR
 --------------------
 JZICAGKORTFRAVHAPDOY

SQL> -- 소문자 20자리 랜덤 문자열 생성 생성
SQL> select dbms_random.string('L', 20) str from dual;

 STR
 --------------------
 wnimhearnitsdunolgqg

SQL> -- 대소문자가 섞인 20자리 랜덤 문자열 생성
SQL> -- (출처 자료에는 대소문자와 숫자가 섞여 나온다고 했지만 테스트 결과 숫자는 나오지 않음.)
SQL> select dbms_random.string('A', 20) str from dual;

 STR
 --------------------
 WDVjqvSHWpTVswQjJSnc

SQL> -- 숫자와 문자(대문자)가 섞인 20자리 문자열 생성
SQL> select dbms_random.string('X', 20) str from dual;

 STR
 --------------------
 L49TIQ8G2Y907YNOFOMQ

SQL> -- 출력 가능한(printable) 문자로 20자리 문자열 생성
SQL> select dbms_random.string('P', 20) str from dual;

 STR
 --------------------
 ~F&D9%C=,9*%Bw&zj],s
</pre>
