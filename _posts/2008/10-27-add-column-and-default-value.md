title: 컬럼 추가와 디폴트 값
date: 2008-10-27
tags: [db, oracle]

---
기존 테이블에 컬럼을 추가할 때 디폴트 값을 지정하면 기존 데이터는 건드리지 않고 새로 추가되는 데이터에 대해서만 디폴드 값이 적용되는 줄 알고 있었다. 그런데 오늘 우연히 작업을 하다가 그동안 잘못 알고 있었다는 것을 알게 되었다. 다음 두 작업은 완전히 다르게 진행된다.
<!--more-->

#### 1. 컬럼 추가시 default 값을 지정하는 경우
```
alter table t add(c1 char(1) default 'X');
```

#### 2. 컬럼을 추가한 다음 default 값을 지정하는 경우
```
alter table t add(c1 char(1));
alter table t modify (c1 default 'X');
```

1의 경우 컬럼이 추가되면서 기존 레코드에 대해서도 추가된 컬럼에 디폴트 값을 설정하므로, 모든 레코드를 업데이트하는 것과 마찬가지이며 시간 오래 걸린다. 이 시간동안 다른 세션에서 테이블에 DML을 시도하면 해당 세션은 library cache lock 대기상태가 된다.

2와 같이 컬럼 추가와 디폴트 값을 따로 작업할 경우 기존 레코드에 대한 값은 변경되지 않는다. 따라서 기존 레코드에 대해 새로 추가된 컬럼의 값은 null이 된다. 새로 insert하는 레코드부터 디폴트 값이 적용된다.
매뉴얼(SQL Reference)에도 다음과 같이 명시되어 있다.

> DEFAULT
> ...If you are adding a new column to the table and specify the default value, then the database inserts the default column value into all rows of the table.

따라서 컬럼을 추가할 때 디폴드 값을 함께 주는 것은 주의해야 겠다. 트랜잭션이 빈번히 발생하는 테이블에 컬럼을 추가할 때 디폴드 값을 주어 컬럼을 추가할 경우, 새로 추가된 컬럼에 디폴드 값을 설정하느라 테이블이 상당 시간동안 접근 불가능 상태가 될 수 있기 때문이다. 이렇게 된다면 해당 테이블에 접근하는 트랜잭션은 컬럼 추가 작업이 끝날 때까지 모두 대기 상태에 빠지거나 timeout으로 실패하게 될 것이다.

### 참고
* [Oracle® Database SQL Reference 10g Release 2 (10.2) > ALTER TABLE > DEFAULT](http://docs.oracle.com/cd/B19306_01/server.102/b14200/statements_3001.htm#sthref5165)
