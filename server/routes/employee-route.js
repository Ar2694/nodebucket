/*
============================================
; Title: employee-route.js
; Author: Professor Krasso
; Date: 29 March 2021
; Modified By: Arlix Sorto
; Description: Week 4
;===========================================
*/
const express = require("express");
const Employee = require("../db-models/employee");
const BaseResponse = require("../service/base-response");
const router = express.Router();

/**
 * API: FindEmployee
 * @param empId
 * @returns Return Employee document or null by empId
 */

router.get("/:empId", async (req, res) => {

    try {
        /***Find data from employee collection by empId */
        Employee.findOne({ empId: req.params.empId }, function (err, employee) {
            /**Check for an errors */
            if (err) {
                console.log(err);

                const mongoDBErrorResponse = new BaseResponse("500", `MongoDB Native Error: ${err}`, null);
                res.json(mongoDBErrorResponse.toObject());
            }
            /**Or else send the employee object and response*/ 
            else {
                console.log(employee);
                const employeeResponse = new BaseResponse("200", "Successful query", employee);
                res.json(employeeResponse.toObject());
            }
        });
    }

    catch (e) {
        console.log(e);
        const findEmployeeCatchError = new BaseResponse("500", `Internal Server Error: ${e.message}`, null);
        res.json(findEmployeeCatchError.toObject());
    }
});


/**
 * API: findAllTasks
 * @param empId
 * @returns Return all the Employee tasks
 */
router.get("/:empId/tasks", async (req, res) => {

    try {
        /***Find data from employee collection by empId */
        Employee.findOne({ empId: req.params.empId }, "empId todo inProgress done", function (err, employee) {

            /**Check for an errors */
            if (err) {
                console.log(err);

                const mongoDBFindAllTasksException = new BaseResponse("500", `Internal server error ${err.message}`, null);

                res.status(500).send(mongoDBFindAllTasksException.toObject());
            }
            /**Or else send the employee object and response*/
            else {
                console.log(employee);

                const employeeTaskResponse = new BaseResponse("200", "Query successful", employee);
                res.status(200).send(employeeTaskResponse.toObject());
            }
        }
        );
    } catch (e) {
        const errorCatchResponse = new BaseResponse("500", `Internal server error ${e.message}`, null);

        res.status(500).send(errorCatchResponse.toObject());
    }
});
/**
 * API: findATask
 * @param empId
 * @param taskId
 * @returns Return a specific task by empId and taskId.
 */
router.get("/:empId/tasks/:taskId", async (req, res) => {
    try {
        /***Find data from employee collection by empId and taskId*/
        Employee.findOne({ empId: req.params.empId }, function (err, employee) {

            /**Check for an errors */
            if (err) {
                console.log(err);
                const getTaskMongoDbError = new BaseResponse("500", `Internal server error ${err.message}`, null);

                res.status(500).send(getTaskMongoDbError.toObject());
            }
            /** Or else send a taskItem object and response*/
            else {

                /**Check if employee is valid or not null*/
                if (employee) {

                    /**Find a specific task in each task array by task Id */
                    const todoItem = employee.todo.find(
                        (item) => item._id.toString() === req.params.taskId
                    );
                    const inProgressItem = employee.inProgress.find(
                        (item) => item._id.toString() === req.params.taskId
                    );
                    const doneItem = employee.done.find(
                        (item) => item._id.toString() === req.params.taskId
                    );
                    /**Check if todoItem is found */
                    if (todoItem) {
                        console.log("todoItem found!");
                        console.log(todoItem);

                        const getTodoItemSuccess = new BaseResponse("200", "Query successful", todoItem);
                        res.status(200).send(getTodoItemSuccess.toObject());

                    }
                    /**Check if inProgressItem is found */
                    else if (inProgressItem) {
                        console.log("inProgressItem found!");
                        console.log(inProgressItem);

                        const getInProgressItemSuccess = new BaseResponse("200", "Query Successful", inProgressItem);
                        res.status(200).send(getInProgressItemSuccess);

                    }
                    /**Check if doneItem is found */
                    else if (doneItem) {
                        console.log("doneItem found!");
                        console.log(doneItem);
                     
                        const getDoneItemSuccess = new BaseResponse("200", "Query Successful", doneItem);
                        res.status(200).send(getDoneItemSuccess);


                    }
                    /** Or else send invalid taskId response and null */
                    else {

                        const invalidTaskIdResponse = new BaseResponse("200", "Invalid taskId", null);
                        res.status(200).send(invalidTaskIdResponse.toObject());
                    }
                }
                /** Or else send a Invalid employeeId response and null*/
                else {

                    const invalidEmployeeIdResponse = new BaseResponse("200", "Invalid employeeId", null);
                    res.status(200).send(invalidEmployeeIdResponse.toObject());
                }

            }
        });
    } catch (e) {
        console.log(e);

        const getTaskCatchError = new BaseResponse("500", `Internal server error ${e.message}`, null);
        res.status(500).send(getTaskCatchError.toObject());
    }
});

