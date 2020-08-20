![](https://img.shields.io/github/workflow/status/kaskadi/action-s3cp/update?label=dependencies%20updated&logo=npm)
![](https://img.shields.io/github/workflow/status/kaskadi/action-s3cp/testing?label=test&logo=mocha)

**CodeClimate**

[![](https://img.shields.io/codeclimate/maintainability/kaskadi/action-s3cp?label=maintainability&logo=Code%20Climate)](https://codeclimate.com/github/kaskadi/action-s3cp)
[![](https://img.shields.io/codeclimate/tech-debt/kaskadi/action-s3cp?label=technical%20debt&logo=Code%20Climate)](https://codeclimate.com/github/kaskadi/action-s3cp)
[![](https://img.shields.io/codeclimate/coverage/kaskadi/action-s3cp?label=test%20coverage&logo=Code%20Climate)](https://codeclimate.com/github/kaskadi/action-s3cp)

**LGTM**

[![](https://img.shields.io/lgtm/grade/javascript/github/kaskadi/action-s3cp?label=code%20quality&logo=lgtm)](https://lgtm.com/projects/g/kaskadi/action-s3cp/?mode=list)

***

# What is this action for?

It allows you to upload files to a given S3 bucket.

# How to use it?

You can use the following code as a new _GitHub Actions Workflow_:

```
name: {YOUR-ACTION-NAME}
on: [{YOUR-ACTION-EVENT}]
jobs:
  {YOUR-JOB-NAME}:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: {YOUR-STEP-name}
      uses: kaskadi/action-s3cp@master
      env:
        AWS_KEY_ID: ${{ secrets.AWS_KEY_ID }}
        AWS_KEY_SECRET: ${{ secrets.AWS_KEY_SECRET }}
        BUCKET: {YOUR-BUCKET-FOR-UPLOAD}
```

Before trying to trigger your new workflow, please set both `AWS_KEY_ID` and `AWS_KEY_SECRET` in the secrets of your repository.
Those credentials are the ones giving programmatic access to an AWS IAM role which can put objects to S3.

**Note:** everything contained in single curly brackets (`{ }`) needs to be replaced by your desired values

In order to tell the action which file to upload to S3, you need to add the following field into your `package.json` file (root level):
```
"kaskadi": {
  "s3-push": {
    "files": [
      {
        "src": "file1.ext",
        "dest": "path/to/{branch}file1.ext"
      },
      {
        "src": "path/to/file2.ext",
        "dest": "path/to/{branch}where/is/file2.ext"
      },
      {
        "src": "folder1/",
        "dest": "path/to/folder1/"
      }
    ]
  }
}
```

**Notes:**
- uploading a folder will always do a recursive upload
- the placeholder `{branch}` is removed if the action is triggered from `master` or replaced by the current version if the action is triggered from `release/vx.x.x`
