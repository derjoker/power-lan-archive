// ==UserScript==
// @name         Voscreen
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Collect Subtile on Voscreen.
// @author       derjoker
// @match        https://voscreen.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  // Your code here...
  const voscreen = Storage('voscreen-dj-2019-12-18')

  const li = document.createElement('li')
  li.classList.add('o-header-menu__item')
  document.querySelector('ul.o-header-menu').appendChild(li)

  const a = document.createElement('a')
  a.classList.add('c-button', 'c-button--dumpy', 'c-button--septenary', 'u-font-weight-bold')
  a.innerHTML = 'Export'
  li.appendChild(a)

  li.addEventListener('click', () => {
    const items = Object.values(voscreen.items()).filter(item => !item.z).map(item => `${item.y}\t${item.x}`)

    const uri = "data:text/csv;charset=utf8," + encodeURIComponent(items.join('\n'))
    const fileName = 'voscreen.csv'
    a.setAttribute("href", uri)
    a.setAttribute("download", fileName)

    voscreen.save()
  })

  // Mutation Observer
  const targetNode = document.body
  const config = { attributes: true, childList: true, subtree: true }
  const callback = function (mutationList) {
    // console.log(mutationList)
    mutationList.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        // console.log('=== addedNodes ===')
        // console.log(node)
        // console.log('======')
        if (node.className === 'c-player-subtitle o-player__subtitle') {
          const x = node.innerText
          let correct, fallback
          document.querySelectorAll('div.c-player-answer.o-player__answer').forEach(el => {
            // console.log(el)
            if (el.classList.contains('is-correct')) {
              correct = el.innerText
            } else if (el.classList.contains('is-incorrect')) {
              // ignore incorrect
            } else {
              fallback = el.innerText
            }
          })
          const y = correct || fallback
          if (!voscreen.item(x)) {
            voscreen.item(x, { x, y })
          }
        }
      })
    })
  }
  const observer = new MutationObserver(callback)
  observer.observe(targetNode, config)

  function Storage(key) {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({}))

    function items() {
      return JSON.parse(localStorage.getItem(key))
    }

    function item(k, v) {
      const t = items()
      if (v === undefined) {
        return t[k]
      } else {
        t[k] = v
        localStorage.setItem(key, JSON.stringify(t))
      }
    }

    function save() {
      const t = items()
      Object.keys(t).forEach(k => {
        const v = t[k]
        v.z = true
      })
      console.log(t)
      localStorage.setItem(key, JSON.stringify(t))
    }

    return {
      items,
      item,
      save
    }
  }
})()
