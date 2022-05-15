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

var igw;

beforeAll(() => {
    this.igw = new Igw();
});

/**
 * @depends-on findId_GetIdOfNonExistentIgw_Success
 */
 test('create_CreateIgw_Success', () => {
    // given
    let name = "Igw-deploy-1";
    
    // when
    this.igw.create(name);
    
    // then
    let id = Igw.findId(name);    // request aws to get name
    expect(id).not.toEqual(null);
})

test('create_NameNotAvailable_ThrowException', () => {
    // given
    let name = "Igw-deploy-1";

    // when, then
    expect(() => this.igw.create(name)).toThrow(IgwNameNotAvailable);
})

test('nameAvailable_NameIsNotUsed_Success', () =>{
    // given
    let name = "Igw-deploy-2";
    
    // when 
    let result = Igw.nameAvailable(name);

    // then
    expect(result).toEqual(true);
})

test('nameAvailable_NameAlreadyInUse_Success', () =>{
    // given
    let name = "Igw-deploy-2";
    
    // when 
    let result = Igw.nameAvailable(name);

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
    let name = "Igw-deploy-2";

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
    let name = "Igw-deploy-2";
     
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
    expect(list.length).not.toEqual(0);
})