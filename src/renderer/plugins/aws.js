import { EC2 } from "@aws-sdk/client-ec2";
import { RDS } from "@aws-sdk/client-rds";

let aws = {};

function configure({ accessKeyId, secretAccessKey, region }) {
  let config = {
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region,
  };
  aws["ec2"] = new EC2(config);
  aws["rds"] = new RDS(config);
}

aws["configure"] = configure;

export default (context, inject) => {
  inject("aws", aws);
};
