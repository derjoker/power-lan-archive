// ==UserScript==
// @name         Anki Cloze Editor
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Create or edit Anki cloze with ease.
// @author       derjoker
// @match        https://ankiuser.net/edit/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  // Your code here...
  console.log('Anki Cloze Editor')

  var ctrl = false

  $(document).keydown(e => {
    ctrl = e.ctrlKey
  })

  $(document).keyup(e => {
    ctrl = e.ctrlKey
  })

  const div = $('<div>')
  $('#toptitle').after(div)

  updateDiv()

  $('div#f0').blur(() => {
    updateDiv()
  })

  function updateDiv() {
    div.html('')
    const text = $('div#f0').text()
    const content = text.split(' ').map(txt => {
      return $(`<span>${txt}</span>`).css({
        'margin': '1px',
        'background': 'yellow'
      }).click(() => {
        const reg = /{{c\d+::(.*)}}/
        const m = txt.match(reg)
        console.log(m)
        const newText = m ? text.replace(m[0], m[1]) : text.replace(txt, `{{c${getIndex()}::${txt}}}`)
        $('div#f0').text(newText)
        updateDiv()
      })
    })
    div.append(content)
  }

  function getIndex() {
    const text = $('div#f0').text()
    const reg = /{{c\d+::/g
    const m = text.match(reg)
    const i = m ? Math.max.apply(null, m.join('').match(/\d+/g).map(d => Number(d))) : 0
    return ctrl ? i : i + 1
  }
})()
