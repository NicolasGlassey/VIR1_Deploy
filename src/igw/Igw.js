/**
 * @file      Igw.js
 * @brief     This class is designed to manage an aws Internet Gateway
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 */

"use strict";

const config = require('../config');
const { DescribeInternetGatewaysCommand, AttachInternetGatewayCommand, DetachInternetGatewayCommand  } = require("@aws-sdk/client-ec2");

const Vpc = require("../vpc/Vpc")

const IgwException = require("./IgwException");
const IgwNotFoundException = require("./IgwNotFoundException");
const IgwNotAttachedException = require("./IgwNotAttachedException");
const IgwAlreadyAttachedException = require("./IgwAlreadyAttachedException");
const VpcNotFoundException = require("../vpc/VpcNotFoundException")
const VpcAlreadyAttachedException = require("../vpc/VpcAlreadyAttachedException")


module.exports = class Igw {

    #client; 
    #vpc;

    constructor() {
        this.#client = config.client;
        this.#vpc = new Vpc()
    }

    async attach(igwName, vpcName) {
        if(await this.#vpc.exists(vpcName)) {
            if (await this.exists(igwName)) {
                let igw = await this.find(igwName)
                let vpcId = await this.#vpc.findId(vpcName)
                if (await this.#vpc.isAttached(vpcName)) {
                    throw new VpcAlreadyAttachedException()
                }
                
                if (await this.state(igwName) === "detached") {
                    const command = new AttachInternetGatewayCommand(
                        {
                            InternetGatewayId: igw["InternetGatewayId"],
                            VpcId: vpcId
                        }
                    )
                    const response = await this.#client.send(command)
                } else {
                    throw new IgwAlreadyAttachedException()
                }
            } else {
                throw new IgwNotFoundException()
            }
        }else{
            throw new VpcNotFoundException()
        }
    }

    async detach(igwName){
        if(await this.exists(igwName)){
            let igw = await this.find(igwName)
            if(await this.state(igwName) == "attached"){
                let command = new DetachInternetGatewayCommand(
                    {
                        InternetGatewayId: igw["InternetGatewayId"],
                        VpcId: igw["Attachments"][0]["VpcId"]
                    }
                )
                let response = await this.#client.send(command)
            }else{
                throw new IgwNotAttachedException()
            }
        }else {
            throw new IgwNotFoundException()
        }

    }

    async state(igwName){        
        let response = await this.find(igwName);
        if(response["Attachments"][0] !== undefined){
            return "attached"
        }
        return "detached"
    }

    async find(igwName) {
        var params = {
            Filters: [
                {
                    Name: "tag:Name",
                    Values: [
                        igwName,
                    ],
                },
            ],
        };

        const command = new DescribeInternetGatewaysCommand(params);
        const response = await this.#client.send(command);
        return response["InternetGateways"][0]
    }

    async exists(igwName){
        let igw = await this.find(igwName)
        if(igw !== undefined){
            return true
        }
        return false
    }

}
