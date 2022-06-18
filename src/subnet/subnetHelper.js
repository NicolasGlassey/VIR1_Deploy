/**
 * @file     subnetHelper.js
 * @brief    This class is designed to manage an aws Subnet
 * @author   Mathieu Rabot
 * @version  13-06-2022 - original (dedicated to VIR1)
 */

const {EC2Client, DescribeSubnetsCommand, DeleteSubnetCommand, CreateSubnetCommand} = require("@aws-sdk/client-ec2");
const SubnetNotFoundException = require("./SubnetNotFoundException");
const SubnetNameNotAvailableException = require("./SubnetNameNotAvailableException");
const VpcHelper = require("../vpc/VpcHelper");

module.exports = class SubnetHelper {
    #client;
    #vpcHelper;

    constructor(region) {
        this.#client = new EC2Client({region: region});
        this.#vpcHelper = new VpcHelper(region);
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

    /**
     * @brief This method find the id of a subnet
     * @param {string} name - the name of the subnet
     * @returns the id of the subnet
     */
    async findId(name) {
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
        return subnet.Subnets[0].SubnetId;
    }

    /**
     * @brief This method creates a subnet in aws asynchronously
     * @param {string} name - the name of the subnet
     * @param {string} vpcName - the name of the vpc
     * @param {string} cidr - the cidr block of the subnet
     * @param {string} availabilityZone - the availability zone of the subnet
     * @param {string} resourceType - the type of the subnet
     * @exception SubnetNameNotAvailableException if the subnet name is not available
     */
    async create(name, vpcName, cidr, availabilityZone, resourceType = "subnet") {
        if (await this.exists(name)) {
            throw new SubnetNameNotAvailableException();
        }
        const vpcId = await this.#vpcHelper.findId(vpcName);
        const params = {
            CidrBlock: cidr,
            VpcId: vpcId,
            AvailabilityZone: availabilityZone,
            TagSpecifications: [
                {
                    ResourceType: resourceType,
                    Tags: [
                        {
                            Key: "Name",
                            Value: name
                        }
                    ]
                }
            ]
        }
        const createSubnetCommand = new CreateSubnetCommand(params);
        return await this.#client.send(createSubnetCommand);
    }

    /**
     * @brief This method delete a subnet in aws asynchronously
     * @param {string} name - the name of the subnet
     * @exception SubnetNotFoundException if the subnet is not found
     */
    async delete(name) {
        let id = await this.findId(name);
        if (id === null) throw new SubnetNotFoundException();
        return this.#client.send(new DeleteSubnetCommand({
                SubnetId: id
            }
        ));
    }
}