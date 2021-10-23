const sun  = '☀'
const moon = '☾'
const light = 'light'
const dark  = 'dark'

let root = document.documentElement
let navBar = document.getElementById('nav-items')
let modeSwitch = document.getElementById('mode-switch')
modeSwitch.style.width = '46px'

modeSwitch.addEventListener('click', (e) => {
  switchMode(getMode() === light ? dark : light)
})

switchMode(getMode(), false)

function getMode () {
  let mode = localStorage.getItem('currentMode')
  return !mode ? light: mode;
}

function setMode (mode) {
  localStorage.setItem('currentMode', mode)
  modeSwitch.textContent = (mode===light ? moon : sun)
}

function switchMode (mode, disqus) {
  if (mode === light) {
    setMode(light)
    makeLight()
    xcode()
  } else {
    setMode(dark)
    makeDark()
    monokai()
  }
  navBar.classList.add('collapsed')

  if (disqus) {
    resetDisqus()
  }
}

function makeDark () {
  root.style.setProperty('--background', "#151d26")
  root.style.setProperty('--text', "#bbb")
  root.style.setProperty('--heading', "#eee")
  root.style.setProperty('--link', "#aaa")
  root.style.setProperty('--link-hover', "#ccc")
  root.style.setProperty('--inline-code-bg', "#212d39")
  root.style.setProperty('--box-fg', "#aaa")
  root.style.setProperty('--box-bg', "#212d39")

  root.style.setProperty('--archive-ul', "#888")
  root.style.setProperty('--post-meta', "#666")
  root.style.setProperty('--tagbox', "#888")

  root.style.setProperty('--line', "#444")
  root.style.setProperty('--circle', "#444")

  root.style.setProperty('--navbar-bg', "#242933")
  root.style.setProperty('--footer-bg', "#242933")

  root.style.setProperty('--invert-amt', '0.84')
  root.style.setProperty('--img-brightness', '0.5')
}

function makeLight () {
  root.style.setProperty('--background', "#fff")
  root.style.setProperty('--text', "")
  root.style.setProperty('--heading', "")
  root.style.setProperty('--link', "#666")
  root.style.setProperty('--link-hover', "#999")
  root.style.setProperty('--inline-code-bg', "#eee")
  root.style.setProperty('--box-fg', "#808080")
  root.style.setProperty('--box-bg', "#f5f5f5")

  root.style.setProperty('--archive-ul', "#444")
  root.style.setProperty('--post-meta', "#aaa")
  root.style.setProperty('--tagbox', "#555")

  root.style.setProperty('--line', "#ebf2f6")
  root.style.setProperty('--circle', "#fff")
  root.style.setProperty('--navbar-bg', "#444")
  root.style.setProperty('--footer-bg', "#333")

  root.style.setProperty('--invert-amt', '0')
  root.style.setProperty('--img-brightness', '1.0')
}

