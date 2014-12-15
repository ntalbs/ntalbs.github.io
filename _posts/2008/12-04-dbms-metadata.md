title: dbms_metadata 패키지를 이용한 DDL 추출
date: 2008-12-04
tags: [db, oracle, ddl]

---
`dbms_metadata` 패키지를 이용해 DDL 추출하는 방법이다. 특정 스키마의 모든 DB 객체에 대한 DDL을 추출하려면 export를 사용하는 것이 더 편하다. ([특정 스키마의 DDL 추출 참조](/2008/11/08/extract-ddl/))
<!--more-->

```
DBMS_METADATA.GET_DDL (
    object_type     IN VARCHAR2,
    name            IN VARCHAR2,
    schema          IN VARCHAR2 DEFAULT NULL,
    version         IN VARCHAR2 DEFAULT 'COMPATIBLE',
    model           IN VARCHAR2 DEFAULT 'ORACLE',
    transform       IN VARCHAR2 DEFAULT 'DDL')
RETURN CLOB;
```

#### 예제: scott.dept 테이블, 인덱스 DDL 추출
```
select dbms_metadata.get_ddl('TABLE','DEPT','SCOTT') from dual;
select dbms_metadata.get_ddl('INDEX','DEPT_IDX','SCOTT') from dual;
```

#### 예제: XXX로 시작하는 테이블과 인덱스에 대한 DDL 추출
```
select dbms_metadata.get_ddl('TABLE',u.table_name, 'SCOTT') ||';'
from dba_tables u where table_name like 'XXX%';

select dbms_metadata.get_ddl('INDEX',u.index_name, 'SCOTT') ||';'
from dba_indexes u where index_name like 'XXX%';
```

#### 예제: scott 스키마에 있는 모든 테이블과 인덱스에 대한 DDL 추출
```
connect scott/tiger;
select dbms_metadata.get_ddl('TABLE',u.table_name )
from user_tables u;
select dbms_metadata.get_ddl('INDEX',u.index_name)
from user_indexes u;
```
