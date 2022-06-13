/**
 * @file     subnetHelper.test.js
 * @brief    This class is designed to test the behaviour of a Subnet.
 * @author   Mathieu Rabot
 * @version  13-06-2022 - original (dedicated to VIR1)
 */

const SubnetHelper = require("../subnet/subnetHelper.js");

let subnetHelper;
let subnetName;

beforeEach(() => {
    subnetHelper = new SubnetHelper("eu-west-3");
    subnetName = "Subnet_TEST_Deploy";
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