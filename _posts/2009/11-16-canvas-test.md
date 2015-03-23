title: Canvas 테스트
date: 2009-11-16
tags: canvas

---

`<canvas>` 태그를 사용해 간단한 그림을 그려봤다. `<canvas>` 태그를 이용하면 브라우저에 자유자재로 그림을 그릴 수 있다. Firefox와 같은 Gecko 기반의 브라우저에서는 `<canvas>` 요소(element)를 지원하지만 IE에서는 아직 지원하지 않는다. Chrome 브라우저에서도 `<canvas>`가 잘 동작한다.
<!--more-->
<div style="margin:auto; width:300px; padding:0;">
  <canvas id="canvas" width="300" height="300"></canvas>
</div>

소스코드는 다음과 같다.

```html
<canvas id="canvas" width="300" height="300"></canvas>
<script type="text/javascript">
// 자바스크립트 소스...
</script>
```

자바스크립트 코드는 다음과 같다.

```js
(function () {
  var timer;
  var DELAY = 20, LIMIT = 25, step = 0;

  var canvas = document.getElementById('canvas');
  var w = canvas.width, h = canvas.height;
  var ctx = canvas.getContext('2d');

  var x = [w / 10, w / 10, w - w / 10, w - w / 10],
    y = [h / 10, h - h / 10, h - h / 10, h / 10];

  function drawRect(x, y, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x[0], y[0]);
    ctx.lineTo(x[1], y[1]);
    ctx.lineTo(x[2], y[2]);
    ctx.lineTo(x[3], y[3]);
    ctx.lineTo(x[0], y[0]);
    ctx.closePath();
    ctx.stroke();
  }

  function drawOneRect() {
    var color = 'rgb(' + step * 10 + ',0,0)';
    drawRect(x, y, color);

    var nx = [
      x[0] + (x[1] - x[0]) / 17,
      x[1] + (x[2] - x[1]) / 17,
      x[2] + (x[3] - x[2]) / 17,
      x[3] + (x[0] - x[3]) / 17
    ];
    var ny = [
      y[0] + (y[1] - y[0]) / 17,
      y[1] + (y[2] - y[1]) / 17,
      y[2] + (y[3] - y[2]) / 17,
      y[3] + (y[0] - y[3]) / 17
    ];

    x = nx;
    y = ny;

    if (++step >= LIMIT) {
      window.clearInterval(timer);
    }
  }

  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, w, h);
  timer = window.setInterval(drawOneRect, DELAY);
})();
```

MDN의 [Canvas tutorial](https://developer.mozilla.org/en/Canvas_tutorial)에 `<canvas>`에 대한 자세한 설명이 나와 있다.

<script type="text/javascript">
(function () {
  var timer;
  var DELAY = 20, LIMIT = 25, step = 0;

  var canvas = document.getElementById('canvas');
  var w = canvas.width, h = canvas.height;
  var ctx = canvas.getContext('2d');

  var x = [w / 10, w / 10, w - w / 10, w - w / 10],
    y = [h / 10, h - h / 10, h - h / 10, h / 10];

  function drawRect(x, y, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x[0], y[0]);
    ctx.lineTo(x[1], y[1]);
    ctx.lineTo(x[2], y[2]);
    ctx.lineTo(x[3], y[3]);
    ctx.lineTo(x[0], y[0]);
    ctx.closePath();
    ctx.stroke();
  }

  function drawOneRect() {
    var color = 'rgb(' + step * 10 + ',0,0)';
    drawRect(x, y, color);

    var nx = [
      x[0] + (x[1] - x[0]) / 17,
      x[1] + (x[2] - x[1]) / 17,
      x[2] + (x[3] - x[2]) / 17,
      x[3] + (x[0] - x[3]) / 17
    ];
    var ny = [
      y[0] + (y[1] - y[0]) / 17,
      y[1] + (y[2] - y[1]) / 17,
      y[2] + (y[3] - y[2]) / 17,
      y[3] + (y[0] - y[3]) / 17
    ];

    x = nx;
    y = ny;

    if (++step >= LIMIT) {
      window.clearInterval(timer);
    }
  }

  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, w, h);
  timer = window.setInterval(drawOneRect, DELAY);
})();
</script>
