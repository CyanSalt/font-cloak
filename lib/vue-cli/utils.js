const semver = require('semver')

function getInstalledPackageVersion(moduleId) {
  let packageJson
  try {
    packageJson = require(`${moduleId}/package.json`)
  } catch {
    return null
  }
  return packageJson.version
}

function hasInstalledPackage(moduleId, version) {
  const installedVersion = getInstalledPackageVersion(moduleId)
  if (!installedVersion) {
    return false
  }
  if (version) {
    return semver.satisfies(installedVersion, version)
  }
  return true
}

module.exports = {
  getInstalledPackageVersion,
  hasInstalledPackage,
}
