title: Direct-path Insert시 주의사항
date: 2008-10-27
tags: [db, oracle]

---
뭔가에 대해 어설프게 아는 것은 큰 위험을 초래할 수 있다. 이번에는 Direct-path Insert에 대한 어설픈 지식으로 큰 사고를 낼 뻔 했다. 지금까지 알고 있었던 사실은 Direct-path Insert를 이용하면 redo와 undo 로깅을 생략해 성능을 향상시킬 수 있다는 것이었다. 따라서 테이블에 대량의 데이터를 넣을 때 이 방법을 활용하곤 했다.<!--more--> 그러나 **Direct-path INSERT를 하는 동안 테이블에는 LOCK이 걸리고 작업이 끝날 때까지 해당 테이블에 DML 작업을 할 수 없게 된다**는 사실은 알지 못했다. 만약 확인하지 않고 거래 데이터를 전환해 넣을 때 Direct-path INSERT를 썼더라면 장애가 생길 뻔 했다. 참고로 Direct-path INSERT와 Direct-path Load를 거의 같은 것으로 생각했었는데 다음과 같이 약간의 차이가 있다.

* Direct-path INSERT는 병렬 모드(parallel-mode)로 실행될 때에도 트랜잭션의 원자성을 보장한다. SQL*Loader를 통한 parallel direct-path load시에는 원자성이 보장되지 않는다.
* parallel direct-path load시 에러가 발생하면 인덱스가 UNUSABLE 상태가 될 수 있다. 그러나 Parallel direct-path INSERT시 인덱스를 업데이트하다 에러가 발생하면 해당 실행문이 롤백된다.

Direct-path INSERT가 끝난 다음 대상 테이블에 인덱스가 있다면 index maintenance가 수행되는데, parallel direct-path INSERT로 실행된 경우에는 병렬 프로세스로, serial direct-path INSERT로 실행된 경우에는 단일(single) 프로세스로 처리된다. 인덱스를 삭제한 다음 Direct-path INSERT 작업을 하고, 그 후에 인덱스를 재생성하면 index maintenance 관련 성능 문제를 해소할수 있다.

### 참고
* [Oracle® Database Administrator's Guide 10g Release 2 (10.2) > 15 Managing Tables > Loading Tables](http://docs.oracle.com/cd/B19306_01/server.102/b14231/tables.htm#CJAEJGJF)
