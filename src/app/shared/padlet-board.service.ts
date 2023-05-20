import { Injectable } from '@angular/core';
import {Comment, Image, Like, Padlet, User} from "./padlet";
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PadletBoardService {

  private api = 'http://padlet.s2010456001.student.kwmhgb.at/api';


  constructor(private http: HttpClient) {}

  getAll() : Observable<Array<Padlet>>{
    return this.http.get<Array<Padlet>>(`${this.api}/padlets`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getSingle(id: number) : Observable<Padlet>{
    return this.http.get<Padlet>(`${this.api}/padlets/${id}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  create (padlet : Padlet) : Observable<any> {
    return this.http.post(`${this.api}/padlets`, padlet).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  update (padlet : Padlet) : Observable<any> {
    return this.http.put(`${this.api}/padlets/${padlet.id}`, padlet).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  remove (id : number) : Observable<any> {
    return this.http.delete(`${this.api}/padlets/${id}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  like (padlet : Padlet) : Observable<any> {
    return this.http.put(`${this.api}/padlets/likes/${padlet.id}`, padlet).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  dislike (padlet : Padlet, user_id: number) : Observable<any> {
    return this.http.delete(`${this.api}/padlets/likes/${padlet.id}/${user_id}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }


  private errorHandler(error: Error | any) : Observable<any>{
    return throwError(error);
  }

}
