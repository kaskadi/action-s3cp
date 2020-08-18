/* eslint-env mocha */
process.chdir('test')
const AWS = require('aws-sdk')
const childProc = require('child_process')
const bucket = process.env.BUCKET
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_KEY_SECRET
})
const chai = require('chai')
chai.should()

describe('action-s3cp', function () {
  this.timeout(10000)
  describe('uploads files to the correct location when branch is master', () => {
    const ref = 'ref:head/master'
    const refs = ref.split('/')
    const placeHolder = refs[refs.length - 1] === 'master' ? '' : `${refs[refs.length - 1]}/`
    before(async () => {
      process.env.GITHUB_REF = ref
      await init()
    })
    tests(placeHolder)
    after(async () => {
      await emptyS3Directory(bucket, 'action-s3cp-test/')
    })
  })
  describe('uploads files to the correct location when branch is NOT master', () => {
    const ref = 'ref:head/release/v1.0.0'
    const refs = ref.split('/')
    const placeHolder = refs[refs.length - 1] === 'master' ? '' : `${refs[refs.length - 1]}/`
    before(async () => {
      process.env.GITHUB_REF = ref
      await init()
    })
    tests(placeHolder)
    after(async () => {
      await emptyS3Directory(bucket, 'action-s3cp-test/')
    })
  })
})

async function init () {
  await execMain()
  await new Promise(resolve => setTimeout(resolve, 1500))
}

function execMain () {
  return new Promise((resolve, reject) => {
    childProc.exec('node ../index.js', (err, stdout, stderr) => {
      if (err === null) {
        console.log(stdout)
        resolve(true)
      } else {
        console.log(stderr)
        resolve(false)
      }
    })
  })
}

function tests (placeHolder) {
  it('should direct upload files', async () => {
    const test = await fileExists(`action-s3cp-test/${placeHolder}test.txt`, bucket)
    test.should.equal(true)
  })
  it('should rename files accordingly', async () => {
    const testNew = await fileExists(`action-s3cp-test/${placeHolder}new.txt`, bucket)
    const testOld = await fileExists(`action-s3cp-test/${placeHolder}old.txt`, bucket)
    testNew.should.equal(true)
    testOld.should.equal(false)
  })
  it('should upload folders', async () => {
    const testFolderKeys = ['test.txt', 'test/', 'test/test.txt']
    const tests = await Promise.all(testFolderKeys.map(key => fileExists(`action-s3cp-test/${placeHolder}test/${key}`, bucket)))
    const test = tests.filter(test => test).length === tests.length
    test.should.equal(true)
  })
}

function fileExists (key, bucket) {
  const params = {
    Bucket: bucket,
    Delimiter: '/',
    Prefix: key
  }
  return s3.listObjectsV2(params).promise().then(res => res.Contents.length > 0)
    .catch(err => {
      console.log(err)
      return false
    })
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
