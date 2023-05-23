import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../shared/authentication.service";
import {UserService} from "../shared/user.service";
import {User} from "../shared/user";

interface Response {
  access_token: string;
}

@Component({
  selector: 'bs-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  loginForm : FormGroup;
  users : User[] = [];
  user : User | undefined;
  current_user_name = "";
  loading : boolean = true;


  constructor(private fb : FormBuilder,
              private router : Router,
              private authService : AuthenticationService,
              private userservice : UserService
  ) {
    this.loginForm = this.fb.group({});
  }

  ngOnInit():void{
    this.userservice.fetchUsers().subscribe(res =>{
      this.users = res;
      this.getCurrentUser();
      this.getUserName();
      this.loading = false;
    });
    this.loginForm = this.fb.group({
      username : ["", [Validators.required, Validators.email]],
      password : ["", [Validators.required]]
    });
  }

  login(){
    const val = this.loginForm.value;
    if(val.username && val.password){
      this.authService.login(val.username, val.password).subscribe((res: any) => {
        this.authService.setSessionStorage((res as Response).access_token);
        this.router.navigateByUrl("/");
      });
    }
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  logout(){
    return this.authService.logout();
  }


  getCurrentUser(){
    if(this.users){
      for(let user of this.users){
        if(user.id == this.userservice.getCurrentUserId()){
          this.user = user;
          break;
        }
      }
    }
  }

  getUserName(){
    if(this.user){
      this.current_user_name = this.user.first_name + "";
    }
  }


}
