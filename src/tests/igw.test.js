/**
 * @file      igw.test.js
 * @brief     This class is designed to test the behaviour of an IGW (Internet Gateway).
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 *
 */

 "use strict";

const config = require('../config.js');
const Igw = require("../igw/Igw.js");
const IgwNotFoundException = require("../igw/IgwNotFoundException.js");
const IgwNameNotAvailable = require("../igw/IgwNameNotAvailable.js");

test('create_CreateIgw_Success', async() => {
    // given
    let name = "Igw-test-deploy-1";

    // when
    let igw = new Igw(config.client);
    let id = await igw.create(name);

    // then
    expect(id).not.toEqual(null);
})

test('create_NameNotAvailable_ThrowException', async () => {
    // given
    let name = "Igw-test-deploy-1";
    let igw = new Igw(config.client);

    // when, then
    await expect(igw.create(name)).rejects.toThrow(IgwNameNotAvailable);
})

test('findId_GetIdOfAnExistingIgw_Success', async () =>{
    // given
    let name = "Igw-test-deploy-1";

    // then
    let igw = new Igw(config.client);
    let id = await igw.findId(name);

    // when
    expect(id).not.toEqual(null);
})

test('findId_GetIdOfNonExistentIgw_Success', async() =>{
    // given
    let name = "Igw-test-deploy-100";

    // when
    let igw = new Igw(config.client);
    let id = await igw.findId(name);

    // then
    expect(id).toEqual(null);
})

test('exists_NameIsNotUsed_Success', async() =>{
    // given
    let name = "Igw-deploy-200";

    // when
    let igw = new Igw(config.client);
    let result = await igw.exists(name);
    
    // then
    expect(result).toEqual(false);
})

test('exists_NameAlreadyInUse_Success', async() =>{
    // given
    let name = "Igw-test-deploy-1";

    // when
    let igw = new Igw(config.client);
    let result = await igw.exists(name);

    // then
    expect(result).toEqual(true);
})

test('all_GetListOfAllIgw_Success', async() => {
    // given 
    let igw = new Igw(config.client);
    
    // when
    let list = await igw.all();

    // then
    expect(list.length).not.toEqual(0);
})

// Requires to delete all Igw before run this test
//test('all_NoIgwExists_Success', async() => {
    // given 
//    let igw = new Igw(config.client);
    
    // when
//    let list = await igw.all();

    // then
//    expect(list.length).toEqual(0);
//})

/**
 * @depends-on find_getExistingIgw_success
 * @depends-on find_getNotExistentIgw_success
 */
 test('delete_deleteAnExistingIgw_Success', async () => {
    // given
    let name = "Igw-test-deploy-1";
    let igw = new Igw(config.client);

    // when
    await igw.delete(name);

    // then
    let id = await igw.findId(name);
    expect(id).toEqual(null);
})

/**
 * @depends-on find_getExistingIgw_success
 * @depends-on find_getNotExistentIgw_success
 */
 test('delete_deleteNonExistentIgw_ThrowException', async () => {
    // given
    let name = "Igw-test-deploy-100";
    let igw = new Igw(config.client);

    // when, then
    await expect(igw.delete(name)).rejects.toThrow(IgwNotFoundException);
})