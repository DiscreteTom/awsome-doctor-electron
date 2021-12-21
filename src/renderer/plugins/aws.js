import { EC2Client } from "@aws-sdk/client-ec2";

let aws = {};

function configure({ accessKeyId, secretAccessKey, region }) {
  aws["ec2"] = new EC2Client({
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region,
  });
}

aws["configure"] = configure;

export default (context, inject) => {
  inject("aws", aws);
};
