const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const { generateFont } = require('../generate')

const QUOTED_REGEXP = /^(['"])(.*)\1/s
const QUERY_REGEXP = /\?.*$/s
const HASH_REGEXP = /#.*$/s

function cleanURL(url) {
  return url
    .trim()
    .replace(QUOTED_REGEXP, '$2')
    .replace(HASH_REGEXP, '')
    .replace(QUERY_REGEXP, '')
}

async function ensure(file) {
  try {
    await fs.promises.mkdir(path.dirname(file))
  } catch {
    // ignore error
  }
}

async function exists(file) {
  try {
    await fs.promises.access(file)
    return true
  } catch {
    return false
  }
}

function toPOSIXPath(file) {
  return file.replace(/\\/g, path.posix.sep)
}

async function generateFontFile(source, target, options) {
  const sourceBuffer = await fs.promises.readFile(source)
  const targetBuffer = await generateFont(sourceBuffer, options)
  await ensure(target)
  return fs.promises.writeFile(target, targetBuffer, { encoding: 'binary' })
}

async function walkDeclsAsync(root, filter, callback) {
  const promises = []
  root.walkDecls(filter, (decl, index) => {
    promises.push(callback(decl, index))
  })
  return Promise.all(promises)
}

const CSS_URL_REGEXP = /url\(([^)]+)\)/gi
const CLOAK_REGEXP = /\?([^#'")]*)\bcloak=\.?(\w+)(&)?/

function rootProcessor(root, options) {
  const { seed, rootDir, filename = '[name].[hash:8].[ext]' } = options
  const outDir = rootDir
    ? 'node_modules/.cache/font-cloak'
    : '.font-cloak'
  const replacer = (matched, prefix, ext, suffix) => {
    const query = prefix || suffix
    return filename
      .replace(/^\[name\]/, '')
      .replace(/\[hash:(\d)\]/, (_, length) => {
        return crypto.createHash('sha1')
          .update(seed)
          .digest('hex')
          .slice(0, Number(length))
      })
      .replace(/\[ext\]/, ext) + (query ? '?' + query : '')
  }
  const cache = new Set()
  return walkDeclsAsync(root, 'src', async decl => {
    const getTargetURL = url => {
      const context = path.dirname(decl.source.input.file)
      const replacedURL = cleanURL(url.replace(CLOAK_REGEXP, replacer))
      return rootDir
        ? path.posix.join(toPOSIXPath(path.relative(context, rootDir)), outDir, path.basename(replacedURL))
        : path.posix.join(outDir, replacedURL)
    }
    for (const matches of decl.value.matchAll(CSS_URL_REGEXP)) {
      const url = matches[1]
      const cloakMatches = url.match(CLOAK_REGEXP)
      if (cloakMatches) {
        const context = path.dirname(decl.source.input.file)
        const targetURL = getTargetURL(url)
        const targetFile = path.join(context, targetURL)
        const isGenerated = cache.has(targetFile) || await exists(targetFile)
        if (!isGenerated) {
          cache.add(targetFile)
          const sourcePath = cleanURL(url)
          const sourceFile = path.join(context, sourcePath)
          await generateFontFile(sourceFile, targetFile, {
            type: cloakMatches[2],
            seed,
          })
        }
      }
    }
    decl.value = decl.value.replace(
      CSS_URL_REGEXP,
      (matched, url) => {
        return url.match(CLOAK_REGEXP) ? `url(${getTargetURL(url)})` : matched
      },
    )
  })
}

module.exports = rootProcessor
