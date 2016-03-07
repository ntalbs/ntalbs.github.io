date: 2010-06-24
tags: [DB, Oracle]
title: Archivelog mode에서의 복구
---
아카이브로그 모드에서 복구는 데이터베이스가 닫힌 상태에서 작업할 수도 있고 열린 상태에서 작업할 수도 있다.
<!--more-->

## 데이터베이스가 닫힌 상태에서의 복구
데이터베이스 전체를 복구하거나 손상된 파일이 SYSTEM 테이블스페이스나 UNDO 테이블스페이스에 포함된 경우에는 데이터베이스가 닫힌(closed) 상태에서 복구를 수행해야 한다.

#### 1. 데이터베이스가 SHUTDOWN 상태가 아니라면 다음 명령으로 SHUTDOWN 한다.
<pre class="console">
SQL> shutdown abort;
</pre>

#### 2. OS 명령을 사용해 손상된 파일을 restore 한다.
<pre class="console">
$ cp /backup/system01.dbf /oradata
</pre>

#### 3. 데이터베이스를 MOUNT 모드로 바꾼 후 복구를 시도한다.
<pre class="console">
SQL> startup mount;
SQL> recover database;
</pre>

데이터베이스를 실패 시점까지 복구하기 위해 아카이브 로그와 온라인 리두 로그 파일을 적용한다.

#### 4. 복구가 끝나면 모든 데이터 파일이 동기화되고 데이터베이스를 OPEN 할 수 있다.
<pre class="console">
SQL> alter database open;
</pre>


## 데이터베이스가 열린 상태에서의 복구
데이터베이스가 OPEN 상태이고, 복구하는 중에도 OPEN되어 있는 상태를 유지하려면 열린 상태에서의 복구를 시도할 수 있다. 손상된 데이터파일이 SYSTEM 테이블스페이스나 UNOD 테이블스페이스에 속한 것이면 안 된다.

#### 1. 다음 쿼리를 이용해 데이터파일을 오프라인으로 만들어야 하는지 확인한다.
<pre class="console">
SQL> select d.file# f#, d.name, d.status, h.status
  2  from v$datafile d, v$datafile_header h
  3  where d.file# = h.file#;

F#   D.NAME                    D.STATUS     H.STATUS
 ---  ------------------------  ----------   -----------
 1    /oradata/system01.dbf     SYSTEM       ONLINE
 2    /oradata/undotbs01.dbf    ONLINE       ONLINE
 ...
 6    /oradata/tsd_img01.dbf    RECOVER      OFFLINE
 ...
</pre>

#### 2. 복구할 파일이 온라인인 경우는 오프라인으로 만든다.
(이미 오프라인인 경우는 이 단계를 생략한다.)
<pre class="console">
SQL> alter database datafile '/oradata/tsd_img01.dbf' offline;
</pre>

또는

<pre class="console">
SQL> alter tablespace tsd_img offline;
</pre>

#### 3. 백업으로부터 파일을 restore한다.
<pre class="console">
$ cp /backup/tsg_img01.dbf /oradata
</pre>

#### 4. RECOVER 명령으로 아카이브 로그와 리두 로그를 적용해 파일을 복구한다.
<pre class="console">
SQL> recover datafile '/oradata/tsd_img01.dbf';
</pre>

또는
<pre class="console">
SQL> recover tablespace tsd_img;
</pre>

### 5. 복구가 끝나면 데이터 파일(또는 테이블스페이스)을 온라인으로 만든다.
<pre class="console">
SQL> alter database datafile '/oradata/tsd_img01.dbf' online;
</pre>

또는
<pre class="console">
SQL> alter tablespace tsd_img online;
</pre>

데이터베이스가 닫혀 있지만 데이터베이스를 열어놓고 복구 작업을 하고자 하는 경우는
1. 먼저 데이터베이스를 MOUNT 상태로 만들고, (`startup mount;`)
2. 손상된 파일(또는 테이블스페이스)를 조회해 오프라인으로 만든 다음,
3. 데이터베이스를 열고 (`alter database open;`)
4. 위의 단계에서 3.~5.까지 해주면 된다.

## 컨트롤 파일이 모두 손상된 경우
컨트롤 파일은 세벌로 중복되어 있으므로 그 중 일부만 손상된 경우는 정상인 컨트롤 파일을 복사해 이름을 바꿔주면 된다.
모든 컨트롤 파일이 손상된 경우는 백업에서 컨트롤 파일을 restore 하고

데이터베이스를 mount 상태로 기동한 다음, 다음 명령을 사용한다.
<pre class="console">
SQL> recover database using backup controlfile;
</pre>