function xcode() {
  root.style.setProperty('--Foreground', '#000000')
  root.style.setProperty('--Background', '#eee')
  root.style.setProperty('--Error', '#000000')
  root.style.setProperty('--Keyword', '#a90d91')
  root.style.setProperty('--KeywordConstant', '#a90d91')
  root.style.setProperty('--KeywordDeclaration', '#a90d91')
  root.style.setProperty('--KeywordNamespace', '#a90d91')
  root.style.setProperty('--KeywordPseudo', '#a90d91')
  root.style.setProperty('--KeywordReserved', '#a90d91')
  root.style.setProperty('--KeywordType', '#a90d91')
  root.style.setProperty('--Name', '#000000')
  root.style.setProperty('--NameAttribute', '#0060b2')
  root.style.setProperty('--NameBuiltin', '#a90d91')
  root.style.setProperty('--NameBuiltinPseudo', '#5b269a')
  root.style.setProperty('--NameClass', '#3f6e75')
  root.style.setProperty('--NameConstant', '#000000')
  root.style.setProperty('--NameDecorator', '#000000')
  root.style.setProperty('--NameEntity', '#000000')
  root.style.setProperty('--NameException', '#000000')
  root.style.setProperty('--NameFunction', '#000000')
  root.style.setProperty('--NameFunctionMagic', '#000000')
  root.style.setProperty('--NameLabel', '#000000')
  root.style.setProperty('--NameTag', '')
  root.style.setProperty('--NameNamespace', '#000000')
  root.style.setProperty('--NameOther', '#000000')
  root.style.setProperty('--NameProperty', '#000000')
  root.style.setProperty('--NameTag', '#000000')
  root.style.setProperty('--NameVariable', '#000000')
  root.style.setProperty('--NameVariableClass', '#000000')
  root.style.setProperty('--NameVariableGlobal', '#000000')
  root.style.setProperty('--NameVariableInstance', '#000000')
  root.style.setProperty('--NameVariableMagic', '#000000')
  root.style.setProperty('--Literal', '#1c01ce')
  root.style.setProperty('--LiteralDate', '#1c01ce')
  root.style.setProperty('--LiteralString', '#c41a16')
  root.style.setProperty('--LiteralStringAffix', '#c41a16')
  root.style.setProperty('--LiteralStringBacktick', '#c41a16')
  root.style.setProperty('--LiteralStringChar', '#2300ce')
  root.style.setProperty('--LiteralStringDelimiter', '#c41a16')
  root.style.setProperty('--LiteralStringDoc', '#c41a16')
  root.style.setProperty('--LiteralStringDouble', '#c41a16')
  root.style.setProperty('--LiteralStringEscape', '#c41a16')
  root.style.setProperty('--LiteralStringHeredoc', '#c41a16')
  root.style.setProperty('--LiteralStringInterpol', '#c41a16')
  root.style.setProperty('--LiteralStringOther', '#c41a16')
  root.style.setProperty('--LiteralStringRegex', '#c41a16')
  root.style.setProperty('--LiteralStringSingle', '#c41a16')
  root.style.setProperty('--LiteralStringSymbol', '#c41a16')
  root.style.setProperty('--LiteralNumber', '#1c01ce')
  root.style.setProperty('--LiteralNumberBin', '#1c01ce')
  root.style.setProperty('--LiteralNumberFloat', '#1c01ce')
  root.style.setProperty('--LiteralNumberHex', '#1c01ce')
  root.style.setProperty('--LiteralNumberInteger', '#1c01ce')
  root.style.setProperty('--LiteralNumberIntegerLong', '#1c01ce')
  root.style.setProperty('--LiteralNumberOct', '#1c01ce')
  root.style.setProperty('--Operator', '#000000')
  root.style.setProperty('--OperatorWord', '#000000')
  root.style.setProperty('--Comment', '#177500')
  root.style.setProperty('--CommentHashbang', '#177500')
  root.style.setProperty('--CommentMultiline', '#177500')
  root.style.setProperty('--CommentSingle', '#177500')
  root.style.setProperty('--CommentSpecial', '#177500')
  root.style.setProperty('--CommentPreproc', '#633820')
  root.style.setProperty('--CommentPreprocFile', '#633820')
  root.style.setProperty('--GenericDeleted', '')
  root.style.setProperty('--GenericOutput', '')
}

