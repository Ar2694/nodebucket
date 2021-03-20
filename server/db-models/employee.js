const mongoose = require('mongoose');

let employeeSchema = mongoose.Schema({
    empId: { type: String, unique: true }
}, {collection: "employees"});

module.exports = mongoose.model("Employee", employeeSchema);