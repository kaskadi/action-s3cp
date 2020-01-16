const AWS = require('aws-sdk')
const core = require('@actions/core')
const fs = require('fs')
const cwd = process.cwd()
const package = require(`${cwd}/package.json`)
const kaskadiOptions = package.kaskadi

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_KEY_SECRET
})

kaskadiOptions['s3-push'].files.forEach(fileData => {
  const file = fs.readFileSync(fileData.src)
  const params = {
    Body: file,
    Bucket: 'kaskadi-public',
    Key: resolvePath(fileData.dest)
  }
  s3.putObject(params).promise(console.log).catch(console.log)
})

function resolvePath (path) {
  let parsedPath = parse(path)
  parsedPath = parsedPath.map(token => {
    if (token.type === 'part') {
      return token.value
    } else {
      return resolver(token.value)
    }
  })
  return parsedPath.join('')
}

function resolver (tokenValue) {
  switch (tokenValue) {
    case 'version':
      const branch = getCurrentBranchName(cwd)
      if (branch !== 'master') {
        return `${branch}/`
      }
      return ''
  }
}

function parse (path) {
  let state = 0
  let result = []
  let currentToken = ''
  for (let i=0; i < path.length; i++) {
    let currentChar = path.charAt(i)
    switch (state) {
      case 0:
        if (currentChar === '{') {
          state = 1
          result.push({
            type: 'part',
            value: currentToken
          })
          currentToken = ''
        } else {
          currentToken += currentChar
        }
      break
      case 1:
        if (currentChar === '}') {
          state = 0
          result.push({
            type: 'token',
            value: currentToken
          })
          currentToken = ''
        } else {
          currentToken += currentChar
        }
      break
    }
  }
  result.push({
    type: 'part',
    value: currentToken
  })
  return result
}

function getCurrentBranchName(cwd = process.cwd()) {
  return fs.readFileSync(`${cwd}/.git/HEAD`, 'utf-8').replace('ref: refs/heads/', '')
}
