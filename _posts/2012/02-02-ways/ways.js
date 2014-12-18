(function () {
    var DELAY = 100, THICKNESS = 10, LANE = 5;
    var SPACE = THICKNESS / LANE;

    var canvas = document.getElementById("canvas5");
    var w = canvas.width, h = canvas.height;
    var g = canvas.getContext("2d");
    var counter = 0;

    g.translate(0.5, 0.5);
    go(0, prepareLines(nextX(), nextY(), nextX(), nextY()), nextColor());

    function go(stage, lines, c) {
        if (counter >= 50*LANE*2) {
            counter = 0;
            clear(g);
        }

        var l = lines[stage];
        drawLine(g, l.x1, l.y1, l.x2, l.y2, c);

        if (stage+1 >= LANE*2) { // move to next point
            setTimeout(function(){go(0, prepareLines(lines[0].x2, lines[LANE].y2, nextX(), nextY()), nextColor());}, DELAY);
        } else {                 // shift line
            setTimeout(function(){go(stage+1, lines, c)}, DELAY);
        }
        counter++;
    }

    function prepareLines(x1, y1, x2, y2) {
        var lines = [];
        for(var i=0; i<LANE; i++) {
            var d = SPACE * i;
            var hls = {} // horizontal line segment
            hls.x1 = x1-d, hls.y1 = y1+d;
            hls.x2 = x2-d, hls.y2 = y1+d;
            lines[i] = hls;

            var vls = {} // vertical line segment
            vls.x1 = x2-d, vls.y1 = y1+d;
            vls.x2 = x2-d, vls.y2 = y2+d;
            lines[i+LANE] = vls
        }
        return lines;
    }

    function drawLine(g, x1, y1, x2, y2, color) {
        g.strokeStyle = color;
        g.beginPath();
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke();
    }

    function random(min, max) {
        return Math.floor(Math.random()*(max-min)) + min;
    }

    function nextColor() {
        return "rgb("+random(0,255)+","+random(0,255)+","+random(0,255)+")";
    }

    function nextX() {
        return random(THICKNESS, w);
    }

    function nextY() {
        return random(0, h-THICKNESS);
    }

    function clear(g) {
        g.fillStyle = "white";
        g.fillRect(-1, -1, w+1, h+1);
        g.fill();
    }
})();
