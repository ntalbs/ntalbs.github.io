title: SQL*Loader 사용법 (초간단 정리)
date: 2010-07-27
tags: [db, oracle]

---
간단히 참조할 용도로 정리한다. 자세한 사용법은 [매뉴얼](http://docs.oracle.com/cd/E11882_01/server.112/e22490/ldr_concepts.htm#SUTIL003)을 참조해야 한다.
<!--more-->

### 1. 데이터를 로드할 테이블 생성(또는 확인)
```
create table xxx (
  c1 number,
  c2 varchar2(10),
  c3 varchar2(10),
  c4 varchar2(10),
  c5 date
);
```

### 2. 데이터 파일 확인 (xxx.dat)
```
aaa aaa aaa
bbb bbb bbb
ccc ccc ccc
```

### 3. 컨트롤 파일 작성 (xxx.ctl)
```
load data
infile 'xxx.dat'
into table xxx
fields terminated by ' '
(
c1 sequence,                      -- sequence
c2 expression "to_char(:c1*10)",  -- expression
c3,
c4 constant 'xxx',                -- constant
c5 sysdate)                       -- sysdate
```

### 4. 데이터 로드 실행
<pre class="console">
$ sqlldr userid=xxx/xxx control=xxx.ctl
</pre>

### 5. 로드 결과 확인
<pre class="console">
SQL> select * from xxx;

 C1 C2  C3   C4   C5
 -- --- ---- ---- -------------------
  1 10  aaa  xxx  2006/11/16 17:08:09
  2 20  bbb  xxx  2006/11/16 17:08:09
  3 30  ccc  xxx  2006/11/16 17:08:09
  ...
</pre>
