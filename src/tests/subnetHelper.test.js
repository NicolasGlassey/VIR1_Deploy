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

beforeAll(() => {
    vpcHelper = new VpcHelper("eu-west-3");
    subnetHelper = new SubnetHelper("eu-west-3");

    subnetName = "Subnet_Deploy_Test";
    subnetCidr = "10.0.0.0/24";
    availabilityZone = "eu-west-3a";

    vpcName = "VPC_Deploy_Test";
    vpcCidr = "10.0.0.0/16";
})

beforeEach(() => {
    if( !await vpcHelper.exists(vpcName))
    {
        await vpcHelper.create(vpcName, vpcCidr);
    }
})

test("exists_Found_Success", async () => {
    // given
    // refer to before each method    
    
    // when
    await subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone);

    // then
    expect(await subnetHelper.exists(subnetName)).toEqual(true);
})

test("exists_NotFound_Success", async () => {
    // given
    // refer to before each method

    // when

    // then
    expect(await subnetHelper.exists(subnetName)).toEqual(false);
})

test("create_NominalCase_Success", async () => {
    // given
    // refer to before each method

    // when
    await subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone);

    // then
    expect(await subnetHelper.exists(subnetName)).toEqual(true);
})

test("create_NameNotAvailable_ThrowException", async () => {
    // given
    // refer to before each method
    await subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone);

    // when
    await expect(subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone)).rejects.toThrow(SubnetNameNotAvailableException);

    // then
    // Exception thrown
})

/**
 * @brief Test if the subnet can be deleted
 * @exception SubnetNotFoundException
 */
test("delete_NotFound_ThrowException", async () => {
    // given
    let notExistSubnet = "not-exists";

    // when
    await expect(subnetHelper.delete(notExistSubnet)).rejects.toThrow(SubnetNotFoundException);

    // then
    // Exception thrown
})

/**
 * @brief Test if the subnet can be deleted
 */
test("delete_NominalCase_Success", async () => {
    // given
    // refer to before each method
    await subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone);

    // when
    await subnetHelper.delete(subnetName);

    // then
    expect(await subnetHelper.exists(subnetName)).toEqual(false);
})

afterEach(async () => {
    if(await subnetHelper.exists(subnetName))
    {
        await subnetHelper.delete(subnetName);
    }
    if (await vpcHelper.exists(vpcName))
    {
        await vpcHelper.delete(vpcName);
    }
})
