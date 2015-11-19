tags: [javascript]
date: 2015-10-01
title: 단축키 처리 코드
---
나는 코드를 작성할 때 코드 모양에 신경을 많이 쓰는 편이다. 나중에 봐도 쉽게 이해할 수 있는지, 하고자 하는 작업의 의도를 잘 드러내고 있는지, 불필요한 중복은 없는지, 코드 구조와 모양이 아름다운지 등을 끊임없이 확인하며 작성한다. 동작하는 코드라도 마음에 들지 않으면 왕창 갈아엎기도 한다.

잘 동작하면 되는거 아니냐고? 동작하지 않는다면 논할 가치도 없는 것 아닐까? 그러나 많은 개발자들이 코드의 미학적 측면에 대해서 고민하지 않는다. 시간이 없다고 핑계를 대기도 하고, 동작한 한다면 코드 모양이나 구조는 중요하지 않다는 주장을 하며 회피하기도 한다. 내가 보기에 이렇게 말하는 사람 대부분은 어떤게 좋은 코드인지 모르는 사람이다.



`if~else if~`로 떡칠된 코드를 보면...

약간의 코드로 다음과 같은 선언적 코드를 만들 수 있다.

이 코드의 가장 큰 장점은 읽기 쉽다는 것이다.


```js
ime.keydown(function (we) {
  var e = composeKeyEvent(we);
  // moveCaret
  if (we.keyCode === key.HOME || (we.keyCode === key.LEFT && e.cmd && !e.word)) {
    executeNoteCmd(note.beginningOfLine, e);
  } else if (we.keyCode === key.END || (we.keyCode === key.RIGHT && e.cmd && !e.word)) {
    executeNoteCmd(note.endOfLine, e);
  } else if (we.keyCode === key.PAGEUP) {
    executeNoteCmd(note.pageUp, e);
  } else if (we.keyCode === key.PAGEDOWN) {
    executeNoteCmd(note.pageDown, e);
  } else if (key.isKeyMove(we.keyCode)) {
    executeNoteCmd(note.moveCaret, e);
  } else if (e.cmd && we.keyCode === key.B) { // Style
    executeNoteCmd(note.bold);
  } else if (e.cmd && we.keyCode === key.I) {
    executeNoteCmd(note.italic);
  } else if (e.cmd && we.keyCode === key.U) {
    executeNoteCmd(note.underline);
  } else if (e.cmd && we.keyCode === key.K) {
    executeNoteCmd(note.editLink);
  } else if (we.keyCode === key.BACKSPACE) { // Delete
    executeNoteCmd(note.forwardDelete, e.alt || e.ctrl);
  } else if (we.keyCode === key.DEL) {
    executeNoteCmd(note.backwardDelete, e.alt || e.ctrl);
  } else if (e.cmd && we.keyCode === key.A) { // Edit
    executeNoteCmd(note.selectAll);
  } else if (!e.shift && e.cmd && we.keyCode === key.Z) {
    executeNoteCmd(note.undo);
  } else if ((e.cmd && we.keyCode === key.Y) || (e.shift && e.cmd && we.keyCode === key.Z)) {
    executeNoteCmd(note.redo);
  } else if (!e.cmd && we.keyCode === key.ENTER) {
    executeNoteCmd(note.insertParagraph);
  } else if (e.cmd && we.keyCode === key.ENTER) {
    executeNoteCmd(note.insertHorizontalRule);
  } else if (e.shift && we.keyCode === key.TAB) {
    executeNoteCmd(note.untab);
  } else if (we.keyCode === key.TAB) {
    executeNoteCmd(note.tab);
  } else if (e.cmd && we.keyCode === key.NUM0) {
    executeNoteCmd(note.heading, 'P');
  } else if (e.cmd && key.NUM1 <= we.keyCode && we.keyCode <= key.NUM6) {
    executeNoteCmd(note.heading, 'H' + String.fromCharCode(we.keyCode));
  } else if (e.cmd && we.keyCode === key.F) {
    executeNoteCmd(note.toggleSearchbar);
  } else if (key.ESC === we.keyCode) {
    executeNoteCmd(note.escape);
  } else {
    return;
  }
});
```
