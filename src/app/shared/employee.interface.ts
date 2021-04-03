/*
============================================
; Title: employee.interface.ts
; Author: Professor Krasso
; Date: 29 March 2021
; Modified By: Arlix Sorto
; Description: Week 4
;===========================================
*/
import { Item } from './item.interface'

export interface Employee{
    empId: string;
    todo: Item[];
    inProgress: Item[];
    done: Item[];
}