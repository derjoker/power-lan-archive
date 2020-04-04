// ==UserScript==
// @name         Deutsche Welle Lektionen
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Collect from Deutsche Welle Lektionen (Lücken).
// @author       derjoker
// @match        https://www.dw.com/de/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  // Your code here...

  // Übungen
  // Kennst du diese Wörter?
  const segment = document.querySelector('div#dkELearning > div.dkTaskWrapper.tab2 > form:first-child > div.dkWrapSegment')
  if (segment) {
    const clone = segment.cloneNode(true)
    clone.querySelectorAll('input').forEach(el => {
      console.log(el)
      el.outerHTML = el.getAttribute('correct')
    })

    let txt = clone.textContent.trim()
    if (txt.split('\n').length) {
      txt = txt.split('\n').map(t => t.replace(/^\d\. /g, '')).join('\n')
      console.log(txt)
    }

    const div = document.createElement('div')
    div.classList.add('submitElement')
    // data:text/plain?
    div.innerHTML = `<a href="data:text/csv;charset=utf-8,${txt}">Download</a>`
    document.querySelector('div#dkELearning > div.dkTaskWrapper.tab2 > form:first-child > div.exerciseForm').appendChild(div.cloneNode(true))
    document.querySelector('div#dkELearning > div.dkTaskWrapper.tab2 > form:first-child > div.solutionForm').appendChild(div.cloneNode(true))
  }
})()
