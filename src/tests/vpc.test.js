/**
 * @file      igw.test.js
 * @brief     This class is designed to test the behaviour of a VPC (Virtual Private Cloud).
 * @author    Mathieu Rabot
 * @version   11-05-2022 - original (dedicated to VIR1)
 *
 */

"use strict";

const config = require('../config.js');
const VpcManager = require("../vpc/Vpc.js");
const VpcException = require("../vpc/VpcException.js");
const VpcNotFoundException = require("../vpc/VpcNotFoundException.js");
const VpcAlreadyExistsException = require("../vpc/VpcAlreadyExistsException");
const VpcNotDeletableException = require("../vpc/VpcNotDeletableException");

let vpcManager;



beforeAll(() => {
    // Load credentials and set region from JSON file
    // You have to set your region here
    vpcManager = new VpcManager();
})

/*beforeEach(() =>{
    // Create a new VPC
    vpc = vpcManager.create( "VPC_TEST", "10.0.0.0/16");
})*/

/**
 * @brief   Test the creation of a VPC
 */
test("create_CreateNewVpc_Success", async () => {
    //given
    let vpcName = "VPC_TEST";
    let cidr = "10.0.0.0/16";
    //when
    let vpc = await vpcManager.createVpc(vpcName, cidr);
    //then



});

// /**
//  * @brief   Test the creation of a VPC with a name already used
//  */
// test("create_CreateNewVpc_VpcAlreadyExistsException", async () => {
//     //given
//     let vpcName = "VPC_TEST";
//     let vpcCidr = "10.0.0.0/16";
//     //when
//     //then
//     expect(() => vpcManager.create(vpcName, vpcCidr)).toThrow(VpcAlreadyExistsException);
// });
//
// /**
//  * @brief Test if a vpc exists with a given name
//  */
// test("exists_VpcExists_Success", async () => {
//     //given
//     let vpcName = "VPC_TEST";
//     //when
//     //then
//     expect(vpcManager.exists(vpcName)).toBe(true);
// });
//
// /**
//  * @brief Test if a vpc exists with a given name
//  */
// test("exists_VpcExists_VpcNotFoundException", async () => {
//     //given
//     //when
//     //then
//     expect(() => vpcManager.exists("VPC_TEST_NOT_FOUND")).toThrow(VpcNotFoundException);
// });
//
// /**
//  * @brief Test if a vpc can be deleted
//  */
// test("deleteVpc_DeleteVpc_Success", async () => {
//     //given
//     let vpcName = "VPC_TEST";
//     //when
//     //then
//     expect(() => vpcManager.deleteVpc(vpcName)).not.toThrow();
// });


/*afterEach(() => {
    // Delete the VPC created
    vpcManager.deleteVpc("VPC_TEST");
});*/








