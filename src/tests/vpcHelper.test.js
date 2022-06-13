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
const VpcNameNotAvailableException = require("../vpc/VpcNameNotAvailableException");

let vpcHelper;
let vpcName;
let vpcCidr;

beforeEach(() => {
    vpcHelper = new VpcHelper("eu-west-3");
    vpcName = "VPC_TEST";
    vpcCidr = "10.0.0.0/16";
})



test("create_NominalCase_Success", async () => {
    //given

    //when
    await vpcHelper.create(vpcName, vpcCidr);

    //then
    expect(await vpcHelper.exists(vpcName)).toBe(true);
});

test("delete_NominalCase_Success", async () => {
    //given

    //when
    await vpcHelper.delete(vpcName);

    //then
    expect(await vpcHelper.exists(vpcName)).toBe(false);
});

test("create_VpcAlreadyExists_ThrowException", async () => {
    //given
    await vpcHelper.create(vpcName, vpcCidr)

    //when
    await expect(vpcHelper.create(vpcName, vpcCidr)).rejects.toThrow(VpcNameNotAvailableException);

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

afterAll(async () => {
    //TODO NGY test if the vpc exists before delete attempt (avoid throwing an exception)
    if(await vpcHelper.exists("VPC_TEST_NOT_DELETABLE")){
        vpcHelper.delete("VPC_TEST_NOT_DELETABLE");
    }
    if(await vpcHelper.exists("VPC_TEST")){
        vpcHelper.delete("VPC_TEST");
    }
});

//TODO Ajouter le test de notDeletable
//TODO Ajouter le test de vpcExceededLimit

