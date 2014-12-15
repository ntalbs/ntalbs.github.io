title: Oracle XDB 비활성화 방법
date: 2008-10-30
tags: [db, oracle]

---
Oracle9i부터는 XML DB가 포함되어 있는데, 이 녀석은 HTTP/WebDAV과 FTP 포트로 각각 8080과 2100 포트를 사용한다. 데이터베이스 서버에 Oracle만 실행 중이라면 XML DB가 떠있다고 해서 당장 문제될 것이 없으니 그냥 무시할 수도 있다(보안을 생각한다면 내려야 하겠지만). 개발 서버나 테스트 서버의 경우 8080포트를 쓰는 다른 서버 프로그램(가령 Tomcat 같은)을 띄워야 하는 경우 포트가 충돌해 문제가 발생할 수 있다.<!--more--> Oracle9i에는 그나마 DBCA를 이용해 DB를 생성할 때 XML DB를 제외할 수 있는 옵션이 있었던 것 같은데, 10g에는 그 옵션이 사라져버렸다.
Oracle이 8080 포트를 사용하지 않게 하려면 XML DB가 뜨지 않게 해야 하는데, 이에 대한 방법이 정확히 나와 있지 않고, Metalink 등을 찾아봐도 설명이 정확하지 않아 다른 인터넷 사이트에서 알아낸 정보와 테스트 결과를 다음과 같이 정리한다.

참고) 원격 사용자가 비정상적인 HTTP 헤더로 Oracle XDB 서버에 HTTP 요청을 보내면 DoS 상태에 빠지게 할 수 있다. 즉 권한이 없는 사용자가 Oracle 데이터베이스 인스턴스의 서비스를 중지시킬 수 있다는 뜻이다. 또한 XDB가 실행중인 시스템에서는 원격 사용자가 임의의 코드를 Oracle 서버 프로세스 권한으로 실행시킬 수 있는 문제도 있다. 이에 대한 패치가 있는지는 확인하지 못했지만, 사용하지 않는다면 XDB 서비스를 중지시키는 것이 좋겠다.


## 1. 포트 사용 여부 확인
UNIX의 netstat 명령이나 Oracle의 lsnrctl을 사용해 다음과 같이 확인할 수 있다.

<pre class="console">
$ netstat -a | grep LISTEN | grep 8080
tcp      0    0  *.8080     *.*        LISTEN

$ lsnrctl status

LSNRCTL for HPUX: Version 10.1.0.2.0 - Production on 09-MAY-2005 16:24:20

Copyright (c) 1991, 2004, Oracle.  All rights reserved.

Connecting to (DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=chantest)(PORT=1521)))
STATUS of the LISTENER
------------------------
Alias              LISTENER
Version            TNSLSNR for HPUX: Version 10.1.0.2.0 - Production
Start Date         09-MAY-2005 11:37:58
Uptime             0 days 4 hr. 46 min. 21 sec
Trace Level        off
Security           ON: Local OS Authentication
SNMP               OFF
Listener Parameter File   /oracle/ora10g/network/admin/listener.ora
Listener Log File        /oracle/ora10g/network/log/listener.log
Listening Endpoints Summary...
  (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=chantest)(PORT=1521)))
  (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=chantest)(PORT=2100))
(Presentation=FTP)(Session=RAW))
  (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=chantest)(PORT=8080))
(Presentation=HTTP)(Session=RAW))
Services Summary...
Service "ORA10G" has 2 instance(s).
  Instance "ORA10G", status UNKNOWN, has 1 handler(s) for this service...
  Instance "ORA10G", status READY, has 2 handler(s) for this service...
Service "ORA10GXDB" has 1 instance(s).
  Instance "ORA10G", status READY, has 0 handler(s) for this service...
The command completed successfully
</pre>

## 2. XML DB 비활성화
SQL*Plus로 DBA 권한으로 로그인한 다음 dispatchers 파라미터를 확인하면 다음과 같이 설정되어 있을 것이다.

<pre class="console">
SQL> show parameter dispatchers

 NAME              TYPE     VALUE
 ---------------   -------  ---------------------------
 dispatchers       string   (PROTOCOL=TCP)(SERVICE=XDB)
 max_dispatchers   integer
</pre>

이 파라미터 값을 변경 또는 제거한 다음 DBMS를 다시 시작하면 된다. PFILE을 사용하는 경우 init.ora 파일을 텍스트 에디터로 편집하면 되고, SPFILE을 사용하는 경우에는 다음과 같이 파라미터를 수정한 후 DBMS를 다시 시작한다.

<pre class="console">
SQL> alter system set dispatchers='' scope=both;
</pre>

