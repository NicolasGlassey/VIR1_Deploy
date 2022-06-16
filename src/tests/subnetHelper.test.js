/**
 * @file     subnetHelper.test.js
 * @brief    This class is designed to test the behaviour of a Subnet.
 * @author   Mathieu Rabot
 * @version  13-06-2022 - original (dedicated to VIR1)
 */

const SubnetHelper = require("../subnet/SubnetHelper.js");
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

/**
 * @brief Test if the subnet exists
 */
test("exists_Found_Success", async () => {
    // given
    await vpcHelper.create(vpcName, vpcCidr);
    await subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone);

    // when

    // then
    expect(await subnetHelper.exists(subnetName)).toEqual(true);
})

/**
 * @brief Test if the subnet can be created
 */
test("create_NominalCase_Success", async () => {
    // given

    // when
    await vpcHelper.create(vpcName, vpcCidr);
    await subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone);

    // then
    expect(await subnetHelper.exists(subnetName)).toEqual(true);
})

/**
 * @brief Test if the subnet already has been created
 * @exception SubnetNameNotAvailableException
 */
test("create_NameNotAvailable_ThrowException", async () => {
    // given
    await vpcHelper.create(vpcName, vpcCidr);
    await subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone);

    // when

    // then
    await expect(subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone)).rejects.toThrow(SubnetNameNotAvailableException);
})

/**
 * @brief Test if the subnet can be deleted
 * @exception SubnetNotFoundException
 */
test("delete_NotFound_ThrowException", async () => {
    // given

    // when

    // then
    await expect(subnetHelper.delete(subnetName)).rejects.toThrow(SubnetNotFoundException);
})

/**
 * @brief Test if the subnet can be deleted
 */
test("delete_NominalCase_Success", async () => {
    // given
    await vpcHelper.create(vpcName, vpcCidr);
    await subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone);

    // when
    await subnetHelper.delete(subnetName);

    // then
    expect(await subnetHelper.exists(subnetName)).toEqual(false);
})

afterEach(async () => {
    try {
        await subnetHelper.delete(subnetName);
    } catch (e) {
        // do nothing
    }
    try {
        await vpcHelper.delete(vpcName);
    } catch (e) {
        // do nothing
    }

})
