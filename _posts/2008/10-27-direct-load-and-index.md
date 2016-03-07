date: 2008-10-27
tags: [DB, Oracle]
title: 다이렉트 로드와 인덱스
---
대량 데이터를 로드할 때 항상 궁금했던 것이 있다. 다음 두 가지 방법 중 어떤 것이 빠를까 하는 것이다.
* 방법1: 인덱스가 있는 상태에서 그냥 다이렉트 모드로 로드
* 방법2: 인덱스를 날리고 로드한 다음 인덱스를 생성
<!--more-->

이를 확인하기 위해 간단히 테스트를 해봤다. 먼저 다음과 같이 테이블을 만든다.

```sql
-- 로드할 데이터를 넣어 둘 테이블
create table t (
  n number,
  c varchar2(10),
  d varchar2(100)
);

-- 인덱스가 있는 상태에서 로드할 테이블
create table t1 (
  n number,
  c varchar2(10),
  d varchar2(100)
);
alter table xxx.t1 add constraint t1_pk primary key (n)
  using index;
create index xxx.t1_ix01 on xxx.t2(c);

-- 인덱스가 없는 상태에서 로드할 테이블
create table t2 (
  n number,
  c varchar2(10),
  d varchar2(100)
);
```

테이블 `t`는 로드할 데이터를 담아둘 것이고, `t1`, `t2`는 위의 두 방법으로 로드하는 것을 비교하기 위한 테이블이다. `t`에 다음과 같이 데이터를 넣는다.

```sql
insert into t
select level,
       dbms_random.string('U',10),
       dbms_random.string('U',100)
from dual
connect by level <= 100000;
```

그리고 다음과 같이 t1.sql과 t2.sql을 만들어둔다.

```sql
-- t1.sql: 방법1
insert /*+ append */ into t1 select * from t;
```

```sql
-- t2.sql: 방법2
alter table t2 drop primary key;
drop index t2_ix01;

insert /*+ append */ into t2 select * from t;

alter table t2 add constraint t2_pk primary key (n)
  using index;
create index t2_ix01 on t2(c);
```

그리고 t1.sql과 t2.sql을 실행시켜 성능을 비교해본다. 비교는 `runstats_pkg`를 사용했다. 래치, I/O 등의 통계정보도 나오지만, 여기서는 실행 시간만 비교해보자. (운영중인 시스템에서 실제 트랜잭션이 발생하고 있는 테이블이라면 이런 것도 고려해야 겠지만, 여기서는 고려하지 않는다.)
<pre class="console">
SQL> exec runStats_pkg.rs_start;

PL/SQL procedure successfully completed.

SQL> @t1
SQL> exec runStats_pkg.rs_middle;

PL/SQL procedure successfully completed.

SQL> @t2
SQL> exec runStats_pkg.rs_stop(100000);
Run1 ran in 1124 hsecs
Run2 ran in 1387 hsecs
run 1 ran in 81.04% of the time
... 생략 ...

PL/SQL procedure successfully completed.
</pre>

**방법1**(인덱스가 있는 상태에서 데이터를 로드한 것)이 **방법2**(인덱스가 없는 상태에서 데이터를 로드한 다음 인덱스를 생성하는 것)보다 시간이 20% 정도 적게 걸리는 것으로 나왔다. 약간은 의외다. 지금까지는 인덱스를 날리고 데이터를 로드한 다음 인덱스를 생성하는 것이 빠르다고 들었기 때문이다. 그러나 이 테스트 결과만 가지고 단정하기는 어려울 것 같다. 만약 인덱스를 병렬처리로 생성하면 어떻게 될까? 병렬처리로 이득을 보려면 처리량이 더 많아야 하므로 데이터를 10배 늘려놓는다.

```sql
truncate table t;
truncate table t1;
truncate table t2;

insert into t
  select level,
         dbms_random.string('U',10),
         dbms_random.string('U',100)
  from dual
  connect by level <= 1000000
```

그리고 t2.sql 스크립트도 다음과 같이 수정한다.

```sql
alter table t2 drop primary key;
drop index t2_ix01;

insert /*+ append */ into t2 select * from t;

create unique index t2_pk on t2 (n) parallel 4;
create index t2_ix01 on t2(c) parallel 4;
alter table t2 add constraint t2_pk primary key (n) using index;
alter index t2_pk noparallel;
alter index t2_ix01 noparallel;
```

이제 다시 두 방법을 비교해보자.
<pre class="console">
SQL> exec runStats_pkg.rs_start;

PL/SQL procedure successfully completed.

SQL> @t1
SQL> exec runStats_pkg.rs_middle;

PL/SQL procedure successfully completed.

