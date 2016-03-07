date: 2009-02-16
tags: [DB, Oracle]
title: 데이터베이스 링크 생성
---
데이터베이스 링크를 만들 때 `using` 뒤에 다음과 같이 connect string을 직접 적어줄 수도 있다. 데이터베이스 링크만을 위해 `tnsnames.ora` 파일에 `tnsalias`를 등록하지 않아도 되겠다.
<!--more-->

```
create database link xxxdb
connect to xxx identified by xxx
using
'(description=
    (address_list=
        (address=
            (protocol=tcp)(host=xxx.xxx.xxx.xxx)(port=????)
         )
    )
    (connect_data=(sid=xxxdb))
 )';

drop database link xxxdb;
```
