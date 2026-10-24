import { createLowlight } from 'lowlight'
import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import css from 'highlight.js/lib/languages/css'
import diff from 'highlight.js/lib/languages/diff'
import http from 'highlight.js/lib/languages/http'
import ini from 'highlight.js/lib/languages/ini'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import perl from 'highlight.js/lib/languages/perl'
import php from 'highlight.js/lib/languages/php'
import plaintext from 'highlight.js/lib/languages/plaintext'
import powershell from 'highlight.js/lib/languages/powershell'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import x86asm from 'highlight.js/lib/languages/x86asm'

const lowlight = createLowlight({
  bash,
  c,
  css,
  diff,
  http,
  ini,
  javascript,
  json,
  perl,
  php,
  plaintext,
  powershell,
  python,
  sql,
  xml,
  yaml,
  x86asm,
})

const ALIASES = {
  asm: 'x86asm',
  html: 'xml',
  js: 'javascript',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  text: 'plaintext',
  txt: 'plaintext',
}

function textContent(node) {
  if (node.type === 'text') return node.value
  return (node.children || []).map(textContent).join('')
}

function highlightCode(node) {
  const classes = Array.isArray(node.properties.className) ? node.properties.className : []
  if (classes.includes('no-highlight') || classes.includes('nohighlight')) return

  const languageClass = classes.find((name) => String(name).startsWith('language-') || String(name).startsWith('lang-'))
  if (!languageClass) return

  const prefix = String(languageClass).startsWith('lang-') ? 'lang-' : 'language-'
  const requested = String(languageClass).slice(prefix.length).toLowerCase()
  const language = ALIASES[requested] || requested
  if (!lowlight.registered(language)) return

  if (!classes.includes('hljs')) node.properties.className = ['hljs', ...classes]
  const result = lowlight.highlight(language, textContent(node), { prefix: 'hljs-' })
  node.children = result.children
}

export default function rehypeHighlight() {
  return function transform(tree) {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'pre') {
        const code = (node.children || []).find((child) => child.type === 'element' && child.tagName === 'code')
        if (code) highlightCode(code)
      }
      for (const child of node.children || []) visit(child)
    }
    visit(tree)
  }
}
