import { S3 } from "@aws-sdk/client-s3";
import { EC2 } from "@aws-sdk/client-ec2";
import { RDS } from "@aws-sdk/client-rds";
import { ElasticLoadBalancingV2 } from "@aws-sdk/client-elastic-load-balancing-v2";

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
  aws["s3"] = new S3(config);
  aws["rds"] = new RDS(config);
  aws["elbv2"] = new ElasticLoadBalancingV2(config);
}

aws["configure"] = configure;

export default (context, inject) => {
  inject("aws", aws);
};
