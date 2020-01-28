const AWS = require('aws-sdk')
const fs = require('fs')
const mime = require('mime-types')
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
  const type = mime.lookup(fileData.src)
  const params = {
    Body: file,
    Bucket: 'kaskadi-public',
    Key: resolvePath(fileData.dest),
    ContentType: type
  }
  s3.putObject(params).promise(console.log).catch(console.log)
})

function resolvePath (path) {
  let branch = getCurrentBranchName()
  if (branch === 'master') {
    branch = ''
  } else {
    branch += '/'
  }
  return path.replace(/{branch}/g, branch)
}

function getCurrentBranchName() {
  const refs = process.env.GITHUB_REF.split('/')
  return refs[refs.length - 1]
}