SQL> @t2
SQL> exec runStats_pkg.rs_stop(100000);
Run1 ran in 5912 hsecs
Run2 ran in 1919 hsecs
run 1 ran in 308.08% of the time
... 생략 ...

PL/SQL procedure successfully completed.
</pre>

이번에는 방법2가 빠르게 나왔다. 음... 그럼 인덱스를 parallel 4로 바꿔놓은 상태에서 방법 1은 어떨까? t1.sql을 다음과 같이 수정한다.

```sql
alter index t1_pk parallel 4;
alter index t1_ix01 parallel 4;

insert /*+ append */ into t1 select * from t;

alter index t1_pk noparallel;
alter index t1_ix01 noparallel;
```

그리고 다시 두 방법을 비교해보자.
<pre class="console">
SQL> exec runStats_pkg.rs_start;

PL/SQL procedure successfully completed.

SQL> @t1
SQL> exec runStats_pkg.rs_middle;

PL/SQL procedure successfully completed.

SQL> @t2
SQL> exec runStats_pkg.rs_stop(100000);
Run1 ran in 4512 hsecs
Run2 ran in 2222 hsecs
run 1 ran in 203.06% of the time
... 생략 ...

PL/SQL procedure successfully completed.
</pre>

**방법1**의 실행 시간이 약간 줄어들긴 했지만 여전히 **방법2**가 2배정도 빠르다. 역시 인덱스가 없는 상태에서 데이터를 로드하고 인덱스를 병렬로 생성하는 것이 빠른 방법이다. 그러나 이미 대량의 데이터가 있는 테이블에 데이처를 추가적으로 로드해야 하는 상황에서도 방법2가 효율적일까? 1백만 건이 있는 테이블에 다시 1백만 건을 넣을 경우에는 어떻게 되는지 테스트를 해보자. 먼저 PK가 중복되지 않도록 데이터 소스가 들어있는 테이블 t를 업데이트한다.

```sql
update xxx.t
set n = n+1000000;
commit;
```

그리고 다시 방법1과 방법2를 비교한다.
<pre class="console">
SQL> exec runStats_pkg.rs_start;

PL/SQL procedure successfully completed.

SQL> @t1
SQL> exec runStats_pkg.rs_middle;

PL/SQL procedure successfully completed.

SQL> @t2
SQL> exec runStats_pkg.rs_stop(100000);
Run1 ran in 3748 hsecs
Run2 ran in 3016 hsecs
run 1 ran in 124.27% of the time
... 생략 ...

PL/SQL procedure successfully completed.
</pre>

방법1과 방법2의 실행시간 차이가 줄어들긴 했지만 여전히 방법2가 빠르다. 이제 t1, t2에 각각 2백만 건의 데이터가 들어있는데 여기에 다시 1백만 건을 넣을 때는 어떻게 되는지 확인해보자. PK가 중복되지 않도록 테이블 t를 업데이트한다.

```sql
update xxx.t
set n = n+1000000;
commit;
```

다시 방법1과 방법2를 비교한다.

<pre class="console">
SQL> exec runStats_pkg.rs_start;

PL/SQL procedure successfully completed.

SQL> @t1
SQL> exec runStats_pkg.rs_middle;

PL/SQL procedure successfully completed.

SQL> @t2
SQL> exec runStats_pkg.rs_stop(100000);
Run1 ran in 3160 hsecs
Run2 ran in 5280 hsecs
run 1 ran in 59.85% of the time
... 생략 ...

PL/SQL procedure successfully completed.

SQL>
</pre>

이번에는 **방법1**이 훨씬 빨랐다. 즉 이미 테이블에 대량 데이터가 있는 경우에는 방법2보다는 방법1이 빠름을 알 수 있다.

## 정리
결론은 다음과 같이 정리할 수 있을 듯 하다.

* 빈 테이블에 대량 데이터를 로드할 때는 인덱스를 드랍한 상태에서 데이터를 로드한 후 병렬처리로 인덱스를 생성하는 방법이 가장 시간이 적게 걸린다.
* 대량 데이터가 있는 상태에서 다시 대량 데이터를 추가로 로드하는 상황이라면 기존 데이터와 새로 로드할 데이터의 비율에 따라 차이가 생긴다.
  * 이미 존재하는 데이터와 새로 로드할 데이터의 양이 비슷하다면 인덱스를 드랍한 상태에서 데이터를 로드한 후 병렬로 인덱스를 생성하는 방법이 그냥 로드하는 방법보다 약간 빠를 수도 있다. 그러나 이는 데이터 양에 따라 결과가 달라질 것 같다.
  * 테이블에 이미 존재하는 데이터에 비해 새로 로드할 데이터 양이 훨씬 적다면 인덱스를 그대로 둔 상태에서 로드하는 것이 유리하다.
