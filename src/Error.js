/**
 * @file      Error.js
 * @brief     This class represent the error message.
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 */

 module.exports =  class Error {
    #message;
    constructor(message) {
        this.#message = message;
    }

    get message(){
        return this.#message;
    }
}
