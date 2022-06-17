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
const SubnetNotFoundException = require("../subnet/SubnetNotFoundException.js");

const RouteTableHelper = require("../routeTable/RouteTableHelper.js");
const RouteTableAlreadyExistsException = require("../routeTable/RouteTableAlreadyExistsException.js");
const RouteTableNotFoundException = require("../routeTable/RouteTableNotFoundException.js");


beforeEach(() => {
});


test('create_NominalCase_Success', async() => {
    // given
    
    // when

    // then
})

test('create_VpcDoesNotExist_ThrowException', async() => {
})

test('associate_NominalCase_Success', async() => {
    // given
    
    // when

    // then
})

test('associate_VpcNotFound_ThrowException', async() => {
    // given

    // when

    // then
})

test('deasassociate_NominalCase_Success', async() => {
    // given

    // when

    // then
})

test('deasassociate_VpcNotFound_ThrowException', async() => {
    // given

    // when

    // then
})

test('state_Associated_Success', async() => {
    // given

    // when

    // then
})

test('state_Deasassociated_Success', async() => {
    // given

    // when

    // then
})

test('delete_Deasassociated_Success', async() => {
    // given

    // when

    // then
})

test('delete_Associated_ThrowException', async() => {
    // given

    // when

    // then
})

test('exists_NominalCase_Success', async() => {
    // given

    // when

    // then
})

test('exists_NotTableRoute_Success', async() => {
    // given

    // when

    // then
})

test('findId_TableRouteExists_Success', async() => {
    // given

    // when

    // then
})

test('findId_TableRouteDoesNotExist_Success', async() => {
    // given

    // when

    // then
})

test('all_TableRoutesExist_Success', async() => {
    // given

    // when

    // then
})