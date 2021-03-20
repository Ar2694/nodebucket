import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup;
  errorMessage: string;

  constructor(private fb: FormBuilder, private router: Router, private cookieService: CookieService, private http: HttpClient, private snackBar: MatSnackBar) {


   }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      empId: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]

    });
  }

  login(){
    const empId = this.loginForm.controls['empId'].value;

    this.http.get('/api/employees/'+ empId).subscribe(res => {
      if(res['data']){
        this.cookieService.set('session_user', empId, 1);
        this.router.navigate(['/']);
      }
      else if(!(res['data'] && (res['httpCode'] === '200'))){
        this.openSnackBar('Invalid employeeId, please try again', 'WARNING');
      }
      else{
        this.openSnackBar(res['message'], 'ERROR');
     
      }
    })
  }

  openSnackBar(message: string, notificationType: string) : void
  {
    this.snackBar.open(message, notificationType,{
      duration: 3000,
      verticalPosition: 'top'
    })
  }
}
