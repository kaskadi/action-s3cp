const { execSync } = require('child_process')

function main() {
  const pjson = require('./package.json')
  updateDependencies(pjson.devDependencies)
  updateDependencies(pjson.dependencies)
}

function updateDependencies (dependencies) {
  if (dependencies) {
    Object.keys(dependencies).forEach(dependency => { execSync(`npm i -D ${dependency}@latest`) }, { stdio: 'inherit' })
  }
}

main()