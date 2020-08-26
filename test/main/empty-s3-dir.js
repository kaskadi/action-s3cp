module.exports = emptyS3Directory

function emptyS3Directory (s3, bucket, dir) {
  return async () => {
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
    if (listedObjects.IsTruncated) await emptyS3Directory(s3, bucket, dir)
  }
}
