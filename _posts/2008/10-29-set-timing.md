title: set timing을 이용한 SQL 실행 속도 측정법
date: 2008-10-29
tags: [db, oracle, sqlplus]

---
SQL*Plus에서 실행시킨 SQL 또는 PL/SQL 블록의 실행속도를 보려면 다음과 같이 `set timing on`을 사용하면 된다.
<!--more-->

<pre class="console">
SQL> set timing on
SQL> select count(*) from all_objects;

  COUNT(*)
 ---------
     40746

 Elapsed: 00:00:11.87
</pre>

그런데, SQL 하나하나의 속도가 하니라 한 블록의 SQL 실행속도를 알고 싶을 때는 어떻게 해야 할까? 예를 들어 다음과 같이 work.sql에 여러 SQL이 들어 있다고 생각해보자.

```sql
-- work.sql
insert into t values ('2007-01-01', 'aaa');
insert into t values ('2007-01-02', 'bbb');
insert into t values ('2007-01-03', 'ccc');
insert into t values ('2007-01-04', 'ddd');
insert into t values ('2007-01-04', 'eee');
```

SQL*Plus에서 `set timing on`한 상태에서 work.sql을 실행시키면 결과는 다음과 같이 각각의 SQL에 대한 실행시간이 나올 뿐이다.

<pre class="console">
SQL> set echo on
SQL> @work.sql
SQL> insert into t values ('2007-01-01', 'aaa');

1 row created.

Elapsed: 00:00:00.15
SQL> insert into t values ('2007-01-02', 'bbb');

1 row created.

Elapsed: 00:00:00.00
SQL> insert into t values ('2007-01-03', 'ccc');

1 row created.

Elapsed: 00:00:00.00
SQL> insert into t values ('2007-01-04', 'ddd');

1 row created.

Elapsed: 00:00:00.01
SQL> insert into t values ('2007-01-04', 'eee');

1 row created.

Elapsed: 00:00:00.00
</pre>

전체 SQL의 실행 속도를 보고 싶다면 `begin ~ end`를 써서 SQL을 묶어주면 된다. 즉 work.sql 파일의 시작과 끝을 `begin ~ end`로 묶어준 다음 실행시키면 된다.

```sql
-- work.sql
begin
insert into t values ('2007-01-01', 'aaa');
insert into t values ('2007-01-02', 'bbb');
insert into t values ('2007-01-03', 'ccc');
insert into t values ('2007-01-04', 'ddd');
insert into t values ('2007-01-04', 'eee');
end;
/
```

이에 대한 실행결과는 다음과 같다.

<pre class="console">
SQL> @work.sql
SQL> begin
  2  insert into t values ('2007-01-01', 'aaa');
  3  insert into t values ('2007-01-02', 'bbb');
  4  insert into t values ('2007-01-03', 'ccc');
  5  insert into t values ('2007-01-04', 'ddd');
  6  insert into t values ('2007-01-04', 'eee');
  7  end;
  8  /

PL/SQL procedure successfully completed.

Elapsed: 00:00:00.15
</pre>

또는 work.sql 파일을 수정하고 싶지 많다면 SQL*Plus에서 파일 실행부를 `begin ~ end`로 묶어줘도 된다. 한꺼번에 여러 파일을 실행해야 한다면 이게 더 편할지도 모르겠다.

<pre class="console">
SQL> set echo on
SQL> begin
  2  @work.sql
  2  insert into t values ('2007-01-01', 'aaa');
  3  insert into t values ('2007-01-02', 'bbb');
  4  insert into t values ('2007-01-03', 'ccc');
  5  insert into t values ('2007-01-04', 'ddd');
  6  insert into t values ('2007-01-04', 'eee');
  7  end;
  8  /

PL/SQL procedure successfully completed.

Elapsed: 00:00:00.03
</pre>

`set echo on` 상태라면 @work.sql을 입력한 후 엔터키를 누르면 위와 같이 파일 내용이 표시된다.
`set timing on` 대신 `timing` 명령을 사용해 여러 SQL의 실행속도를 측정할 수도 있다.

```sql
timing start
insert into t values ('2007-01-01', 'aaa');
insert into t values ('2007-01-02', 'bbb');
insert into t values ('2007-01-03', 'ccc');
insert into t values ('2007-01-04', 'ddd');
insert into t values ('2007-01-04', 'eee');
timing stop
```

위와 같이 work.sql의 맨 앞과 뒤에 각각 `timing start`, `timing stop`을 추가하면 다음과 같이 각각의 SQL에 대한 실행속도뿐 아니라 전체 실행속도까지 한꺼번에 볼 수 있다.

<pre class="console">
SQL> set echo on
SQL> @work.sql
SQL> timing start
SQL> insert into t values ('2007-01-01', 'aaa');

1 row created.

Elapsed: 00:00:00.00
SQL> insert into t values ('2007-01-02', 'bbb');

1 row created.

Elapsed: 00:00:00.01
SQL> insert into t values ('2007-01-03', 'ccc');

1 row created.

Elapsed: 00:00:00.00
SQL> insert into t values ('2007-01-04', 'ddd');

1 row created.

Elapsed: 00:00:00.00
SQL> insert into t values ('2007-01-04', 'eee');

1 row created.

Elapsed: 00:00:00.01
SQL> timing stop
Elapsed: 00:00:00.03
</pre>

`timing stop` 다음에 찍힌 시간이 전체 SQL을 실행하는 데 걸린 시간이다.