function monokai () {
  root.style.setProperty('--Foreground', '#f8f8f2')
  root.style.setProperty('--Background', '#212d39')
  root.style.setProperty('--Error', '#1e0010')
  root.style.setProperty('--Keyword', '#66d9ef')
  root.style.setProperty('--KeywordConstant', '#66d9ef')
  root.style.setProperty('--KeywordDeclaration', '#66d9ef')
  root.style.setProperty('--KeywordNamespace', '#f92672')
  root.style.setProperty('--KeywordPseudo', '#66d9ef')
  root.style.setProperty('--KeywordReserved', '#66d9ef')
  root.style.setProperty('--KeywordType', '#66d9ef')
  root.style.setProperty('--Name', '#f8f8f2')
  root.style.setProperty('--NameAttribute', '#a6e22e')
  root.style.setProperty('--NameBuiltin', '#f8f8f2')
  root.style.setProperty('--NameBuiltinPseudo', '#f8f8f2')
  root.style.setProperty('--NameClass', '#a6e22e')
  root.style.setProperty('--NameConstant', '#66d9ef')
  root.style.setProperty('--NameDecorator', '#a6e22e')
  root.style.setProperty('--NameEntity', '#a6e22e')
  root.style.setProperty('--NameException', '#a6e22e')
  root.style.setProperty('--NameFunction', '#a6e22e')
  root.style.setProperty('--NameFunctionMagic', '#f8f8f2')
  root.style.setProperty('--NameLabel', '#f8f8f2')
  root.style.setProperty('--NameTag', '#f8f8f2')
  root.style.setProperty('--NameNamespace', '#f8f8f2')
  root.style.setProperty('--NameOther', '#a6e22e')
  root.style.setProperty('--NameOther', '#f8f8f2')
  root.style.setProperty('--NameTag', '#f92672')
  root.style.setProperty('--NameVariable', '#f8f8f2')
  root.style.setProperty('--NameVariableClass', '#f8f8f2')
  root.style.setProperty('--NameVariableGlobal', '#f8f8f2')
  root.style.setProperty('--NameVariableInstance', '#f8f8f2')
  root.style.setProperty('--NameVariableMagic', '#f8f8f2')
  root.style.setProperty('--Literal', '#ae81ff')
  root.style.setProperty('--LiteralDate', '#e6db74')
  root.style.setProperty('--LiteralString', '#e6db74')
  root.style.setProperty('--LiteralStringAffix', '#e6db74')
  root.style.setProperty('--LiteralStringBacktick', '#e6db74')
  root.style.setProperty('--LiteralStringChar', '#e6db74')
  root.style.setProperty('--LiteralStringDelimiter', '#e6db74')
  root.style.setProperty('--LiteralStringDoc', '#e6db74')
  root.style.setProperty('--LiteralStringDouble', '#e6db74')
  root.style.setProperty('--LiteralStringEscape', '#ae81ff')
  root.style.setProperty('--LiteralStringHeredoc', '#e6db74')
  root.style.setProperty('--LiteralStringInterpol', '#e6db74')
  root.style.setProperty('--LiteralStringOther', '#e6db74')
  root.style.setProperty('--LiteralStringRegex', '#e6db74')
  root.style.setProperty('--LiteralStringSingle', '#e6db74')
  root.style.setProperty('--LiteralStringSymbol', '#e6db74')
  root.style.setProperty('--LiteralNumber', '#ae81ff')
  root.style.setProperty('--LiteralNumberBin', '#ae81ff')
  root.style.setProperty('--LiteralNumberFloat', '#ae81ff')
  root.style.setProperty('--LiteralNumberHex', '#ae81ff')
  root.style.setProperty('--LiteralNumberInteger', '#ae81ff')
  root.style.setProperty('--LiteralNumberIntegerLong', '#ae81ff')
  root.style.setProperty('--LiteralNumberOct', '#ae81ff')
  root.style.setProperty('--Operator', '#f8f8f2')
  root.style.setProperty('--OperatorWord', '#f92672')
  root.style.setProperty('--Comment', '#75715e')
  root.style.setProperty('--CommentHashbang', '#75715e')
  root.style.setProperty('--CommentMultiline', '#75715e')
  root.style.setProperty('--CommentSingle', '#75715e')
  root.style.setProperty('--CommentSpecial', '#75715e')
  root.style.setProperty('--CommentPreproc', '#75715e')
  root.style.setProperty('--CommentPreprocFile', '#75715e')
  root.style.setProperty('--GenericDeleted', '#f92672')
  root.style.setProperty('--GenericOutput', '')

  root.style.setProperty('--GenericInserted', '#a6e22e')
  root.style.setProperty('--GenericSubheading', '#75715e')
}

function resetDisqus () {
  DISQUS.reset({reload: true})
}
