date: 2008-10-24
tags: [DB, Oracle]
title: 원하는 시간에만 DB 작업 실행하기
---
예전에 [database.sarang.net 오라클 게시판](http://database.sarang.net/?criteria=oracle)에 `DBMS_JOB`을 이용해 원하는 작업을 08시, 14시, 20시에 실행시키는 방법을 묻는 질문이 올라왔다. 작업 간격이 규칙적일 때는 문제가 간단하지만 원하는 시간 간격이 불규칙하므로 그냥 JOB을 세 개 등록하면 어떻겠냐고 답했더니 이번에는 이 작업을 평일에만 실행시키게 하고 싶다고 했다. 즉 평일 08시, 14시, 20시에 작업이 실행되도록 하고 싶다는 것이었다.
<!--more-->

문제를 풀기 전에 `DBMS_JOB.SUBMIT` 프로시저를 살펴보자. `DBMS_JOB`을 이용해 작업을 등록하려면 `SUBMIT` 프로시저를 사용해야 한다. 파라미터 중 `next_date`와 `interval`을 통해 작업 실행 시각을 조절할 수 있다.

```sql
DBMS_JOB.SUBMIT (
  job       OUT BINARY_INTEGER,
  what      IN  VARCHAR2,
  next_date IN  DATE DEFAULT sysdate,    -- 실행할 시각
  interval  IN  VARCHAR2 DEFAULT 'null', -- 다음 실행될 시점을 계산할 수식
  no_parse  IN  BOOLEAN DEFAULT FALSE,
  instance  IN  BINARY_INTEGER DEFAULT any_instance,
  force     IN  BOOLEAN DEFAULT FALSE);
```

`next_date`의 디폴트 값은 `sysdate`이므로 값을 주지 않으면 등록 즉시 실행된다. 그 다음 실행 시각은 JOB이 실행되기 직전 `interval`에 지정된 수식을 이용해 계산한다. `interval`이 `NULL`일 경우는 작업이 한 번만 실행된다. 파라미터 이름이 `interval`이지만 실제 의미는 **다음 실행될 시점을 계산할 수식**이다. 만약 어떤 작업을 1시간에 1번씩 실행시키고 싶다면 `interval`을 `'sysdate+1/24'`로 주면 된다. 작업을 시작하기 전에 `sysdate+1/24`를 통해 다음 실행할 시각을 구하면 작업 시작 시간으로부터 1시간 후인 시각이 된다. 다음 작업 시작 시각을 알고 싶으면 `ALL_JOBS`의 `NEXT_DATE` 컬럼을 조회해 확인할 수 있다.

| interval         | 작업 주기        |
|------------------|-----------------|
|`'sysdate + 1/24'`| 1시간에 1번      |
|`'sysdate + 1'`   | 1일에 1번        |
|`'sysdate + 7'`   | 7일(일주일)에 한번|

그런데 위와 같이 하면 작업 주기만 지정한 것일 뿐이다. 특정 시각에 JOB을 실행시키려면 다음과 같이 하면 된다.

|interval                       | 작업 시각                 |
|-------------------------------|--------------------------|
|`'trunc(sysdate) + 1 + 1/24'`  | 매일 01시에 작업 실행      |
|`'trunc(sysdate, ''D'') + 7'`  | 매주 일요일 00시에 작업 실행|

`interval` 파라미터는 문자열로 주어야 하므로 수식 내에 따옴표(single quotation)이 있으면 따옴표를 두 개 써줘야 하는 것에 유의해야 한다. interval 수식이 복잡할 때는 확인하기가 어려울 수 있는데, 그럴 때는 interval 수식으로 직접 쿼리를 작성해 확인할 수 있다.

```sql
select trunc(sysdate, 'D') + 7 from dual;
```

이제 다음과 같이 다양한 경우에 대한 interval을 구해보자.

1. 매주 토요일 새벽 1시에 실행
2. 매월 1일 새벽 0시에 실행
3. 매월 말일 밤 11시에 실행
4. 평일(월화수목금) 밤 10시에 실행
5. 불규칙한 시각, 8시, 14시, 20시에 한번씩

1번은 쉽다. 일단 `next_date`를 이번 주 토요일 새벽 1시로 지정하고, 그 다음 실행될 날은 거기서 7일 후가 된다. 즉,

```sql
...
next_date=>to_date('2007102701','YYYYMMDDHH24'),
interval=>'sysdate + 7'
...
```

월초나 월말의 경우는 `add_months`나 `last_day`를 이용해 구하면 된다.

```sql
-- 매월1일 새벽 0시 작업 실행
...
next_date=>add_months(trunc(sysdate,'MM'),1),
interval=>'add_months(trunc(sysdate,''MM''),1)'
...

-- 매월 말일 밤 11시에 작업 실행
...
next_date=>last_day(trunc(sysdate))+23/24,
interval=>'last_day(trunc(sysdate)+1)+23/24'  -- 말일+1일은 다음달 1일
...
```

평일만 실행되도록 하기 위해서는 interval이 좀더 복잡해진다.

```sql
...
interval=>'trunc(sysdate) + decode(to_char(sysdate,''D''), ''6'', 3, ''7'', 2, 1) + 22/24'
...
```

요일을 구한 다음 토요일(`to_char(sysdate,'D')='6'`)에는 작업 후 3일 후에, 일요일(`to_char(sysdate,'D')='7'`)에는 작업 후 2일 후에, 평일에는 자업 후 1일 후에 작업이 다시 시작되도록 하면 된다. 이를 위해 `DECODE` 함수를 활용했다.

불규칙한 시간 간격일 경우에도 작업 시각을 기반으로 `DECODE`를 활용하면 가능할 것 같다. 그러나 하루 수행 횟수가 서너 번 정도라면 그냥 각 시각마다 실행되도록 서너 개의 JOB을 등록시켜주는 것도 생각해볼 수 있다.

원래 문제는 불규칙한 시각+평일 조건을 만족해야 하므로 하나의 interval 수식으로 해결하려면 수식이 무척 복잡해질 것 같다. interval 수식이 복잡해지면 이해가기도 어려워 진고, 나중에 수정하고 싶을 때 문제가 생길 수도 있다.

참고로 10g부터는 `DBMS_JOB` 대신 `DBMS_SCHEDULER`을 쓰도록 권고하고 있다.
