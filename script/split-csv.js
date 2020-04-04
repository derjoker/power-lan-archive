const fs = require('fs')

const re = /[\u{4e00}-\u{9fa5}]/u

const t = fs.readFileSync('文本.txt', 'utf8').trim().split('\r\n').map(l => {
  const m = l.match(re)
  const i = m ? l.substring(0, m.index).lastIndexOf(' ') : l.length
  return l.substring(0, i) + '\t' + l.substring(i + 1)
}).join('\r\n')

fs.writeFileSync('result.csv', t)
