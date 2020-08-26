const runAction = require('../helpers/run-action.js')
const steps = ['pre', 'main']

module.exports = ref => async () => {
  process.chdir('test')
  process.env.GITHUB_REF = ref
  return await runAction(steps).then(() => new Promise(resolve => setTimeout(resolve, 1500))).then(() => {
    process.chdir('..')
    return true
  })
}
