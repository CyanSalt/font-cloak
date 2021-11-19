function interpolateName(name) {
  return function (data, assetInfo) {
    let resourceQuery
    // for webpack@<=4
    if (typeof assetInfo === 'string') {
      resourceQuery = assetInfo
    } else {
      const { parseResource } = require('webpack/lib/util/identifier')
      const resource = parseResource(data.filename)
      resourceQuery = resource.query
    }
    const query = new URLSearchParams(resourceQuery)
    return name.replace(/\[ext\]/gi, () => query.get('cloak'))
  }
}

module.exports = {
  interpolateName,
}
