module.exports = ({ log }, path) => {
  log(`INFO: resolving path ${path} with current branch...`)
  let branch = getCurrentBranchName()
  log(`INFO: current branch is ${branch}.`)
  if (branch === 'master') {
    branch = ''
  } else {
    branch += '/'
  }
  const resolvedPath = path.replace(/{branch}/g, branch)
  log(`SUCCESS: successfully resolved path to ${resolvedPath}!`)
  return resolvedPath
}

function getCurrentBranchName () {
  const ref = process.env.GITHUB_BASE_REF || process.env.GITHUB_REF
  const refs = ref.split('/')
  return refs[refs.length - 1]
}
