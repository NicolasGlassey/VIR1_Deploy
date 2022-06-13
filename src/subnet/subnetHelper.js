/**
 * @file     subnetHelper.js
 * @brief    This class is designed to manage an aws Subnet
 * @author   Mathieu Rabot
 * @version  13-06-2022 - original (dedicated to VIR1)
 */

const {EC2Client} = require("@aws-sdk/client-ec2");

module.exports = class SubnetHelper {
    #client;

    constructor(region) {
        this.#client = new EC2Client({ region: region });
    }
}