import { EC2Client } from "@aws-sdk/client-ec2";
import { RDSClient } from "@aws-sdk/client-rds";

let aws = {};

function configure({ accessKeyId, secretAccessKey, region }) {
  let config = {
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region,
  };
  aws["ec2"] = new EC2Client(config);
  aws["rds"] = new RDSClient(config);
}

aws["configure"] = configure;

export default (context, inject) => {
  inject("aws", aws);
};
