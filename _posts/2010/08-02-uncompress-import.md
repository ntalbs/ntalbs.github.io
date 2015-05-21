title: 압축 해제와 동시에 import 하기
date: 2010-08-02
tags: [db, oracle]

---
압축된 덤프 파일을 압축 해제와 동시에 import 하는 방법이다. 압축을 해제할 만큼 디스크 공간이 충분하지 않을 때 유용하게 사용할 수 있다.
<!-- more -->

## 1. 파이프로 들어오는 데이터를 import 한다.
이 명령은 백그라운드로 실행되도록 한다.

<pre class="console">
$ imp system/pw fromuser=scott file=pipe log=imp_${dump_file}.log ignore=y &
</pre>

## 2. dump 파일을 압축 해제해 파이프로 넘긴다.
`uncompress`로 압축 해제한 다음 `$pipe`로 넘긴다.

<pre class="console">
$ uncompress < exp.dmp.Z > $pipe
</pre>

이를 응용해 다음과 같은 스크립트를 만들 수 있다.

```sh
#!/bin/ksh
if [ "$1" -eq "" ]; then
    print "usage: restore.sh inputfile"
    exit 1
fi

pipe=/tmp/expimp_pipe
dump_file=$1
imp id/pw fromuser=scott file=pipe log=imp_${dump_file}.log ignore=y &
uncompress < $dump_file > $pipe
```
