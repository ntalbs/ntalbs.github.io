title: SELECT 결과를 shell 변수로 가져오기
date: 2008-11-01
tags: [db, oracle, shell, sqlplus]

---
select한 결과를 shell에서 참조해야 하는 경우 다음과 같이 하면 된다.
<!--more-->

#### 방법 1
```sh
#!/bin/ksh
VALUE=`sqlplus -silent "user/passwd@sid" < set pagesize 0 \
feedback off verify off heading off echo off
select max(c1) from t1;
exit;
END`

if [ -z "$VALUE" ]; then
echo "No rows returned from database"
exit 0
else
echo $VALUE
fi
```

#### 방법 2
```sh
#!/bin/ksh
sqlplus -s > null "usr/passwd@sid" < column num_rows \
new_value num_rows format 9999
select count(*) num_rows
from table_name;
exit num_rows
EOF
echo "Number of rows are: $?"
```
