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
  const refs = process.env.GITHUB_REF.split('/')
  return refs[refs.length - 1]
}
