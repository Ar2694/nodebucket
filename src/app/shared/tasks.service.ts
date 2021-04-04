/*
============================================
; Title: tasks.service.ts
; Author: Professor Krasso
; Date: 29 March 2021
; Modified By: Arlix Sorto
; Description: Week 4
;===========================================
*/ 
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from './item.interface';


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: HttpClient) {
   
   }

   /**
    * 
    * @param empId 
    * @returns Find all tasks from the API. 
    */
   findAllTasks(empId: string): Observable<any> {
    return this.http.get('/api/employees/' + empId + '/tasks')
  }
 /**
   * 
   * @param empId 
   * @param taskId 
   * @returns Find a task from the API.
   */
  findATask(empId: string, taskId: string): Observable<any>{
    return this.http.get(`/api/employees/${empId}/tasks/${taskId}`);
  }
  /**
   * 
   * @param empId 
   * @param task 
   * @returns Create and send a task to the API.
   */
  createTask(empId: string, task: string): Observable<any>{
    return this.http.post('/api/employees/' + empId + '/tasks', {
      text: task
    });

  }

  /**
   * 
   * @param empId 
   * @param todo 
   * @param inProgress 
   * @param done 
   * @returns Update task arrays in the API.
   */
  updateTask(empId: string, todo: Item[],inProgress: Item[], done: Item[]): Observable<any>{
    return this.http.put(`/api/employees/${empId}/tasks`, {
      todo,
      inProgress,
      done
    });
  }

  
  /**
   * 
   * @param empId 
   * @param taskId 
   * @returns Delete a task in the API
   */
  deleteTask(empId: string, taskId: string): Observable<any>{
    return this.http.delete(`/api/employees/${empId}/tasks/${taskId}`);
  }
}
