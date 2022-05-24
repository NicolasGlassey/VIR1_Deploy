/**
 * @file      igw.test.js
 * @brief     This class is designed to test the behaviour of an IGW (Internet Gateway).
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 *
 */

"use strict";

const config = require('../config').client;

const Vpc = require("../vpc/Vpc");
const Igw = require("../igw/Igw");

const IgwException = require("../igw/IgwException.js");
const IgwNotFoundException = require("../igw/IgwNotFoundException.js");
const IgwNotAttachedException = require("../igw/IgwNotAttachedException");
const IgwAlreadyAttachedException = require("../igw/IgwAlreadyAttachedException");

const VpcNotFoundException = require("../vpc/VpcNotFoundException")
const VpcAlreadyAttachedException = require("../vpc/VpcAlreadyAttachedException")

var igw, vpc, vpcName, vpcCidr, igwName;

beforeAll(async () => {
    this.igwName = "Igw-Deploy-test";

    this.vpcName = "Vpc-Deploy-test";
    this.vpcCidr = "10.0.0.0/16";

    this.igw = new Igw(config);
    this.vpc = new Vpc();

    //TODO create vpc if not exist
    if(await this.vpc.exists(this.vpcName) === false){
        await this.vpc.create(this.vpcName, this.vpcCidr);
    }
    if(await this.igw.exists(this.igwName) === false){
        await this.igw.create(this.igwName);
    }
});


test("attach_NominalCase_Success", async () => {
    //Given
    expect(await this.igw.state(this.igwName)).toEqual("detached")

    //When
    await this.igw.attach(this.igwName, this.vpcName)

    //Then
    expect(await this.igw.state(this.igwName)).toEqual("attached")
});

test("detach_NominalCase_Success", async () => {
    //Given
    expect(await this.igw.state(this.igwName)).toEqual("attached")

    //When
    await this.igw.detach(this.igwName)

    //Then
    expect(await this.igw.state(this.igwName)).toEqual("detached")
});

test("attach_IgwNotExist_ThrowException", async () => {
    //Given
    let igwNameNotExist = "Deploy-NotExist"

    //When
    this.igw.attach(this.igwName, this.vpcName)

    //Then
    expect(this.igw.attach(igwNameNotExist, this.vpcName)).rejects.toThrow(IgwNotFoundException)
    this.igw.detach(this.igwName)
});

test("attach_IgwAlreadyAttach_ThrowException", async () => {
    //Given
    this.igw.attach(this.igwName, this.vpcName)

    //When, Then
    expect(this.igw.attach(this.igwName, this.vpcName)).rejects.toThrow(IgwAlreadyAttachedException)
    this.igw.detach(this.igwName)
});

test("attach_VpcNotFound_ThrowException", async () => {
    //Given, When, Then

    expect(this.igw.attach(this.igwName, "Vpc_Not_Exist")).rejects.toThrow(VpcNotFoundException)
});


test("attach_VpcAlreadyAttached_ThrowException", async () => {
    //Given
    this.igw.attach(this.igwName, this.vpcName)

    //When, Then
    expect(this.igw.attach(this.igwName, this.vpcName)).rejects.toThrow(VpcAlreadyAttachedException)
    this.igw.detach(this.igwName)
});

test("detach_IgwNotAttached_ThrowException", async () => {
    //Given, When,Then

    expect(this.igw.detach(this.igwName, this.vpcName)).rejects.toThrow(IgwNotAttachedException)

});

afterAll(async () => {
    if (await this.vpc.exists(this.vpcName)) {
        if (await this.igw.state(this.igwName) === "attached") {
            await this.igw.detach(this.igwName)
        }
        await this.vpc.delete(this.vpcName)
        if (await this.igw.exists(this.igwName)) {
            await this.igw.delete(this.igwName)
        }
    }

})