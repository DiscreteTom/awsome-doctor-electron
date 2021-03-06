# **This repo is deprecated.**

See [awsome-doctor](https://github.com/DiscreteTom/awsome-doctor) and [awsome-doctor-view](https://github.com/DiscreteTom/awsome-doctor-view) instead.

# Awsome Doctor

> Powered by [electron-nuxt](https://github.com/michalzaq12/electron-nuxt).

A desktop application that helps you to trouble shoot your AWS environment issues.

## Features

- Support local AWS credentials.
  - Profile files in `~/.aws/`
  - Environment variables.
  - You can also manually input temporary credentials, which will not be stored.
- YAML format workflow file.
  - You don't need to have web/frontend skills to create a new workflow.
  - Use URL to open external workflows.
- Markdown format output.
  - External links, titles, styled fonts, codes, etc.
- Built-in responsive workflow editor.
  - Code format.
  - Syntax highlight.
- Custom HTTP request powered by axios.
- Modularization.

## Build Setup

```bash
# install dependencies
yarn install

# serve app with hot reload
yarn dev

# build electron application for production
yarn build
```

## Write a Workflow

### File Structure

> The built-in editor is preferred to generate or edit workflow files, so you don't have to learn how to write YAML files.

A workflow consists of 4 parts in a yaml file:

```yaml
title: Can't ping EC2 instance from the Internet.

# you can define data that you need to use across steps
# or accept user input
data:
  instanceId: "" # format: `key: default value`

input:
  - label: Instance ID
    placeholder: i-01234567891234567
    # this input will be stored in the data named `instanceId`
    store: instanceId

steps:
  - name: Instance status check.
    js: | # multiline string
      $.ok = "OK"
```

### Eval the Code

The `js` code in steps is a JavaScript async function body. The content will be run by:

```js
await eval(`
  (async () => {
    ${step.js}
  })()
`);
```

Which means you can use `return` to stop running, and use `await` inside the code block:

```js
let res;
try {
  // call async function
  res = await $.aws.ec2.describeInstanceStatus({});
} catch (e) {
  $.err = e;
  // stop running
  return;
}
// process res
// ...
```

### Context

You can access a context variable `$` in your JavaScript code. The context variable contains the following members:

```js
let $ = {
  // AWS JavaScript SDK V3, see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html
  aws: {
    ec2: Object, // EC2 client
    rds: Object, // RDS client
    ...

    EC2, // EC2 SDK
    RDS, // RDS SDK
    ...
  },

  // The data you defined in your workflow file.
  data: { ... },

  // Json path, see https://github.com/dchester/jsonpath
  jp,

  // js-yaml, see https://github.com/nodeca/js-yaml
  yaml,

  // HTTP client, see https://github.com/axios/axios
  axios,

  // output
  err: "",
  info: "",
  ok: "",

  // util functions in `src/workflow-utils/` folder
  utils: { ... },

  // stop executing remaining workflows
  stop: false,
};
```

Examples:

```js
// call AWS
let res = await $.aws.ec2.describeInstanceStatus({
  InstanceIds: [$.data.instanceId],
});

// http request
let res = await $.axios.get("https://examples.com");

// dump object as YAML
$.yaml.dump(res);

// using json path
let publicIps = $.jp.query(res, "$..PrivateIpAddresses..PublicIp");

// output
$.err += "error";
$.info += "info";
$.ok += "ok";

// use util functions
await $.utils.securityGroup.checkEC2Instances({
  $,
  instanceIds: ['i-1234567890']
  direction: "in",
  protocol: "tcp",
  port: 22,
});

// stop workflow
$.stop = true;
```

### Output

- `ok` means users **don't** need to check this step's output.
- `info` means users need to check the output **manually**.
- `err` means there **must** be something wrong.

The output is rendered using `result.err || result.info || result.ok`, which means if your `$.err` is not empty, the output will not contain `$.info` and `$.ok`.

The output is rendered as Markdown if your output starts with `/md\n`:

```js
// use multiline string
$.ok = `/md
# title

## subtitle

> Ref.

**Bold**, *italic*, \`inline code\`, [external link](https://aws.amazon.com).

\`\`\`js
// code block
let a = 1;
console.log(123);
\`\`\`
`;

// use normal string
$.ok = "/md\n# Markdown";
```

### Modularization

> External workflows might be **dangerous** since your AK/SK can be retrieved through `await $.aws.ec2.config.credentials()`.

There are some approaches to reuse external or 3rd party code:

```js
// use standard util functions in `$.utils`
// you can find those util functions in `src/workflow-utils/`
$.utils.securityGroup.checkEC2Instances(...);

// use http request to retrieve 3rd party code
eval(await $.axios.get("https://example.com"));

// use steps from other workflow
let res = await $.axios.get("https://example.com/some-workflow.yml");
let workflow = $.yaml.load(res.data);
await eval(`
  (async () => {
    ${workflow.steps[0]}
  })()
`);
```

### Multi-region or Multi-account

> For simple usage, you can set a default region and default AWS profile in Settings page. Whenever you change those settings, all AWS service clients will be recreated and you can access those clients by `$.aws`.

If you need to access multiple region or multi account, you can create your own service client. E.g.:

```js
// retrieve current credentials
let credentials = await $.aws.ec2.config.credentials();

// construct config with new credentials or region code
let config = {
  credentials,
  region: "us-east-2",
};

// create your own service client and stored in your workflow data
$.data.myEc2 = new $.aws.EC2(config);
```

### [CHANGELOG](https://github.com/DiscreteTom/awsome-doctor-electron/blob/main/CHANGELOG.md)
