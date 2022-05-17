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

var igw, vpc, vpcName, igwName;

beforeAll(() => {
    // Load credentials and set region from JSON file
    // You have to set your region here
    this.vpcName = "Vpc-Deploy-test";
    this.igwName = "Igw-Deploy-test";

    this.igw = new Igw(config.client);
    //this.vpc = new Vpc();
});

test("Attach_NominalCase_Success", async () => {
    //Given
    //TODO  Utiliser le code pour créer vpc et IGW
    // IGW 
    // VPC
    // client
    let expected = await this.igw.state(this.igwName)
    
    expect(expected).toEqual("detached")
    //When
    let received = await this.igw.attach(this.igwName, this.vpcName)

    //Then
    expect(received).toEqual("attached")
})

test("Attach_IgwNotExist_Failure", async () => {
    //Given
    //TODO  Utiliser le code pour créer vpc et IGW
    // IGW 
    // VPC
    // client
    let igwNameNotExist = "Deploy-NotExist"
    //When
    let received = await this.igw.exists(igwNameNotExist)

    //Then
    expect(received).toEqual(false)
})

test("Attach_VpcNotExist_Failure", async () => {
    //Given
    //TODO  Utiliser le code pour créer vpc et IGW
    // IGW 
    // VPC
    // client
    let vpcNameNotExist = "Vpc-NotExist"
    //When
    let received = await this.vpc.exists(vpcNameNotExist)

    //Then
    expect(received).toEqual(false)
})

test("Attach_IgwAlreadyAttach_Failure", async () => {
    //Given
    //TODO  Utiliser le code pour créer vpc et IGW
    // IGW 
    // VPC
    // client  

    //When
    let expected = await this.igw.state(this.igwName)
    //Then
    expect(expected).toEqual("attached")
})

test("Attach_VpcAlreadyAttach_Failure", async () => {
    //Given
    //TODO  Utiliser le code pour créer vpc et IGW
    // IGW 
    // VPC
    // client  

    //When
    let expected = await this.vpc.state(this.vpcName)
    //Then
    expect(expected).toEqual("attached")
})

// TODO remove this example
test('example', () => {
    // given
    // when
    // then
    expect(true).toEqual(true);
})