(function () {
  'use strict'

  function randomColor () {
    let colors = [
      '#003366',
      '#333300',
      '#660033', '#089378', '#0898b3', '#1A5276'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  function offsetTop (elm) {
    return elm ? elm.getBoundingClientRect().top + elm.ownerDocument.defaultView.pageYOffset : 0
  }

  function offsetHeight (elm) {
    return elm ? elm.offsetHeight : 0
  }

  function initProgress (h1) {
    let threshold = offsetTop(h1) + offsetHeight(h1) - offsetHeight(document.querySelector('nav'))
    let postContent = document.querySelector('.post-content')

    if (!postContent) return

    let ph = offsetHeight(postContent)   // post height
    let wh = window.innerHeight          // window height
    let color = randomColor()

    document.addEventListener('scroll', () => {
      let top = offsetTop(postContent)
      let y = document.defaultView.pageYOffset
      let base = Math.max(5, top + ph - wh)
      let progress = Math.min(100, y / base * 100)

      let bar = document.querySelector('#bar')
      bar.style.width = progress + '%'
      bar.style.backgroundColor = color

      if (y <= threshold) {
        document.querySelector('#progress').style.height = '8px'
      } else {
        document.querySelector('#progress').style.height = '36px'
      }
    })
  }

  let h1 = document.querySelector('h1')
  if (h1) {
    initProgress(h1)
  }

  document.querySelectorAll('[data-toggle=collapse]').forEach(el => el.addEventListener('click', (e) => {
    let targetId = el.getAttribute('data-target')
    let target = document.getElementById(targetId.substring(1)) // remove '#'
    target.classList.toggle('collapsed')
  }))

  function minHeight () {
    let wh = window.innerHeight
    let hh = offsetHeight(document.querySelector('header'))
    let fh = offsetHeight(document.querySelector('footer'))
    let minHeight = wh - hh - fh - 20 // 20 for adjustment
    return minHeight + 'px'
  }

  // shortcut:
  // down: j or C-n
  // up:   k or C-p
  // prev page: h or C-b
  // next page: l or C-f
  document.addEventListener('keydown', e => {
    if (e.keyCode === 74 /* j */ || (e.ctrlKey && e.keyCode === 78 /* C-n */)) {
      window.scrollBy(0, 100)
    } else if (e.keyCode === 75 /* k */ || (e.ctrlKey && e.keyCode === 80 /* C-p */)) {
      window.scrollBy(0, -100)
    } else if (e.keyCode === 72 /* h */ || (e.ctrlKey && e.keyCode === 66)) {
      let a = document.querySelector('.previous')
      if (!!a) window.location = a.href
    } else if (e.keyCode === 76 /* l */ || (e.ctrlKey && e.keyCode === 70)) {
      let a= document.querySelector('.next')
      if (!!a) window.location = a.href
    }
  })

  // footnote
  document.querySelectorAll('.footnote-ref a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      let id = e.target.getAttribute('href').substr(1)
      let footnote = document.getElementById(id)
      footnote.scrollIntoView({block: 'end'})
    })
  })

  document.querySelector('main').style.minHeight = minHeight()
}())
