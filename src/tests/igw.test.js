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
const IgwAlreadyExistsException = require("../igw/IgwAlreadyExistsException.js");

//TODO NGY add Before Each function (igwName, igw)

let igw = null;
let igwName = "";

beforeEach(() => {
    igw = new Igw();
    igwName = "myIgwName";
});

test('exists_NominalCase_Success', async() => {
    // given
    // refer to before each method

    // when
    //Event is called directly by the assertion

    // then
    expect(await igw.exists(igwName)).toEqual(true);
})

test('exists_NotFound_Success', async() => {
    // given
    // refer to before each method

    // when

    // then
    expect(await igw.exists(igwName)).toEqual(false);
})

test('create_CreateIgw_Success', async() => {
    // given
    // refer to before each method

    // when
    let igw = new Igw();
    await igw.create(name);

    // then
    //test if exists using the igw name
})

test('create_IgwAlreadyExists_ThrowException', async () => {
    // given
    // refer to before each method

    // when
    await expect(igw.create(name)).rejects.toThrow(IgwAlreadyExistsException);

    // then
    // Exception is thrown
})

test('all_GetListOfAllIgw_Success', async() => {
    // given 
    // refer to before each method

    // when
    let list = await igw.all();

    // then
    expect(list.length).not.toEqual(0);
})

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