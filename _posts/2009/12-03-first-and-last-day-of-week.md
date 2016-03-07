date: 2009-12-03
tags: [DB, Oracle, SQL]
title: 주어진 주의 첫 날과 마지막 날 구하기
---
[Database.Sarang.net](http://database.sarang.net/) Q&A 게시판에 특정 주(몇월 몇째주)를 주면 이 주의 첫 날과 마지막 날을 구하는 방법에 대한 질문이 올라왔다. 열심히 머리를 굴려본 결과 해당 주에 포함된 날짜를 구하면 그 주의 첫 날과 마지막 날을 구할 수 있음을 알게 됐고, 다음과 같은 쿼리를 작성했다.
<!--more-->

```sql
select
  (to_date(:d, 'YYYYMMDD')
    - to_number(to_char(to_date(:d,'YYYYMMDD'),'D')) + 1) start_dt,
  (to_date(:d, 'YYYYMMDD')
    + (7 - to_number(to_char(to_date(:d,'YYYYMMDD'),'D')))) end_dt
from dual;
```

그러나 이 쿼리는 주어진 주에 대한 날짜를 구하는 방법이 들어있지 않아 완전한 답이 될 수 없다. 그런데 바로 아래 어느 훌륭한 분이 완벽한 답을 달았다. 끙끙대며 열심히 이해한 결과를 설명하면... 다음과 같다. 그리고 `trunc` 함수를 쓰면 식도 훨씬 단순해짐을 알았다.

### 1. 해당 달의 마지막 날짜 구한다.

```sql
select
  last_day(to_date(:yyyymm, 'YYYYMM') day_last,
  :week week
from dual
```

### 2. 해당 달이 몇 주를 가지는지(또는 마지막 주가 몇째 주인지) 구한다.

```sql
select
  (trunc(day_last, 'D')
    - trunc(trunc(day_last, 'MM'), 'D') / 7 + 1 last_week,
  day_last,
  week
from ...
```

### 3. 지정된 주에 포함된 날짜를 구한다.

```sql
select
  day_last - 7 * decode(least(last_week, week),
                        week, last_week - week) base day
from ...
```

### 4. 이 날짜가 포함된 주의 첫 날과 마지막 날을 구한다.

```sql
select
  trunc(base_day, 'D') start_date,
  trunc(base_day, 'D')+6 end_date
from ...
```

세번째 단계에서 `decode(least(...))` 대신 `case when week < last_week then last_week - week end`로 하는 게 이해하기 더 쉬울 듯 하다.

이걸 모두 합치면...

```sql
select
  trunc (base_day, 'd') starting_day,
  trunc (base_day, 'd') + 6 ending_day
from (
  select
    day_last - 7 * (case when week < last_week
                    then last_week - week end) base_day
  from (
    select
      (trunc(day_last, 'd')
        - trunc(trunc(day_last, 'mm'), 'd')) / 7 + 1 last_week,
      day_last,
      week
    from (
      select
        last_day (to_date (:yyyymm, 'yyyymm')) day_last,
        :week week
      from dual)));
```

여기까지도 멋졌는데, 다음 쿼리를 보니... 더 멋지네.

```sql
select
  decode(least(day_last, base_fday),
         base_fday, base_fday) start_date,
  decode(least(day_last, base_fday),
         base_fday, base_fday + 6) end_date
from (
  select
    trunc(first_day + 7 * (week - 1), 'd') base_fday,
    last_day(first_day) day_last
  from (
    select
      to_date(:yyyymm, 'yyyymm') first_day,
      :week week
    from dual));
```
