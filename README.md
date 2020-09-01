[![Build status](https://img.shields.io/github/workflow/status/kaskadi/action-s3cp/build?label=build&logo=mocha)](https://github.com/kaskadi/action-s3cp/actions?query=workflow%3Abuild)

**CodeClimate**

[![](https://img.shields.io/codeclimate/maintainability/kaskadi/action-s3cp?label=maintainability&logo=Code%20Climate)](https://codeclimate.com/github/kaskadi/action-s3cp)
[![](https://img.shields.io/codeclimate/tech-debt/kaskadi/action-s3cp?label=technical%20debt&logo=Code%20Climate)](https://codeclimate.com/github/kaskadi/action-s3cp)
[![](https://img.shields.io/codeclimate/coverage/kaskadi/action-s3cp?label=test%20coverage&logo=Code%20Climate)](https://codeclimate.com/github/kaskadi/action-s3cp)

**LGTM**

[![](https://img.shields.io/lgtm/grade/javascript/github/kaskadi/action-s3cp?label=code%20quality&logo=lgtm)](https://lgtm.com/projects/g/kaskadi/action-s3cp/?mode=list)

***

# What is this action for?

This action allows you to upload files to a given S3 bucket.

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
    - name: {YOUR-STEP-NAME}
      uses: kaskadi/action-s3cp@master
      env:
        AWS_KEY_ID: {AWS_KEY_ID-VALUE}
        AWS_KEY_SECRET: {AWS_KEY_SECRET-VALUE}
        BUCKET: {BUCKET-VALUE}
```

**Note:** everything contained in single curly brackets (`{ }`) needs to be replaced by your desired values

**Environment variables:**
|     Variable     | Required | Description                                                                                                                                                                           |
| :--------------: | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|   `AWS_KEY_ID`   |  `true`  | ID of a programmatic access AWS key attached to an IAM role which has permission to put an object into your target S3 bucket. **Recommend implementing into repository secrets!**     |
| `AWS_KEY_SECRET` |  `true`  | Secret of a programmatic access AWS key attached to an IAM role which has permission to put an object into your target S3 bucket. **Recommend implementing into repository secrets!** |
|     `BUCKET`     |  `true`  | Target bucket for file upload. For upload configuration, see below.                                                                                                                   |

---

**Upload configuration:**

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

_Notes:_
- uploading a folder will always do a recursive upload
- the placeholder `{branch}` is removed if the action is triggered from `master` or replaced by the current version if the action is triggered from `release/vx.x.x`