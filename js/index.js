(function () {
  'use strict'

  function randomColor () {
    let colors = [
      '#330033', '#003366',
      '#003399', '#000033', '#333300', '#990033',
      '#660033', '#089378', '#0898b3', '#1A5276', '#ffca00', '#ff9900'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  function offsetTop (elm) {
    return elm.getBoundingClientRect().top + elm.ownerDocument.defaultView.pageYOffset
  }

  function initProgress (h1) {
    let threshold = offsetTop(h1) + h1.offsetHeight - document.querySelector('nav').offsetHeight
    let postContent = document.querySelector('.post-content')
    let ph = postContent.offsetHeight    // post height
    let wh = window.innerHeight          // window height
    let color = randomColor()

    document.addEventListener('scroll', () => {
      if (!postContent) return

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
    let hh = document.querySelector('header').offsetHeight
    let fh = document.querySelector('footer').offsetHeight
    let minHeight = wh - hh - fh - 20 // 20 for adjustment
    return minHeight + 'px'
  }

  // shortcut: j or C-n for down, k or C-p for up
  document.addEventListener('keydown', e => {
    if (e.keyCode === 74 /* j */ || (e.ctrlKey && e.keyCode === 78 /* C-n */)) {
      window.scrollBy(0, 100)
    } else if (e.keyCode === 75 /* k */ || (e.ctrlKey && e.keyCode === 80 /* C-p */)) {
      window.scrollBy(0, -100)
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
