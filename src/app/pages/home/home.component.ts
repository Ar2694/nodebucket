/*
============================================
; Title: home.component.ts
; Author: Professor Krasso
; Date: 29 March 2021
; Modified By: Arlix Sorto
; Description: Week 4
;===========================================
*/
import { Component, OnInit } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { Employee } from 'src/app/shared/employee.interface';
import { Item } from 'src/app/shared/item.interface';
import { TasksService } from 'src/app/shared/tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskDialogComponent } from 'src/app/shared/create-task-dialog/create-task-dialog.component';
import { EditTaskDialogComponent } from 'src/app/shared/edit-task-dialog/edit-task-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  todo: Item[];
  inProgress: Item[];
  done: Item[];
  employee: Employee;
  empId: string;

  constructor(private taskService: TasksService, private cookieService: CookieService, private dialog: MatDialog) {
    this.empId = this.cookieService.get('session_user');

    /**Find and populate column tasks. */
    this.taskService.findAllTasks(this.empId).subscribe(res => {
      console.log('--Server response from findAllTasks--');
      console.log(res);

      this.employee = res.data;
      console.log(this.employee);


    }, err => {
      console.log(err);
    }, () => {
      this.todo = this.employee.todo;
      this.inProgress = this.employee.inProgress;
      this.done = this.employee.done;

      console.log("This is in the complete section");
      console.log(this.todo);
      console.log(this.inProgress);
      console.log(this.done);
    });
  }

  ngOnInit(): void {
  }
/**
 * Function: Open a create new task dialog
 */
  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.taskService.createTask(this.empId, data.text).subscribe(res => {
          this.employee = res.data;
        }, err => {
          console.log(err);
        }, () => {
          this.todo = this.employee.todo;
          this.inProgress = this.employee.inProgress;
          this.done = this.employee.done;
        });
      }
    });
  }
/**
 * 
 * @param taskId 
 * @returns Open Edit task dialog for editing task.
 */
  openEditTaskDialog(taskId: string) {
    /**Check if taskId is valid */
    if (taskId) {
     
      /***Find data from employee collection by empId and taskId */
      this.taskService.findATask(this.empId, taskId).subscribe(res => {
        this.employee = res.data;
   
      }, err => {
        console.log(err);
      }, () => {
        const dialogRef = this.dialog.open(EditTaskDialogComponent, {
          disableClose: true,
          data: { data: this.employee }
        });

        /**dialog function after it's closed */
        dialogRef.afterClosed().subscribe(data => {
        
          /**Find task index with a matching task id */
          const todoIndex = this.todo.findIndex(item => item._id === data._id);
          const inProgressIndex = this.inProgress.findIndex(item => item._id === data._id);
          const doneIndex = this.done.findIndex(item => item._id === data._id);

          /**Check if todo task is found */
          if (todoIndex != -1) {
       
            this.todo[todoIndex].text = data.text;
            this.updateTaskList(this.empId, this.todo, this.inProgress, this.done);
          }
             /**Check if inprogress task is found */
          else if (inProgressIndex != -1) {
           
            this.inProgress[inProgressIndex].text = data.text;
            this.updateTaskList(this.empId, this.todo, this.inProgress, this.done);
          } 
             /**Check if done task is found */
          else if (doneIndex != -1) {
   
            this.done[doneIndex].text = data.text;
            this.updateTaskList(this.empId, this.todo, this.inProgress, this.done);
          }


        });


      });
    }

  }

  /**
   * Function:  Drag n drop task will update the task list.
   * @param event 
   * @returns Drag n drop task will update the task list.
   */
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log("Reorderd item in an existing column/array");
      this.updateTaskList(this.empId, this.todo, this.inProgress, this.done);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      console.log("Reorderd task to a diffent column/array");

      this.updateTaskList(this.empId, this.todo, this.inProgress, this.done);
    }
  }

  /**
   * Function: Find a specific task.
   * @param taskId 
   * @returns Find a specific task.
   */
  findATask(taskId: string): void {

    if (taskId) {
      console.log(`Task item ${taskId} was found!`);
      this.taskService.findATask(this.empId, taskId).subscribe(res => {

        this.employee = res.data;


      }, err => {
        console.log(err);
      }, () => {
        console.log("Check here");
        console.log(this.employee);

      });
    }
  }

/**
 * Function: Delete a specific task.
 * @param taskId 
 * @returns  Delete a specific task.
 */
  deleteTask(taskId: string): void {
    if (taskId) {
      console.log(`Task item ${taskId} was deleted`);
      this.taskService.deleteTask(this.empId, taskId).subscribe(res => {
        this.employee = res.data;
      }, err => {
        console.log(err);
      }, () => {
        this.todo = this.employee.todo;
        this.inProgress = this.employee.inProgress;
        this.done = this.employee.done;
      });
    }
  }

 /**
  * Function: Update the task list
  * @param empId 
  * @param todo 
  * @param inProgress 
  * @param done 
  */
  private updateTaskList(empId: string, todo: Item[], inProgress: Item[], done: Item[]): void {
    this.taskService.updateTask(empId, todo, inProgress, done).subscribe(res => {
      this.employee = res.data;

    }, err => {
      console.log(err);
    }, () => {
      this.todo = this.employee.todo;
      this.inProgress = this.employee.inProgress;
      this.done = this.employee.done;
    });
  }
}
