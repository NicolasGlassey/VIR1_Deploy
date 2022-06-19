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
const IgwHelper = require('../igw/IgwHelper.js');
const VpcNotDeletableException = require('../vpc/VpcNotDeletableException.js');
const VpcLimitExceededException = require('../vpc/VpcLimitExceededException .js');

let vpcHelper, vpcName, vpcCidr;
let igwHelper, igwName;

beforeAll(() => {
    igwHelper = new IgwHelper("eu-west-3")
    vpcHelper = new VpcHelper("eu-west-3");

    igwName = "IgwDeploy"

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
    let notExistVpc = "not-exists";

    //when
    await expect(vpcHelper.delete(notExistVpc)).rejects.toThrow(VpcNotFoundException);

    //then
    //Exception is thrown
});

test("delete_NotDeletable_ThrowException", async () => {
    //given
    if(!(await vpcHelper.exists(vpcName))){
        await vpcHelper.create(vpcName, vpcCidr)
    }
    if(!(await igwHelper.exists(igwName))){
        await igwHelper.create(igwName)
    }
    await igwHelper.attach(igwName, vpcName)
    //when
    await expect(vpcHelper.delete(vpcName)).rejects.toThrow(VpcNotDeletableException);

    //then
    //Exception is thrown
});

afterAll(async () => {
    if (await igwHelper.exists(igwName)){
        await igwHelper.detach(igwName)
        igwHelper.delete(igwName)
    }
    if (await vpcHelper.exists("VPC_TEST_NOT_DELETABLE")){
        vpcHelper.delete("VPC_TEST_NOT_DELETABLE");
    }
    if (await vpcHelper.exists("VPC_TEST")){
        vpcHelper.delete("VPC_TEST");
    }
    
});

