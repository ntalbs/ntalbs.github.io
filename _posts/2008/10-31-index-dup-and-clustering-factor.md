title: 인덱스 중복과 클러스터링 팩터
date: 2008-10-31
tags: [db, oracle, index]

---
테이블 T에 다음과 같은 인덱스가 있다면 `ix01`은 삭제해야 한다고 생각했다.
* `ix01`: `a`
* `ix02`: `a+b`

`ix02`을 이용하면 `ix01`을 사용해야 하는 경우를 모두 포괄할 수 있으니 `ix02`만 남겨놓고 나머지는 삭제하는 것이 맞다고 생각했던 것이다. 그러나 문제가 항상 그렇게 단순하지만은 않은 듯 하다.
<!--more-->

```sql
create table t(a number, b varchar2(20), c varchar2(30));

insert into t
select mod(level, 1000),
       dbms_random.string('U', 20),
       dbms_random.string('X', 30)
from dual connect by level <= 1000000;

commit;

create index ix01 on t(a);
create index ix02 on t(a, b);

analyze table t compute statistics;
```

참고: 인덱스를 `ix01(a)`, `ix02(a+b)`로 만들 때 테이블에 **인덱스에는 없는 별도의 컬럼(c)가 있는 경우와 없는 경우**는 양상이 완전히 다르게 나타난다. 컬럼 c가 없는 경우 `select * from t where a=:a`와 같은 쿼리를 실행시키면 `ix02` 인덱스만 읽어서 결과를 구할 수 있으므로(테이블을 읽지 않고도) 원하는 테스트를 할 수 없다.

테이블 `T`에 1백만건의 데이터가 들어 있고, 컬럼 `a`의 distinct value는 1000개다. 그리고 `ix01(a)`, `ix02(a+b)` 인덱스를 생성했다. 이 경우 `a`에 `'='` 조건으로 쿼리를 수행하는데 있어 `ix01`을 타나 `ix02`를 타나 결과가 동일할까?

<pre class="console">
SQL&gt; select * from t where a=10

Call    Count CPU Time Elapsed Time Disk Query Current Rows
------- ----- -------- ------------ ---- ----- ------- ----
Parse       1    0.000        0.000    0     0       0    0
Execute     1    0.000        0.000    0     0       0    0
Fetch     101    0.000        0.008    0  1104       0 1000
------- ----- -------- ------------ ---- ----- ------- ----
Total     103    0.000        0.008    0  <span style="color:black;background-color:yellow">1104</span>       0 1000

Misses in library cache during parse: 0
Optimizer goal: ALL_ROWS
Parsing user: XXX (ID=61)

Rows  Row Source Operation
---- ---------------------------------------------------
   0 STATEMENT
1000   TABLE ACCESS BY INDEX ROWID T (cr=1104 pr=0 pw=0 time=8056 us)
1000    INDEX RANGE SCAN <span style="color:black;background-color:lightgreen">IX01</span> (cr=104 pr=0 pw=0 time=1037 us)OF IX01 (NONUNIQUE)
</pre>

<pre class="console">
SQL&gt; select /*+ INDEX(t ix02) */ * from t where a=10

Call    Count CPU Time Elapsed Time Disk Query Current Rows
------- ----- -------- ------------ ---- ----- ------- ----
Parse       1    0.000        0.000    0     0       0    0
Execute     1    0.000        0.000    0     0       0    0
Fetch     101    0.000        0.009    0  1108       0 1000
------- ----- -------- ------------ ---- ----- ------- ----
Total     103    0.000        0.009    0  <span style="color:black;background-color:yellow">1108</span>       0 1000

Misses in library cache during parse: 0
Optimizer goal: ALL_ROWS
Parsing user: XXX (ID=61)

Rows  Row Source Operation
---- ---------------------------------------------------
   0 STATEMENT
1000   TABLE ACCESS BY INDEX ROWID T (cr=1108 pr=0 pw=0 time=9058 us)
1000    INDEX RANGE SCAN <span style="color:black;background-color:lightgreen">IX02</span> (cr=108 pr=0 pw=0 time=1037 us)OF IX02 (NONUNIQUE)
</pre>

