date: 2014-11-12
tags: [DB, PostgreSQL, MySql, SQL]
title: MySQL Row Generator
---
Oracle에서는 `connect by`를 사용해 필요한 만큼 행(row)을 생성할 수 있다.

```sql
select level from dual connect by level <= 100;
```

PostgreSQL에서도 `generate_series`를 사용해 쉽게 행을 만들 수 있다.

```sql
select * from generate_series(1, 100);
```

재귀적 CTE(Common Table Expressions)를 사용하면 특정 DBMS에서만 제공하는 기능을 사용하지 않고 표준 SQL만 사용해 행 생성기(row generator)를 만들 수 있다. PostgreSQL에서는 다음과 같은 식으로 원하는 만큼 행을 생성할 수 있다.
<!--more-->

```sql
with recursive a(n) as (
  select 1
  union all
  select n+1 from a
)
select n from a limit 100; -- generates 100 rows
```

CTE는 SQL-99 표준이지만, MySQL은 CTE를 구현하지 않아 이 방식을 쓸 수 없다. 2006년부터 [CTE 구현 요청](http://bugs.mysql.com/bug.php?id=16244)이 있지만, 언제 지원하겠다는 계획도 없는 것으로 보인다.

인터넷에서 우연히 [MySQL Row Generator](http://use-the-index-luke.com/blog/2011-07-30/mysql-row-generator)를 발견해 혹시 하고 읽어봤는데, 역시 다음과 같이 카테시안 곱을 사용하는 무식한 방법이었다.

## MySQL 행 생성기
먼저 노가다 작업을 통해 16행짜리 뷰를 만든다.

```sql
create or replace view generator_16 as
  select 0 n union all select 1  union all select 2  union all
  select 3   union all select 4  union all select 5  union all
  select 6   union all select 7  union all select 8  union all
  select 9   union all select 10 union all select 11 union all
  select 12  union all select 13 union all select 14 union all
  select 15;
```

더 많은 행은 `generator_16` 뷰로 카테시안 곱을 반복해 만든다. 즉 `generator_16` 두 개를 카테시안 조인하면 256개의 행이 생긴다. 숫자가 순차 증가하게 하려면 간단한 계산이 필요하다.

```sql
select (hi.n*16 + lo.n) as n
from generator_16 hi, generator_16 lo;
```

위 쿼리를 실행해보면 0부터 255까지 숫자가 나온다. 따라서 다음과 같이 256행을 가지는 뷰를 만들 수 있다.

```sql
create or replace view generator_256 as
  select (hi.n*16 + lo.n) as n
  from generator_16 hi, generator_16 lo;
```

마찬가지로 `generator_256`과 `generator_16`을 이용해 4k 행을 가지는 뷰를 만들 수 있다.

```sql
create or replace view generator_4k as
  select (hi.n*256 + lo.n) as n
  from generator_16 hi, generator_256 lo;
```

이런 식으로 1M(=2<sup>20</sup>) 행을 가지는 뷰도 만들 수 있다.

```sql
create or replace view generator_4k as
  select (hi.n*256 + lo.n) as n
  from generator_16 hi, generator_256 lo;

create or replace view generator_64k as
  select (hi.n*256 + lo.n) as n
  from generator_256 hi, generator_256 lo;

create or replace view generator_1m as
  select (hi.n*65536 + lo.n) as n
  from generator_16 hi, generator_64k lo;
```

[MySQL Row Generator](http://use-the-index-luke.com/blog/2011-07-30/mysql-row-generator)에서는 약간의 성능 향상을 위해 비트 연산을 사용했지만, 여기서는 그냥 곱셈을 사용했다. 대세에 영향을 미칠 정도는 아닐 것 같다.

## 결론
이 방식은 별로 우아하지 않다. 각 뷰에서 생성하는 행의 범위가 정해져 있어, 뷰를 사용하기 전에 얼마나 많은 행이 필요할지에 생각하고 다른 뷰를 사용해야 한다. 그러나 테스트 데이터를 대량 생성하는 경우가 아니라면 보통 `generator_256` 정도만 사용해도 충분하지 않을까 생각된다.

무식한 방법이긴 하지만, 당장은 MySQL에서 이보다 좋은 방법이 없는 것 같다.

## 참고
* [MySQL Row Generator](http://use-the-index-luke.com/blog/2011-07-30/mysql-row-generator)
* MySQL Feature request: [SQL-99 Derived table WITH clause (CTE)](http://bugs.mysql.com/bug.php?id=16244)
* [무한 row 생성 쿼리](/2008/row-generator/)
* [데이터 생성 SQL](/2009/data-generator/)
