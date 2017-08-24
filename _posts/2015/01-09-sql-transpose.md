tags: [DB, SQL, PostgreSQL]
date: 2015-01-09
title: SQL에서 행을 열로 바꾸는 방법
---
쿼리를 작성하다 보면 행을 열로 또는 열을 행으로 바꾸고 싶은 경우가 생긴다. 데이터 모델을 만들 때 같은 종류의 데이터는 행으로 저장하는 것이 좋지만, 고객은 열로 표현된 형태의 보고서를 보고 싶을 수 있다. 쿼리 결과를 행에서 열로 또는 열에서 행으로 바꾸는 작업은 원리를 이해하면 어렵지 않지만 약간의 기교가 필요하다. 그래서인지 쿼리 결과의 행/열 전환은 SQL 관련 단골 질문이기도 하다.<!--more-->

## 개요
주문 테이블 `orders`에 다음과 같이 날짜별 거래 데이터가 들어있다고 하자.

<pre class="console">
order_date | order_amt
-----------+----------
2013-12-22 |      900
2014-01-23 |     1000
2014-01-31 |      500
2014-03-03 |     2500
...
</pre>

연도별, 월별 거래금액은 `group by`를 사용해 쉽게 구할 수 있다. 날짜를 조작하는 부분은 DBMS마다 조금씩 다를 수 있는데, 기본 로직은 날짜에서 월만 뽑아내 `group by`하는 것이다. 여기서는 PostgreSQL을 예로 사용한다.

```sql
select to_char(order_date, 'yyyy-mm') "yyyy-mm", sum(order_amt) amt
from orders
where order_date between '2013-01-01' and '2014-12-31'
group by to_char(order_date, 'yyyy-mm')
order by 1;
```

위 쿼리를 실행하면 다음과 같이 결과가 표시된다.

<pre class="console">
 yyyy-mm |  amt
---------+-------
 2013-01 | 22428
 2013-02 | 18490
 2013-03 | 22794
...
 2014-01 | 18252
 2014-02 |  9863
 2014-03 | 22081
...
 2014-12 | 30595
(24 rows)
</pre>

그런데 다음과 같이 월을 열로 펼쳐서 표시하고 싶으면 어떻게 해야 할까?

<pre class="console">
 year |  Jan  |  Feb  |  Mar  |  Apr  |  May  | ...
------+-------+-------+-------+-------+-------+-----
 2013 | 22428 | 18490 | 22794 | 23316 | 26798 | ...
 2014 | 18252 |  9863 | 22081 | 24066 | 17110 | ...
</pre>

## 준비
테스트를 위해 다음과 같이 테이블과 샘플 데이터를 준비한다.

```sql
-- 테이블 생성
create table orders (
  order_date date,
  order_amt int
);

-- 테스트 데이터 생성 (2013, 2014)
insert into orders
select '2013-01-01'::date + trunc(random() * 365 * 2)::int, trunc(random() * 1000)
from generate_series(0, 1000) as t(n);
```

## 방법1: Aggregate 함수와 CASE문을 사용하는 방법
먼저 각 열에 원하는 데이터만 나오도록 해야 한다. 예전에 Oracle에서는 `decode` 함수를 많이 사용했고, 표준 SQL에서는 `case~when` 구문을 사용하면 된다. 각 열에 해당 월의 데이터만 들어가도록 다음과 같이 쿼리를 작성할 수 있다.

```sql
select
  extract(year from order_date) "year",
  case when extract(month from order_date) =  1 then order_amt end as "Jan",
  case when extract(month from order_date) =  2 then order_amt end as "Feb",
  case when extract(month from order_date) =  3 then order_amt end as "Mar",
  case when extract(month from order_date) =  4 then order_amt end as "Apr",
  case when extract(month from order_date) =  5 then order_amt end as "May",
  case when extract(month from order_date) =  6 then order_amt end as "Jun",
  case when extract(month from order_date) =  7 then order_amt end as "Jul",
  case when extract(month from order_date) =  8 then order_amt end as "Aug",
  case when extract(month from order_date) =  9 then order_amt end as "Sep",
  case when extract(month from order_date) = 10 then order_amt end as "Oct",
  case when extract(month from order_date) = 11 then order_amt end as "Nov",
  case when extract(month from order_date) = 12 then order_amt end as "Dec"
from orders
where order_date between '2013-01-01' and '2014-12-31';
```

`extract(...)`가 반복되는 것이 보기 싫다면 다음과 같이 쿼리를 수정할 수 있다.

```sql
select
  "year",
  case when mm =  1 then order_amt end as "Jan",
  case when mm =  2 then order_amt end as "Feb",
  case when mm =  3 then order_amt end as "Mar",
  case when mm =  4 then order_amt end as "Apr",
  case when mm =  5 then order_amt end as "May",
  case when mm =  6 then order_amt end as "Jun",
  case when mm =  7 then order_amt end as "Jul",
  case when mm =  8 then order_amt end as "Aug",
  case when mm =  9 then order_amt end as "Sep",
  case when mm = 10 then order_amt end as "Oct",
  case when mm = 11 then order_amt end as "Nov",
  case when mm = 12 then order_amt end as "Dec"
from (select extract(year from order_date) "year",
             extract(month from order_date) as mm, order_amt
      from orders
      where order_date between '2013-01-01' and '2014-12-31') as t;
```

이 쿼리를 실행하면 다음과 같은 결과가 나온다.

<pre class="console">
 year | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec
