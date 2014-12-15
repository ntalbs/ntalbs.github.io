title: MINIMIZE RECORDS_PER_BLOCK
date: 2008-10-25
tags: [db, oracle]

---
SQL Reference에 보면 `records_per_block`절에 대해 다음과 같이 설명되어 있다.

> instruct Oracle Database to calculate the largest number of records in any block in the table and to limit future inserts so that no block can contain more than that number of records.
<!--more-->

해석을 해보면,

> 테이블 내의 블록 중 레코드 수가 최대인 것을 계산한 다음, 나중에 insert할 때 블록 당 레코드 수를 계산한 값 이상이 되지 않도록 제한하도록 한다.

처음에는 정확히 해석해보지도 않고 '뭔 소리지?' 하고 의아해 했다. 사실 이미 데이터가 들어있는 테이블에 `ALTER TABLE ... MINIMIZE RECORDS_PER_BLOCK`을 실행시키면, 당장 눈에 띄는 변화를 발견할 수 없었기 때문이다.

예를 들어, 테이블을 하나 만들고,

```sql
create table t1 (n number);
```

데이터를 10건 정도 넣고,

```sql
insert into t1
  select level from dual connect by level <= 10;
commit;
```

블록에 어떻게 들어가있는지 확인해보기 위해 다음 쿼리를 실행시켜보면,

```sql
select dbms_rowid.rowid_block_number(rowid) rowid_blkno
from t1;
```

<pre class="console">
 N    ROWID_BLKNO
 ---- -----------
    1         415
    2         415
    3         415
    4         415
    5         415
    6         415
    7         415
    8         415
    9         415
   10         415

 10 rows selected.
</pre>

모든 레코드가 한 블록에 들어가 있는 것을 확인할 수 있다. (블록 번호가 모두 동일하게 나온다.) 테스트에서 `DB_BLOCK_SIZE`는 8k로 되어 있었으니, 이런 데이터라면 몇천개 이상 들어갈 것이다.

그리고 `ALTER TABLE ... MINIMIZE RECORDS_PER_BLOCK` 명령을 실행시킨 다음 위 쿼리를 다시 실행시켜봐도 결과가 동일한 것을 보고는... "이게 뭐야!" 했다.

```sql
alter table t1 minimize records_per_block;
select n, dbms_rowid.rowid_block_number(rowid) rowid_blkno
from t1;
```

<pre class="console">
 N    ROWID_BLKNO
 ---- -----------
    1         415
    2         415
    3         415
    4         415
    5         415
    6         415
    7         415
    8         415
    9         415
   10         415

 10 rows selected.
</pre>

매뉴얼을 자세히 읽어봤으면 제대로 이해할 수 있었을 텐데...
매뉴얼에는 현재 테이블에서 블록당 레코드 수의 최대값을 구한 다음 나중에 `Insert`할 때 블록당 레코드 수가 그 최대값을 넘지 않도록 한다고 쓰여 있다.

따라서 테스트를 다시 해보면... 테이블을 다시 만들고... (truncate 후 다시 테스트하면 원하는 결과가 나오지 않는다)

```sql
drop table t1 purge;
create table t1 (n number);
```

데이터를 1건 넣고

```sql
insert into t1 values (0);
```

`ALTER TABLE ... MINIMIZE RECORDS_PER_BLOCK` 명령을 실행시킨 다음,

```sql
ALTER TABLE t1 MINIMIZE RECORDS_PER_BLOCK;
```

데이터를 왕창 넣어 본다.

```sql
insert into t1
  select level from dual connect by level <= 10;
commit;
```

그리고 다음 쿼리를 실행시켜보면,

```sql
select n, dbms_rowid.rowid_block_number(rowid) rowid_blkno
from t1 order by 1;
```

<pre class="console">
 N    ROWID_BLKNO
 ---- -----------
    0         415
    1         415
    2         416
    3         416
    4         412
    5         412
    6         413
    7         413
    8         414
    9         414
   10         421

 11 rows selected.
</pre>

블록당 레코드 수가 2개에 지나지 않음을 볼 수 있다. (같은 블록 넘버가 2개씩 나오는 것으로 확인할 수 있다.) 좀더 정확히 보려면 다음과 같은 쿼리를 날려보는 것이 좋겠다.

```sql
select
  dbms_rowid.rowid_block_number(rowid) rowid_blkno,
  dbms_rowid.rowid_relative_fno(rowid) rel_fno,
  count(*) rec_cnt
from t1
group by
  dbms_rowid.rowid_block_number(rowid),
  dbms_rowid.rowid_relative_fno(rowid);
```

<pre class="console">
 ROWID_BLKNO REL_FNO     REC_CNT
 ----------- ----------- -----------
         415           4           2
         412           4           2
         414           4           2
         421           4           1
         413           4           2
         416           4           2

 6 rows selected.
</pre>

사실 문서대로라면 블록 당 1개의 레코드가 있어야 맞는 거긴 하지만...

처음에 3건을 넣고 `ALTER TABLE ... MINIMIZE RECORDS_PER_BLOCK`을 날린 다음 다시 테스트해보면 블록 당 3개의 레코드가 있는 것을 확인할 수있다. Google 그룹스에서 검색해보면 이에 대해 자세한 설명이 되어있는 글을 찾을 수 있다.

크기가 작지만 액세스가 매우 빈번한 테이블의 경우 블록 컨텐션이 많이 발생할 수 있을텐데,
그럴 때 이걸 적용할 수도 있겠다.
