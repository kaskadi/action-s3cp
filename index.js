const AWS = require('aws-sdk')
const fs = require('fs')
const mime = require('mime-types')
const cwd = process.cwd()
const package = require(`${cwd}/package.json`)
const kaskadiOptions = package.kaskadi
const bucket = 'kaskadi-public'

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_KEY_SECRET
})

kaskadiOptions['s3-push'].files.forEach(upload)

function upload (data) {
  const fileStats = fs.lstatSync(data.src)
  if (fileStats.isDirectory()) {
    uploadFolder(data)
  } else {
    uploadFile(data)
  }
}

function uploadFolder (data) {
  // create folder
  const params = {
    Body: '',
    Bucket: bucket,
    Key: resolvePath(data.dest)
  }
  s3.putObject(params).promise(console.log).catch(console.log)
  // for all files in the folder, repeat upload process
  fs.readdirSync(data.src).forEach(file => {
    const uploadData = {
      src: `${data.src}/${file}`,
      dest: `${data.dest}/${file}`
    }
    upload(uploadData)
  })
}

function uploadFile (data) {
  const params = {
    Body: fs.readFileSync(data.src),
    Bucket: bucket,
    Key: resolvePath(data.dest),
    ContentType: mime.lookup(data.src)
  }
  s3.putObject(params).promise(console.log).catch(console.log)
}

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
