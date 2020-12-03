const AWS = require('aws-sdk')
const fs = require('fs')
const mime = require('mime-types')
const { kaskadi } = require(`${process.cwd()}/package.json`)
const resolvePath = require('./helpers/upload/resolve-path.js')
const upload = require('./helpers/upload/upload.js')

const logger = logStack => msg => logStack.push(msg)

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_KEY_SECRET
})

const utils = { s3, fs, mime }

let logStack = []

async function main () {
  await Promise.allSettled(kaskadi['s3-push'].files.map(file => {
    var fileLogStack = []
    const log = logger(fileLogStack)
    const fileUtils = { ...utils, log }
    log(`::group::Uploading ${file.src}`)
    file.dest = resolvePath(fileUtils, file.dest)
    return upload(fileUtils, file)
      .catch(err => {
        log('ERROR: something unexcepted happened, see below for more details...')
        log(err.stack)
      })
      .finally(() => {
        log('::endgroup::')
        logStack = [...logStack, fileLogStack.join('\n')]
      })
  }))
}

main().finally(() => { console.log(logStack.join('\n')) })
