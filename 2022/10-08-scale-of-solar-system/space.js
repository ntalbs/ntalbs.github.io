(function () {
  function adjust_for_dpi(canvas_ele) {
    canvas_ele.style.width = "100%";
    canvas_ele.style.height = "100%";

    let canvas_gcs = getComputedStyle(canvas_ele);
    let canvas_css_width = canvas_gcs.getPropertyValue('width')
        .slice(0, -2);
    let canvas_css_height = canvas_gcs.getPropertyValue('height')
        .slice(0, -2);

    let dpi = window.devicePixelRatio;

    let setAttr = canvas_ele.setAttribute.bind(canvas_ele);
    setAttr('width', canvas_css_width * dpi);
    setAttr('height', canvas_css_height * dpi);

    let setCss = canvas_ele.style;
    setCss.width = canvas_css_width;
    setCss.height = canvas_css_height;
  }

  var canvas = document.getElementById("space");
  canvas.style.width='100%';
  adjust_for_dpi(canvas);

  let w = canvas.width, h = canvas.height;


  let g = canvas.getContext('2d', {alpha: false});
  let x = w/2;

  let r_sun_km = 700_000;
  let r_sun = 200;
  let r_earth = r_sun / 100;

  // fill background
  g.beginPath();
  g.rect(0, 0, w, h);
  g.fillStyle = '#001';
  g.fill();

  g.translate(0.5, 0.5);

  // distance line
  g.lineWidth = 0.5;
  g.strokeStyle = 'white';
  g.beginPath();
  g.moveTo(x, 0);
  g.lineTo(x, h);
  g.stroke();

  // draw sun
  let grd = g.createRadialGradient(x, 0, r_sun * 0.7, x, 0, r_sun);
  grd.addColorStop(0, "red");
  grd.addColorStop(0.5, "orange");
  grd.addColorStop(1, "yellow");

  g.beginPath();
  g.arc(x, 0, r_sun, 0, 2*Math.PI);
  g.fillStyle = grd
  g.fill();

  function drawDistanceMark(g, distance_km, label, planet) {
    let d = distance_km / r_sun_km * r_sun;

    g.strokeStyle = 'white';
    g.beginPath();
    g.moveTo(w/2 - 30, d);
    g.lineTo(w/2 + 30, d);
    g.stroke();

    g.fillStyle = 'white';

    if (!!label) {
      g.font = '18px Arial';
      g.textAlign = 'left'
      g.fillText(`${label}`, 5, d+10);
    }

    g.textAlign = 'right'
    g.font = '15px Arial';
    g.fillText(`${distance_km.toLocaleString("en-US")} km`, w-10, d+10);

    if (!!planet) {
      // draw planet
      g.fillStyle = 'white'
      g.beginPath();
      g.arc(x, d, r_earth, 0, 2*Math.PI);
      g.fill();
    }

    if (label==='Earth') {
      let r_moon_orbit = 355_000 / r_sun_km * r_sun;
      g.beginPath();
      g.arc(x, d, r_moon_orbit, 0, 2*Math.PI);
      g.stroke();

      g.beginPath();
      g.fillText('The orbit of the moon', x-80, d-80);
      g.fill();
    }
  }

  drawDistanceMark(g, 696_340, 'Radius of the Sun');
  drawDistanceMark(g, 58_000_000, 'Mercury', true);
  drawDistanceMark(g, 108_000_000, 'Venus', true);
  drawDistanceMark(g, 150_000_000, 'Earth', true);

  for (let d=1_000_000; d < 150_000_000; d+= 1_000_000) {
    drawDistanceMark(g, d);
  }
})()