/**
 * API: createTask
 * @param empId
 * @returns Create a new task.
 */

router.post("/:empId/tasks", async (req, res) => {
    try {
        /***Find data from employee collection by empId */
        Employee.findOne({ empId: req.params.empId }, function (err, employee) {
            /**Check for any errors */
            if (err) {
                console.log(err);

                const createTaskMongoDbError = new BaseResponse("500", `MongoDb Exception: ${err.message}`, null);
                res.status(500).send(createTaskMongoDbError.toObject());
            } 
            /** Or else create/save a task, send a response and updated employee object*/
            else {
                /**Check if employee is not null or valid*/
                if (employee) {

                    console.log(employee.todo);
                
                    /***Save new task into To-Do tasks*/
                    const item = {
                        text: req.body.text
                    };
                    employee.todo.push(item);

                    employee.save(function (err, updatedEmployee) {
                        /**Check for any errors */
                        if (err) {
                            console.log(err);

                            const createTaskOnSaveMongoDbError = new BaseResponse("500", `MongoDB save exception: ${err.message}`, null);
                            res.status(500).send(createTaskOnSaveMongoDbError.toObject());
                        } 
                         /** Or else send a response and updated employee object*/
                        else {
                            console.log(updatedEmployee);

                            const createTaskOnSaveSuccessResponse = new BaseResponse("200", "Successful query", updatedEmployee);
                            res.status(200).send(createTaskOnSaveSuccessResponse.toObject());
                        }
                    });
                } 
                /**Or else send invalid employeeId response and null */
                else {

                    console.log("Invalid employeeId");

                    const invalidEmployeeResponse = new BaseResponse("200", "Invalid employeeId", null);
                    res.status(200).send(invalidEmployeeResponse.toObject());
                }
            }
        });
    } catch (e) {
        console.log(e);

        const createTaskCatchException = new BaseResponse("500", `Internal Server Error: ${e.message}`, null);
        res.status(500).send(createTaskCatchException.toObject());
    }
});

/**
 * API: updateTask
 * @param empId
 * @returns Update tasks by empId.
 */
router.put("/:empId/tasks", async (req, res) => {
    try {
        /***Find data from employee collection by empId */
        Employee.findOne({ empId: req.params.empId }, function (err, employee) {
            /**Check for any errors */
            if (err) {
                console.log(err);

                const updateTaskMongodbException = new BaseResponse("500", `Internal server error ${err.message}`, null);
                res.status(500).send(updateTaskMongodbException.toObject());
            }
            /**Or else update employee tasks */
            else {
                console.log(employee);
                
                /**Check if employee is not null or valid*/
                if (employee) {
                    employee.set({
                        todo: req.body.todo,
                        inProgress: req.body.inProgress,
                        done: req.body.done,
                    });
                    employee.save(function (err, updatedEmployee) {
                        /**Check for any errors */
                        if (err) {
                            console.log(err);

                            const updateTaskMongoDbError = new BaseResponse("500", `Internal server error ${err.message}`, null);
                            res.status(500).send(updateTaskMongoDbError.toObject());
                        } 
                        /**Or else send response and the updated employee object */
                        else {
                            console.log(updatedEmployee);

                            const updateTaskSuccessResponse = new BaseResponse("200", "Query Successful", updatedEmployee);
                            res.status(200).send(updateTaskSuccessResponse.toObject());
                        }
                    });
                } 
                 /**Or else send invalid employeeId response and null */
                else {

                    const invalidEmployeeIdResponse = new BaseResponse("200", "Invalid employeeId", null);
                    res.status(200).send(invalidEmployeeIdResponse.toObject());
                }
            }
        });
    } catch (e) {
        console.log(e);

        const updateTaskCatchResponse = new BaseResponse("500", `Internal server error ${e.message}`, null);
        res.status(500).send(updateTaskCatchResponse.toObject());
    }
});

