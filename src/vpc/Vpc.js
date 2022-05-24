/**
 * @file      Vpc.js
 * @brief     This class is designed to manage an aws Virtual Private Cloud
 * @author    Mathieu Rabot
 * @version   11-05-2022 - original (dedicated to VIR1)
 */

"use strict";
const {CreateVpcCommand, DeleteVpcCommand, DescribeVpcsCommand} = require("@aws-sdk/client-ec2")
const config = require('../config');
const VpcException = require("./VpcException");
const VpcNotFoundException = require("./VpcNotFoundException");
const VpcAlreadyExistsException = require("./VpcAlreadyExistsException");
const VpcExceedLimitException = require("./VpcExceedLimitException");
const VpcTagNameAlreadyExistsException = require("./VpcTagNameAlreadyExistsException");
const VpcNotDeletableException = require("./VpcNotDeletableException");

module.exports = class Vpc {

    #client;

    constructor(client) {
        this.#client = client;
    }

    /**
     * @brief This method creates an vpc in aws asynchronously
     * @param {string} vpcTagName - the name of the vpc
     * @param {string} vpcCidrBlock - the cidr block of the vpc
     */
    async createVpc(vpcTagName, vpcCidrBlock) {
        const ec2 = config.client;
        const params = {
            CidrBlock: vpcCidrBlock,
            EnableDnsHostnames: true,
            EnableDnsSupport: true,
            InstanceTenancy: "default",
            TagSpecifications: [
                {
                    ResourceType: "vpc",
                    Tags: [
                        {
                            Key: "Name",
                            Value: vpcTagName
                        }
                    ]
                }
            ]
        };
        try {
            if(await this.vpcExists(vpcTagName)) {
                throw new VpcTagNameAlreadyExistsException();
            }
            return await ec2.send(new CreateVpcCommand(params));
        } catch (err) {

        }
    }

    /**
     * @brief This method deletes a vpc
     * @param {string} vpcTagName - the name of the vpc
     * @throws VpcNotFoundException if the vpc is not found
     */
    async deleteVpc(vpcTagName) {
        const ec2 = config.client;
        if(await this.vpcExists(vpcTagName) == false) {
            throw new VpcNotFoundException();
        }
        return ec2.send(new DeleteVpcCommand({
            VpcId: await this.getVpcId(vpcTagName)}
        ));
    }

    /**
     * @brief This method returns the vpc id of the vpc with the given name
     * @param {string} vpcTagName - the name of the vpc
     */
    async getVpcId(vpcTagName) {
        const ec2 = config.client;
        const params = {
            Filters: [
                {
                    Name: "tag:Name",
                    Values: [
                        vpcTagName
                    ]
                }
            ]
        };
        const describeVpcsCommand = new DescribeVpcsCommand(params);
        const vpc = await ec2.send(describeVpcsCommand);
        if (vpc.Vpcs.length === 0) {
            throw new VpcNotFoundException(`Vpc ${vpcTagName} not found`);
        }
        return vpc.Vpcs[0].VpcId;
    }

    /**
     * @brief This method check if the vpc exists
     * @param {string} vpcTagName - the name of the vpc
     */
    async vpcExists(vpcTagName) {
        const ec2 = config.client;
        const params = {
            Filters: [
                {
                    Name: "tag:Name",
                    Values: [
                        vpcTagName
                    ]
                }
            ]
        };
        const describeVpcsCommand = new DescribeVpcsCommand(params);
        const vpc = await ec2.send(describeVpcsCommand);
        return vpc.Vpcs.length !== 0;
    }
}
 