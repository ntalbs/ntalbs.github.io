date: 2008-10-30
tags: [DB, Oracle]
title: DB 링크 삭제 시 제약사항
---
불필요한 데이터베이스 링크가 난무하는 것 같아 정리하기로 마음을 먹었다. 일단 개발DB에서 운영DB로의 데이터베이스 링크는 허용할 수 없으므로 이것부터 삭제하기로 했다. 개발DB에 `sys` 계정으로 로그인한 다음 `dba_db_links` 테이블을 조회해 개발DB에서 운영DB로 연결되는 데이터베이스 링크를 하나씩 확인했다.<!--more--> `public` 데이터베이스 링크를 삭제할 때는 `drop public database link ...` 명령으로 간단하게 삭제했다. 그리고 `xxx` 스키마에 있는 데이터베이스 링크를 삭제하기 위해 `drop database link xxx.{db_link_name}` 명령을 날렸는데, 데이터베이스 링크를 찾을 수 없다며 `ora-02024` 에러가 발생했다.

<pre class="console">
SQL> drop database link xxx.prdtdb;
drop database link xxx.prdtdb
                   *
ERROR at line 1:
ORA-02024: database link not found

SQL>
</pre>

순간 약간 당황해서 다시 `dba_db_links`를 조회했다. '뭔 소리를 하는 거야! 분명이 데이터베이스 링크가 있구만.' 생각하며 다시 시도했지만 마찬가지였다. 이상하다 생각하며 SQL Reference에서 drop database link 구문을 찾아봤더니 바로 해답을 찾을 수 있었다.

> Restriction on Dropping Database Links:
> <span style="background-color:yellow">You cannot drop a database link in another user's schema, and you cannot qualify dblink with the name of a schema,</span> because periods are permitted in names of database links. Therefore, Oracle Database interprets the entire name, such as ralph.linktosales, as the name of a database link in your schema rather than as a database link named linktosales in the schema ralph.

즉, 데이터베이스 링크 이름에는 원래 `"."`이 포함될 수 있기 때문에 다른 DB 객체와는 달리 `{스키마이름}.{DB링크이름}`과 같은 식으로 쓸 수 없다는 얘기고, 그렇다보니 다른 사용자(스키마)의 DB링크는 삭제할 수 없다는 뜻이다.
사실 가끔씩 `dbname.xxx.com`과 같은 식의 이름을 가진 DB링크를 보곤 하는데, 조금만 생각했으면 간단히 알 수 있는 것이었다. 요즘은 점점 생각하는 능력이 떨어지는구나.

### 참고
* [Oracle® Database SQL Reference 10g Release 2 (10.2) > DROP DATABASE LINK](http://docs.oracle.com/cd/B19306_01/server.102/b14200/statements_8010.htm#i2066689)
