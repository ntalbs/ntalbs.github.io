title: 오라클 인덱스 용량 산정 방법
date: 2008-11-18
tags: [db, oracle, 용량산정]

---
인덱스 용량을 산정하기 위한 방법인데 조금 복잡하다. 어차피 추정이므로 간단하게 $(인덱스\ 컬럼\ 크기\ 합) \times (데이터\ 건수) \times (1.3\ \widetilde \ 1.5)$ 정도면 되지 않을까 싶다.
<!--more-->

#### ① 블록 헤더 크기 계산
```
(Block header) = (fixed header) + (variable transaction header)
```

```
(fixed header) = 113
(variable transaction header) = 23 * initrans
```

#### ② 블록당 가용 데이터 공간 크기 계산
```
(Available data space)
  = ( (Block size) - (Block header) ) * (1 - pctfree/100)
  = ( (Block size) - ① ) * (1 - pctfree/100)
```

#### ③ 평균 인덱스 엔트리 크기 계산
```
(Average entry size) = (entry header) + (rowid size) + F + 3*V + D
```

```
(entry header) = 1
(rowid size) = 6
F = 크기가 250byte 미만인 컬럼 수
V = 크기가 250byte 이상인 컬럼 수
D = combined column length
```

#### ④ 인덱스당 필요 블록 수 계산
```
(Number of blocks for index)
  = 1.1 * (number of entries)
    / (TRUNC(Available data space) / (Average entry size)
  = 1.1 * (number of entries) / TRUNC( ② / ③ )
```

#### ⑤ 인덱스 용량 계산
```
(Index size) = (Number of blocks for index) * (Block size)
  = ④ * (Block size)
```

### 참고
* Meta-Link: Doc ID: 10640.1
