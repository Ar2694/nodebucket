/*
============================================
; Title: employee.js
; Author: Professor Krasso
; Date: 29 March 2021
; Modified By: Arlix Sorto
; Description: Week 4
;===========================================
*/ 
const mongoose = require('mongoose');
const Item = require('./item');

let employeeSchema = mongoose.Schema({
    empId: { type: String, unique: true },
    todo: [Item],
    inProgress: [Item],
    done: [Item],
}, {collection: "employees"});

module.exports = mongoose.model("Employee", employeeSchema);