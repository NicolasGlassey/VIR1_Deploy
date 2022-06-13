/**
 * @file     subnetHelper.test.js
 * @brief    This class is designed to test the behaviour of a Subnet.
 * @author   Mathieu Rabot
 * @version  13-06-2022 - original (dedicated to VIR1)
 */

const SubnetHelper = require("../subnet/subnetHelper.js");
const VpcHelper = require("../vpc/VpcHelper");
const SubnetNameNotAvailableException = require("../subnet/SubnetNameNotAvailableException");
const SubnetNotFoundException = require("../subnet/SubnetNotFoundException");

let vpcHelper;
let subnetHelper;
let subnetName;
let vpcName;
let vpcCidr;
let subnetCidr;
let availabilityZone;

beforeEach(() => {
    vpcHelper = new VpcHelper("eu-west-3");
    subnetHelper = new SubnetHelper("eu-west-3");
    subnetName = "Subnet_TEST_Deploy";
    vpcName = "VPC_TEST_Deploy";
    vpcCidr = "10.0.0.0/16";
    subnetCidr = "10.0.0.0/24";
    availabilityZone = "eu-west-3a";
})

/**
 * @brief Test if the subnet exists
 */
test("exists_NotFound_Success", async () => {
    // given
    // refer to before each method

    // when

    // then
    expect(await subnetHelper.exists(subnetName)).toEqual(false);
})