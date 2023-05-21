import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {User} from "./user";
import {catchError, retry} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users : User[]= [];

  private api = 'http://padlet.s2010456001.student.kwmhgb.at/api';

  constructor(private http: HttpClient) {}

  fetchUsers() : Observable<Array<User>>{
    return this.http.get<Array<User>>(`${this.api}/users`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllUsers() {
    this.fetchUsers().subscribe(res => this.users = res);
    // return this.users;
  }

  getCurrentUser(){
    this.getAllUsers();
    for(let user of this.users){
      if(user.id == this.getCurrentUserId()){
        return user;
      }
    }
    return undefined;
  }

  getCurrentUserId(){
    let current_user_id = sessionStorage.getItem('user_id');
    if(current_user_id) return parseInt(current_user_id);
    return 0;
  }

  private errorHandler(error: Error | any) : Observable<any>{
    return throwError(error);
  }
}
