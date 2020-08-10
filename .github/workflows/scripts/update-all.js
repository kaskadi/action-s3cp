const { execSync } = require('child_process')

function main() {
  const pjson = require('../../../package.json')
  updateDependencies(pjson.devDependencies, 'D')
  updateDependencies(pjson.dependencies, 'S')
}

function updateDependencies (dependencies, level) {
  if (dependencies) {
    Object.keys(dependencies).forEach(dependency => { execSync(`npm i -${level} ${dependency}@latest`) }, { stdio: 'inherit' })
  }
}

main()
