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
const IgwException = require("../igw/IgwException.js");
const IgwNotFoundException = require("../igw/IgwNotFoundException.js");
const IgwNameNotAvailable = require("../igw/IgwNameNotAvailable.js");


test('createOne_CreateIgw_Success', async () => {
    // given
    let name = "Igw-deploy-1";

    // when
    let newIgw = await Igw.createOne(name);

    // then
    expect(newIgw.igwId).not.toEqual(null);
})

test('createOne_NameNotAvailable_ThrowException', async() => {
    // given
    let name = "Igw-deploy-1";

    // when, then
    expect(Igw.createOne(name)).rejects.toThrow(IgwNameNotAvailable);
})

test('find_getExistingIgw_success', async () => {
    // given
    let name = "Igw-deploy-1";

    // when
    let igw = await Igw.find(name);

    //then
    expect(igw.igwId).not.toEqual(null);
})

test('find_getNotExistentIgw_success',  async () => {
    // given
    let name = "Igw-deploy-2";

    // when
    let anIgw = await Igw.find(name);

    //then
    expect(anIgw).toEqual(null);
})

/**
 * @depends-on find_getExistingIgw_success 
 * @depends-on find_getNotExistentIgw_success
 */
test('allGetters_NominalCase_Success', async() => {
    // given
    let name = "Igw-deploy-1";

    // when
    let igw = await Igw.find(name);

    // then
    expect(igw.name).toEqual(name);
    expect(igw.igwId).not.toEqual(null);
})

test('create_CreateIgw_Success', async() => {
    // given
    let name = "Igw-deploy-2";

    // when
    let newIgw = new Igw(name);
    await newIgw.create();

    // then
    expect(newIgw.igwId).not.toEqual(null);
})

test('create_NameNotAvailable_ThrowException', async() => {
    // given
    let name = "Igw-deploy-2";

    // when
    let newIgw = new Igw(name);

    // when, then
    expect(newIgw.create()).rejects.toThrow(IgwNameNotAvailable);
})

test('exists_NameIsNotUsed_Success', async() =>{
    // given
    let name = "Igw-deploy-20";

    // when
    let result = await Igw.exists(name);

    // then
    expect(result).toEqual(false);
})

test('exists_NameAlreadyInUse_Success', async() =>{
    // given
    let name = "Igw-deploy-2";

    // when
    let result = await Igw.exists(name);

    // then
    expect(result).toEqual(true);
})

test('findId_GetIdOfAnExistingIgw_Success', async () =>{
    // given
    let name = "Igw-deploy-1";

    // then
    let result = await Igw.findId(name);

    // when
    expect(result).not.toEqual(null);
})

test('findId_GetIdOfNonExistentIgw_Success', async() =>{
    // given
    let name = "Igw-deploy-3";

    // when
    let result = await Igw.findId(name);

    // then
    expect(result).toEqual(null);
})

/**
 * depdends-on findId_GetIdOfAnExistingIgw_Success
 */
test('deleteOne_DeleteAnExistingIgw_Success', async() => {
    // given
    let name = "Igw-deploy-1";

    // when
    await Igw.deleteOne(name);

    // then
    let id = await Igw.findId(name);
    expect(id).toEqual(null);
})

test('deleteOne_DeleteNonExistentIgw_ThrowException', async() => {
    // given
    let name = "Igw-deploy-10";

    // when, then
    expect(Igw.deleteOne(name)).rejects.toThrow(IgwNotFoundException);
})

test('all_getAllExistentIgw_Success', async() => {
    // given igw
    // when
    let list = await Igw.all();
    expect(list.length).not.toEqual(0);
})

// Requires that no Igw exists
// test('all_NoExistingIgw_Success', async() => {
//    // given igw
//    // when
//    let list = await Igw.all();
//    expect(list.length).toEqual(0);
// })

/**
 * @depends-on find_getExistingIgw_success
 * @depends-on find_getNotExistentIgw_success
 */
 test('delete_deleteAnExistingIgw_Success', async () => {
    // given
    let name = "Igw-deploy-2";
    let anIgw = await Igw.find(name);

    // when
    await anIgw.delete();

    // then
    let sameIgw = await Igw.find(name);
    expect(sameIgw).toEqual(null);
})

/**
 * @depends-on find_getExistingIgw_success
 * @depends-on find_getNotExistentIgw_success
 */
 test('delete_deleteNonExistentIgw_ThrowException', async () => {
    // given
    let name = "Igw-deploy-20";
    let anIgw = new Igw(name);

    // when, then
    expect(anIgw.delete()).rejects.toThrow(IgwNotFoundException);
})