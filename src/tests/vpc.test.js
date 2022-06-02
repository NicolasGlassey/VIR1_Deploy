/**
 * @file      igw.test.js
 * @brief     This class is designed to test the behaviour of a VPC (Virtual Private Cloud).
 * @author    Mathieu Rabot
 * @version   11-05-2022 - original (dedicated to VIR1)
 *
 */

"use strict";

const VpcHelper = require('../vpc/VpcHelper.js');
const VpcNotFoundException = require("../vpc/VpcNotFoundException.js");
const VpcTagNameAlreadyExistsException = require("../vpc/VpcTagNameAlreadyExistsException");

let vpcHelper;
let vpcName;
let vpcCidr;
let region;

beforeEach(() => {
    region = "myregion";
    vpcHelper = new VpcHelper(region);
    vpcName = "VPC_TEST";
    vpcCidr = "10.0.0.0/16";
})

test("create_CreateNewVpc_Success", async () => {
    //given


    //when
    await vpcHelper.create(vpcName, vpcCidr);

    //then
    expect(await vpcHelper.exists(vpcName)).toBe(true);
});

test("delete_DeleteVpc_Success", async () => {
    //given
    //TODO add assertion exists

    //when
    await vpcHelper.delete(vpcName);

    //then
    expect(await vpcHelper.exists(vpcName)).toBe(false);
});

test("create_VpcAlreadyExists_ThrowException", async () => {
    //given
    await vpcHelper.create(vpcName, vpcCidr)

    //when
    await expect(vpcHelper.create(vpcName, vpcCidr)).rejects.toThrow(VpcTagNameAlreadyExistsException);

    //then
    //Exception is thrown
});

test("delete_VpcNotFound_ThrowException", async () => {
    //given
    //TODO NGY - add assert if exists == false

    //when
    await expect(vpcHelper.delete("VPC_TEST_NOT_FOUND")).rejects.toThrow(VpcNotFoundException);

    //then
    //Exception is thrown
});

afterEach(() => {
    //TODO NGY test if the vpc exists before delete attempt (avoid throwing an exception)
    vpcHelper.delete("VPC_TEST_NOT_DELETABLE");
    vpcHelper.delete("VPC_TEST");
});



