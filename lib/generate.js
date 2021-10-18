const fontCarrier = require('font-carrier')
const seedrandom = require('seedrandom')

function shuffle(arr, rand) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let target = Math.floor(rand() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[target]
    arr[target] = temp
  }
  return arr
}

function generateSequence(seed) {
  const rand = seedrandom(seed)

  const offset = Math.floor(rand() * 128)
  const list = shuffle(Array(128).fill().map((_, i) => i), rand)

  return {
    offset,
    list,
  }
}

function generateFont(input, { type, seed }) {
  const { offset, list } = generateSequence(seed)

  const original = fontCarrier.transfer(input)
  const font = fontCarrier.create()
  list.forEach((target, index) => {
    font.setGlyph(String.fromCharCode(0xE000 + offset + target), original.getGlyph(String.fromCharCode(index)))
  })

  const result = font.output({ types: [type] })
  return result[type]
}

function generateMagicString(seed) {
  const { offset, list } = generateSequence(seed)
  return [...list, offset].map(n => n.toString(16).padStart(2, '0')).join('')
}

module.exports = {
  generateFont,
  generateMagicString,
}
