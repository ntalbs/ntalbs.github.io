date: 2010-12-15
tags: [DB, SQL]
title: 생각해볼 문제
---
1부터 100까지 더하는 프로그램을 짜라면 많은 프로그래머들이 다음과 같이 `for` 루프로 1부터 100까지 돌면서 합을 구하는 형식으로 코드를 작성할 것이다. (Python으로 구현)
<!--more-->

```python
def sum1(n):
  s = 0
  for i in range(1, n+1):
    s += i
  return s
```

컴퓨터는 이런 식의 반복 계산을 잘 하므로 작은 수에 대해서는 이렇게 작성해도 큰 상관은 없을 것이다. 물론 비효율적이기는 하지만. 좀더 효율적으로 작성하려면 간단한 공식을 이용하면 된다.

```python
def sum2(n):
  return n * (n + 1) / 2
```

[Set-based Approach](http://ukja.tistory.com/362)에서 주문 간격 평균을 구하는 문제도 사실은 위와 비슷한 경우라 할 수 있다. (문제는 원래 페이지 참조) 테이블은 다음과 같다. (컬럼 이름을 약간 수정했다.)

```sql
create table orders(
  member_no int, -- 회원번호
  order_no  int, -- 주문번호
  order_dt  date -- 주문일자
);
```

테스트를 위해 샘플 데이터도 넣었다. (테스트는 PostgreSQL에서 진행)

```sql
insert into orders values
(100, 1, '2010-12-01'),
(100, 2, '2010-12-10'),
(100, 3, '2010-12-15');
```

개발자라면 주문 간격의 평균을 구하라는 문제를 보는 순간 먼저 날짜 간격을 계산한 다음 그에 대한 평균을 구해야겠다고 생각할 것이다. SQL의 윈도우 함수(window function 또는 windowing function, 오라클에서는 analytic function)을 모르면 약간 고민을 하겠지만 이를 알고 있다면 망설임 없이 날짜로 정렬한 다음 현재 날짜에서 바로 전 레코드의 날짜를 빼서 기간을 구하고 이 기간에 대한 평균을 구하려 할 것이다.

```sql
select avg(order_dt - priv_order_dt)
from (
  select
    order_dt,
    lag(order_dt, 1)
      over (partition by member_no
          order by order_dt) priv_order_dt
  from orders where member_no=100
  ) a
;
```

그러나 평균이 무엇인지를 잘 생각해보면 좀더 간단하게 구할 수 있다는 걸 알 수 있다.

{% asset_img 2010-12-15-1.png %}

날짜가 d<sub>1</sub>(처음 주문한 날짜)부터 d<sub>n</sub>(마지막 주문한 날짜)까지 있다면 각 주문 간격은
d<sub>2</sub>-d<sub>1</sub>, d<sub>3</sub>-d<sub>2</sub>, ..., d<sub>n</sub> - d<sub>n-1</sub>가 된다. 날짜 개수가 n개이므로 각 날짜 사이의 기간 개수는 n-1개가 된다. 따라서 평균을 구하는 식은 다음과 같이 단순화할 수 있다.

{% asset_img 2010-12-15-2.png %}

즉, 마지막 날짜에서 처음 날짜를 뺀 다음 기간 개수로 나눠주면 되는 것이다. 앞에서 윈도우 함수까지 동원해가며 작성했던 SQL은 사실 수식을 단순화하기 전의 방법(수식 첫 줄)으로 기간의 평균을 구한 것이다.

그러나 마지막의 단순한 식을 이용하면 SQL도 단순해진다.

```sql
select (max(order_dt) - min(order_dt)) / (count(*)-1)
from orders
where member_no = 100;
```

그런데 `count(*)`가 1인 경우, 즉 날짜가 하나뿐인 경우에는 기간이란게 있을 수 없다. 위 SQL도 분모가 0이 되기 때문에 문제가 생긴다. 따라서 다음과 같이 `count(*)`가 1인 경우에 대해 따로 처리하도록 수정해야 한다.

```sql
select
  case when count(*) = 1 then
    null
  else
    (max(order_dt) - min(order_dt)) / (count(*)-1)
  end
from orders
where member_no = 100;
```

프로그램을 작성할 때, 또는 SQL을 작성할 때 아무 생각없이 코드를 작성하지 말아야 한다는 걸 깨닫게 해주는 좋은 문제다.

## 참고
* 위 SQL 코드는 [조동욱 님의 블로그에 올라온 글](http://ukja.tistory.com/362)과 그에 달린 답글을 참고하며 작성한 것이다.
* SQL을 작성할 때 한번 더 생각하게 해주는 좋은 예제지만 집합적 사고와는 그다지 관계가 없어 보인다.
