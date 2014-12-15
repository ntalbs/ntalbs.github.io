title: LONG형 컬럼을 가진 테이블의 테이블스페이스 이동
date: 2008-10-31
tags: [db, oracle, tablespace]

---
테이블을 다른 테이블스페이스로 이동시키기 위해서는 다음과 같이 한다.

```
ALTER TABLE t MOVE TABLESPACE ts_name;
```

그러나 테이블에 `LONG`형 컬럼이 포함되어 있는 테이블에 대해서는 이와 같은 방법을 사용할 수 없다. (ora-00997 에러 발생) `LONG`형 컬럼이 포함된 테이블은 CTAS를 사용해 데이터를 복사할 수도 없다. (역시 ora-00997 에러 발생)
<!--more-->

<pre class="console">
SQL> create table t (n number, l long);
Table created.

SQL> alter table t move;
alter table t move
*
ERROR at line 1:
ORA-00997: illegal use of LONG datatype
</pre>

`LONG`형 컬럼을 포함한 테이블을 다른 테이블스페이스로 옮길때는 다음 두 가지 방법을 사용할 수 있다.

## 1. `LONG`형을 `LOB` 형으로 변경
`to_lob` 함수를 사용해 `LONG`형을 `LOB`형으로 바꿔 `SELECT`해 테이블을 생성한다. `to_lob` 함수 옆에 컬럼 alias를 써줘야 에러가 발생하지 않고 해당 alias가 새로 만드는 테이블의 컬럼 이름이 된다.

<pre class="console">
SQL> create table t_lob as select n, to_lob(l) l from t

Table created.

Elapsed: 00:00:00.07
SQL> desc t_lob
 Name                     Null?    Type
 ------------------------ -------- ---------
 N                                 NUMBER
 L                                 CLOB
</pre>

## 2. exp/imp 활용
테이블을 export 했다가 다시 import 한다.

<pre class="console">
SQL> !exp xxx/xxx tables=t file=t.dmp
...
About to export specified tables via Conventional Path ...
. . exporting table                 T      0 rows exported
Export terminated successfully without warnings.

SQL> alter table t rename to t_long;

Table altered.

Elapsed: 00:00:00.03
SQL> !imp xxx/xxx file=t.dmp
...
. importing XXX's objects into XXX
. . importing table                "T"     0 rows imported
Import terminated successfully without warnings.

SQL> desc t

 Name                     Null?    Type
 ------------------------ -------- ---------
 N                        NUMBER
 L                        LONG
</pre>

## 참고
* http://www.orafaq.com/forum/t/21725/0/
