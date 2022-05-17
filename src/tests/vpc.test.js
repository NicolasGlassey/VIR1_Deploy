/**
 * @file      igw.test.js
 * @brief     This class is designed to test the behaviour of a VPC (Virtual Private Cloud).
 * @author    Mathieu Rabot
 * @version   11-05-2022 - original (dedicated to VIR1)
 *
 */

 "use strict";
 
const config = require('../_config.js');
const Vpc = require("../vpc/Vpc.js");
const VpcException = require("../vpc/VpcException.js");
const VpcNotFoundException = require("../vpc/VpcNotFoundException.js");

var vpc;

beforeAll(() => {
    // Load credentials and set region from JSON file
    // You have to set your region here
    this.vpc = new Vpc();
});

// TODO remove this example
test('example', () => {
    // given
    // when
    // then
    expect(true).toEqual(true);
})