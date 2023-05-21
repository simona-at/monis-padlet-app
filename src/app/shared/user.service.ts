import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {User} from "./user";
import {catchError, retry} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private api = 'http://padlet.s2010456001.student.kwmhgb.at/api';

  constructor(private http: HttpClient) {}

  getAllUsers() : Observable<Array<User>>{
    return this.http.get<Array<User>>(`${this.api}/users`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: Error | any) : Observable<any>{
    return throwError(error);
  }
}
