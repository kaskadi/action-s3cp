const appendPath = require('./append-path.js')

module.exports = upload

function upload (s3, fs, bucket, mime, data) {
  const isDirectory = fs.lstatSync(data.src).isDirectory()
  if (isDirectory) {
    return Promise.all(fs.readdirSync(data.src).map(file => {
      const uploadData = {
        src: `${appendPath(data.src)}${file}`,
        dest: `${appendPath(data.dest)}${file}`
      }
      return upload(s3, fs, bucket, mime, uploadData)
    }))
  } else {
    return uploadFile(s3, fs, bucket, mime, data)
  }
}

function uploadFile (s3, fs, bucket, mime, data) {
  const params = {
    Body: fs.readFileSync(data.src),
    Bucket: bucket,
    Key: data.dest,
    ContentType: mime.lookup(data.src)
  }
  return s3.putObject(params).promise()
}
