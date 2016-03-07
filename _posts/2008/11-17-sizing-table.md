date: 2008-11-17
tags: [DB, Oracle]
title: 오라클 테이블 용량 산정 방법
---
테이블 용량을 산정하기 위한 방법인데 조금 복잡하다. 어차피 추정이므로 간단하게 $(평균\ row \ 크기) \times (데이터\ 건수) \times 1.3$ 정도로 해도 되지 않을까 싶다.
<!--more-->

#### ① 블록 헤더 크기 계산
```
(Block header) = (fixed header) + (variable transaction header)
    + (table directory) + (row directory)
```

```
(fixed header) = 57
(variable transaction header) = 23 * initrans
(table header) = 4 * n,	n은 테이블 개수, clustered table이 아닌 경우 1
(row directory) = 2 * x, x는 블록당 row 수
```

#### ② 블록당 가용 데이터 공간 크기 계산
```
(Available data space)
  = ((Block size) - (Block header)) * (1 - pctfeee/100)
  = ((Block size) - ①) * (1 - pctfeee/100)
```

#### ③ 평균 row 크기 계산
```
(Average row size) = (row header) + F + 3*V + D
```

```
(row header) = clustered table이 아닌 경우 3
F = 크기가 250byte 미만인 컬럼 수
V = 크기가 250byte 이상인 컬럼 수
D = combined column length
```

#### ④ 블록당 평균 row 수 계산
```
(Average number of rows per block) = x = TRUNC( ② / ③ )
```

이 식에서 x를 구함.

#### ⑤ 테이블당 필요 블록 수 계산
```
(Number of blocks for table) = (total number of rows) / ④
```

#### ⑥ 테이블 용량 계산
```
(Table size) = ⑤ * (Block size)
```

### 참고
* Meta-Link: Doc ID: 10640.1