/**
 * API: deleteTask
 * @param empId
 * @param taskId
 * @returns Delete a task by empId and taskId
 */
router.delete("/:empId/tasks/:taskId", async (req, res) => {
    try {
           /***Find data from employee collection by empId and taskId */
        Employee.findOne({ empId: req.params.empId }, function (err, employee) {

            /**Check for any errors */
            if (err) {
                console.log(err);
                const deleteTaskMongoDbError = new BaseResponse("500", `Internal server error ${err.message}`, null);
                res.status(500).send(deleteTaskMongoDbError.toObject());
            } 
            /**Or else find and delete a task */
            else {
                /**Check if employee is not null or valid*/
                if (employee) {
                    console.log(employee);

                    const todoItem = employee.todo.find(
                        (item) => item._id.toString() === req.params.taskId
                    );
                    const inProgressItem = employee.inProgress.find(
                        (item) => item._id.toString() === req.params.taskId
                    );
                    const doneItem = employee.done.find(
                        (item) => item._id.toString() === req.params.taskId
                    );
                    /** Check if todo item is found */
                    if (todoItem) {
                        console.log(todoItem);

                        employee.todo.id(todoItem._id).remove();
                        employee.save(function (err, updatedTodoItemEmployee) {
                            if (err) {
                                console.log(err);

                                const deleteTodoItemMongodbError = new BaseResponse("500", `Internal server error ${err.message}`, null);

                                res.status(500).send(deleteTodoItemMongodbError.toObject());
                            } else {
                                console.log(updatedTodoItemEmployee);

                                const deleteTodoItemSuccess = new BaseResponse("200", "Query successful", updatedTodoItemEmployee);

                                res.status(200).send(deleteTodoItemSuccess.toObject());
                            }
                        });
                    } 
                    /**Check if in-progress item is found */
                    else if (inProgressItem) {
                        console.log(inProgressItem);

                        employee.inProgress.id(inProgressItem._id).remove();
                        employee.save(function (err, updatedInProgressItemEmployee) {
                            if (err) {
                                console.log(err);

                                const deleteinProgressItemMongodbError = new BaseResponse("500", `Internal server error ${err.message}`, null);

                                res.status(500).send(deleteinProgressItemMongodbError.toObject());
                            } else {
                                console.log(updatedInProgressItemEmployee);

                                const deleteInProgressItemSuccess = new BaseResponse("200", "Query Successful", updatedInProgressItemEmployee);

                                res.status(200).send(deleteInProgressItemSuccess);
                            }
                        });
                    }
                    /**Check if done item is found */
                    else if (doneItem) {
                        console.log(doneItem);

                        employee.done.id(doneItem._id).remove();
                        employee.save(function (err, updatedDoneItemEmployee) {
                            if (err) {
                                console.log(err);

                                const deleteDoneItemMongodbError = new BaseResponse("500", `Internal server error ${err.message}`, null);
                                res.status(500).send(deleteDoneItemMongodbError.toObject());
                            } else {
                                console.log(updatedDoneItemEmployee);

                                const deleteDoneItemSuccess = new BaseResponse("200", "Query Successful", updatedDoneItemEmployee);
                                res.status(200).send(deleteDoneItemSuccess);
                            }
                        });
                    } 
                    /**Or else send an invalid taskId response and null */
                    else {

                        const invalidTaskIdResponse = new BaseResponse("200", "Invalid taskId", null);
                        res.status(200).send(invalidTaskIdResponse.toObject());
                    }
                } else {

                    const invalidEmployeeIdResponse = new BaseResponse("200", "Invalid employeeId", null);

                    res.status(200).send(invalidEmployeeIdResponse.toObject());
                }

            }
        });
    } catch (e) {
        console.log(e);

        const deleteTaskCatchError = new BaseResponse("500", `Internal server error ${e.message}`, null);
        res.status(500).send(deleteTaskCatchError.toObject());
    }
});
module.exports = router;
