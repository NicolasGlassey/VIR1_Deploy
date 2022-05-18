/**
 * @file      Igw.js
 * @brief     This class is designed to manage an aws Internet Gateway
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 */

 "use strict";

 const config = require('../config');
 const client = config.client
 const IgwNotFoundException = require("./IgwNotFoundException");
 const IgwNameNotAvailable = require("../igw/IgwNameNotAvailable");

 const { CreateInternetGatewayCommand, DeleteInternetGatewayCommand, DescribeInternetGatewaysCommand} = require("@aws-sdk/client-ec2");
 const IgwException = require('./IgwException');

 module.exports = class Igw {

     //region private attributes
     igwId = null;
     name = null;
     //endregion private attributes

     /**
      * Constructor
      * @param name : name of the internet gateway
      * @param id : Id of an existing internet gateway
      */
     constructor(name, id = null) {
       this.name = name;
       if(this.name === null) throw new IgwNameNotAvailable();
       // Aws response return undefined, we set it to null
       this.igwId = id === undefined ? null : id;
       this.name  = name === undefined ? null: name;
     }

     /**
      * @brief This property gets the internet gateway id
      * @returns igw id
      */
      get igwId(){
       return this.igwId;
     }

     /**
      * @brief This property gets the name of the internet gateway
      * @returns name
      */
     get name(){
       return this.name;
     }

     /**
      * @brief This method creates an igw with the given name in the constructor
      * @param name : name of the internet gateway
      * @exception IgwNameNotAvailable is thrown when the name is already in use
      */
      async create(){
       if(await Igw.exists(this.name)) throw new IgwNameNotAvailable();
       let tmp = (await Igw.createOne(this.name));
       this.name = tmp.name;
       this.igwId = tmp.igwId;
     }

     /**
      * @brief This method deletes an internet gateway by its name
      * @exception IgwNotFoundException is thrown when attempts to delete non-existent Igw
      */
     async delete(){
         await Igw.deleteOne(this.name, this.igwId);
     }

     /**
      * @brief This method checks if an Igw already exists with the given name
      * @param name:  name of the internet gateway
      * @returns true if name is available
      */
     static async exists(name){
       return await this.findId(name) !== null;
     }

     /**
      * @brief This method returns the the internet gatway object by its name
      * @param name: name of the internet gateway  to find
      * @returns null if igw doesn't exist
      */
      static async find(name) {
       var params = {
           Filters: [
               {
                   Name: "tag:Name",
                   Values: [
                       name,
                   ],
               },
           ],
       };
       const command = new DescribeInternetGatewaysCommand(params);
       const response = await client.send(command);

       if(response["InternetGateways"].length === 0) return null;

       let id =  response["InternetGateways"][0]["InternetGatewayId"];
       return new Igw(name, id);
     }

     /**
      * @brief This method returns the id of the internet gatway by its name
      * @param name: name of the internet gateway to find
      */
      static async findId(name){
        var params = {
            Filters: [
                {
                    Name: "tag:Name",
                    Values: [
                        name,
                    ],
                },
            ],
        };
        const command = new DescribeInternetGatewaysCommand(params);
        const response = await client.send(command);
        if(response["InternetGateways"].length === 0) return null;
        
        return response["InternetGateways"][0]["InternetGatewayId"];
     }

     /**
      * @brief This method create an igw with the given name
      * @param name : name of the internet gateway
      * @exception IgwNameNotAvailable is thrown when the name is already in use
      */
     static async createOne(name){
      if(await Igw.exists(name) === true) throw new IgwNameNotAvailable();

       var params = {
         TagSpecifications: [
           {
             ResourceType: "internet-gateway",
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
       const response = await client.send(command);
       if(response === undefined) return null;
       let id =  response["InternetGateway"]["InternetGatewayId"];
       return new Igw(name, id);
     }

     /**
      * @brief This method deletes an internet gateway by its name
      * @param name
      * @exception IgwNotFoundException is thrown when attempts to delete non-existent Igw
      */
     static async deleteOne(name, id = null){
      if(await Igw.exists(name) === false) throw new IgwNotFoundException();
      if(id === null) id = await Igw.findId(name);

      var params = {
        InternetGatewayId:id
      };

       const command = new DeleteInternetGatewayCommand(params);
       const response = await client.send(command);
     }

     /**
      * @brief This method get all existing internet gateway.
      * @returns list of internet gateway
      */
     static async all(){
      var params = {
        TagSpecifications: [
          {
            ResourceType: "internet-gateway",
            Tags: [
              {
                Key: "Name",
                Value: ""
              },
            ]
          },
        ],
      };
       const command = new DescribeInternetGatewaysCommand(params);
       const response = await client.send(command);
       return response["InternetGateways"];
     }

 }
