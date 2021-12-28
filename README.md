# Awsome Doctor

> Powered by [electron-nuxt](https://github.com/michalzaq12/electron-nuxt).

A desktop application that helps you to trouble shoot your AWS environment issues.

## Features

- Support local AWS credentials.
  - Profile files in `~/.aws/`
  - Environment variables.
  - You can also manually input temporary credentials, which will not be stored.
- YAML format workflow file.
  - You don't need to have web skills to create a new workflow.
- Markdown format output.
  - External links, titles, styled fonts, codes, etc.
- Built-in responsive workflow editor.
  - Code format.
  - Syntax highlight.

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

You can use the built-in editor to generate new workflows or edit existing workflows.

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
  res = await $.aws.ec2.send(/* ... */);
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
  // AWS JavaScript SDK v3 service client
  aws: {
    ec2: Object, // EC2 client
    rds: Object, // RDS client
    ...
  },

  // The data you defined in your workflow file.
  data: { ... },

  // Json path, see https://github.com/dchester/jsonpath
  jp,

  // output
  err: "",
  info: "",
  ok: "",

  // AWS JavaScript SDK v3
  ... {
    ec2,
    rds,
    ...
  }
};
```

Examples:

```js
// call AWS
let res = await $.aws.ec2.send(
  new $.ec2.DescribeInstanceStatusCommand({
    InstanceIds: [$.data.instanceId],
  })
);

// using json path
let publicIps = $.jp.query(res, "$..PrivateIpAddresses..PublicIp");

// output
$.err += "error";
$.info += "info";
$.ok += "ok";
```

### Output

The output is rendered using `result.err || result.info || result.ok`, which means if your `$.err` is not empty, the output will not contain `$.info` and `$.ok`.

The output is rendered as Markdown if your output starts with `/md\n`:

```js
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
```
