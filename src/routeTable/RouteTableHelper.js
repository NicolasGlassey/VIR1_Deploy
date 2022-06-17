/**
 * @file      RouteTableHelper.js
 * @brief     This class is designed to manage an aws Route TAble
 * @author    Mélodie Ohan
 * @version   14-06-2022 - original (dedicated to VIR1)
 */
 "use strict";

const {EC2Client, CreateRouteTableCommand} = require("@aws-sdk/client-ec2");

const vpcHelper = require("../vpc/VpcHelper")
const VpcNotFoundException = require("../vpc/VpcNotFoundException.js");
const subnetHelper = require("../subnet/subnetHelper")

const SubnetNotFoundException = require("../subnet/SubnetNotFoundException.js");

const RouteTableAlreadyExistsException = require("./RouteTableAlreadyExistsException");
const RouteTableNotFoundException = require("./RouteTableNotFoundException");

module.exports = class RouteTable {
    
     //region private attributes
     #associated;
     #deasassociated;
     #client; 
     #vpcHelper;
     //endregion private attributes

     constructor(region){
        this.#client = new EC2Client({ region: region });
        this.#vpcHelper = new VpcHelper("eu-west-3");
     }

     async associate();

     async deasassociate();

     async state();

     async create(routeTableName, vpcName, resourceType = "routeTables");

     async delete();

     async exists();

     async findId(name);
     
}