SPFILE을 사용하는 경우 alter system 명령으로 파라미터 값을 바꿀 수는 있지만, 파라미터 값만 바꾼다고 XDB가 바로 비활성화 되는 것은 아니다. DBMS를 다시 시작해줘야 XDB가 비활성화 된다. 데이터베이스를 재기동한 후 netstat 또는 lsnrctl로 확인해보면 8080 포트를 사용하지 않음을 확인할 수 있다.
Metalink와 일부 문서에는 dispatchers 파라미터에서 "(SERVICE=XDB)" 부분만 제거하면 된다고 되어있지만, Oracle10g에서는 dispatchers 파라미터를 ''로 만들어줘야 했다.

## 3. HTTP, FTP 포트 바꾸기
다음과 같이 하면 HTTP와 FTP 포트를 바꿔줄 수 있다. 이렇게 한 경우에는 DBMS를 다시 시작시킬 필요가 없다. 프로시저를 실행시킨 후 netstat, lsnrctl 명령을 통해 결과를 바로 확인할 수 있다. 포트를 0으로 설정하면 XML DB를 비활성화 시킬 수 있다.

<pre class="console">
-- HTTP/WEBDAV 포트를 8081로 변경
SQL> call dbms_xdb.cfg_update(updateXML(
  2   dbms_xdb.cfg_get(),
  3   '/xdbconfig/sysconfig/protocolconfig/httpconfig/http-port/text()',
  4   8081))
  5  /

Call completed.

-- FTP 포트를 2111로 변경
SQL> call dbms_xdb.cfg_update(updateXML(
  2   dbms_xdb.cfg_get(),
  3  '/xdbconfig/sysconfig/protocolconfig/ftpconfig/ftp-port/text()',
  4   2111))
  5  /

Call completed.
</pre>

테스트 결과 여기까지만 해도 포트가 변경된다. DBMS를 다시 시작해도 결과는 그대로 남아 있다. 그런데 참조한 문서에는 다음 과정이 있어 참고로 남겨둔다.

<pre class="console">
SQL> COMMIT;
Commit complete.

SQL> EXEC dbms_xdb.cfg_refresh;
PL/SQL procedure successfully completed.
</pre>

결과를 확인하는 단계다. netstat이나 lsnrctl로 확인할 수도 있지만, 다음 SQL을 통해서도 확인할 수 있다. 결과가 매우 길기 때문에 중간에 불필요한 부분은 제거했다. long과 pagesize를 충분히 설정해줘야 결과가 제대로 보인다. 결과를 자세히 보고 싶으면 SPOOL해서 에디터에서 보는 편이 좋겠다.

<pre class="console">
SQL> -- Verify the change
SQL> set long 100000
SQL> set pagesize 9000
SQL> SELECT dbms_xdb.cfg_get FROM dual;

 CFG_GET
 -------------------------------------------------------------
 &lt;xdbconfig xmlns="http://xmlns.oracle.com/xdb/xdbconfig.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://xmlns.oracle.com/xdb/xdbconfig.xsd http://xmlns.oracle.com/xdb/xdbconfig.xsd">
  &lt;sysconfig>
    &lt;acl-max-age>900&lt;/acl-max-age>
    &lt;acl-cache-size>32&lt;/acl-cache-size>
    &lt;invalid-pathname-chars>,&lt;/invalid-pathname-chars>
    &lt;call-timeout>300&lt;/call-timeout>
    &lt;max-session-use>100&lt;/max-session-use>
    &lt;default-lock-timeout>3600&lt;/default-lock-timeout>
    &lt;resource-view-cache-size>1048576&lt;/resource-view-cache-size>
    &lt;protocolconfig>
      &lt;common>
      ...생략...
      &lt;/common>
      &lt;ftpconfig>
        <span style="color:black;background-color:yellow">&lt;ftp-port>2111&lt;/ftp-port></span>
        &lt;ftp-listener>local_listener&lt;/ftp-listener>
        &lt;ftp-protocol>tcp&lt;/ftp-protocol>
        &lt;session-timeout>6000&lt;/session-timeout>
      &lt;/ftpconfig>
      &lt;httpconfig>
        <span style="color:black;background-color:yellow">&lt;http-port>8081&lt;/http-port></span>
        &lt;http-listener>local_listener&lt;/http-listener>
        &lt;http-protocol>tcp&lt;/http-protocol>
        &lt;session-timeout>6000&lt;/session-timeout>
        &lt;server-name>XDB HTTP Server&lt;/server-name>
        ...생략...
    &lt;/protocolconfig>
  &lt;/sysconfig>
&lt;/xdbconfig>
</pre>
