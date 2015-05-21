title: SQL*Plus 프롬프트 설정
date: 2008-10-31
tags: [db, oracle, sqlplus]

---
SQL*Plus의 프롬프트를 `username@INSTANCE_NAME >`과 같은 식으로 설정하면 현재 로그인한 인스턴스와 사용자 이름을 확인할 수 있어 편하다. logn.sql 스크립트를 만들어 여기에 프롬프트 설정 코드를 넣어두면 된다. Effective Oracle 책(p79)에는 설정 코드가 조금 복잡하게 나와 있다.
<!--more-->

```sql
define gname=idle
column global_name new_value gname
select lower(user)||'@'
  ||substr(global_name, 1,
           decode(dot, 0, length(global_name),
           dot-1)) global_name
from (select global_name, instr(global_name, '.') dot
      from global_name);
set sqlprompt '&gname> '
```

이 코드는 복잡할 뿐만 아니라 RAC인 경우 DB 이름만 표시할 뿐 어느 인스턴스인지를 알 수 없기 때문에 불편하다. 다음과 같이 하면 코드도 짧아질 뿐 아니라 어느 인스턴스인지도 알 수 있다. 9i, 10g에서 모두 잘 동작한다.

```sql
define uname=idle
column user_name new_value uname
select lower(user) user_name from dual;
set sqlprompt '&uname@&_CONNECT_IDENTIFIER> '
```

그러나 9i에서는 처음 로그인할 때만 프롬프트가 제대로 설정되고, SQL*Plus 내에서 `connect` 명령으로 다시 접속할 경우 프롬프트가 갱신되지 않는다. 10g에서는 `connect`를 새로 하면 그에 맞게 프롬프트가 바뀐다.
10g에서 사용자 이름이 대문자로 나오는 것이 상관 없다면 다음과 같이 더 간단하게 할 수 있다.

```sql
set sqlprompt '&_user@&_CONNECT_IDENTIFIER> '
```

`_CONNECT_IDENTIFIER`는 실제로 인스턴스 이름이 아니라 `TNSNAME`이다. SID가 XXXDB더라도 TNSNAME을 XXX로 해놓는다면 프롬프트에도 XXX로 보일 것이다.
