/**
 * @file      igw.test.js
 * @brief     This class is designed to test the behaviour of a VPC (Virtual Private Cloud).
 * @author    Mathieu Rabot
 * @version   11-05-2022 - original (dedicated to VIR1)
 *
 */

"use strict";

const config = require('../config.js');
const Vpc = require('../vpc/Vpc.js');
const VpcException = require("../vpc/VpcException.js");
const VpcNotFoundException = require("../vpc/VpcNotFoundException.js");
const VpcAlreadyExistsException = require("../vpc/VpcAlreadyExistsException");
const VpcNotDeletableException = require("../vpc/VpcNotDeletableException");
const VpcTagNameAlreadyExistsException = require("../vpc/VpcTagNameAlreadyExistsException");

let vpcManager;
let vpc;
let vpcName;
let vpcCidr;

beforeAll(() => {
    // Load credentials and set region from JSON file
    // You have to set your region here
    this.vpcManager = new Vpc();
    this.vpcName = "VPC_TEST";
    this.vpcCidr = "10.0.0.0/16";
})

/**
 * @brief   Test the creation of a VPC
 */
test("create_CreateNewVpc_Success", async () => {
    //given
    await this.vpcManager.create(this.vpcName, this.vpcCidr);
    //when
    //then
    expect(await this.vpcManager.exists(this.vpcName)).toBe(true);
    // expect(vpc.getName().toBe("VPC_TEST");

});

/**
 * @brief Test if a vpc can be deleted
 */
test("deleteVpc_DeleteVpc_Success", async () => {
    //given
    //when
    await this.vpcManager.delete(this.vpcName);
    //then
    expect(await this.vpcManager.exists(this.vpcName)).toBe(false);
});

/**
 * @brief Test if the vpc got the same name
 */
test("createVpc_VpcName_VpcAlreadyExistsException", async () => {
    //given
    await this.vpcManager.create(this.vpcName, this.vpcCidr)
    //when
    //then
     expect(this.vpcManager.create(this.vpcName, this.vpcCidr)).rejects.toThrow(VpcTagNameAlreadyExistsException);
});

/**
 * @brief Test if a vpc exists with a given name
 */
test("deleteVpc_VpcExists_VpcNotFoundException", async () => {
    //given
    //when
    //then
    expect(this.vpcManager.delete("VPC_TEST_NOT_FOUND")).rejects.toThrow(VpcNotFoundException);
});

// TODO : Test if a vpc throw an error after deletation if he is attached to a subnet

afterAll(() => {
    this.vpcManager.delete("VPC_TEST_NOT_DELETABLE");
    this.vpcManager.delete("VPC_TEST");
});

// /**
//  * @brief Test the vpc limit
//  */
// test("createVpc_VpcLimit_VpcAlreadyExistsException", async () => {
//     //given
//     let vpcName = "VPC_TEST";
//     //when
//     //then
//     expect(this.vpcManager.createVpc(this.vpcName, this.vpcCidr).rejects.toThrow(VpcAlreadyExistsException));
// });


// /**
//  * @brief   Test the creation of a VPC with a name already used
//  */
// test("create_CreateNewVpc_VpcAlreadyExistsException", async () => {
//     //given
//     let vpcName = "VPC_TEST";
//     let vpcCidr = "10.0.0.0/16";
//     //when
//     //then
//     expect(() => this.vpcManager.createVpc(vpcName, vpcCidr)).toThrow(VpcAlreadyExistsException);
 //});
// /**
//  * @brief Test if the vpc exists
//  */
// test("exists_VpcExists_Success", async () => {
//     //given
//     let vpcName = "VPC_TEST";
//     //when
//     //then
//     if(await this.vpcManager.getVpcId(vpcName) !== undefined) {
//         expect(true).toBe(true);
//     }
// });




