/* eslint-env mocha */
const init = require('./init.js')
const fileExists = require('./file-exists.js')
const emptyS3Directory = require('./empty-s3-dir.js')
const AWS = require('aws-sdk')
const bucket = process.env.BUCKET
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_KEY_SECRET
})
const chai = require('chai')
chai.should()

describe('uploads files to the correct location when branch is master', function () {
  this.timeout(30000)
  const ref = 'ref:head/master'
  before(init(ref))
  tests(getPlaceholder(ref))
  after(emptyS3Directory(s3, bucket, 'action-s3cp-test/'))
})
describe('uploads files to the correct location when branch is NOT master', function () {
  this.timeout(30000)
  const ref = 'ref:head/release/v1.0.0'
  before(init(ref))
  tests(getPlaceholder(ref))
  after(emptyS3Directory(s3, bucket, 'action-s3cp-test/'))
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

function getPlaceholder (ref) {
  const refs = ref.split('/')
  return refs[refs.length - 1] === 'master' ? '' : `${refs[refs.length - 1]}/`
}
