/**
 * @file      Igw.js
 * @brief     This class is designed to manage an aws Internet Gateway
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 */

"use strict";

const config = require('../config');
const IgwcException = require("./IgwException");
const IgwNotFoundException = require("./IgwNotFoundException");
const IgwNameNotAvailable = require("../igw/IgwNameNotAvailable");


module.exports = class Igw {


    //region private attributes
    #client = null;
    igwId = null;
    name = null;
    //endregion private attributes

    constructor() {
    }
    
    /**
     * @brief This method creates an igw with the given name
     * @param name : name of the internet gateway 
     * @exception IgwNameNotAvailable is thrown when the name is already in use
     */
    create(name){
        throw new Error('Method not implemented.');
    }

    /**
     * @brief This property gets the internet gateway id
     */
    igwId(){
        throw new Error('Method not implemented.');
    }    

    /**
     * @brief This property gets the name of the internet gateway
     */
    name(){
        throw new Error('Method not implemented.');
    }

    /**
     * @brief This method checks if the name is available
     * @param name:  name of the internet gateway   
     */
    static nameAvailable(name){
        throw new Error('Method not implemented.');
    }
    
    /**
     * @brief This method returns the id of the internet gatway by its name
     * @param name: name of the internet gateway  to find
     */
    static findId(name){
        throw new Error('Method not implemented.');
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
