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
    * @returns 
    */
   findAllTasks(empId: string): Observable<any> {
    return this.http.get('/api/employees/' + empId + '/tasks')
  }

  /**
   * 
   * @param empId 
   * @param task 
   * @returns 
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
   * @param done 
   * @returns 
   */
  updateTask(empId: string, todo: Item[], done: Item[]): Observable<any>{
    return this.http.put(`/api/employees/${empId}/tasks`, {
      todo,
      done
    });
  }

  
  /**
   * 
   * @param empId 
   * @param taskId 
   * @returns 
   */
  deleteTask(empId: string, taskId: string): Observable<any>{
    return this.http.delete(`/api/employees/${empId}/tasks/${taskId}`);
  }
}
