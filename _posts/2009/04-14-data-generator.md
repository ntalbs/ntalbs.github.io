title: 데이터 생성 SQL
date: 2009-04-14
tags: [db, sql, oracle, postgresql]

---
Oracle에서라면 다음 쿼리로 row를 생성할 수 있다.

```sql
-- 1~100까지 숫자 생성 (100 rows)
select level from dual connect by level <= 100;
```

이렇게 row 생성 쿼리를 이용하면 테스트 데이터를 원하는 만큼 생성하는 것도 쉽고, 간단한 문제를 풀 때도 유용하다. 예를 들어 얼마 전 kldp.org에 올라왔던 1~45의 숫자 중 랜덤하게 6개를 선택해 표시하는 문제도 다음과 같이 SQL로 풀 수 있다.
<!--more-->

```sql
-- 1~45의 숫자중 6개의 숫자를 랜덤하게 선택해 출력
select *
from (select level from dual
      connect by level <=45
      order by dbms_random.random)
where rownum <= 6;
```

그러나 이게 Oracle에서만 유효한 SQL이다보니 다른 DBMS에서는 활용할 수 없다. 요즘은 회사에서 사용하는PostgreSQL에서는 이 문제를 어떻게 해결할 수 있을까 고민했는데, 예상외로 쉬운 방법이 있었다. Oracle에서는 `connect by`를 이용한 재귀적 SQL을 사용했지만 PostgreSQL에서는 `generate_series()` 함수를 사용하면 된다.

```sql
-- 1~100까지 숫자 생성 (100 rows)
select * from generate_series(1, 100);

-- 생성된 숫자를 이용한 계산이 필요할 때
select n, n*10 from generate_series(1, 100) as t(n);
```

따라서 1~45의 숫자 중 랜덤하게 6개를 선택해 표시하는 문제를 PostgreSQL에서는 다음과 같이 풀 수 있다.

```sql
-- 1~45의 숫자중 6개의 숫자를 랜덤하게 선택해 출력
select *
from (select * from generate_series(1, 45)
      order by random()) as t
limit 6;
```

이와 비슷하게 데이터를 생성해내는 방법이 MySQL에도 있을까 찾아봤지만, 마음에 드는 방법을 찾지는 못했다. MySQL에서는 그냥 데이터가 많은 다른 테이블을 카테시안 조인해 데이터를 만들어내는 방법뿐인지, 아니면 다른 멋진 방법이 있는데 내가 알지 못하는 것인지 모르겠다.
