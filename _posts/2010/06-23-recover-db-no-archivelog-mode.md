date: 2010-06-23
tags: [DB, Oracle]
title: noarchivelog mode에서의 복구
---
redo log 백업이 있을 때와 없을 때의 절차가 다르다.
<!--more-->

## redo log 백업이 있을 때
#### 1. 데이터베이스 종료
<pre class="console">
SQL> shutdown abort;
</pre>

#### 2. 모든 파일 restore
참고: 최종 백업 이후 redo log가 겹쳐쓰이지 않았다면 손상된 파일만 restore한 다음 복구할 수 있다.

#### 3. 데이터베이스 기동
<pre class="console">
SQL> startup;
</pre>

## redo log 백업이 없을 때
#### 1. 데이터베이스 종료
<pre class="console">
SQL> shutdown immediate;
</pre>

#### 2. 데이터 파일과 컨트롤 파일 restore

#### 3. cancel-based recovery 수행
<pre class="console">
SQL> startup mount;
...
SQL> recover database until cancel;
</pre>

#### 4. resetlogs 옵션으로 데이터베이스 open
<pre class="console">
SQL> alter database open resetlogs;
</pre>
