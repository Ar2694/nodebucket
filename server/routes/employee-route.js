const express = require("express");
const Employee = require("../db-models/employee");
const BaseResponse = require("../service/base-response");
const router = express.Router();

/**
 * @param empId
 * @returns Employee document or null
 */

router.get("/:empId", async (req, res) => {
    try {
        Employee.findOne({ empId: req.params.empId }, function (err, employee) {
            if (err) {
                console.log(err);

                const mongoDBErrorResponse = new BaseResponse("500", `MongoDB Native Error: ${err}`,null );
                res.json(mongoDBErrorResponse.toObject());
            } else {
                console.log(employee);
                const employeeeResponse = new BaseResponse("200","Successful query",employee);
                res.json(employeeeResponse.toObject());
            }
        });
    } catch (e) {
        console.log(e);
        const findEmployeeCatchError = new BaseResponse("500", `Internal Server Error: ${e.message}`,null);
        res.json(findEmployeeCatchError.toObject());
    }
});

/**
 * API: findAllTasks
 */
router.get("/:empId/tasks", async (req, res) => {
    try {
        Employee.findOne({ empId: req.params.empId }, "empId todo done", function (err, employee) {
            if (err) {
                console.log(err);

                const mongoDBFindAllTasksException = new BaseResponse("500", `Internal server error ${err.message}`, null);

                res.status(500).send(mongoDBFindAllTasksException.toObject());
            } else {
                console.log(employee);

                const employeeTaskResponse = new BaseResponse("200","Query successful", employee);
                res.status(200).send(employeeTaskResponse.toObject());
            }
        }
        );
    } catch (e) {
        const errorCatchResponse = new BaseResponse("500",`Internal server error ${e.message}`,null);

        res.status(500).send(errorCatchResponse.toObject());
    }
});

/**
 * API: createTask
 */

router.post("/:empId/tasks", async (req, res) => {
    try {
        Employee.findOne({ empId: req.params.empId }, function (err, employee) {
            if (err) {
                console.log(err);

                const createTaskMongoDbError = new BaseResponse("500",`MongoDb Exception: ${err.message}`, null); 

                res.status(500).send(createTaskMongoDbError.toObject());
            } else {
               
                if (employee) {

                    console.log(employee.todo);

                    const item = {
                        text: req.body.text
                    };

                    employee.todo.push(item);

                    employee.save(function (err, updatedEmployee) {
                        if (err) {
                            console.log(err);

                            const createTaskOnSaveMongoDbError = new BaseResponse("500",`MongoDB save exception: ${err.message}`,null);

                            res.status(500).send(createTaskOnSaveMongoDbError.toObject());
                        } else {
                            console.log(updatedEmployee);

                            const createTaskOnSaveSuccessResponse = new BaseResponse("200","Successful query", updatedEmployee);

                            res.status(200).send(createTaskOnSaveSuccessResponse.toObject());
                        }
                    });
                } else {

                    console.log("Invalid employeeId");

                    const invalidEmployeeResponse = new BaseResponse( "200","Invalid employeeId",null);

                    res.status(200).send(invalidEmployeeResponse.toObject());
                }
            }
        });
    } catch (e) {
        console.log(e);

        const createTaskCatchException = new BaseResponse("500",`Internal Server Error: ${e.message}`,null);

        res.status(500).send(createTaskCatchException.toObject());
    }
});

/**
 * API: updateTask
 */
router.put("/:empId/tasks", async (req, res) => {
    try {
        Employee.findOne({ empId: req.params.empId }, function (err, employee) {
            if (err) {
                console.log(err);

                const updateTaskMongodbException = new BaseResponse("500",`Internal server error ${err.message}`,null);

                res.status(500).send(updateTaskMongodbException.toObject());
            } else {
                console.log(employee);

                if (employee) {
                    employee.set({
                        todo: req.body.todo,
                        done: req.body.done,
                    });

                    employee.save(function (err, updatedEmployee) {
                        if (err) {
                            console.log(err);

                            const updateTaskMongoDbError = new BaseResponse("500",`Internal server error ${err.message}`, null );

                            res.status(500).send(updateTaskMongoDbError.toObject());
                        } else {
                            console.log(updatedEmployee);

                            const updateTaskSuccessResponse = new BaseResponse("200", "Query Successful", updatedEmployee);

                            res.status(200).send(updateTaskSuccessResponse.toObject());
                        }
                    });
                } else {
                 
                    const invalidEmployeeIdResponse = new BaseResponse("200","Invalid employeeId",null);

                    res.status(200).send(invalidEmployeeIdResponse.toObject());
                }
            }
        });
    } catch (e) {
        console.log(e);

        const updateTaskCatchResponse = new BaseResponse("500",`Internal server error ${e.message}`, null);

        res.status(500).send(updateTaskCatchResponse.toObject());
    }
});

/**
 * API: deleteTask
 */
router.delete("/:empId/tasks/:taskId", async (req, res) => {
    try {
        Employee.findOne({ empId: req.params.empId }, function (err, employee) {
            if (err) {
                console.log(err);
                const deleteTaskMongoDbError = new BaseResponse("500", `Internal server error ${err.message}`,null );

                res.status(500).send(deleteTaskMongoDbError.toObject());
            } else {

                if (employee) {
                    console.log(employee);

                    const todoItem = employee.todo.find(
                        (item) => item._id.toString() === req.params.taskId
                    );
                    const doneItem = employee.done.find(
                        (item) => item._id.toString() === req.params.taskId
                    );
    
                    if (todoItem) {
                        console.log(todoItem);
    
                        employee.todo.id(todoItem._id).remove();
    
                        employee.save(function (err, updatedTodoItemEmployee) {
                            if (err) {
                                console.log(err);
    
                                const deleteTodoItemMongodbError = new BaseResponse("500",`Internal server error ${err.message}`, null);
    
                                res.status(500).send(deleteTodoItemMongodbError.toObject());
                            } else {
                                console.log(updatedTodoItemEmployee);
    
                                const deleteTodoItemSuccess = new BaseResponse("200", "Query successful", updatedTodoItemEmployee);
    
                                res.status(200).send(deleteTodoItemSuccess.toObject());
                            }
                        });
                    } else if (doneItem) {
                        console.log(doneItem);
    
                        employee.done.id(doneItem._id).remove();
    
                        employee.save(function (err, updatedDoneItemEmployee) {
                            if (err) {
                                console.log(err);
    
                                const deleteDoneItemMongodbError = new BaseResponse("500",`Internal server error ${err.message}`,null);
    
                                res.status(500).send(deleteDoneItemMongodbError.toObject());
                            } else {
                                console.log(updatedDoneItemEmployee);
    
                                const deleteDOneItemSuccess = new BaseResponse("200","Query Successful", updatedDoneItemEmployee);
    
                                res.status(200).send(updatedDoneItemEmployee);
                            }
                        });
                    } else {
                      
                        const invalidTaskIdResponse = new BaseResponse("200", "Invalid taskId",null);
    
                        res.status(200).send(invalidTaskIdResponse.toObject());
                    }
                } else {
                 
                    const invalidEmployeeIdResponse = new BaseResponse("200","Invalid employeeId", null);

                    res.status(200).send(invalidEmployeeIdResponse.toObject());
                }
            
            }
        });
    } catch (e) {
        console.log(e);

        const deleteTaskCatchError = new BaseResponse("500",`Internal server error ${e.message}`, null);

        res.status(500).send(deleteTaskCatchError.toObject());
    }
});
module.exports = router;
