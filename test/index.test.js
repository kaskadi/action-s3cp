/* eslint-env mocha */
process.chdir('test')
const AWS = require('aws-sdk')
const pjson = require('./package.json')
const kaskadiOptions = pjson.kaskadi
const bucket = 'kaskadi-public'
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_KEY_SECRET
})
const chai = require('chai')
chai.should()

describe('action-s3cp', () => {
  it('should upload the files given into package.json to the correct location when branch is master', async () => {
    process.env.GITHUB_REF = 'ref:head/master'
    require('../index.js')
    const test = await new Promise((resolve, reject) => {
      setTimeout(async () => {
        resolve(await testFiles())
      }, 1000)
    })
    test.should.equal(true)
  })
  // it('should upload the files given into package.json to the correct location when branch is NOT master', async () => {
  //   process.env.GITHUB_REF = 'ref:head/release/v1.0.0'
  //   require('../index.js')
  //   const test = await testFiles()
  //   test.should.equal(true)
  // })
  after(() => {
    // since index.js does its work without awaiting we want to make sure that the files are uploaded before deleting them
    setTimeout(() => {
      emptyS3Directory(bucket, 'action-s3cp-test/')
    }, 2000)
  })
})

async function testFiles () {
  const tests = []
  const refs = process.env.GITHUB_REF.split('/')
  const branch = refs[refs.length - 1]
  for (const file of kaskadiOptions['s3-push'].files) {
    const dest = branch !== 'master' ? file.dest.replace('{branch}', `${branch}/`) : file.dest.replace('{branch}', '')
    tests.push(await fileExists(dest, bucket))
  }
  console.log(tests)
  return tests.filter(test => test).length === tests.length
}

async function fileExists (key, bucket) {
  const params = {
    Bucket: bucket,
    Key: key
  }
  let response = true
  await s3.headObject(params).promise().catch(() => {
    response = false
  })
  return response
}

async function emptyS3Directory (bucket, dir) {
  const listParams = {
    Bucket: bucket,
    Prefix: dir
  }
  const listedObjects = await s3.listObjectsV2(listParams).promise()
  if (listedObjects.Contents.length === 0) return
  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: [] }
  }
  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key })
  })
  await s3.deleteObjects(deleteParams).promise()
  if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir)
}
