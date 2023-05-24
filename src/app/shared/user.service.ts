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

  /**
   * Diese Methode ruft alle Benutzer vom Server ab, indem sie eine GET-Anfrage an die API-URL sendet. Sie gibt ein
   * Observable zurück, das die Antwort mit einem Array von Benutzerobjekten enthält. Die Methode verwendet die retry- und
   * catchError-Operatoren, um fehlgeschlagene Anfragen abzufangen und Fehler zu behandeln.
   */
  fetchUsers() : Observable<Array<User>>{
    return this.http.get<Array<User>>(`${this.api}/users`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  /**
   * Diese Methode ruft alle Benutzer ab und speichert sie im lokalen users-Array. Sie abonniert
   * das Observable von fetchUsers() und weist das Ergebnis dem users-Array zu.
   */
  getAllUsers() {
    this.fetchUsers().subscribe(res => this.users = res);
  }

  /**
   * Diese Methode liest die aktuelle Benutzer-ID aus der Sitzungsspeicherung (sessionStorage) und gibt
   * sie als Ganzzahl zurück. Wenn keine Benutzer-ID gefunden wird, wird 0 zurückgegeben.
   */
  getCurrentUserId(){
    let current_user_id = sessionStorage.getItem('user_id');
    if(current_user_id) return parseInt(current_user_id);
    return 0;
  }

  /**
   * Diese private Methode wird verwendet, um Fehler abzufangen und als Observable zurückzugeben.
   * @param error
   * @private
   */
  private errorHandler(error: Error | any) : Observable<any>{
    return throwError(error);
  }
}
