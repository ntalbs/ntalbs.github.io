title: PostgreSQL 날짜 연산
date: 2010-07-09
tags: [db, postgresql]

---
database.sarang.net의 [PostgreSQL 게시판](http://database.sarang.net/?criteria=pgsql)에 PostgreSQL에서 [날짜 연산 관련 질문](http://database.sarang.net/?inc=read&aid=8678&criteria=pgsql&subcrit=qna&id=&limit=20&keyword=&page=1)이 올라왔다. 답을 생각해보면서 PostgreSQL에서 날짜 관련 함수 및 연산 방법을 간단히 정리해봤다.
<!--more-->

## 간단한 날짜 관련 함수 및 날짜 연산:
```
-- 오늘 (date)
select current_date;

-- 현재시각 (timestamp)
select now();
select current_timestamp;

-- 어제/오늘/내일
select
  current_date - 1 "어제",
  current_date     "오늘",
  current_date + 1 "내일"
;

-- day of week
select extract(dow from current_date);    -- 일요일(0) ~ 토요일(6)
select extract(isodow from current_date); -- 월요일(1) ~ 일요일(7)

-- day of year
select extract(doy from current_date);

-- week of year
select extract(week from current_date);

-- 두 날짜 사이의 날수
select '2010-07-05'::date - '2010-06-25'::date;
```

## 한 주의 첫날, 마지막 날 구하기:
```
-- (주 첫 날을 월요일로 할 때 주) 첫날, 마지막 날
-- date_trunc() 함수의 리턴 타입은 timestamp임

-- 이번 주
select
  date_trunc('week', current_date)::date     "이번 주 첫날",
  date_trunc('week', current_date)::date+6   "이번 주 마지막 날"
;

-- 전 주
select
  date_trunc('week', current_date-7)::date   "전 주 첫날",
  date_trunc('week', current_date-7)::date+6 "전주 마지막 날"
;

-- 다음 주
select
  date_trunc('week', current_date+7)::date   "다음 주 첫날",
  date_trunc('week', current_date+7)::date+6 "다음주 마지막 날"
;

-- (주 첫 날을 일요일로 할 때) 주 첫날/마지막 날
-- week로 date_trunc를 하는 경우 결과가 월요일 날짜가 되기 때문에
-- 한 주를 일요일~토요일까지로 하는 경우는 -1 필요

-- 이번 주
select
  date_trunc('week', current_date)::date-1     "이번 주 첫날",
  date_trunc('week', current_date)::date+6-1   "이번 주 마지막 날"
;

-- 전 주
select
  date_trunc('week', current_date-7)::date-1   "전 주 첫날",
  date_trunc('week', current_date-7)::date+6-1 "전주 마지막 날"
;

-- 다음 주
select
  date_trunc('week', current_date+7)::date-1   "다음 주 첫날",
  date_trunc('week', current_date+7)::date+6-1 "다음주 마지막 날"
;
```

## 한 달의 첫날, 마지막 날 구하기:
```
-- 한 달 전/후 날짜
select
  current_date - interval '1 months' "전 달",
  current_date + interval '1 months' "다음 달"
;

-- 이번 달 첫날, 마지막 날
select
  date_trunc('month',
             current_date)::date "첫날",
  date_trunc('month',
             current_date + interval '1 months')::date - 1 "마지막 날"
;

-- 전달 첫날, 마지막 날
select
  date_trunc('month',
             current_date - interval '1 months')::date "첫 날",
  date_trunc('month',
             current_date)::date - 1 "마지막 날"
;

-- 다음 달 첫날, 마지막 날
select
  date_trunc('month',
             current_date + interval '1 months')::date "첫 날",
  date_trunc('month',
             current_date + interval '2 months')::date - 1 "마지막 날"
;
```

## 이번 주 첫날부터 마지막 날까지 날짜들:
```
-- 이번 주 날짜
select
  date_trunc('week', current_date)::date -1 + i "일~토",
  date_trunc('week', current_date)::date    + i "월~일"
from generate_series(0,6) as t(i);
```

이번 달 첫날부터 마지막 날까지 날짜들. `generate_series()` 함수를 사용한다. 한 달이 28일, 29일, 30일, 31일 중 어떤 것이 될지 알 수 없기 때문에 월의 마지막날을 구해 generate_series()의 두번째 인수로 넣어준다.

```
-- 이번 달 날짜 (첫날 ~ 마지막 날)
select date_trunc('month', current_date)::date + (i - 1)
from
  generate_series(
    1,
    extract(day from date_trunc('month', current_date + interval '1 months')::date - 1)::integer
  ) as t(i);

select date_trunc('month', current_date)::date + (i - 1)
from
  generate_series(
    1,
    extract(day from date_trunc('month', current_date) + interval '1 months' - interval '1 days')::integer
  ) as t(i);
```

**week of month**: 이번 달의 첫날부터 마지막 날까지의 날짜와 week of month를 구하는 쿼리인데, 1일~7일까지는 첫째 주, 8일~14일까지는 둘째 주와 같은 식으로 된다. 역시 `generate_series()` 함수를 사용했는데, 위와 같이 첫 날과 마지막 날의 차를 구해 수열을 만들지 않고 0~30까지 만들어 무조건 더하면서 이번 달에 속하는 날짜만 where 절 조건으로 추려내게 했다.
```
select dt, to_char(dt, 'W') "day of week"
from (
    select date_trunc('month', current_date)::date + i dt
    from generate_series(0, 30) as t(i)
    ) t
where extract(month from dt) = extract(month from current_date)
;
```

## PostgreSQL 매뉴얼 참조 URL:
http://www.postgresql.org/docs/8.4/interactive/functions-datetime.html
http://www.postgresql.org/docs/8.4/interactive/functions-formatting.html
