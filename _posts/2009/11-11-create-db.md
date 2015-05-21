title: 오라클 데이터베이스 생성하기
date: 2009-11-11
tags: [db, oracle]

---
오라클 데이터베이스를 생성할 때 보통은 DBCA를 이용한다. 그러나 DBCA만 사용해 DB를 생성하다보면, DBCA를 사용할 수 없는 상황에는 당황하게 된다. 다음은 DBCA를 이용할 수 없는 경우 오라클 데이터베이스를 생성하는 절차다.
<!--more-->

## 1. SID, ORACLE_HOME 설정
<pre class="console">
$ export ORACLE_SID=testdbexport ORACLE_HOME=/path/to/oracle/home
</pre>

## 2. 초기화 파라미터 파일 생성 (minimal)
`$ORACLE_HOME/dbs`에 `init<SID>.ora` 파일을 만든다.

```
control_files = (/.../control1.ctl,/.../control2.ctl,/.../control3.ctl)
undo_management = AUTO
undo_tablespace = UNDOTBS1
db_name = test
db_block_size = 8192
sga_max_size = 1073741824 # 1GB
sga_target = 1073741824 # 1GB
```

## 3. 패스워드 파일 생성
<pre class="console">
$ $ORACLE_HOME/bin/orapwd file=$ORACLE_HOME/dbs/pwd{sid}.ora \
password=oracle entries=5
</pre>

## 4. 인스턴스 기동
<pre class="console">
$ sqlplus '/as sysdba'
...
SQL> startup nomount
</pre>

## 5. `CREATE DATABASE` 문 실행
```sql
create database test
dblogfile group 1 ('/.../redo1.log') size 100M,
group 2 ('/.../redo2.log') size 100M,
group 3 ('/.../redo3.log') size 100M
character set ko16ksc5601
national character set al16utf16
datafile '/.../system.dbf' size 500M autoextend on next 10M maxsize unlimited extent management local
sysaux datafile '/.../sysaux.dbf' size 100M autoextend on next 10M maxsize unlimited
undo tablespace undotbs1 datafile '/.../undotbs1.dbf' size 100M
default temporary tablespace temp tempfile '/.../temp01.dbf'
size 100M;
```

## 6. Data Dictionary View 생성 스크립트 실행
<pre class="console">
$ORACLE_HOME/rdbms/admin/CATALOG.sql
$ORACLE_HOME/rdbms/admin/CATPROC.sql
</pre>
## 7. SPFILE 생성
<pre class="console">
SQL> create spfile from pfile;
</pre>
## 8. 추가 테이블스페이스 생성
데이터를 저장할 테이블스페이스를 생성한다.

## 9. sys, system 계정 암호 변경
보안을 위해 관리자 계정 암호를 변경한다.


## 참고: `CREATE DATABASE` 문 Syntax

```sql
CREATE DATABASE [database name]
  [CONTROLFILE REUSE]
  [LOGFILE [GROUP integer] file specification]
  [MAXLOGFILES integer]
  [MAXLOGMEMBERS integer]
  [MAXLOGHISTORY integer]
  [MAXDATAFILES integer]
  [MAXINSTANCES integer]
  [ARCHIVELOG|NOARCHIVELOG]
  [CHARACTER SET charset]
  [NATIONAL CHARACTER SET charset]
  [DATAFILE filespec [autoextend]]
  [DEFAULT TEMPORARY TABLESPACE tablespace filespec]
  [UNDO TABLESPACE tablespace DATAFILE filespec]
  [SET TIME_ZONE [time_zone_region]];
```
