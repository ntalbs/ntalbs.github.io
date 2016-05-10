date: 2008-11-08
tags: [DB, Oracle]
title: 특정 스키마 DDL 추출
---
다음과 같이 하면 exp/imp 도구를 사용해 특정 스키마의 DDL을 추출할 수 있다.
<!--more-->

## 1. 해당 스키마의 메타데이터를 exp한다.

<pre class="console">
$ exp xxx/xxx owner=xxx file=xxx.dmp rows=n
</pre>

## 2. indexfile 옵션을 사용해 DDL 파일을 만든다.
다음과 같이 하면 실제 import를 하지 않으면서  xxx.sql 파일이 생성된다. 생성된 DDL에서 owner는 `touser`로 지정한 `xxx`가 될 것이다.

<pre class="console">
$ imp xxx/xxx file=xxx.dmp fromuser=xxx touser=xxx indexfile=xxx.sql
</pre>

## 3. 생성된 파일을 편집한다.
xxx.sql 파일은 다음과 같은 식으로 생성되는데, 이를 적절히 편집한다. 먼저 각 행의 앞에 있는 `REM`을 모두 삭제하고, 중간에 `CONNECT...`문도 삭제한다. `CONNECT...`문을 삭제하지 않으면 스크립트 실행시 오류 발생한다.

<pre class="console">
REM  CREATE TABLE "XXX"."ABUSE" ("USER_ID" VARCHAR2(20) NOT NULL ENABLE,
REM  "ABUSE" VARCHAR2(3), "S_DATE" VARCHAR2(20), "D_DATE" VARCHAR2(20),
REM  "GUBUN" CHAR(1)) PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
REM  LOGGING STORAGE(INITIAL 65536 NEXT 65536 MINEXTENTS 1 MAXEXTENTS
REM  2147483645 PCTINCREASE 50 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL
REM  DEFAULT) TABLESPACE "SYSTEM" ;
<span style="color:black;background-color:yellow">CONNECT XXX;</span>
REM CREATE UNIQUE INDEX "XXX"."PK_ABUSE" ON "ABUSE" ("USER_ID" ) PCTFREE 10
REM INITRANS 2 MAXTRANS 255 STORAGE(INITIAL 65536 NEXT 65536 MINEXTENTS 1
REM MAXEXTENTS 2147483645 PCTINCREASE 50 FREELISTS 1 FREELIST GROUPS 1
REM BUFFER_POOL DEFAULT) TABLESPACE "SYSTEM" LOGGING ;
</pre>
