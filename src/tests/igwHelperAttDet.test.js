/**
 * @file      igw.test.js
 * @brief     This class is designed to test the behaviour of an IGW (Internet Gateway).
 * @author    Mélodie Ohan
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

let igwHelper, vpcHelper, vpcName, vpcCidr, igwName;

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
    expect(await igwHelper.state(igwName)).toEqual("detached")

    //When
    await igwHelper.attach(igwName, vpcName)

    //Then
    expect(await igwHelper.state(igwName)).toEqual("attached")
});

test("detach_NominalCase_Success", async () => {
    //Given

    await igwHelper.attach(igwName, vpcName)
    expect(await igwHelper.state(igwName)).toEqual("attached")

    //When
    await igwHelper.detach(igwName)

    //Then
    expect(await igwHelper.state(igwName)).toEqual("detached")
});

test("attach_IgwNotExist_ThrowException", async () => {
    //Given
    let igwNameNotExist = "Deploy-NotExist"

    //When
    expect(igwHelper.attach(igwNameNotExist, vpcName)).rejects.toThrow(IgwNotFoundException)

    //Then
    //Exception is thrown
});

test("attach_IgwOrVpcAlreadyAttach_ThrowException", async () => {
    //Given
    await igwHelper.attach(igwName, vpcName)

    //When
    expect(igwHelper.attach(igwName, vpcName)).rejects.toThrow(IgwAttachmentException)

    //Then
    //Exception is thrown
});

test("attach_VpcNotFound_ThrowException", async () => {
    //Given
    let fakeIgwName = "Vpc_Not_Exist";
    // When, Then

    expect(igwHelper.attach(igwName, fakeIgwName)).rejects.toThrow(VpcNotFoundException)
});

test("detach_IgwNotAttached_ThrowException", async () => {
    //Given, When,Then
    expect(igwHelper.detach(igwName, vpcName)).rejects.toThrow(IgwNotAttachedException)
});

afterAll(async () =>{
    if (await igwHelper.exists(igwName)) {
        //TODO NGY the delete method get an optionnal parameter. By default = false. If true, it forces an attached igw to be deleted
        await igwHelper.delete(igwName, true)
    }
})

afterEach(async () => {
    if (await vpcHelper.exists(vpcName)) {
        if(await vpcHelper.isAttached(vpcName)){
            await igwHelper.detach(igwName, vpcName)
        }
        await vpcHelper.delete(vpcName)
    }
})