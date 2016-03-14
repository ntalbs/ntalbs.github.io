date: 2010-08-01
tags: [DB, Oracle, Shell]
title: export와 동시에 압축하기
---
다음과 같이 하면 export를 받은 후 압축하지 않고 export와 동시에 압축을 할 수 있다. export 파일 크기가 크고 디스크 용량이 충분하지 않을 때 사용하면 유용하다.
<!-- more -->

## 1. named pipe를 만든다.
<pre class="console">
$ mknod /tmp/expimp_pipe p
</pre>

## 2. pipe로부터 들어오는 데이터를 압축한다.
이 명령은 백그라운드로 실행되도록 한다.

<pre class="console">
$ compress &lt; /tmp/expimp_pipe &gt; exp.dmp.Z &
</pre>

## 3. pipe에 데이터를 쓴다.
<pre class="console">
$ exp system/pw owner=scott direct=y file=/tmp/expimp_pipe
</pre>

pipe를 이용해 export 하는 동시에 compress로 압축 저장해 백업을 받는 스크립트는 다음과 같이 작성할 수 있다. (named pipe는 미리 만들어두어야 한다.)

```sh
#!/bin/ksh
date=$(date +"%m%d")
pipe=/tmp/expimp_pipe

target_file=dump${date}
compress < $pipe > ${target_file}.dmp.Z &
exp system/pw owner=user1 direct=y file=$pipe log=${target_file}.log

mv *.dmp.Z /tempdata/orabackup

echo
echo backup completed...
echo
```
