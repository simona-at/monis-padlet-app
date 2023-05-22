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

  constructor(private http: HttpClient){} //, private router: Router, private route: ActivatedRoute) { }

  public login (email:string, password: string){
    return this.http.post(`${this.api}/login`, {
      email:email,
      password:password
    });
  }

  public setSessionStorage(token:string){
    // console.log(jwt_decode(token));
    const decodedToken = jwt_decode(token) as Token;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user_id", decodedToken.user.id);
  }

  public logout(){
    this.http.post(`${this.api}/logout`, {});
    // this.router.navigate(['../'], {relativeTo: this.route});
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
    // console.log("logged out");
  }

  public isLoggedIn() : boolean{
    if (sessionStorage.getItem("token")) {
      let token : string = <string>sessionStorage.getItem("token");
      const decodedToken = jwt_decode(token) as Token;
      let expirationDate : Date = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      if (expirationDate < new Date()){
        // console.log("token expired");
        return false;
      }
      return true;
    }
    else {
      return false;
    }
  }

  public isLoggedOut(): boolean{
    return !this.isLoggedIn();
  }

  // public getCurrentUser(){
  //   return this.http.get(`${this.api}/me`, {});
  // }

}
