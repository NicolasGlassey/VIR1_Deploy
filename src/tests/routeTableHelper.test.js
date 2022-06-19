/**
* @file      routeTableHelper.test.js
* @brief     This class is designed to test the behaviour of an route table.
* @author    Mélodie Ohan
* @version   14-06-2022 - original (dedicated to VIR1)
*/

"use strict";

const {EC2Client} = require("@aws-sdk/client-ec2");

const VpcHelper = require('../vpc/VpcHelper.js');
const VpcNotFoundException = require("../vpc/VpcNotFoundException.js");

const SubnetHelper = require('../subnet/subnetHelper.js');

const RouteTableHelper = require("../routeTable/RouteTableHelper.js");
const RouteTableAlreadyExistsException = require("../routeTable/RouteTableAlreadyExistsException.js");
const RouteTableNotFoundException = require("../routeTable/RouteTableNotFoundException.js");


  let vpcHelper, routeTableHelper, vpcName, vpcCidr, routeTableName, region, subnetName;

  let subnetHelper, subnetCidr, availabilityZone;

beforeAll(() => {
    region = "eu-west-3";
    routeTableHelper = new RouteTableHelper(region);
    vpcHelper = new VpcHelper(region);
    vpcName = "vpc-deploy-test";
    vpcCidr = "10.0.0.0/16";
    subnetCidr = "10.0.0.0/24";
    routeTableName = "routeTable-deploy-test"
    subnetName = "subnet-deploy-test";
    subnetHelper = new SubnetHelper(region);
    availabilityZone = "eu-west-3a";
});

beforeEach(async()=>{
    if(await vpcHelper.exists(vpcName) === false) await vpcHelper.create(vpcName, vpcCidr);
    if(await routeTableHelper.exists(routeTableName) === false) await routeTableHelper.create(routeTableName, vpcName);
})

afterEach(async () => {
    if(await subnetHelper.exists(subnetName)) await subnetHelper.delete(subnetName);
    if(await routeTableHelper.exists(routeTableName) === true) await routeTableHelper.delete(routeTableName);
    if(await vpcHelper.exists(vpcName) === true) await vpcHelper.delete(vpcName);
});


test('findId_NominalCase_Success', async() => {
    // given
    // refer to beforeAll method

    // when
    // refer to beforeEach method

    // then
    expect(await routeTableHelper.findId(routeTableName)).not.toEqual(null)
})

test('findId_NonExistentRouteTable_Success', async() => {
    // given
    let notUsedName = "NonExistentRouteTable";

    // when
    // nothing is created

    // then
    expect(await routeTableHelper.findId(notUsedName)).toEqual(null);
})

test('exists_NominalCase_Success', async() => {
    // given
    // refer to beforeAll method

    // when
    // refer to beforeEach method

    // then
    expect(await routeTableHelper.exists(routeTableName)).toEqual(true)
})

test('findId_NonExistentRouteTable_Success', async() => {
    // given
    let notUsedName = "NonExistentRouteTable";

    // when
    // nothing is created

    // then
    expect(await routeTableHelper.exists(notUsedName)).toEqual(false);
})

test('create_NominalCase_Success', async() => {
    // given
    // refer to beforeAll method

    // when
    // refer to beforeEach method

    // then
    expect(await routeTableHelper.exists(routeTableName)).toEqual(true)
})

test("cerate_RouteTableAlreadyExists_ThrowException", async () => {
        // given
        //refer to beforeEach method

        // when
        await expect(routeTableHelper.create(routeTableName, vpcName)).rejects.toThrow(RouteTableAlreadyExistsException);
    
        // then
        // Exception is thrown
})

test('create_VpcDoesNotExist_ThrowException', async() => {
    // given
    let nonExistentVpc = "non-existent";
    
    // when
    await expect(routeTableHelper.create(routeTableName, nonExistentVpc)).rejects.toThrow(VpcNotFoundException);

    // then
    // Exception is thrown
})
  
test('delete_NominalCase_Success', async() => {
    // given
    // refer to beforeEach and beforeAll methods

    // when
    await routeTableHelper.delete(routeTableName);

    // then
    expect(await routeTableHelper.exists(routeTableName)).toEqual(false)
})

test("delete_RouteTableNotFound_ThrowException", async () => {
    // given
    let NonExistentRouteTable = "non-existant";

    //when
    await expect(routeTableHelper.delete(NonExistentRouteTable)).rejects.toThrow(RouteTableNotFoundException);

    // then
    // Exception is thrown
})

test('isAssociated_NoAssociation_Success', async() => {
    // given
    // refer to beforeEach and beforeAll methods

    if(await subnetHelper.exists(subnetName) === false) await subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone);

    if (await routeTableHelper.isAssociated(routeTableName) === true) await routeTableHelper.disassociate(routeTableName, subnetName);

    // when

    // then
    expect(await routeTableHelper.isAssociated(routeTableName)).toEqual(false);
})

test('isAssociated_RouteTableAssociated_Success', async() => {
    // given
    // refer to beforeEach and beforeAll methods

    if(await subnetHelper.exists(subnetName) === false) await subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone);

    if (await routeTableHelper.isAssociated(routeTableName) === false) await routeTableHelper.associate(routeTableName, subnetName);

    // when
    expect(await routeTableHelper.isAssociated(routeTableName)).toEqual(true);

})

test('isAssociated_RouteTableDisassociated_Success', async() => {
    // given
    // refer to beforeEach and beforeAll methods

    if(await subnetHelper.exists(subnetName) === false) await subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone);

    await routeTableHelper.associate(routeTableName, subnetName);

    await routeTableHelper.disassociate(routeTableName, subnetName);
    // when
    expect(await routeTableHelper.isAssociated(routeTableName)).toEqual(false);

})