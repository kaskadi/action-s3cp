/* eslint-env mocha */
if (!process.env.GITHUB_ACTION) {
  require('dotenv').config({ path: `${process.cwd()}/test/.env` })
}

describe('action-s3cp', function () {
  // ******* DO NOT REMOVE THIS TEST!
  require('./pre/tests.js')
  // *******
  require('./main/tests.js')
})
