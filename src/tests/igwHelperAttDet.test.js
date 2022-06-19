/**
 * @file      igw.test.js
 * @brief     This class is designed to test the behaviour of an IGW (Internet Gateway).
 * @author    Cyril Goldenschue
 * @version   11-05-2022 - original (dedicated to VIR1)
 *
 */

"use strict";

const VpcHelper = require("../vpc/VpcHelper");
const IgwHelper = require("../igw/IgwHelper");

const IgwNotFoundException = require("../igw/IgwNotFoundException.js");
const IgwNotAttachedException = require("../igw/IgwNotAttachedException");
const IgwAttachmentException = require("../igw/IgwAttachmentException");

const VpcNotFoundException = require("../vpc/VpcNotFoundException")

let igwHelper, vpcHelper;
let vpcName, vpcCidr, igwName;

beforeAll(async () => {
    vpcHelper = new VpcHelper("eu-west-3");
    igwHelper = new IgwHelper("eu-west-3")

    igwName = "Igw-Deploy-test";

    if(await igwHelper.exists(igwName) === false){
        await igwHelper.create(igwName);
    }
});

beforeEach(async () =>{
    vpcName = "Vpc-Deploy-test";
    vpcCidr = "10.0.0.0/16";

    if(await vpcHelper.exists(vpcName) === false){
        await vpcHelper.create(vpcName, vpcCidr);
    }
})


test("attach_NominalCase_Success", async () => {
    //Given
    // refer to before each method
    expect(await igwHelper.state(igwName)).toEqual("detached")

    //When
    await igwHelper.attach(igwName, vpcName)

    //Then
    expect(await igwHelper.state(igwName)).toEqual("attached")
});

test("detach_NominalCase_Success", async () => {
    //Given
    // refer to before each method
    await igwHelper.attach(igwName, vpcName)
    expect(await igwHelper.state(igwName)).toEqual("attached")

    //When
    await igwHelper.detach(igwName)

    //Then
    expect(await igwHelper.state(igwName)).toEqual("detached")
});

test("attach_IgwNotExist_ThrowException", async () => {
    //Given
    // refer to before each method
    let notExistIgw = "not-exists"

    //When
    expect(igwHelper.attach(notExistIgw, vpcName)).rejects.toThrow(IgwNotFoundException)

    //Then
    //Exception is thrown
});

test("attach_IgwOrVpcAlreadyAttach_ThrowException", async () => {
    //Given
    // refer to before each method
    await igwHelper.attach(igwName, vpcName)

    //When
    expect(igwHelper.attach(igwName, vpcName)).rejects.toThrow(IgwAttachmentException)

    //Then
    //Exception is thrown
});

test("attach_VpcNotFound_ThrowException", async () => {
    //Given
    // refer to before each method
    let notExistVpc = "not-exists";

    // When
    expect(igwHelper.attach(igwName, notExistVpc)).rejects.toThrow(VpcNotFoundException)

    //Then
    //Exception is thrown
});

test("detach_IgwNotAttached_ThrowException", async () => {
    //Given
    // refer to before each method
    
    //When
    expect(igwHelper.detach(igwName, vpcName)).rejects.toThrow(IgwNotAttachedException)

    //Then
    //Exception is thrown
});

afterAll(async () =>{
    if (await igwHelper.exists(igwName)) {
        await igwHelper.delete(igwName, true)
    }
})

afterEach(async () => {
    if (await vpcHelper.exists(vpcName)) {
        if(await vpcHelper.isAttached(vpcName)){
            await igwHelper.detach(igwName)
        }
        await vpcHelper.delete(vpcName)
    }
})