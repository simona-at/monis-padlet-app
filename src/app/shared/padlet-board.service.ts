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

  /**
   * Diese Methode ruft alle Padlets ab, indem sie einen HTTP-GET-Aufruf an den API-Endpunkt /padlets durchführt.
   * Sie gibt ein Observable zurück, das ein Array von Padlet-Objekten enthält.
   */
  getAll() : Observable<Array<Padlet>>{
    return this.http.get<Array<Padlet>>(`${this.api}/padlets`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  /**
   * Diese Methode ruft ein einzelnes Padlet anhand der angegebenen ID ab, indem sie einen HTTP-GET-Aufruf an den API-Endpunkt /padlets/{id} durchführt.
   * Sie gibt ein Observable zurück, das ein einzelnes Padlet-Objekt enthält.
   * @param id
   */
  getSingle(id: number) : Observable<Padlet>{
    return this.http.get<Padlet>(`${this.api}/padlets/${id}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  /**
   * Diese Methode erstellt ein neues Padlet, indem sie einen HTTP-POST-Aufruf an den API-Endpunkt /padlets mit den Daten des
   * zu erstellenden Padlets durchführt. Sie gibt ein Observable zurück.
   * @param padlet
   */
  create (padlet : Padlet) : Observable<any> {
    return this.http.post(`${this.api}/padlets`, padlet).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  /**
   * Diese Methode aktualisiert ein vorhandenes Padlet, indem sie einen HTTP-PUT-Aufruf an den API-Endpunkt /padlets/{id} mit
   * den aktualisierten Daten des Padlets durchführt. Sie gibt ein Observable zurück.
   * @param padlet
   */
  update (padlet : Padlet) : Observable<any> {
    return this.http.put(`${this.api}/padlets/${padlet.id}`, padlet).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  /**
   * Diese Methode löscht ein Padlet anhand der angegebenen ID, indem sie einen HTTP-DELETE-Aufruf an den API-Endpunkt /padlets/{id}
   * durchführt. Sie gibt ein Observable zurück.
   * @param id
   */
  remove (id : number) : Observable<any> {
    return this.http.delete(`${this.api}/padlets/${id}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  /**
   * Diese Methode fügt einem Padlet einen "Like" hinzu, indem sie einen HTTP-PUT-Aufruf an den API-Endpunkt /padlets/likes/{id} mit
   * den Daten des Padlets durchführt. Sie gibt ein Observable zurück.
   * @param padlet
   */
  like (padlet : Padlet) : Observable<any> {
    return this.http.put(`${this.api}/padlets/likes/${padlet.id}`, padlet).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  /**
   * Diese Methode entfernt den "Like" eines Benutzers von einem Padlet, indem sie einen HTTP-DELETE-Aufruf an den
   * API-Endpunkt /padlets/likes/{id}/{user_id} mit den entsprechenden IDs durchführt. Sie gibt ein Observable zurück.
   * @param padlet
   * @param user_id
   */
  dislike (padlet : Padlet, user_id: number) : Observable<any> {
    return this.http.delete(`${this.api}/padlets/likes/${padlet.id}/${user_id}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  /**
   * Diese Methode fügt einem Padlet einen Kommentar hinzu, indem sie einen HTTP-PUT-Aufruf an den API-Endpunkt /padlets/comments/{id}
   * mit den Daten des Padlets durchführt. Sie gibt ein Observable zurück.
   * @param padlet
   */
  comment (padlet : Padlet) : Observable<any> {
    return this.http.put(`${this.api}/padlets/comments/${padlet.id}`, padlet).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  /**
   * Diese Methode ist eine private Hilfsmethode, die einen Fehler oder eine Ausnahme abfängt und ein Observable mit dem Fehler als Wert zurückgibt.
   * @param error
   * @private
   */
  private errorHandler(error: Error | any) : Observable<any>{
    return throwError(error);
  }

}
