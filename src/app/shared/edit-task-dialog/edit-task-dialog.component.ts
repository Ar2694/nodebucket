import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from 'src/app/shared/item.interface';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit {

  taskForm: FormGroup;
  taskItem: Item;

  constructor(private dialogRef: MatDialogRef<EditTaskDialogComponent>, @Inject(MAT_DIALOG_DATA) data, private fb: FormBuilder) {
    this.taskItem = {
      _id: data.data._id,
      text: data.data.text,
    }


  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      text: [this.taskItem.text, Validators.compose([Validators.required])]
    });

    console.log(this.taskItem.text);
  }
  /**Get new task new and update task list */
  EditTask() {
    this.taskItem.text = this.taskForm.value.text,

      console.log(this.taskItem);
    this.dialogRef.close(this.taskItem);
  }

  cancel() {
    this.dialogRef.close();
  }
}
