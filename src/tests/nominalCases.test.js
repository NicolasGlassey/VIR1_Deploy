/**
 * @file      nominalCases.test.js
 * @brief     This class is designed to test the behaviour of all nominal cases.
 * @author    Cyril Goldenschue
 * @version   18-06-2022 - original (dedicated to VIR1)
 *
 */

 "use strict";
 const VpcHelper = require("../vpc/VpcHelper.js");
 const IgwHelper = require("../igw/IgwHelper.js");
 const SubnetHelper = require("../subnet/SubnetHelper.js");
 const RouteTableHelper = require("../routeTable/RouteTableHelper.js");

let vpcName, vpcCidr, igwName, subnetName, subnetCidr, availabilityZone, routeTableName;
let vpcHelper, igwHelper, subnetHelper, routeTableHelper;


   
beforeAll (() => {
    vpcHelper = new VpcHelper("eu-west-3");
    igwHelper = new IgwHelper("eu-west-3");
    subnetHelper = new SubnetHelper("eu-west-3");
    routeTableHelper = new RouteTableHelper("eu-west-3");

    //vpc
    vpcName = "Vpc_Deploy_NominalCase";
    vpcCidr = "10.0.0.0/16";

    //igw
    igwName = "Igw_Deploy_NominalCase";

    //subnet
    subnetName = "Subnet_Deploy_NominalCase"
    subnetCidr = "10.0.0.0/24";
    availabilityZone = "eu-west-3a";

    //routeTable
    routeTableName = "RouteTable_Deploy_NominalCase"

});



//region creation

test("createVpc_NominalCase_Success", async () => {
    //given

    //when
    await vpcHelper.create(vpcName, vpcCidr);

    //then
    expect(await vpcHelper.exists(vpcName)).toEqual(true);
});

test("createIgw_NominalCase_Success", async () => {
    //given

    //when
    await igwHelper.create(igwName);

    //then
    expect(await igwHelper.exists(igwName)).toEqual(true);
});

test("attach_NominalCase_Success", async () => {
    //Given
    expect(await igwHelper.state(igwName)).toEqual("detached")

    //When
    await igwHelper.attach(igwName, vpcName)

    //Then
    expect(await igwHelper.state(igwName)).toEqual("attached")
});

test("createSubnet_NominalCase_Success", async () => {
    // given

    // when
    await subnetHelper.create(subnetName, vpcName, subnetCidr, availabilityZone);

    // then
    expect(await subnetHelper.exists(subnetName)).toEqual(true);
})



//TODO routeTable
test("createRouteTable_NominalCase_Success", async () => {
    // given

    // when
    await routeTableHelper.create(routeTableName);

    // then
    expect(await routeTableHelper.exists(routeTableName)).toEqual(true);
})
//endregion creation











//region delete
//TODO vérifier l'ordre
//TODO routeTable
test("deleteRouteTable_NominalCase_Success", async () => {
    // given

    // when
    await routeTableHelper.delete(routeTableName);

    // then
    expect(await routeTableHelper.exists(routeTableName)).toEqual(false);
})



test("deleteSubnet_NominalCase_Success", async () => {
    // given

    // when
    await subnetHelper.delete(subnetName);

    // then
    expect(await subnetHelper.exists(subnetName)).toEqual(false);
})

test("detach_NominalCase_Success", async () => {
    //Given
    expect(await igwHelper.state(igwName)).toEqual("attached")

    //When
    await igwHelper.detach(igwName)

    //Then
    expect(await igwHelper.state(igwName)).toEqual("detached")
});

test('deleteIgw_NominalCase_Success', async () => {
    // given

    // when
    await igwHelper.delete(igwName);

    // then
    expect(await igwHelper.exists(igwName)).toEqual(false);
})

test("deleteVpc_NominalCase_Success", async () => {
    //given

    //when
    await vpcHelper.delete(vpcName);

    //then
    expect(await vpcHelper.exists(vpcName)).toEqual(false);
});
//endregion delete