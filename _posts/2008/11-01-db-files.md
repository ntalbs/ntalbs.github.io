date: 2008-11-01
tags: [DB, Oracle]
title: db_files 개수에 포함되는 파일은?
---
현재 우리 운영DB는 `db_files` 파라미터 값이 매우 작게 잡혀있다. 따라서 빨리 값을 늘려줘야 하는데, 당장 운영중인 DB를 내리고 파라미터 값을 바꿀 수는 없다. 그런데 여기서 궁금증 하나 생겼다. `db_files`는 데이터 파일 개수만 제한하는 것일까, 아니면 temp 파일도 여기에 포함되는 것일까? 혹시 온라인 리두로그는? 혹시 컨트롤 파일도 포함되는 것일까?<!--more--> 지금까지는 당연히 데이터 파일 수를 제한하는 것이라 생각했었는데, 이런 궁금증이 생기니 확신을 할 수가 없다. 지금까지 명확하게 알지 못하고 작업하다가 사고친 게 어디 한두번이던가?

레퍼런스 매뉴얼에서 `db_files` 파라미터에 대해 찾아보니 다음과 같은 설명 뿐이다.

> DB_FILES specifies the maximum number of database files that can be opened for this database.

이 데이터베이스를 위해 열수 있는 최대 데이터베이스 파일 수를 지정한다고 하는데, 데이터베이스 파일에는 데이터 파일뿐 아니라 임시 파일, 리두로그 파일, 컨트롤 파일 등도 포함되는 것 아닌가? 가장 확실한 방법은 직접 해보는 것이다.

먼저 각 파일의 수를 파악한다.
<pre class="console">
sys@TESTDB> select count(*) from v$datafile;

  COUNT(*)
----------
         6

sys@TESTDB> select count(*) from v$logfile;

  COUNT(*)
----------
         3

sys@TESTDB> select count(*) from v$controlfile;

  COUNT(*)
----------
         3

sys@TESTDB> select count(*) from v$tempfile;

  COUNT(*)
----------
         2
</pre>

데이터 파일이 6개, 온라인 리두로그 파일이 3개, 컨트롤 파일이 3개, 임시파일이 2개인 상태다. (총 13개) 이제 테스트를 쉽게 하기 위해 `db_files` 값을 작게 한다. 현재의 전체 파일 개수보다 작게하면 어떻게 될까?

<pre class="console">
$ sqlplus / as sysdba
sys@TESTDB> alter system set db_files=10 scope=spfile;

System altered.

sys@TESTDB> shutdown immediate
Database closed.
Database dismounted.
ORACLE instance shut down.

sys@TESTDB> startup
ORACLE instance started.

Total System Global Area  159383552 bytes
Fixed Size                  1288340 bytes
Variable Size             100665196 bytes
Database Buffers           50331648 bytes
Redo Buffers                7098368 bytes
Database mounted.
Database opened.
sys@TESTDB> show parameter db_files

NAME      TYPE     VALUE
--------- -------- ------
db_files  integer  10
</pre>

어라? 가뿐하게 수정된다. 이는 위의 모든 파일이 db_files의 영향을 받는 것이 아님을 의미한다. 이제 테이블스페이스를 만들어 데이터 파일을 계속 추가해보자.

<pre class="console">
sys@TESTDB> create tablespace ts_xxx
  2  datafile '/oradata/testdb/ts_xxx01.dbf' size 1m;

Tablespace created.

sys@TESTDB> alter tablespace ts_xxx
  2  add datafile '/oradata/testdb/ts_xxx02.dbf' size 1m;

Tablespace altered.

sys@TESTDB> alter tablespace ts_xxx
  2  add datafile '/oradata/testdb/ts_xxx03.dbf' size 1m;

Tablespace altered.

sys@TESTDB> alter tablespace ts_xxx
  2  add datafile '/oradata/testdb/ts_xxx04.dbf' size 1m;

Tablespace altered.

sys@TESTDB> alter tablespace ts_xxx
  2  add datafile '/oradata/testdb/ts_xxx05.dbf' size 1m;
alter tablespace ts_xxx
*
ERROR at line 1:
ORA-00059: maximum number of DB_FILES exceeded

sys@TESTDB>
</pre>

처음 테이블스페이스를 만들고(데이터 파일 1개 추가), 그 다음 데이터 파일을 계속 추가해 총 데이터 파일 개수가 10개가 될 때까지는 문제가 없지만, 10개를 초과하면서는 에러가 발생한다. 따라서 `db_files`는 데이터 파일에만 관계가 됨을 알 수 있다.

PS: 데이터베이스를 오픈할 때 임시 파일은 없어도 되나? 테스트해본 결과 임시 파일은 영향이 없는 것을 확인했다. DBMS를 `shutdown`시킨 후 임시파일을 삭제하고 DBMS를 `startup` 하면, 임시파일이 새로 생성되고 데이터베이스는 정상 오픈된다.
