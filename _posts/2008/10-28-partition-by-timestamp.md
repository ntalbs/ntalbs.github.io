title: TIMESTAMP 컬럼으로 파티션 하는 방법
date: 2008-10-28
tags: [db, oracle, ddl]

---
일반적으로 range 파티션 테이블을 만들 때는 다음과 같이 한다.
<!--more-->
```
create table t (...)
tablespace ...
partition by range (c)
(
partition p1 values less than (100),
partition p2 values less than (200),
...
partition p_max values less than (maxvalue)
);
```
파티션 키 컬럼이 `DATE` 타입일 경우에는 다음과 같이 하면 된다.
```
create table t (...)
tablespace ...
partition by range (dt)
(
partition p2006 values
    less than (to_date('20070101','YYYYMMDD')),
partition p2007 values
    less than (to_date('20070101','YYYYMMDD')),
...
partition p_max values
    less than (maxvalue)
);
```
파티션 키 컬럼이 `TIMESTAMP`인 컬럼으로 파티션을 할 때는 다음과 같이 하면 될 것 같다.
```
create table t (...)
tablespace ...
partition by range (dt)
(
partition p2006 values
    less than (to_timestamp('20070101','YYYYMMDD')),
partition p2007 values
    less than (to_timestamp('20070101','YYYYMMDD')),
...
partition p_max values
    less than (maxvalue)
);
```
그러나 위와 같은 SQL을 실행시키면 다음과 같은 에러가 발생한다.
```
partition p2006 values
   less than (to_timestamp('20070101','YYYYMMDD')),
              *
ERROR at line 4:
ORA-30078: partition bound must be
TIME/TIMESTAMP WITH TIME ZONE literals
```

`TIMESTAMP` 컬럼으로 파티션을 하는 정확한 문법은 다음과 같다.
```
create table t (...)
tablespace ...
partition by range (dt)
(
partition p2006 values
    less than (timestamp'2007-01-01 00:00:00 +0:00'),
partition p2007 values
    less than (timestamp'2008-01-01 00:00:00 +0:00'),
...
partition p_max values
    less than (maxvalue)
);
```

## 참고
* http://www.orafaq.com/forum/t/6418/0/
