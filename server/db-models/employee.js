const mongoose = require('mongoose');
const Item = require('./item');

let employeeSchema = mongoose.Schema({
    empId: { type: String, unique: true },
    todo: [Item],
    done: [Item],
}, {collection: "employees"});

module.exports = mongoose.model("Employee", employeeSchema);