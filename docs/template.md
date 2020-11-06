[![Build status](https://img.shields.io/github/workflow/status/kaskadi/action-s3cp/build?label=build&logo=mocha)](https://github.com/kaskadi/action-s3cp/actions?query=workflow%3Abuild)
[![Static code analysis status](https://img.shields.io/github/workflow/status/kaskadi/action-s3cp/analyze-code?label=codeQL&logo=github)](https://github.com/kaskadi/action-s3cp/actions?query=workflow%3Aanalyze-code)
[![Docs generation status](https://img.shields.io/github/workflow/status/kaskadi/action-s3cp/generate-docs?label=docs&logo=read-the-docs)](https://github.com/kaskadi/action-s3cp/actions?query=workflow%3Agenerate-docs)

**CodeClimate**

[![](https://img.shields.io/codeclimate/maintainability/kaskadi/action-s3cp?label=maintainability&logo=Code%20Climate)](https://codeclimate.com/github/kaskadi/action-s3cp)
[![](https://img.shields.io/codeclimate/tech-debt/kaskadi/action-s3cp?label=technical%20debt&logo=Code%20Climate)](https://codeclimate.com/github/kaskadi/action-s3cp)
[![](https://img.shields.io/codeclimate/coverage/kaskadi/action-s3cp?label=test%20coverage&logo=Code%20Climate)](https://codeclimate.com/github/kaskadi/action-s3cp)

***

{{>main}}
---

**Upload configuration:**

In order to tell the action which file to upload to S3, you need to add the following field into your `package.json` file (root level):
```json
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