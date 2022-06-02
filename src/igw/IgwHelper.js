/**
 * @file      Igw.js
 * @brief     This class is designed to manage an aws Internet Gateway
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 */

 "use strict";

const {EC2Client, DescribeInternetGatewaysCommand, AttachInternetGatewayCommand, DetachInternetGatewayCommand, CreateInternetGatewayCommand, DeleteInternetGatewayCommand  } = require("@aws-sdk/client-ec2");

const VpcHelper = require("../vpc/VpcHelper")

const IgwNotFoundException = require("./IgwNotFoundException");
const IgwNotAttachedException = require("./IgwNotAttachedException");
const IgwAlreadyAttachedException = require("./IgwAlreadyAttachedException");
const VpcNotFoundException = require("../vpc/VpcNotFoundException")
const VpcAlreadyAttachedException = require("../vpc/VpcAlreadyAttachedException")
const IgwNameNotAvailable = require('./IgwNameNotAvailable');

module.exports = class IgwHelper {


    //region private attributes
    #client; 
    #vpcHelper;
    //endregion private attributes

    constructor(region) {
      this.#client = new EC2Client({ region: region });
      this.#vpcHelper = new VpcHelper("eu-west-3")
    }

    async attach(igwName, vpcName) {
        if(await this.#vpcHelper.exists(vpcName)) {
            if (await this.exists(igwName)) {
                let igw = await this.find(igwName)
                let vpcId = await this.#vpcHelper.findId(vpcName)
                if (await this.#vpcHelper.isAttached(vpcName)) {
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

   /**
    * @brief This method creates an igw with the given name in the constructor
    * @param {string} name 
    * @param {string} resourceType 
    * @exception IgwNameNotAvailable is thrown when the name is already in use
    * @returns id of the created igw or null
    */
    async create(name, resourceType = "internet-gateway"){
      if(await this.exists(name)) throw new IgwNameNotAvailable();
    
      var params = {
         TagSpecifications: [
           {
             ResourceType: resourceType,
             Tags: [
               {
                 Key: "Name",
                 Value: name
               },
             ]
           },
         ],
       };

      const command = new CreateInternetGatewayCommand(params);
      const response = await this.#client.send(command);
      if(response === undefined) return null;
      return response["InternetGateway"]["InternetGatewayId"];
     }

   /**
    * @brief This method deletes an internet gateway by its name
    * @exception IgwNotFoundException is thrown when attempts to delete non-existent Igw 
    * @param {string} name 
    */
    async delete(name){
      let id = await this.findId(name);
      if(id === null) throw new IgwNotFoundException();

      var params = {
        InternetGatewayId:id
      };

      const command = new DeleteInternetGatewayCommand(params);
      await this.#client.send(command); 
    }

   /**
    * @brief This method checks if an Igw already exists with the given name
    * @param {String} name 
    * @returns true if name is available
    */
    async exists(name){
      return await this.findId(name) !== null;
    }

   /**
    * @brief This method returns the id of the internet gatway by its name
    * @param {string} name 
    * @returns null if nothing matches or the id 
    */
    async findId(name){
      var params = {
        Filters: [
          {
            Name: "tag:Name",
            Values: [ name,],
          },
        ],
      };
      const command = new DescribeInternetGatewaysCommand(params);
      const response = await this.#client.send(command);
      if(response["InternetGateways"].length === 0) return null;
        
      return response["InternetGateways"][0]["InternetGatewayId"];
    }

   /**
    * @brief This method get all existing internet gateway.
    * @param {string} resourceType 
    * @returns list of internet gateway
    */
    async all(resourceType = "internet-gateway"){
      // Empty params to get all internet gateways
      var params = {
        TagSpecifications: [
          {
            ResourceType: resourceType,
            Tags: [{ Key: "Name", Value: ""},]
          },
        ],
      };
      const command = new DescribeInternetGatewaysCommand(params);
      const response = await this.#client.send(command);
      return response["InternetGateways"];
    }
 }
