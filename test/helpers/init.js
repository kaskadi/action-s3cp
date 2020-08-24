const runAction = require('./run-action.js')
const steps = ['pre', 'main']

module.exports = () => {
  runAction(steps)
  return new Promise(resolve => setTimeout(resolve, 1500))
}
