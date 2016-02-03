tags: emacs
date: 2015-01-14
title: Emacs를 데이터베이스 클라이언트로 사용하기
---
Emacs에서 데이터베이스 쿼리를 할 수 있으면 좋겠다는 생각이 들었다. 지금까지 찾은 방법은 SQLi를 이용한 방법과 edbi를 사용하는 방법 두 가지다. SQLi는 Emacs에 기본 기능을 사용하기 때문에 별도 패키지를 설치하지 않아도 되지만 기능도 기본 수준이다. edbi는 SQLi보다 풍부한 기능을 제공하지만 별도 패키지를 설치해야 하고 `cpan`으로 `RPC::EPC::Service`, `DBI`, 데이터베이스 드라이버 등의 Perl 모듈을 설치해야 한다.<!--more-->

## SQLi를 이용한 방법
다음과 같이 하면 데이터베이스에 접속된 `*SQL*` 버퍼가 생긴다. 여기서 쿼리를 실행할 수 있다.
1. `M-x sql-postgres` (PostgreSQL 데이터베이스에 접속하는 경우)
2. User, Database, Server 입력

그러나 `*SQL*` 버퍼는 `psql`을 버퍼에 연결한 것에 불과하기 때문에 여기서 쿼리를 자유롭게 편집하기에는 제약이 있다. `.sql`버퍼를 따로 열어 SQLi로 연결하면 좀더 자유롭게 쿼리를 편집할 수 있다. 또한 편집한 쿼리를 `*SQL*` 버퍼로 보내 실행할 수 있다.

1. `.sql` 파일을 연 버퍼에서 `M-x sql-set-product` 실행하고 `postgres` 입력
2. `M-x sql-set-sqli-buffer` 실행 후 커넥션 버퍼 지정 (디폴트는 `*SQL*`)

이제 `.sql` 버퍼에서 쿼리 입력 후 `sql-send-region`명령(`C-c C-r`)을 통해 쿼리를 실행할 수 있다.

## edbi를 이용한 방법
1. 패키지 매니저(`M-x list-package`)에 들어가 `edbi`를 설치한다.
2. `cpan`으로 `RPC::EPC::Service`, `DBI`, 데이터베이스 드라이버 등의 Perl 모듈을 설치한다. EPC 모듈뿐 아니라 SQLite, PostgreSQL, MySQL 데이터베이스 드라이버가 함께 설치된다.<pre class="console">$ cpan RPC::EPC::Service DBI DBD::SQLite DBD::Pg DBD::mysql</pre>
3. `M-x edbi:open-db-viewer`를 실행한다.
4. 설정창에서 `Data Source`, `User Name`, `Auth` 항목을 입력한 후 `[OK]`를 선택한다. 연결 설정 정보는 History에 저장되어 나중에 불러쓸 수 있다.
{% asset_img 1.png %}
5. 데이터베이스에 접속되면 테이블 목록이 표시된다. `RET`키를 누르면 테이블 데이터가 표시되고, `c`를 누르면 쿼리 편집 버퍼로 이동한다. `j`, `k` 또는 `n`, `p`로 행을 이동할 수 있다.
{% asset_img 2.png %}

## 결론
잘 모르는 Perl 모듈이 왕창 깔리는 부담이 있지만, 사용성은 edbi가 훨씬 좋은 듯 하다.

## 참고
* [Using Emacs as a Database Client](http://emacsredux.com/blog/2013/06/13/using-emacs-as-a-database-client/)
SQLi를 사용해 데이터베이스에 접근하는 방법을 설명한다.
* [Emacs DBI](https://github.com/kiwanami/emacs-edbi)
edbi는 SQLi를 썼을 때보다 훨씬 다양한 기능을 제공한다.
* [Connect to a PostgreSQL database using Perl DBI](http://www.microhowto.info/howto/connect_to_a_postgresql_database_using_perl_dbi.html)
중간 쯤에 PostgreSQL 접속을 위한 Data Source 설정 방법이 나온다.
