/**
 * @file      RouteTableHelper.js
 * @brief     This class is designed to manage an aws Route TAble
 * @author    Mélodie Ohan
 * @version   14-06-2022 - original (dedicated to VIR1)
 */
"use strict";

const {
    EC2Client,
    CreateRouteTableCommand,
    DescribeRouteTablesCommand,
    DeleteRouteTableCommand,
    AssociateRouteTableCommand,
    DisassociateRouteTableCommand
} = require("@aws-sdk/client-ec2");

const VpcHelper = require("../vpc/VpcHelper")
const VpcNotFoundException = require("../vpc/VpcNotFoundException");
const subnetHelper = require("../subnet/subnetHelper")

const SubnetNotFoundException = require("../subnet/SubnetNotFoundException")

const RouteTableAssociationNotFoundException = require("./RouteTableAssociationNotFoundException");
const RouteTableAlreadyExistsException = require("./RouteTableAlreadyExistsException");
const RouteTableNotFoundException = require("./RouteTableNotFoundException");

module.exports = class RouteTable {

    //region private attributes
    #client;
    #vpcHelper;
    #subnetHelper;

    //endregion private attributes

    /**
     * Constructor
     * @param {string} region
     */
    constructor(region) {
        this.#client = new EC2Client({region: region});
        this.#vpcHelper = new VpcHelper(region);
        this.#subnetHelper = new subnetHelper(region);
    }

    /**
     * @brief Associate a route table with a subnet
     * @param {string} routeTableName
     * @param {string} subnetName
     * @exception RouteTableNotFoundException if routeTable doesn't exist
     * @exception SubnetNotFoundException if subnet doesn't exist
     */
    async associate(routeTableName, subnetName) {
        let routeTableId = await this.findId(routeTableName);
        let subnetId = await this.#subnetHelper.findId(subnetName);

        if (routeTableId === null) throw new RouteTableNotFoundException();
        if (subnetId === null) throw new SubnetNotFoundException();

        var params = {
            RouteTableId: routeTableId.toString(),
            SubnetId: subnetId.toString()
        };
        await this.#client.send(new AssociateRouteTableCommand(params));

    }

    /**
     * @brief Disassociate a route table and a subnet
     * @param {string} routeTableName
     * @param {string} subnetName
     * @exception RouteTableNotFoundException if routeTable doesn't exist
     * @exception RouteTableAssociationNotFoundException if association doesn't exist
     */
    async disassociate(routeTableName) {
        if (!await this.exists(routeTableName)) throw new RouteTableNotFoundException();

        let RouteTableAssociationId = await this.findAssociationId(routeTableName);
        if (RouteTableAssociationId === null) throw new RouteTableAssociationNotFoundException();

        var params = {
            AssociationId: RouteTableAssociationId
        };
        await this.#client.send(new DisassociateRouteTableCommand(params));
    }

    /**
     * @brief Verify if the route table is associated to a subnet
     * @param {string} name
     * @exception RouteTableNotFoundException
     * @returns true if it is associated
     */
    async isAssociated(name) {
        let id = await this.findId(name);
        if (id === null) throw new RouteTableNotFoundException();

        const command = new DescribeRouteTablesCommand({
            RouteTableIds: [id]
        });
        const routeTable = await this.#client.send(command);
        return routeTable.RouteTables[0].Associations.length > 0;
    }


    /**
     * @brief create a route table associated with a vpc.
     * @param {string} routeTableName
     * @param {string} vpcName
     * @param {string} resourceType
     * @exception VpcNotFoundException if vpc doesn't exist
     * @exception RouteTableAlreadyExistsException if vpc already exist
     */
    async create(routeTableName, vpcName, resourceType = "route-table") {
        let vpcId = await this.#vpcHelper.findId(vpcName);
        if (vpcId === null) throw new VpcNotFoundException();
        if(await this.exists(routeTableName)) throw new RouteTableAlreadyExistsException();

        var params = {
            VpcId: vpcId,
            TagSpecifications: [
                {
                    ResourceType: resourceType,
                    Tags: [
                        {
                            Key: "Name",
                            Value: routeTableName
                        },
                    ]
                },
            ]
        };

        const command = new CreateRouteTableCommand(params);
        const response = await this.#client.send(command);
    }

    /**
     * @brief Delete a route table by it's name
     * @param {string} name
     * @exception RouteTableNotFoundException if the route table doesn't exists
     */
    async delete(name) {
        let id = await this.findId(name);
        if (id === null) throw new RouteTableNotFoundException();
        // Todo check if it is associated and throw appropriate exception
        var params = {
            RouteTableId: id
        };

        const command = new DeleteRouteTableCommand(params);
        await this.#client.send(command);
    }

    /**
     * @brief Verify if a route table exists by it's name
     * @param {string} name
     * @returns true if route table exists
     */
    async exists(name) {
        return await this.findId(name) !== null;
    }

    /**
     * @brief Find a route table id by its name
     * @param {string} name
     * @returns id or null
     */
    async findId(name) {
        var params = {
            Filters: [
                {
                    Name: "tag:Name",
                    Values: [name,],
                },
            ],
        };
        const command = new DescribeRouteTablesCommand(params);
        const routeTable = await this.#client.send(command);
        if (routeTable.RouteTables.length === 0) return null;
        return routeTable.RouteTables[0].RouteTableId;
    }

    /**
     * @brief Find a associationId by its name
     * @param {string} name
     * @returns associationId or null
     */
     async findAssociationId(name) {
        var params = {
            Filters: [
                {
                    Name: "tag:Name",
                    Values: [name,],
                },
            ],
        };
        const command = new DescribeRouteTablesCommand(params);
        const routeTable = await this.#client.send(command);
        if (routeTable.RouteTables.length === 0) return null;
        return routeTable.RouteTables[0].Associations[0].RouteTableAssociationId;
    }
}