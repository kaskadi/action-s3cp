module.exports = (s3, key, bucket) => {
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
