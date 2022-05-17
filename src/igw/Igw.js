/**
 * @file      Igw.js
 * @brief     This class is designed to manage an aws Internet Gateway
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 */

"use strict";

const client = require('../config').client;
const IgwcException = require("./IgwException");
const IgwNotFoundException = require("./IgwNotFoundException");
const IgwNameNotAvailable = require("../igw/IgwNameNotAvailable");


module.exports = class Igw {


    //region private attributes
    igwId = null;
    name = null;
    //endregion private attributes

    /**
     * Constructor 
     * @param name : name of the internet gateway
     * @param id : Id of an existing internet gateway
     */
    constructor(name, id = null) {  
    }
    
    /**
     * @brief This property gets the internet gateway id
     * @returns igw id
     */
    igwId(){
        throw new Error('Method not implemented.');
    }    

    /**
     * @brief This property gets the name of the internet gateway
     * @returns name
     */
    name(){
        throw new Error('Method not implemented.');
    }

    /**
     * @brief This method creates an igw with the given name in the constructor
     * @param name : name of the internet gateway 
     * @returns 
     * @exception IgwNameNotAvailable is thrown when the name is already in use
     */
    create(){
      throw new Error('Method not implemented.');
    }  

    /**
     * @brief This method deletes an internet gateway by its name
     * @exception IgwNotFoundException is thrown when attempts to delete non-existent Igw
     */
    delete(){
        throw new Error('Method not implemented.');
    }

    /**
     * @brief This method checks if an Igw already exists with the given name
     * @param name:  name of the internet gateway
     * @returns true if name is available
     */
    static exists(name){
        throw new Error('Method not implemented.');
    }
    
    /**
     * @brief This method returns the the internet gatway object by its name
     * @param name: name of the internet gateway  to find
     * @returns undefined if igw doesn't exist
     */
    static find(name){
        throw new Error('Method not implemented.');
    }

    /**
     * @brief This method returns the id of the internet gatway by its name
     * @param name: name of the internet gateway to find
     */
    static findId(name){
        throw new Error('Method not implemented.');
    }

    /**
     * @brief This method create an igw with the given name
     * @param name : name of the internet gateway
     * @exception IgwNameNotAvailable is thrown when the name is already in use
     */
    static createOne(name){
       throw new Error("Method not implemented");
    }

    /**
     * @brief This method deletes an internet gateway by its name
     * @param name 
     * @exception IgwNotFoundException is thrown when attempts to delete non-existent Igw
     */
    static deleteOne(name){
        throw new Error('Method not implemented.');
    }

    /**
     * @brief This method get all existing internet gateway.
     * @returns list of internet gateway
     */
    static all(){
        throw new Error('Method not implemented.');
    }

}
