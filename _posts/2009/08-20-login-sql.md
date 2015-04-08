title: login.sql
date: 2009-08-20
tags: [db, oracle, sqlplus]

---
`SQLPATH` 환경 변수 설정하고 `SQLPATH`에 다음 내용으로 login.sql 파일을 만들어 놓는다.
<!--more-->

```
set trimspool on
set timing on
set time on
set pages 100
set lines 10

set termout off
define gname=idle
column global_name new_value gname
select lower(user)||'@'||substr(global_name, 1, decode(dot, 0, length(global_name), dot-1)) global_name
from (select global_name, instr(global_name, '.') dot from global_name);
set sqlprompt '&gname> '
set termout on
```

10g부터는 SQL 프롬프트를 좀더 간단하게 설정할 수 있다.
```
set sqlprompt '&_user@&_CONNECT_IDENTIFIER> '
```
사용자 이름을 소문자로 나오게 하고 싶으면 다음과 같이 하면 된다.
```
define uname=idle
column user_name new_value uname
select lower(user) user_name from dual;
set sqlprompt '&uname@&_CONNECT_IDENTIFIER> '
```
