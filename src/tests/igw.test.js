/**
 * @file      igw.test.js
 * @brief     This class is designed to test the behaviour of an IGW (Internet Gateway).
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 *
 */

 "use strict";
 
const config = require('../config.js');
const Igw = require("../igw/Igw.js");
const IgwException = require("../igw/IgwException.js");
const IgwNotFoundException = require("../igw/IgwNotFoundException.js");

var igw;

beforeAll(() => {
    // Load credentials and set region from JSON file
    // You have to set your region here
    this.igw = new Igw();
});

test("Attach_NominalCase_Success", async () => {
    //Given
    //TODO  Utiliser le code pour créer vpc et IGW
    // IGW 
    // VPC
    // client
    let expected = await this.igw.state(this.IgwName)
    
    expect(expected).toEqual("detached")
    //When
    this.igw.attach(this.IgwName, this.vpcName)

    //Then
    let received = await this.igw.state(this.IgwName)
    expect(received).toEqual("attached")
})

// TODO remove this example
test('example', () => {
    // given
    // when
    // then
    expect(true).toEqual(true);
})