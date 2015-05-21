title: Undo 테이블스페이스 크기 변경 방법
date: 2009-11-10
tags: [db, oracle, tablespace]

---
Oracle9i에서 UNDO Tablespace를 auto mode로 사용할 때, UNDO Tablespace를 변경하는 방법이다. Undo Tablespace의 데이터 파일이 너무 커진 경우 데이터 파일 크기를 줄이고 싶지만, 데이터 파일의 크기를 직접 줄일 수는 없다. 따라서 새로운 UNDO Tablespace를 만들고 크기를 적절히 지정한 데이터 파일을 할당하고, 데이터베이스에 지정된 UNDO Tablespace를 변경해야 한다.
<!--more-->

#### 1. 다음과 같이 새로운 undo tablespace 생성.
```sql
CREATE UNDO TABLESPACE UNDOTBS2;
DATAFILE '/home/oradata/undotbs.dbf' SIZE 100M;
```

#### 2. 새로 생성한 undo tablespace로 스위치.
```sql
ALTER SYSTEM SET UNDO_TABLESPACE = UNDOTBS2;
```

#### 3. 기존에 사용하던 undo tablespace를 drop.
```sql
DROP TABLESPACE UNDOTBS1;
```

#### 4. 초기화 파라미터 파일 변경
`initSID.ora` 파일을 사용하는 경우에는 `initSID.ora` 파일에 `undo_tablespace` 파라미터의 값을 `undotbs2`로 변경.

PS: 10g에서는 테이블스페이스 이름을 변경할 수 있으므로 새로 만든 `UNDOTBS2`를 `UNDOTBS1`으로 바꾸면 된다
