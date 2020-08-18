module.exports = path => {
  const lastChar = path.charAt(path.length - 1)
  const lastPart = path.split('/').pop()
  return lastChar !== '/' && lastPart !== '{branch}' ? `${path}/` : path
}
