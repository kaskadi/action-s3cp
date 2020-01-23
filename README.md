<!-- **GitHub Actions workflows status**

![](https://img.shields.io/github/workflow/status/kaskadi/action-s3cp/testing?label=test)
![](https://img.shields.io/github/workflow/status/kaskadi/action-s3cp/publish?label=publish) -->
**CodeClimate**

![](https://img.shields.io/codeclimate/maintainability/kaskadi/action-s3cp)
![](https://img.shields.io/codeclimate/tech-debt/kaskadi/action-s3cp)
<!-- ![](https://img.shields.io/codeclimate/coverage/kaskadi/action-s3cp) -->

**LGTM**

[![](https://img.shields.io/lgtm/grade/javascript/github/kaskadi/action-s3cp)](https://lgtm.com/projects/g/kaskadi/action-s3cp/?mode=list)

****

# What is this action for?

It allows you to upload files to a given S3 bucket.

# How to use it?

You can use the following code as a new _GitHub Actions Workflow_:

```
name: YOUR-ACTION-NAME
on: [YOUR-ACTION-EVENT]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Upload files to S3 bucket
      uses: kaskadi/action-s3cp@master
      env:
        AWS_KEY_ID: ${{ secrets.AWS_KEY_ID }}
        AWS_KEY_SECRET: ${{ secrets.AWS_KEY_SECRET }}
```

Before trying to trigger your new workflow, please set both `AWS_KEY_ID` and `AWS_KEY_SECRET` in the secrets of your repository.
Those credentials are the ones giving programmatic access to an AWS IAM role which can put objects to S3.
