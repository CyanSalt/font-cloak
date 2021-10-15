function encode(text, magicString) {
  if (text.length === 0) {
    return ''
  }
  if (text.length === 1) {
    const charCode = text.charCodeAt(0)
    if (charCode > 0x007F) return text
    const offset = parseInt(magicString.slice(-2), 16)
    const target = parseInt(magicString.slice(charCode * 2, charCode * 2 + 2), 16)
    return String.fromCharCode(0xE000 + offset + target)
  }
  return text.split('').map(c => encode(c, magicString)).join('')
}

module.exports = {
  encode,
}
