date: 2008-11-03
tags: [DB, Oracle, SQL]
title: 무한 row 생성 쿼리
---
Oracle에서는 다음과 같이 `connect by`절을 사용해 원하는 만큼 row를 만들어낼 수 있다.
<!--more-->

### Oracle 9i일 경우 (1~100까지의 row를 생성)
```sql
select * from (select level from dual connect by level <= 100)
```

### Oracle 10g일 경우 (1~100까지의 row를 생성)
```sql
select level from dual connect by level <= 100
```

### 진짜 무한 로우 생성 쿼리(10g)
```sql
select level from dual connect by 1=1
```
