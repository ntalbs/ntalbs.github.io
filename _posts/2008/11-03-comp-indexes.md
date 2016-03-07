date: 2008-11-03
tags: [DB, Oracle, SQL]
title: 인덱스 비교
---
개발DB와 테스트DB, 또는 테스트DB와 운영DB간 인덱스를 비교할 때는 다음 쿼리를 사용할 수 있다.
<!--more-->

### 인덱스 명세
인덱스를 비교하기 위해서는 먼저 인덱스 명세를 만들어야 한다. 인덱스에 포함된 컬럼 개수의 최대값을 구한 다음 그 값만큼 `max(decode(..))`를 해줘서 인덱스에 대한 명세를 구할 수 있다.

```sql
-- 인덱스에 포함된 컬럼의 최대 개수 파악
select max(column_position)
from all_ind_columns
where index_owner='XXX';
```

```sql
-- 최대 개수만큼 max(decode(...)) 지정
select table_name, index_name,
  max(decode(column_position, 1, column_name)) ||
  max(decode(column_position, 2, '+'||column_name)) ||
  max(decode(column_position, 3, '+'||column_name)) ||
  max(decode(column_position, 4, '+'||column_name)) ||
  max(decode(column_position, 5, '+'||column_name)) ||
  max(decode(column_position, 6, '+'||column_name)) ||
  max(decode(column_position, 7, '+'||column_name)) ||
  max(decode(column_position, 8, '+'||column_name)) ||
  max(decode(column_position, 9, '+'||column_name)) ||
  max(decode(column_position,10, '+'||column_name)) index_columns
from all_ind_columns
where index_owner = 'XXX'
group by table_name, index_name;
```

### DB간 인덱스 비교
인덱스 명세를 구할 수 있으면, 양쪽 DB에서 인덱스 명세를 구한 다음 이를 비교하면 된다.

```sql
with
a as (
  select table_name, index_name,
    max(decode(column_position, 1, column_name)) ||
    max(decode(column_position, 2, '+'||column_name)) ||
    max(decode(column_position, 3, '+'||column_name)) ||
    max(decode(column_position, 4, '+'||column_name)) ||
    max(decode(column_position, 5, '+'||column_name)) ||
    max(decode(column_position, 6, '+'||column_name)) ||
    max(decode(column_position, 7, '+'||column_name)) ||
    max(decode(column_position, 8, '+'||column_name)) index_columns
  from all_ind_columns
  where index_owner = 'XXX'
  group by table_name, index_name),
b as (
  select table_name, index_name,
    max(decode(column_position, 1, column_name)) ||
    max(decode(column_position, 2, '+'||column_name)) ||
    max(decode(column_position, 3, '+'||column_name)) ||
    max(decode(column_position, 4, '+'||column_name)) ||
    max(decode(column_position, 5, '+'||column_name)) ||
    max(decode(column_position, 6, '+'||column_name)) ||
    max(decode(column_position, 7, '+'||column_name)) ||
    max(decode(column_position, 8, '+'||column_name)) index_columns
  from all_ind_columns@testdb
  where index_owner = 'XXX'
  group by table_name, index_name)
select a.*, b.*
from a, b
where a.table_name = b.table_name
  and a.index_name = b.index_name
  and a.index_columns <> b.index_columns
;
```
