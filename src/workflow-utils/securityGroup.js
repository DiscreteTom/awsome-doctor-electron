/**
 * This file contains the util functions in `$.utils.securityGroup`
 */

/**
 * ## Params
 *
 * - `$`: context
 * - `instanceIds`: A **list** of EC2 instance id
 * - `direction`: `'in'`/`'out'`
 * - `protocol`: e.g. `'tcp'`/`'udp'`/`'icmp'`
 * - `port`: e.g. `22`
 *
 * ## Return
 *
 * ```
 * {
 *   err,
 *   anyTrafficPeer: {
 *     type: 'any|cidr|no',
 *     cidr: [], // if type == 'cidr'
 *   },
 *   portPeer: {
 *     type: 'any|cidr|no',
 *     cidr: [], // if type == 'cidr'
 *   }
 * }
 * ```
 */
async function checkEC2Instances({
  $,
  instanceIds,
  direction,
  protocol,
  port,
}) {
  let securityGroupIds;
  try {
    let res = await $.aws.ec2.describeInstances({ InstanceIds: instanceIds });
    securityGroupIds = $.jp.query(res, "$..SecurityGroups[*].GroupId");
  } catch (err) {
    return { err };
  }

  return await checkPort({ $, direction, securityGroupIds, protocol, port });
}

/**
 * ## Params
 *
 * - `$`: context
 * - `direction`: `'in'`/`'out'`
 * - `securityGroupIds`: A **list** of security group id
 * - `protocol`: e.g. `'tcp'`/`'udp'`/`'icmp'`
 * - `port`: e.g. `22`
 *
 * ## Return
 *
 * ```
 * {
 *   err,
 *   anyTrafficPeer: {
 *     type: 'any|cidr|no',
 *     cidr: [], // if type == 'cidr'
 *   },
 *   portPeer: {
 *     type: 'any|cidr|no',
 *     cidr: [], // if type == 'cidr'
 *   }
 * }
 * ```
 */
async function checkPort({ $, direction, securityGroupIds, protocol, port }) {
  let res;
  let result = {};
  try {
    res = await $.aws.ec2.describeSecurityGroups({
      GroupIds: securityGroupIds,
    });
  } catch (err) {
    return { err };
  }

  let anyTrafficPeer = allowAnyPeer({
    cidrs: getAnyTrafficCidrs({ $, res, direction }),
  });

  if (anyTrafficPeer.type == "any") {
    return { anyTrafficPeer };
  } else {
    result.anyTrafficPeer = anyTrafficPeer;
  }

  result.portPeer = allowAnyPeer({
    cidrs: getPortCidr({ $, res, direction, protocol, port }),
  });
  return result;
}

/**
 * ## Params
 *
 * - `$`: context
 * - `res`: the response of `describeSecurityGroups`, see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/describesecuritygroupscommandoutput.html
 * - `direction`: `'in'`/`'out'`
 *
 * ## Return
 *
 * A list of CIDR. E.g.: `['0.0.0.0/0', '192.168.0.0/16']`.
 */
function getAnyTrafficCidrs({ $, res, direction }) {
  return $.jp.query(
    res,
    `$..${
      direction == "in" ? "IpPermissions" : "IpPermissionsEgress"
    }[?(@.IpProtocol=='-1')]..CidrIp`
  );
}

/**
 * ## Params
 *
 * - `cidrs`: A list of CIDR, e.g. `['0.0.0.0/0', '192.168.0.0'16']`.
 *
 * ## Return
 *
 * ```
 * {
 *   type: 'any|cidr|no',
 *   cidr: ['192.168.0.0/16'], // if type == 'cidr'
 * }
 * ```
 */
function allowAnyPeer({ cidrs }) {
  if (cidrs.length === 0) {
    return { type: "no" };
  } else {
    if (cidrs.indexOf("0.0.0.0/0" != -1)) {
      return { type: "any" };
    } else {
      return { type: "cidr", cidr: cidrs };
    }
  }
}

/**
 * ## Params
 *
 * - `$`: context
 * - `res`: the response of `describeSecurityGroups`, see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/describesecuritygroupscommandoutput.html
 * - `direction`: `'in'`/`'out'`
 * - `protocol`: `'tcp'`/`'ucp'`/`'icmp'`
 * - `port`
 *
 * ## Return
 *
 * A list of CIDR. E.g.: `['0.0.0.0/0', '192.168.0.0/16']`.
 */
function getPortCidr({ $, res, direction, protocol, port }) {
  return $.jp.query(
    res,
    `$..${
      direction == "in" ? "IpPermissions" : "IpPermissionsEgress"
    }[?(@.IpProtocol=='${protocol}' && (@.FromPort==${port} || @.FromPort==-1))]..CidrIp`
  );
}

module.exports = {
  checkPort,
  getAnyTrafficCidrs,
  allowAnyPeer,
  getPortCidr,
  checkEC2Instances,
};
