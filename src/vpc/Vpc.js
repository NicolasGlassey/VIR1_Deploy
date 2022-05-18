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

module.exports = class Vpc {

    constructor() {
    }

    /**
     * @brief This method creates an vpc in aws asynchronously
     * @param {string} vpcTagName - the name of the vpc
     * @param {string} vpcCidrBlock - the cidr block of the vpc
     *
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
            const data = await ec2.send(new CreateVpcCommand(params));
            return data.Vpc;
        } catch (err) {
            throw new VpcException(err);
        }
    }

    /**
     * @brief This method deletes an vpc
     * @param {string} vpcTagName - the name of the vpc
     * @throws VpcNotFoundException if the vpc is not found
     */
    delete(vpcTagName) {
        let client = config.client;
        this.describe().then(function (data) {
            let vpcId = data.Vpcs.filter(function (vpc) {
                return vpc.Tags.filter(function (tag) {
                    return tag.Key === 'Name' && tag.Value === vpcTagName;
                }).length > 0;
            })[0].VpcId;
            client.deleteVpc({
                VpcId: vpcId
            }, function (err, data) {
                if (err) {
                    throw new VpcException(err);
                } else {
                    console.log(`Vpc ${vpcTagName} deleted`);
                }
            });
        }).catch(function (err) {
            throw new VpcNotFoundException(err);
        });
    }

    /**
     * @brief This method check if the vpc exists
     * @param {string} vpcTagName - the name of the vpc
     */
    exists(vpcTagName) {
        throw new Error("Not implemented");
    }

    /**
     * @brief This method returns all the vpcs
     * @returns {Array} - an array of vpc
     */
    describe() {
        let client = config.client;
        let vpcs = [];
        client.describeVpcs({}, function (err, data) {
            if (err) {
                throw new VpcException(err);
            } else {
                data.Vpcs.forEach(function (vpc) {
                    vpcs.push(vpc);
                });
            }
        });
        return vpcs;
    }

}
 