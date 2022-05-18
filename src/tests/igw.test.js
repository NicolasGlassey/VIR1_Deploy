/**
 * @file      igw.test.js
 * @brief     This class is designed to test the behaviour of an IGW (Internet Gateway).
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 *
 */

 "use strict";
 
const config = require('../config');

//const Vpc = require("../vpc/Vpc");
const Igw = require("../igw/Igw");

const IgwException = require("../igw/IgwException.js");
const IgwNotFoundException = require("../igw/IgwNotFoundException.js");
const IgwNotAttachedException = require("../igw/IgwNotAttachedException");
const IgwAlreadyAttachedException = require("../igw/IgwAlreadyAttachedException");

var igw, vpc, vpcName, igwName;

beforeAll(() => {
    // Load credentials and set region from JSON file
    // You have to set your region here
    this.vpcName = "Vpc-Deploy-test";
    this.igwName = "Igw-Deploy-test";

    this.igw = new Igw();
    //this.vpc = new Vpc();
});

test("Attach_NominalCase_Success", async () => {
    //Given
    //TODO  Utiliser le code pour créer vpc et IGW
    // IGW 
    // VPC
    // client

    
    expect(await this.igw.state(this.igwName)).toEqual("detached")
    //When
     await this.igw.attach(this.igwName, this.vpcName)

    //Then
    expect(await this.igw.state(this.igwName)).toEqual("attached")
});

test("Detach_NominalCase_Success", async () => {
    //Given
    //TODO  Utiliser le code pour créer vpc et IGW
    // IGW 
    // VPC
    // client
    
    expect(await this.igw.state(this.igwName)).toEqual("attached")
    //When
    await this.igw.detach(this.igwName)
    //Then
    expect(await this.igw.state(this.igwName)).toEqual("detached")
});

test("Attach_IgwNotExist_Exception", async () => {
    //Given
    // IGW
    // VPC
    // client
    let igwNameNotExist = "Deploy-NotExist"
    //When
    this.igw.attach(this.igwName, this.vpcName)
    //Then
    expect(this.igw.attach(igwNameNotExist, this.vpcName)).rejects.toThrow(IgwNotFoundException)
    this.igw.detach(this.igwName)
});

test("Attach_IgwAlreadyAttach_Exception", async () => {
    //Given
    //TODO  Utiliser le code pour créer vpc et IGW
    // IGW
    // VPC
    // client
    this.igw.attach(this.igwName, this.vpcName)
    //When
    //Then
    expect(this.igw.attach(this.igwName, this.vpcName)).rejects.toThrow(IgwAlreadyAttachedException)
    this.igw.detach(this.igwName)
});

test("Detach_IgwNotAttached_Exception", async () => {
    //Given
    //TODO  Utiliser le code pour créer vpc et IGW
    // IGW 
    // VPC
    // client
    //When
   expect(this.igw.detach(this.igwName, this.vpcName)).rejects.toThrow(IgwNotAttachedException)
    //Then
});

// TODO remove this example
test('example', () => {
    // given
    // when
    // then
    expect(true).toEqual(true);
});