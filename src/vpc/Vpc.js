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
    async create(name, cidr, resourcetype = "vpc") {
        if (await this.exists(name)) {
            throw new VpcTagNameAlreadyExistsException();
        }
        const params = {
            CidrBlock: cidr,
            EnableDnsHostnames: true,
            EnableDnsSupport: true,
            InstanceTenancy: "default",
            TagSpecifications: [
                {
                    ResourceType: "vpc",
                    Tags: [
                        {
                            Key: "Name",
                            Value: name
                        }
                    ]
                }
            ]
        };
        return await this.#client.send(new CreateVpcCommand(params));
    }

    /**
     * @brief This method deletes a vpc
     * @param {string} vpcTagName - the name of the vpc
     * @throws VpcNotFoundException if the vpc is not found
     */
    async delete(name) {
        if (await this.exists(name) === false) {
            throw new VpcNotFoundException();
        }
        try {
            return this.#client.send(new DeleteVpcCommand({
                    VpcId: await this.findId(name)
                }
            ));
        }catch (err) {
            if (err.code === "DependencyViolation") {
                throw new VpcNotDeletableException();
            }
        }

    }

    /**
     * @brief This method returns the vpc id of the vpc with the given name
     * @param {string} vpcTagName - the name of the vpc
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
        const describeVpcsCommand = new DescribeVpcsCommand(params);
        const vpc = await this.#client.send(describeVpcsCommand);
        if (vpc.Vpcs.length === 0) {
            throw new VpcNotFoundException(`Vpc ${vpcTagName} not found`);
        }
        return vpc.Vpcs[0].VpcId;
    }

    /**
     * @brief This method check if the vpc exists
     * @param {string} vpcTagName - the name of the vpc
     */
    async exists(vpcTagName) {
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
 