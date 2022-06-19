/**
 * @file      Vpc.js
 * @brief     This class is designed to manage an aws Virtual Private Cloud
 * @author    Mathieu Rabot
 * @version   11-05-2022 - original (dedicated to VIR1)
 */

"use strict";
const {EC2Client, CreateVpcCommand, DeleteVpcCommand, DescribeVpcsCommand, DescribeInternetGatewaysCommand} = require("@aws-sdk/client-ec2")

const VpcNotFoundException = require("./VpcNotFoundException");
const VpcNameNotAvailableException = require("./VpcNameNotAvailableException");
const VpcLimitExceededException  = require("./VpcLimitExceededException ");
const VpcNotDeletableException = require("./VpcNotDeletableException");

module.exports = class VpcHelper {

    //region private attributes
    #client; 
    //endregion private attributes
    

    /**
     * @constructor
     * @param {string} region
     */
    constructor(region) {
        this.#client = new EC2Client({ region: region });
    }

    /**
     * @brief This method creates an vpc in aws asynchronously
     * @async
     * @param {string} name - the name of the vpc
     * @param {string} vpcCidrBlock - the cidr block of the vpc
     * @exception EC2Client.VpcExceedLimitException the limit of vpcs is exceeded
     * @exception VpcNameNotAvailableException the name choose is already used
     */
    async create(name, cidr, resourcetype = "vpc") {
        if (await this.exists(name)) throw new VpcNameNotAvailableException();

        const params = {
            CidrBlock: cidr,
            EnableDnsHostnames: true,
            EnableDnsSupport: true,
            InstanceTenancy: "default",
            TagSpecifications: [
                {
                    ResourceType: resourcetype,
                    Tags: [
                        {
                            Key: "Name",
                            Value: name
                        }
                    ]
                }
            ]
        };
        await this.#client.send(new CreateVpcCommand(params));
    }

    /**
     * @brief This method deletes a vpc
     * @async
     * @param {string} name - the name of the vpc
     * @exception VpcNotFoundException if the vpc is not found
     * @exception VpcNotDeletableException the vpc is attached and we can't delete
     */
    async delete(name) {
        if (await this.exists(name) === false) throw new VpcNotFoundException();
        if (await this.isAttached(name) === true) throw new VpcNotDeletableException();

        let vpcId = await this.findId(name),
            params = {
                VpcId: vpcId
            }

        await this.#client.send(new DeleteVpcCommand(params));
    }

    /**
     * @brief This method returns the vpc id of the vpc with the given name
     * @async
     * @param {string} name - the name of the vpc
     * @returns vpc id
     */
    async findId(name) {
        const params = {
            Filters: [
                {
                    Name: "tag:Name",
                    Values: [
                        name
                    ]
                }
            ]
        };
        const vpc = await this.#client.send(new DescribeVpcsCommand(params));
        if (vpc.Vpcs.length === 0) return null;
        return vpc.Vpcs[0].VpcId;
    }

    /**
     * @brief This method check if the vpc exists 
     * @async
     * @param {string} name - the name of the vpc
     * @returns a bool if vpc exists
     */
    async exists(name) {
        const params = {
            Filters: [
                {
                    Name: "tag:Name",
                    Values: [
                        name
                    ]
                }
            ]
        };
        const vpc = await this.#client.send(new DescribeVpcsCommand(params));
        return vpc.Vpcs.length !== 0;
    }

    /**
     * @brief This method check if the vpc has dependencies attached
     * @async
     * @param {string} name - the name of the vpc
     * @returns the vpc attachment state
     */
    async isAttached(name) {

        let vpcId = await this.findId(name)
        const params = {
            Filters: [
                {
                    Name: "attachment.vpc-id",
                    Values: [
                        vpcId,
                    ],
                },
            ],
        };

        const response = await this.#client.send(new DescribeInternetGatewaysCommand(params));
        
        let igw = response.InternetGateways[0]
        return igw !== undefined;
    }
}
 