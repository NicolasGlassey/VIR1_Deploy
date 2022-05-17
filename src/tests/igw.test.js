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
const { findId } = require('../igw/Igw.js');


test('constructor_NameAlreadyInUse_throwException', () => {
    // given
    let name = "Igw-deploy-1";

    // when, then
    expect(() => new Igw(name)).toThrow(IgwNameNotAvailable);
})


 test('create_CreateIgw_Success', () => {
    // given
    let name = "Igw-deploy-1";
    
    // when
    let newIgw = Igw.create(name);
    
    // then
    expect(newIgw.igwId).not.toEqual(null);
})

/**
 * @depends-on findId_GetIdOfAnExistingIgw_Success
 */
test('allGetters_NominalCase_Success', () => {
    // given
    let name = "Igw-deploy-2";

    // when
    let newIgw = new Igw(name);

    // then
    expect(name).toEqual(newIgw.name);
    expect(id).not.toEqual(null);
})


test('create_NameNotAvailable_ThrowException', () => {
    // given
    let name = "Igw-deploy-1";

    // when, then
    expect(() => Igw.create(name)).toThrow(IgwNameNotAvailable);
})

test('exists_NameIsNotUsed_Success', () =>{
    // given
    let name = "Igw-deploy-3";
    
    // when 
    let result = Igw.exists(name);

    // then
    expect(result).toEqual(true);
})

test('exists_NameAlreadyInUse_Success', () =>{
    // given
    let name = "Igw-deploy-1";
    
    // when 
    let result = Igw.exists(name);

    // then
    expect(result).toEqual(false);
})

test('findId_GetIdOfAnExistingIgw_Success', () =>{
    // given
    let name = "Igw-deploy-1";

    // then
    let result = Igw.findId(name);

    // when
    expect(result).not.toEqual(null);
})

test('findId_GetIdOfNonExistentIgw_Success', () =>{
    // given
    let name = "Igw-deploy-3";

    // when
    let result = Igw.findId(name);

    // then
    expect(result).toEqual(null);
})

/**
 * @depends-on findId_GetIdOfNonExistentIgw_Success
 */
test('deleteOne_DeleteAnExistingIgw_Success', () => {
    // given
    let name = "Igw-deploy-1";

    // when
    Igw.deleteOne(name);
    
    // then
    let id = Igw.findId(name);
    expect(id).toEqual(null);
})

test('deleteOne_DeleteNonExistentIgw_ThrowException', () => {
    // given
    let name = "Igw-deploy-3";
     
    // when, then
    expect(() => Igw.deleteOne(name)).toThrow(IgwNotFoundException);
})

test('all_getAllExistentIgw_Success', () => {
    // given igw
    // when
    let list =  Igw.all();
    expect(list.length).not.toEqual(0);
})

test('all_NoExistingIgw_Success', () => {
    // given igw
    // when
    let list =  Igw.all();
    expect(list.length).toEqual(0);
})

test('find_getExistingIgw_success', () => {
    // given
    let name = "Igw-deploy-2";

    // when
    let anIgw = Igw.find(name);

    //then
    expect(anIgw).not.toEqual(null);
})

test('find_getNotExistentIgw_success', () =>{
    // given
    let name = "Igw-deploy-2";

    // when
    let anIgw = Igw.find(name);

    //then
    expect(anIgw).toEqual(null);
})

/**
 * @depends-on find_getExistingIgw_success
 * @depends-on find_getNotExistentIgw_success
 */
 test('delete_deleteAnExistingIgw_Success', () => {
    // given
    let name = "Igw-deploy-2";
    let anIgw = find(name);

    // when
    anIgw.delete();
    
    // then
    let findAfterDelete = Igw.find(name);
    expect(findAfterDelete).toEqual(null);
})