이 경우는 별차이 없는 듯 하다. `ix01`을 타는 경우와 `ix02`를 타는 경우 I/O가 크게 차이나지 않는다. 이런 경우라면 당연히 `ix01`이 존재할 이유가 없으므로 삭제해도 될 것이다. 이제 테스트 데이터를 약간 다르게 만들어 보자.

```sql
drop table t purge;

create table t(a number, b varchar2(20), c varchar2(30));

insert into t
select trunc(level/1000),
       dbms_random.string('U', 20),
       dbms_random.string('X', 30)
from dual connect by level <= 1000000;

commit;

create index ix01 on t(a);
create index ix02 on t(a, b);

analyze table t compute statistics;
```

달라진 것은 a 컬럼에 데이터를 넣는 방식 뿐이다. 실제 들어가는 데이터는 거의 동일하나 데이터가 들어가는 순서가 달라진다. 앞에서는 1, 2, ..., 998, 999, 0, 1, 2, ..., 999, 0, 1, ...과 같은 순서로 들어간다면 여기서는 0, 0, ..., 0(1000개), 1, 1, ..., 1(1000개), 2, 2, ...와 같은 순서로 데이터가 들어간다. 이제 위에서 돌렸던 쿼리를 다시 돌려보자.

<pre class="console">
SQL&gt; select * from t where a=10

Call    Count CPU Time Elapsed Time Disk Query Current Rows
------- ----- -------- ------------ ---- ----- ------- ----
Parse       1    0.000        0.001    0     0       0    0
Execute     1    0.000        0.000    0     0       0    0
Fetch     101    0.000        0.004    0   213       0 1000
------- ----- -------- ------------ ---- ----- ------- ----
Total     103    0.000        0.005    0   <span style="color:red;background-color:yellow;font-weight:bold">213</span>       0 1000

Misses in library cache during parse: 1
Optimizer goal: ALL_ROWS
Parsing user: XXX (ID=61)

Rows  Row Source Operation
----  ---------------------------------------------------
   0  STATEMENT
1000   TABLE ACCESS BY INDEX ROWID T (cr=213 pr=0 pw=0 time=3043 us)
1000    INDEX RANGE SCAN IX01 (cr=105 pr=0 pw=0 time=4026 us)OF IX01 (NONUNIQUE)
</pre>

<pre class="console">
SQL&gt; select /*+ INDEX(t ix02) */ * from t where a=10

Call    Count CPU Time Elapsed Time Disk Query Current Rows
------- ----- -------- ------------ ---- ----- ------- ----
Parse       1    0.000        0.001    0     0       0    0
Execute     1    0.000        0.000    0     0       0    0
Fetch     101    0.016        0.008    0  1001       0 1000
------- ----- -------- ------------ ---- ----- ------- ----
Total     103    0.016        0.009    0  <span style="color:red;background-color:yellow;font-weight:bold">1001</span>       0 1000

Misses in library cache during parse: 1
Optimizer goal: ALL_ROWS
Parsing user: XXX (ID=61)

Rows  Row Source Operation
----  ---------------------------------------------------
   0  STATEMENT
1000   TABLE ACCESS BY INDEX ROWID T (cr=1001 pr=0 pw=0 time=8055 us)
1000    INDEX RANGE SCAN IX02 (cr=108 pr=0 pw=0 time=1034 us)OF IX02 (NONUNIQUE)
</pre>

어라? `ix02` 인덱스를 타면 `ix01`을 탈 때보다 I/O가 5배 이상 높다. 왜 그런 것일까? 정답은 클러스터링 팩터에 있다. 두 인덱스의 클러스터링 팩터를 비교해보면 다음과 같이 큰 차이가 남을 알 수 있다.

<pre class="console">
SQL&gt; select index_name, clustering_factor
     from dba_indexes
     where index_name in ('IX01','IX02');

INDEX_NAME                     CLUSTERING_
------------------------------ -----------
IX01                                 <span style="color:black;background-color:yellow">9338</span>
IX02                               <span style="color:black;background-color:yellow">886957</span>

