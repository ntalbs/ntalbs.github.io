const sun  = '☼'
const moon = '☾'
const light = 'light'
const dark  = 'dark'

let be = document.getElementsByTagName("BODY")[0];
let modeSwitch = document.getElementById('mode-switch')
modeSwitch.style.width = '46px'

modeSwitch.addEventListener('click', (e) => {
  switchMode(getMode() === light ? dark : light);
})

switchMode(getMode())

function getMode() {
  let mode = localStorage.getItem('currentMode')
  return !mode ? light: mode;
}

function setMode(mode) {
  localStorage.setItem('currentMode', mode)
  modeSwitch.textContent = (mode===light ? moon : sun)
}

function switchMode(mode) {
  if (mode === light) {
    setMode(light)
    makeLight()
  } else {
    setMode(dark)
    makeDark()
  }
}

function makeDark(){
  be.style.setProperty('--background', "#2a2e2e");
  be.style.setProperty('--text', "#bbb");
  be.style.setProperty('--heading', "#eee");
  be.style.setProperty('--link', "#aaa");
  be.style.setProperty('--link-hover', "#ccc");
  be.style.setProperty('--inline-code-bg', "#444");
  be.style.setProperty('--code-block-bg', "#888");
  be.style.setProperty('--box-fg', "#aaa");
  be.style.setProperty('--box-bg', "#3a3a3a");

  be.style.setProperty('--archive-ul', "#888");
  be.style.setProperty('--post-meta', "#666");
  be.style.setProperty('--tagbox', "#888");

  be.style.setProperty('--line', "#444");
  be.style.setProperty('--circle', "#444");
  be.style.setProperty('--footer', "#333");
}

function makeLight(){
  be.style.setProperty('--background', "#fff");
  be.style.setProperty('--text', "");
  be.style.setProperty('--heading', "");
  be.style.setProperty('--link', "#666");
  be.style.setProperty('--link-hover', "#999");
  be.style.setProperty('--inline-code-bg', "#eee");
  be.style.setProperty('--code-block-bg', "#eee");
  be.style.setProperty('--box-fg', "#808080");
  be.style.setProperty('--box-bg', "#f5f5f5");

  be.style.setProperty('--archive-ul', "#444");
  be.style.setProperty('--post-meta', "#aaa");
  be.style.setProperty('--tagbox', "#555");

  be.style.setProperty('--line', "#ebf2f6");
  be.style.setProperty('--circle', "#fff");
  be.style.setProperty('--footer', "#eee");
}