------+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----
 2013 |     |     |     |     |     |     |     |     |     | 954 |     |
 2013 |     | 614 |     |     |     |     |     |     |     |     |     |
 2014 |     |     |     |     |     |     |     |     | 436 |     |     |
 2013 |     |     |     |     |     |     |     | 469 |     |     |     |
 2013 |     |     |     | 438 |     |     |     |     |     |     |     |
 2014 |     |     |     |     | 156 |     |     |     |     |     |     |
 2013 |     |     |     |  43 |     |     |     |     |     |     |     |
 2014 |     |     |     |     |     |     |     |     |     |   4 |     |
...
</pre>

아직 원하는 결과가 아니지만 거의 다 한 것이나 마찬가지다. 위 결과를 `"year"`로 `group by` 하고 각 컬럼을 `sum()`으로 감싸 데이터를 더해주기만 하면 끝난다.

```sql
select
  "year",
  sum(case when mm =  1 then order_amt end) as "Jan",
  sum(case when mm =  2 then order_amt end) as "Feb",
  sum(case when mm =  3 then order_amt end) as "Mar",
  sum(case when mm =  4 then order_amt end) as "Apr",
  sum(case when mm =  5 then order_amt end) as "May",
  sum(case when mm =  6 then order_amt end) as "Jun",
  sum(case when mm =  7 then order_amt end) as "Jul",
  sum(case when mm =  8 then order_amt end) as "Aug",
  sum(case when mm =  9 then order_amt end) as "Sep",
  sum(case when mm = 10 then order_amt end) as "Oct",
  sum(case when mm = 11 then order_amt end) as "Nov",
  sum(case when mm = 12 then order_amt end) as "Dec"
from (select extract(year from order_date) "year",
             extract(month from order_date) as mm, order_amt
      from orders
      where order_date between '2013-01-01' and '2014-12-31') as t
group by "year";
```

위 쿼리를 실행시키면 원하는 결과가 나오는 것을 확인할 수 있다. 샘플 데이터를 만들 때 `random()` 함수를 사용했으므로 숫자에 차이가 있을 것이다.

<pre class="console">
 year |  Jan  |  Feb  |  Mar  |  Apr  |  May  | ...
------+-------+-------+-------+-------+-------+-----
 2013 | 22428 | 18490 | 22794 | 23316 | 26798 | ...
 2014 | 18252 |  9863 | 22081 | 24066 | 17110 | ...
(2 rows)
</pre>

여기서는 `sum`을 사용했지만 경우에 따라 `count`, `max`, `min` 등의 다른 Aggregate 함수를 사용해야 할 수도 있다.

## 방법2: WITH와 스칼라 서브쿼리를 사용하는 방법
`with`와 스칼라 서브쿼리를 이용해 다음과 같은 쿼리를 작성할 수도 있다.

```sql
with m as (
  select
    extract(year from order_date) "year",
    extract(month from order_date) "month",
    sum(order_amt) amt
  from orders
  where order_date between '2013-01-01' and '2014-12-31'
  group by
    extract(year from order_date),
    extract(month from order_date)
)
select "year",
  (select amt from m where m.year = t.year and m.month =  1) "Jan",
  (select amt from m where m.year = t.year and m.month =  2) "Feb",
  (select amt from m where m.year = t.year and m.month =  3) "Mar",
  (select amt from m where m.year = t.year and m.month =  4) "Apr",
  (select amt from m where m.year = t.year and m.month =  5) "May",
  (select amt from m where m.year = t.year and m.month =  6) "Jun",
  (select amt from m where m.year = t.year and m.month =  7) "Jul",
  (select amt from m where m.year = t.year and m.month =  8) "Aug",
  (select amt from m where m.year = t.year and m.month =  9) "Sep",
  (select amt from m where m.year = t.year and m.month = 10) "Oct",
  (select amt from m where m.year = t.year and m.month = 11) "Nov",
  (select amt from m where m.year = t.year and m.month = 12) "Dec"
from m t
group by "year"
order by 1;
```

## 방법3: PIVOT을 사용하는 방법
Oracle, PostgreSQL 등의 DBMS는 쿼리에서 pivot을 지원한다. Oracle에는 11g부터 `pivot`, `unpivot` 기능이 추가되었다. PostgreSQL에서는 `tablefunc` 모듈에 있는 `crosstab`을 이용해 pivot된 결과를 만들 수 있다. PostgreSQL에서 pivot 기능을 사용하려면 먼저 `tablefunc` 확장기능을 활성화해야 한다.

```sql
CREATE EXTENSION tablefunc;
```

이제 다음과 같이 `crosstab` 함수를 사용할 수 있다.

```sql
select * from crosstab(
  'select
     extract(year from order_date) as year,
     extract(month from order_date) as month,
     sum(order_amt)
   from orders
   where order_date between ''2013-01-01'' and ''2014-12-31''
   group by extract(year from order_date), extract(month from order_date)
   order by 1',
  'select m from generate_series(1,12) m'
) as (
  year int,
  "Jan" int,
  "Feb" int,
  "Mar" int,
  "Apr" int,
  "May" int,
  "Jun" int,
  "Jul" int,
  "Aug" int,
  "Sep" int,
  "Oct" int,
  "Nov" int,
  "Dec" int
);
```

## 정리
쿼리로 행/열을 전환하는 방법을 살펴봤다. 약간의 기교가 필요하지만 원리를 파악하면 이해하기 어려울 정도는 아니다. Oracle 11g에서는 `pivot`, `unpivot`, PostgreSQL에서는 `crosstab`을 이용하면 다른 방법보다 깔끔하게 행/열을 전환할 수 있다.

## 참고
* [Three Ways To Transpose Rows Into Columns in Oracle SQL](http://oraclecoder.com/tutorials/how-to-transpose-columns-to-rows-in-oracle--2435)
Oracle에서 행/열을 전환하는 방법을 설명한다.