2 rows selected.
</pre>

`ix01`을 타든 `ix02`를 타든 테이블에 가서 `a=10`인 블럭을 읽는 것은 마찬가지지만, `ix02`를 타는 경우는 인덱스를 레인지 스캔하면 읽는 순서와 테이블에서의 블럭 순서가 계속 엇갈리며 I/O가 많아지는 것이다. 그렇다면 `a`, `b`로 정렬해 데이터를 넣으면 어떨까?

```sql
drop table t purge;

create table t(a number, b varchar2(20), c varchar2(30));

insert into t
select trunc(level/1000),
       dbms_random.string('U', 20),
       dbms_random.string('X', 30)
from dual connect by level <= 1000000
order by 1,2;

commit;

create index ix01 on t(a);
create index ix02 on t(a, b);

analyze table t compute statistics;
```

`a`, `b`로 정렬해 데이터를 넣었으므로, `ix01`과 `ix02`의 클러스터링 팩터를 확인해보면 다음과 같이 비슷함을 확인할 수 있다.

<pre class="console">
SQL&gt; select index_name, clustering_factor
     from dba_indexes
     where index_name in ('IX01','IX02');

INDEX_NAME                     CLUSTERING_
------------------------------ -----------
IX01                                  9338
IX02                                  8389

2 rows selected.
</pre>

다시 테스트해보자.

<pre class="console">
SQL&gt; select * from t where a=10

Call    Count CPU Time Elapsed Time Disk Query Current Rows
------- ----- -------- ------------ ---- ----- ------- ----
Parse       1    0.000        0.001    0     0       0    0
Execute     1    0.000        0.000    0     0       0    0
Fetch     101    0.000        0.004    0   213       0 1000
------- ----- -------- ------------ ---- ----- ------- ----
Total     103    0.000        0.005    0   <span style="color:black;background-color:yellow">213</span>       0 1000

Misses in library cache during parse: 1
Optimizer goal: ALL_ROWS
Parsing user: XXX (ID=61)

Rows  Row Source Operation
---- ---------------------------------------------------
   0 STATEMENT
1000   TABLE ACCESS BY INDEX ROWID T (cr=213 pr=0 pw=0 time=3041 us)
1000    INDEX RANGE SCAN IX01 (cr=<span style="color:black;background-color:yellow">105</span> pr=0 pw=0 time=3025 us)OF IX01 (NONUNIQUE)
</pre>

<pre class="console">
SQL&gt; select /*+ INDEX(t ix02) */ * from t where a=10

Call    Count CPU Time Elapsed Time Disk Query Current Rows
------- ----- -------- ------------ ---- ----- ------- ----
Parse       1    0.000        0.001    0     0       0    0
Execute     1    0.000        0.000    0     0       0    0
Fetch     101    0.016        0.004    0   216       0 1000
------- ----- -------- ------------ ---- ----- ------- ----
Total     103    0.016        0.005    0   <span style="color:black;background-color:yellow">216</span>       0 1000

Misses in library cache during parse: 1
Optimizer goal: ALL_ROWS
Parsing user: XXX (ID=61)

Rows  Row Source Operation
---- ---------------------------------------------------
   0 STATEMENT
1000   TABLE ACCESS BY INDEX ROWID T (cr=216 pr=0 pw=0 time=3044 us)
1000    INDEX RANGE SCAN IX02 (cr=<span style="color:black;background-color:yellow">108</span> pr=0 pw=0 time=3026 us)OF IX02 (NONUNIQUE)
</pre>

`ix01`을 탈 때와 `ix02`를 탈 때의 I/O가 거의 비슷해진다.

## 결론
테스트를 통해 알 수 있듯이, `ix01(a)`과 `ix02(a+b)`와 같이 인덱스가 중복된 것 처럼 보이더라도 함부로 `ix01`을 삭제하면 안된다. 클러스터링 팩터에 따라 I/O에 많은 차이가 생길 수 있기 때문이다.
