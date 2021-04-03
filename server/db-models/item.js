/*
============================================
; Title: item.js
; Author: Professor Krasso
; Date: 29 March 2021
; Modified By: Arlix Sorto
; Description: Week 4
;===========================================
*/ 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let itemSchema = new Schema({

  text: { type: String },
});

module.exports = itemSchema;