(() => {
  // ns-hugo-imp:/Users/ntalbs/Blog/themes/simplex/assets/js/mode.js
  var light = "light";
  var dark = "dark";
  function getMode() {
    return localStorage.getItem("mode") || light;
  }
  function switchMode(mode) {
    if (mode === light) {
      setMode(light);
    } else {
      setMode(dark);
    }
  }
  function setMode(mode) {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem("mode", mode);
    changeGiscusTheme(mode + "_protanopia");
  }
  function changeGiscusTheme(theme) {
    const iframe = document.querySelector("iframe.giscus-frame");
    if (!iframe) return;
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme } } },
      "https://giscus.app"
    );
  }
  var modeSwitch = document.getElementById("mode-switch");
  modeSwitch.addEventListener("click", (e) => {
    switchMode(getMode() === "light" ? "dark" : "light");
  });

  // ns-hugo-imp:/Users/ntalbs/Blog/themes/simplex/assets/js/anchor.js
  [...document.querySelectorAll("a")].filter((link) => link.hostname != window.location.hostname).forEach((link) => link.target = "_blank");

  // ns-hugo-imp:/Users/ntalbs/Blog/themes/simplex/assets/js/shortcut.js
  document.addEventListener("keydown", (e) => {
    if (e.srcElement.id === "search") {
      if (e.keyCode === 13) {
        search(e.srcElement.value.trim());
        e.srcElement.value = "";
      }
      return;
    }
    if (e.keyCode === 74 || e.ctrlKey && e.keyCode === 78) {
      window.scrollBy(0, 100);
    } else if (e.keyCode === 75 || e.ctrlKey && e.keyCode === 80) {
      window.scrollBy(0, -100);
    } else if (e.keyCode === 72 && !(e.ctrlKey || e.metaKey) || e.ctrlKey && e.keyCode === 66) {
      nextPage();
    } else if (e.keyCode === 76 && !(e.ctrlKey || e.metaKey) || e.ctrlKey && e.keyCode === 70) {
      prevPage();
    } else if (e.keyCode === 191) {
      window.scrollTo(0, 0);
      e.preventDefault();
      document.getElementById("search").focus();
    }
  });
  function isPostPage(path) {
    return /^\/\d{4}\//.test(path);
  }
  function prevPage() {
    if (isPostPage(window.location.pathname)) {
      let a = document.querySelector(".article-nav .prev");
      if (!!a) window.location = a.href;
    } else {
      let a = document.querySelector(".page-item+.active").nextElementSibling.firstElementChild;
      if (!!a.href) window.location = a.href;
    }
  }
  function nextPage() {
    if (isPostPage(window.location.pathname)) {
      let a = document.querySelector(".article-nav .next");
      if (!!a) window.location = a.href;
    } else {
      let a = document.querySelector(".page-item+.active").previousElementSibling.firstElementChild;
      if (!!a.href) window.location = a.href;
    }
  }
  function search(keyword) {
    if (keyword === "") {
      return;
    }
    window.open(`https://www.google.com/search?q=${keyword}+site%3Antalbs.github.io`, "_blank");
  }

  // ns-hugo-imp:/Users/ntalbs/Blog/themes/simplex/assets/js/progressbar.js
  function randomColor() {
    let colors = [
      "#003366",
      "#660033",
      "#089378",
      "#0898b3",
      "#1A5276"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  function offsetTop(elm) {
    return elm ? elm.getBoundingClientRect().top + elm.ownerDocument.defaultView.pageYOffset : 0;
  }
  function offsetHeight(elm) {
    return elm ? elm.offsetHeight : 0;
  }
  function initProgress(h12) {
    let threshold0 = offsetHeight(document.querySelector("nav"));
    let threshold1 = offsetTop(h12) + offsetHeight(h12);
    let postContent = document.querySelector(".post-content");
    if (!postContent) return;
    let ph = offsetHeight(postContent);
    let wh = window.innerHeight;
    let color = randomColor();
    document.addEventListener("scroll", () => {
      let top = offsetTop(postContent);
      let y = document.defaultView.pageYOffset;
      let base = Math.max(5, top + ph - wh);
      let progress = Math.min(100, y / base * 100);
      let bar = document.querySelector("#bar");
      bar.style.width = progress + "%";
      bar.style.backgroundColor = color;
      if (y <= threshold0) {
        document.querySelector("#progress").style.height = "0";
      } else if (y <= threshold1) {
        document.querySelector("#progress").style.height = "8px";
      } else {
        document.querySelector("#progress").style.height = "36px";
      }
    });
  }
  function minHeight() {
    let wh = window.innerHeight;
    let hh = offsetHeight(document.querySelector("header"));
    let fh = offsetHeight(document.querySelector("footer"));
    let minHeight2 = wh - hh - fh - 20;
    return minHeight2 + "px";
  }
  document.querySelector("main").style.minHeight = minHeight();
  var h1 = document.querySelector("h1");
  if (h1) {
    initProgress(h1);
  }
})();
