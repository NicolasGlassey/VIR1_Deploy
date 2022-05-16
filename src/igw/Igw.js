/**
 * @file      Igw.js
 * @brief     This class is designed to manage an aws Internet Gateway
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 */

"use strict";

const config = require('../_config');
const { DescribeInternetGatewaysCommand, AttachInternetGatewayCommand  } = require("@aws-sdk/client-ec2");

const IgwcException = require("./IgwException");
const IgwNotFoundException = require("./IgwNotFoundException");


module.exports = class Igw {

    #client;

    constructor(client) {
        this.#client = client;
        //this.#client = config.client;

    }

    async attach(IgwName, VpcName) {
        /*if(this.#vpc.exists(VpcName) != true){
            throw new VpcNotExistException()
        }*/

        /*vpc = this.#client.describeVpcs({
            Filters: [
                {
                    Name: "tag:Name",
                    Values: [
                      "Deploy-test"
                    ],
                },
            ],
        });*/
        if(this.exists(IgwName)/*&& vpc != null*/){
            let gateway = await this.getGateway(IgwName)
            //console.log(gateway)
            /*if(vpc["Vpcs"][0]["State"]!="available"){
                throw new VpcAlreadyAttachedException()
            }*/
            /*if(gateway[0]["Attachments"][0]["State"] == "available" ){
                throw new IgwAlreadyAttachedException()
            }*/
            const command = new AttachInternetGatewayCommand (
                {   
                    InternetGatewayId: gateway[0]["InternetGatewayId"],
                    VpcId: "vpc-0dc6811332bf28391",//this.#vpc.VpcId(VpcName, this.#vpc),
                }
            )
            const response = await this.#client.send(command)
        } else {
            throw new IgwNotExistException()
        }
        return "attached";
    }






    async state(igwName){        
        let response = await this.getGateway(igwName);

        if(response[0]["Attachments"][0] != null){
            return "attached"
        }
        return "detached"
    }

    async getGateway(igwName) {
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
        return response["InternetGateways"]
    }

    async exists(igwName){
        let igw = await this.getGateway(igwName)
        if(igw[0] != undefined){
            return true
        }
        return false
    }

}
