const pj = require('./package.json')
const fs = require('fs')
const core = require('@actions/core')

console.log(core.getInput('working-directory'))
