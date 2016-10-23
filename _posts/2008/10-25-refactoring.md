date: 2008-10-25
tags: [리팩터링]
title: 코드 수정
---
소스코드를 보다가 다음과 같은 코드를 발견했다. 명령행 인수 분석해 딕셔너리에 넣는 코드인데, 이렇게 복잡할 필요가 있을까 생각되어 잠시 코드를 들여다 봤다.
<!--more-->

```python
def cmd_option_parse():
    cmd_argv = {}
    argv = sys.argv[1:]
    for arg in argv:
        if arg.startswith('-'):
            arg = arg[1:]

        if arg.startswith('--'):
            arg = arg[2:]

        p = arg.split('=')
        if len(p) == 2:
            key = p[0]
            val = p[1]
            cmd_argv[key] = val
        else:
            cmd_argv[arg] = ''
    return cmd_argv
```

인수 입력 형식은 `=`을 기준으로 `key=value` 형식으로 주어지며, `-`와 `--`가 코드에 있는 것은 인수 중에 `-`와 `--`로 시작하는 경우 이를 제거하기 위한 코드다. 결국은 `key=value` 형식을 분석해 딕셔너리에 넣되 `-`를 제거하면 되는 것이다. 다음과 같이 하는 것이 훨씬 단순하고 이해하기 쉽다.

```python
def getArgMap():
    argMap = {}
    for a in sys.argv[1:]:
        try:
            (k,v)=a.split('=')
            argMap[k.lstrip('-')]=v
        except:
            argMap[a.lstrip('-')]=''
    return argMap
```

`if`가 많이 들어가 있는 코드는 보기도 안 좋고 이해하기도 쉽지 않다.
