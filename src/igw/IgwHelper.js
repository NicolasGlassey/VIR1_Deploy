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
const IgwAttachmentException = require("./IgwAttachmentException");
const VpcNotFoundException = require("../vpc/VpcNotFoundException")
const IgwNameNotAvailableException = require('./IgwNameNotAvailableException'); 

const attached = "attached",
      detached = "detached";
module.exports = class IgwHelper {

    //region private attributes
    #client; 
    #vpcHelper;
    //endregion private attributes

    /**
     * @constructor
     * @param {string} region
     */
    constructor(region) {
      this.#client = new EC2Client({ region: region });
      this.#vpcHelper = new VpcHelper("eu-west-3");
    }
    
    /**
    * @brief This method attach an igw and a vpc with the given names in the constructor
    
    * @param {string} igwName
    * @param {string} vpcName
    * @exception IgwAttachmentException is thrown when the igw ot the vpc are already attached
    * @exception IgwNotFoundException is thrown when the igw isn't exist
    * @exception VpcNotFoundException is thrown when the vpc isn't exist
    */
    async attach(igwName, vpcName) {
        if(await this.#vpcHelper.exists(vpcName)) {
            if (await this.exists(igwName)) {
                let igw = await this.find(igwName)
                let vpcId = await this.#vpcHelper.findId(vpcName)
                //TODO à voir en review
                if (await this.state(igwName) === detached || !(await this.#vpcHelper.isAttached(vpcName))) {

                  await this.#client.send(new AttachInternetGatewayCommand(
                    {
                        InternetGatewayId: igw.InternetGatewayId,
                        VpcId: vpcId
                    }
                  ));
                } else {
                    throw new IgwAttachmentException()
                }
            } else {
                throw new IgwNotFoundException()
            }
        }else{
            throw new VpcNotFoundException()
        }
    }

    /**
    * @brief This method detach an igw with the given name in the constructor
    * @async
    * @param {string} igwName
    * @exception IgwNotAttachedException is thrown when the igw isn't attached
    * @exception IgwNotFoundException is thrown when the igw isn't exist
    */
    async detach(igwName){
        if(await this.exists(igwName)){
            let igw = await this.find(igwName)
            if(await this.state(igwName) === attached){
              await this.#client.send(new DetachInternetGatewayCommand(
                    {
                        InternetGatewayId: igw.InternetGatewayId,
                        VpcId: igw.Attachments[0].VpcId
                    }
              ));
            }else{
                throw new IgwNotAttachedException()
            }
        }else {
            throw new IgwNotFoundException()
        }

    }

    /**
    * @brief This method check the attachment state for the igw with the given name in the constructor
    * @async
    * @param {string} igwName 
    * @returns state of igw attachement
    */
    async state(igwName){        
        let response = await this.find(igwName);
        if(response.Attachments[0] !== undefined){
            return attached
        }
        return detached
    }

       /**
    * @brief This method find an igw with the given name in the constructor
    * @async
    * @param {string} igwName 
    * @returns the igw finded
    */
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
        return response.InternetGateways[0]
    }

   /**
    * @brief This method creates an igw with the given name in the constructor
    * @async
    * @param {string} name 
    * @param {string} resourceType 
    * @exception IgwNameNotAvailable is thrown when the name is already in use
    */
    async create(name, resourceType = "internet-gateway"){
      if(await this.exists(name)) throw new IgwNameNotAvailableException();
    
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

       await this.#client.send(new CreateInternetGatewayCommand(params));
     }

   /**
    * @brief This method deletes an internet gateway by its name
    * @async
    * @exception IgwNotFoundException is thrown when attempts to delete non-existent Igw 
    * @param {string} name 
    */
    async delete(name, isForced = false){

      if(isForced){
        if(await this.state(name) === attached) await this.detach(name)
      }

      let id = await this.findId(name),
          params = {
            InternetGatewayId: id
          };
      if(id === null) throw new IgwNotFoundException();

      await this.#client.send(new DeleteInternetGatewayCommand(params));
    }

   /**
    * @brief This method checks if an Igw already exists with the given name
    * @async
    * @param {String} name 
    * @returns true if name is available
    */
    async exists(name){
      return await this.findId(name) !== null;
    }

   /**
    * @brief This method returns the id of the internet gatway by its name
    * @async
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

      const igw = await this.#client.send(new DescribeInternetGatewaysCommand(params));
      if(igw.InternetGateways.length === 0) return null;
        
      return igw.InternetGateways[0].InternetGatewayId;
    }

    /**
    * @brief This method get all existing internet gateway.
    * @async
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
      const response = await this.#client.send(new DescribeInternetGatewaysCommand(params));
      return response.InternetGateways;
    }
 }
