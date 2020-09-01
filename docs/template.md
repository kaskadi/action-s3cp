[![Build status](https://img.shields.io/github/workflow/status/kaskadi/action-s3cp/build?label=build&logo=mocha)](https://github.com/kaskadi/action-s3cp/actions?query=workflow%3Abuild)

**CodeClimate**

[![](https://img.shields.io/codeclimate/maintainability/kaskadi/action-s3cp?label=maintainability&logo=Code%20Climate)](https://codeclimate.com/github/kaskadi/action-s3cp)
[![](https://img.shields.io/codeclimate/tech-debt/kaskadi/action-s3cp?label=technical%20debt&logo=Code%20Climate)](https://codeclimate.com/github/kaskadi/action-s3cp)
[![](https://img.shields.io/codeclimate/coverage/kaskadi/action-s3cp?label=test%20coverage&logo=Code%20Climate)](https://codeclimate.com/github/kaskadi/action-s3cp)

**LGTM**

[![](https://img.shields.io/lgtm/grade/javascript/github/kaskadi/action-s3cp?label=code%20quality&logo=lgtm)](https://lgtm.com/projects/g/kaskadi/action-s3cp/?mode=list)

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