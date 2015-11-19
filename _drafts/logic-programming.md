tags: [clojure]
date: 2015-07-07
title: 로직 프로그래밍
---
프로젝트 오일러 96번 스도쿠 퍼즐 풀기

Scala 15줄로 sudoku 퍼즐 풀기... 헉 어떻게?

Constraint Satisfaction Programming (CSP)

Martin Odersky의 Functional Programming Principle in Scala 강의에서 프로그래밍 패러다임으로 logic programming 처음 접함
prolog란 언어가 있다는 것만...

Clojure에는 core.logic


## 참고
* [Solving a sudoku puzzle in 15 lines of scala code](http://sciss.github.io/2013/11/28/sudoku/) Scala 코드 15줄로 스도쿠 퍼즐 풀기. 무슨 마법으로 겨우 15줄로 스도쿠를 풀 수 있다는 말인지 흥미를 느껴 보게 되었고 Constraint Satisfaction Programming이란 걸 처음으로 접하게 해준 글이다. 솔직히 끝까지 다 읽어보지는 않았고 이해하지도 못했지만, 그동안 몰랐던 Logic Programming에 흥미를 갖게 해주었다는 점에서 중요하다.
* [A Very Gentle Introduction To Relational & Functional Programming](https://github.com/swannodette/logic-tutorial) 이 글을 읽고 Logic Programming에 대해, core.logic에 대해 감을 잡을 수 있었다. 아직 작업중인 문서고 길이도 짧지만 첫 단추를 풀게 해 준 글이다.
* [A Core.logic Primer](https://github.com/clojure/core.logic/wiki/A-Core.logic-Primer)
