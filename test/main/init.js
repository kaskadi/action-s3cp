const runAction = require('../helpers/run-action.js')
const steps = ['pre', 'main']

module.exports = ref => async () => {
  process.chdir('test')
  const baseRef = process.env.GITHUB_BASE_REF
  const curRef = process.env.GITHUB_REF
  process.env.GITHUB_BASE_REF = ref
  delete process.env.GITHUB_REF
  return await runAction(steps)
    .then(() => new Promise(resolve => setTimeout(resolve, 1500)))
    .then(() => {
      process.env.GITHUB_BASE_REF = baseRef
      process.env.GITHUB_REF = curRef
    })
    .then(() => {
      process.chdir('..')
      return true
    })
}
