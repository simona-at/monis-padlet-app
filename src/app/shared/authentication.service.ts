import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import jwt_decode from "jwt-decode";
import {ActivatedRoute, Router} from "@angular/router";

interface Token{
  exp: number;
  user: {
    id : string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private api = 'http://padlet.s2010456001.student.kwmhgb.at/api/auth';

  constructor(private http: HttpClient){}

  /**
   * Diese Methode führt einen HTTP-POST-Aufruf an die Login-API-Endpunkt durch, um sich mit den angegebenen
   * Anmeldeinformationen anzumelden. Sie akzeptiert die E-Mail-Adresse und das Passwort als Parameter und gibt
   * das HTTP-Response-Objekt zurück.
   * @param email
   * @param password
   */
  public login (email:string, password: string){
    return this.http.post(`${this.api}/login`, {
      email:email,
      password:password
    });
  }

  /**
   * Diese Methode nimmt das Zugriffstoken als Parameter und decodiert es, um die Benutzer-ID aus dem Token zu extrahieren.
   * Anschließend werden das Zugriffstoken und die Benutzer-ID im Session Storage gespeichert.
   * @param token
   */
  public setSessionStorage(token:string){
    const decodedToken = jwt_decode(token) as Token;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user_id", decodedToken.user.id);
  }

  /**
   * Diese Methode führt einen HTTP-POST-Aufruf an die Logout-API-Endpunkt durch, um die aktuelle Sitzung des Benutzers zu beenden.
   * Sie entfernt auch das Zugriffstoken und die Benutzer-ID aus dem Session Storage.
   */
  public logout(){
    this.http.post(`${this.api}/logout`, {});
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
  }

  /**
   * Diese Methode überprüft, ob der Benutzer aktuell eingeloggt ist, indem sie das im Session Storage gespeicherte Zugriffstoken
   * überprüft. Sie decodiert das Zugriffstoken, um das Ablaufdatum zu erhalten, und vergleicht es mit der aktuellen Zeit.
   * Wenn das Ablaufdatum kleiner als die aktuelle Zeit ist, wird false zurückgegeben, andernfalls true.
   */
  public isLoggedIn() : boolean{
    if (sessionStorage.getItem("token")) {
      let token : string = <string>sessionStorage.getItem("token");
      const decodedToken = jwt_decode(token) as Token;
      let expirationDate : Date = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      if (expirationDate < new Date()){
        return false;
      }
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Diese Methode gibt den umgekehrten Wert von isLoggedIn() zurück. Sie überprüft, ob der Benutzer ausgeloggt ist.
   */
  public isLoggedOut(): boolean{
    return !this.isLoggedIn();
  }
}
