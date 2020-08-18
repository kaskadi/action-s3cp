require('./helpers/install-dependencies.js')()
const AWS = require('aws-sdk')
const fs = require('fs')
const mime = require('mime-types')
const cwd = process.cwd()
const pjson = require(`${cwd}/package.json`)
const kaskadiOptions = pjson.kaskadi
const bucket = 'kaskadi-public'
const resolvePath = require('./helpers/upload/resolve-path.js')
const upload = require('./helpers/upload/upload.js')

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_KEY_SECRET
})

async function main () {
  await Promise.all(kaskadiOptions['s3-push'].files.map(file => {
    file.dest = resolvePath(file.dest)
    return upload(s3, fs, bucket, mime, file)
  }))
}

main().catch(console.log)
