/* eslint-env mocha */
process.chdir('test')
if (!process.env.GITHUB_ACTION) {
  require('dotenv').config()
}
const AWS = require('aws-sdk')
const init = require('./helpers/init.js')
const fileExists = require('./helpers/file-exists.js')
const emptyS3Directory = require('./helpers/empty-s3-dir.js')
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
      await emptyS3Directory(s3, bucket, 'action-s3cp-test/')
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
      await emptyS3Directory(s3, bucket, 'action-s3cp-test/')
    })
  })
})

function tests (placeHolder) {
  it('should direct upload files', async () => {
    const test = await fileExists(s3, `action-s3cp-test/${placeHolder}test.txt`, bucket)
    test.should.equal(true)
  })
  it('should rename files accordingly', async () => {
    const testNew = await fileExists(s3, `action-s3cp-test/${placeHolder}new.txt`, bucket)
    const testOld = await fileExists(s3, `action-s3cp-test/${placeHolder}old.txt`, bucket)
    testNew.should.equal(true)
    testOld.should.equal(false)
  })
  it('should upload folders', async () => {
    const testFolderKeys = ['test.txt', 'test/', 'test/test.txt']
    const tests = await Promise.all(testFolderKeys.map(key => fileExists(s3, `action-s3cp-test/${placeHolder}test/${key}`, bucket)))
    const test = tests.filter(test => test).length === tests.length
    test.should.equal(true)
  })
}
