const sun  = '☀'
const moon = '☾'
const light = 'light'
const dark  = 'dark'

let root = document.documentElement
let modeSwitch = document.getElementById('mode-switch')
modeSwitch.style.width = '46px'

modeSwitch.addEventListener('click', (e) => {
  switchMode(getMode() === light ? dark : light);
})

switchMode(getMode())

function getMode () {
  let mode = localStorage.getItem('currentMode')
  return !mode ? light: mode;
}

function setMode (mode) {
  localStorage.setItem('currentMode', mode)
  modeSwitch.textContent = (mode===light ? moon : sun)
}

function switchMode (mode) {
  if (mode === light) {
    setMode(light)
    makeLight()
  } else {
    setMode(dark)
    makeDark()
  }
  resetDisqus()
}

function makeDark () {
  root.style.setProperty('--background', "#2a2e2e");
  root.style.setProperty('--text', "#bbb");
  root.style.setProperty('--heading', "#eee");
  root.style.setProperty('--link', "#aaa");
  root.style.setProperty('--link-hover', "#ccc");
  root.style.setProperty('--inline-code-bg', "#444");
  root.style.setProperty('--code-block-bg', "#888");
  root.style.setProperty('--box-fg', "#aaa");
  root.style.setProperty('--box-bg', "#3a3a3a");

  root.style.setProperty('--archive-ul', "#888");
  root.style.setProperty('--post-meta', "#666");
  root.style.setProperty('--tagbox', "#888");

  root.style.setProperty('--line', "#444");
  root.style.setProperty('--circle', "#444");
  root.style.setProperty('--footer', "#333");
}

function makeLight () {
  root.style.setProperty('--background', "#fff");
  root.style.setProperty('--text', "");
  root.style.setProperty('--heading', "");
  root.style.setProperty('--link', "#666");
  root.style.setProperty('--link-hover', "#999");
  root.style.setProperty('--inline-code-bg', "#eee");
  root.style.setProperty('--code-block-bg', "#eee");
  root.style.setProperty('--box-fg', "#808080");
  root.style.setProperty('--box-bg', "#f5f5f5");

  root.style.setProperty('--archive-ul', "#444");
  root.style.setProperty('--post-meta', "#aaa");
  root.style.setProperty('--tagbox', "#555");

  root.style.setProperty('--line', "#ebf2f6");
  root.style.setProperty('--circle', "#fff");
  root.style.setProperty('--footer', "#eee");
}

function resetDisqus() {
  DISQUS.reset({reload: true});
}
