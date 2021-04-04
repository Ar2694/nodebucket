/*
============================================
; Title: base-response.js
; Author: Professor Krasso
; Date: 29 March 2021
; Modified By: Arlix Sorto
; Description: Week 4
;===========================================
*/

/**
 * @params
 * @returns
 */
class BaseResponse {
    /**
     * 
     * @param {*} httpCode String http status code
     * @param {*} message  Message you want the user to see
     * @param {*} data  Return an acutal data object or null.
     */
    constructor(httpCode, message, data) {
        this.httpCode = httpCode,
            this.message = message,
            this.data = data,
            this.timestamp = new Date().toLocaleString('en-US')
    }

    /**
     * toObject() function for returning an object.
     * @returns new object literal with all of the BaseResponse fields
     */
    toObject() {

        return {
            'httpCode': this.httpCode,
            'message': this.message,
            'data': this.data,
            'timestamp': this.timestamp
        }
    }
}
module.exports = BaseResponse;