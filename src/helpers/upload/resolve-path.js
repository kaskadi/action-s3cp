module.exports = path => {
  let branch = getCurrentBranchName()
  if (branch === 'master') {
    branch = ''
  } else {
    branch += '/'
  }
  return path.replace(/{branch}/g, branch)
}

function getCurrentBranchName () {
  const ref = process.env.GITHUB_BASE_REF || process.env.GITHUB_REF
  const refs = ref.split('/')
  return refs[refs.length - 1]
}
