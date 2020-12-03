const appendPath = require('./append-path.js')

module.exports = upload

// functions are written as async here to make sure that the .catch() statement at the higher level gets triggered in case an error occur before the returned promises

async function upload (utils, data) {
  const { fs } = utils
  const isDirectory = fs.lstatSync(data.src).isDirectory()
  if (isDirectory) {
    return Promise.all(fs.readdirSync(data.src).map(file => {
      const uploadData = {
        src: `${appendPath(data.src)}${file}`,
        dest: `${appendPath(data.dest)}${file}`
      }
      return upload(utils, uploadData)
    }))
  } else {
    return uploadFile(utils, data)
  }
}

async function uploadFile ({ s3, fs, mime, log }, data) {
  log(`INFO: uploading file ${data.src} to S3 at ${data.dest}...`)
  const bucket = process.env.BUCKET
  const params = {
    Body: fs.readFileSync(data.src),
    Bucket: bucket,
    Key: data.dest,
    ContentType: mime.lookup(data.src)
  }
  return s3.putObject(params).promise()
    .then(() => {
      log(`SUCCESS: ${data.src} successfully uploaded at ${data.dest} in ${bucket}!`)
    })
}
