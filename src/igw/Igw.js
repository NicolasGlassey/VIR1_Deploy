/**
 * @file      Igw.js
 * @brief     This class is designed to manage an aws Internet Gateway
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 */

 "use strict";

 const config = require('../config');
 const IgwNotFoundException = require("./IgwNotFoundException");
 const IgwNameNotAvailable = require('./IgwNameNotAvailable');

const { CreateInternetGatewayCommand, DeleteInternetGatewayCommand, DescribeInternetGatewaysCommand} = require("@aws-sdk/client-ec2");

 module.exports = class Igw {

   //region private attributes
   #client = null;
   //endregion private attributes

   /**
    * Constructor
    * @param {EC2Client} client 
    */
    constructor(client) {
      // Aws response return undefined, we set it to null
      this.#client = client;
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
