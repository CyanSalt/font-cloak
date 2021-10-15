function interpolateName(name) {
  return function (resourcePath, resourceQuery) {
    const query = new URLSearchParams(resourceQuery)
    return name.replace(/\[ext\]/gi, () => query.get('cloak'))
  }
}

module.exports = {
  interpolateName,
}
