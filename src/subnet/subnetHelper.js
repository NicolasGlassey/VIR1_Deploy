/**
 * @file     subnetHelper.js
 * @brief    This class is designed to manage an aws Subnet
 * @author   Mathieu Rabot
 * @version  13-06-2022 - original (dedicated to VIR1)
 */

const {EC2Client, DescribeSubnetsCommand} = require("@aws-sdk/client-ec2");

module.exports = class SubnetHelper {
    #client;

    constructor(region) {
        this.#client = new EC2Client({ region: region });
    }

    /**
     * @brief This method checks if the subnet exists
     * @param {string} name - the name of the subnet
     * @returns a bool if subnet exists
     */
    async exists(name) {
        const params = {
            Filters: [
                {
                    Name: "tag:Name",
                    Values: [name]
                }
            ]
        }
        const describeSubnetsCommand = new DescribeSubnetsCommand(params);
        const subnet = await this.#client.send(describeSubnetsCommand);
        return subnet.Subnets.length > 0;
    }
}