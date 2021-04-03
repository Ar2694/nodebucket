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

  openEditTaskDialog(taskId: string) {
    
    if(taskId){
      console.log(`Task item ${taskId} was found!`);
      this.taskService.findATask(this.empId, taskId).subscribe(res=>{
      
        this.employee = res.data;
        console.log("Check here please");
        console.log(this.employee);
       
      }, err => {
        console.log(err);
      }, () => {
        const dialogRef = this.dialog.open(EditTaskDialogComponent, {
          disableClose: true,
          data:{ data: this.employee}
        });

        dialogRef.afterClosed().subscribe(data => {
   console.log("after close");
   console.log(data);
   const todoIndex = this.todo.findIndex(obj => obj._id === data._id);
   const inProgressIndex = this.inProgress.findIndex(obj => obj._id === data._id);
   const doneIndex = this.done.findIndex(obj => obj._id === data._id);
 

   if(todoIndex != -1){
    console.log(this.todo[todoIndex].text);
    this.todo[todoIndex].text = data.text;
    this.updateTaskList(this.empId, this.todo,this.inProgress, this.done);
   }else if(inProgressIndex != -1){
    console.log(this.inProgress[inProgressIndex].text);
    this.inProgress[inProgressIndex].text = data.text;
    this.updateTaskList(this.empId, this.todo,this.inProgress, this.done);
   }else if(doneIndex != -1){
    console.log(this.done[doneIndex].text);
    this.done[doneIndex].text = data.text;
    this.updateTaskList(this.empId, this.todo,this.inProgress, this.done);
   }


        });
        

      });
    }

    

   
  }

  drop(event: CdkDragDrop<any[]>){
    if(event.previousContainer === event.container){
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log("Reorderd item in an existing column/array");
      this.updateTaskList(this.empId, this.todo,this.inProgress, this.done);
    }else{
      transferArrayItem(event.previousContainer.data, event.container.data,event.previousIndex, event.currentIndex);
      console.log("Reorderd task to a diffent column/array");
   
      this.updateTaskList(this.empId, this.todo,this.inProgress, this.done);
    }
  }
  findATask(taskId: string): void {

    const currentTask = null;

    if(taskId){
      console.log(`Task item ${taskId} was found!`);
      this.taskService.findATask(this.empId, taskId).subscribe(res=>{
      
        this.employee = res.data;

       
      }, err => {
        console.log(err);
      }, () => {
        console.log("Check here");
        console.log(this.employee);

      });
    }
  }

  
  deleteTask(taskId: string): void {
    if(taskId){
      console.log(`Task item ${taskId} was deleted`);
      this.taskService.deleteTask(this.empId, taskId).subscribe(res=>{
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
   * 
   * @param empId 
   * @param todo 
   * @param done 
   */
  private updateTaskList(empId: string, todo: Item[], inProgress: Item[], done: Item[]): void{
    this.taskService.updateTask(empId, todo,inProgress,done).subscribe(res=>{
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
