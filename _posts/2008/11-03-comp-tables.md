date: 2008-11-03
tags: [DB, Oracle, SQL]
title: 테이블 비교
---
프로젝트를 하다보면 개발DB와 테스트DB 또는 테스트DB와 운영DB간 스키마를 비교해 차이점이 없는지 확인할 일이 많다. 다음은 테이블과 컬럼을 비교하는 스크립트다.<!--more--> `Full Outer Join`을 사용할 수도 있으나, 결과가 제대로 나오지 않거나 에러(ora-600)가 발생한다(Oracle 9i, 10g에서 모두 에러 발생했음). 그냥 `left outer join`, `right outer join`한 후 둘을 `union` 하는 것이 결과가 제대로 나온다. (`with`절은 Oracle 9i부터 사용 가능함.)

```sql
with
a as (
  select
    table_name, column_name,
    decode(data_type,
      'CHAR', data_type||'('||data_length||')',
      'VARCHAR2', data_type||'('||data_length||')',
      'NUMBER', data_type||'('||data_precision||','||data_scale||')',
      data_type) data_type,
    nullable
  from all_tab_columns
  where owner = 'XXX'
    and table_name not like 'BIN$%'
  ),
b as (
  select
    table_name, column_name,
    decode(data_type,
      'CHAR', data_type||'('||data_length||')',
      'VARCHAR2', data_type||'('||data_length||')',
      'NUMBER', data_type||'('||data_precision||','||data_scale||')',
      data_type) data_type,
    nullable
  from all_tab_columns<b id="ncsj">@testdb</b>
  where owner = 'XXX'
    and table_name not like 'BIN$%'
  )
select decode(a.table_name, null, b.table_name, a.table_name) tbl,
       a.column_name, a.data_type, a.nullable,
       b.column_name, b.data_type, b.nullable
from a, b
where a.table_name = b.table_name(+)
  and a.column_name = b.column_name(+)
  and (a.data_type <> nvl(b.data_type,'x')
         or a.nullable <> nvl(b.nullable,'x'))
union
select decode(a.table_name, null, b.table_name, a.table_name),
       a.column_name, a.data_type, a.nullable,
       b.column_name, b.data_type, b.nullable
from a, b
where a.table_name(+) = b.table_name
  and a.column_name(+) = b.column_name
  and (nvl(a.data_type,'x') <> b.data_type
         or nvl(a.nullable,'x') <> b.nullable)
order by 1;
```
