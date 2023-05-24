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

  loading : boolean = true;

  current_user_name : string = "";

  constructor(private fb : FormBuilder,
              private router : Router,
              private authservice : AuthenticationService,
              private userservice : UserService
  ) {
    this.loginForm = this.fb.group({});
  }

  /**
   * Diese Methode wird beim Initialisieren der Komponente aufgerufen. Zuerst wird die fetchUsers()-Methode des UserService
   * aufgerufen, um die Liste der Benutzer abzurufen. Sobald die Benutzerliste erhalten wurde, werden die Methoden
   * getCurrentUser() und getUserName() aufgerufen, um den aktuellen Benutzer und dessen Namen zu setzen. Schließlich
   * wird das loginForm-FormGroup erstellt und konfiguriert.
   */
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

  /**
   * Diese Methode wird aufgerufen, wenn der Benutzer das Login-Formular abschickt. Sie überprüft, ob sowohl der
   * Benutzername als auch das Passwort eingegeben wurden. Wenn dies der Fall ist, wird die login()-Methode des
   * AuthenticationService aufgerufen, um die Authentifizierung durchzuführen. Bei erfolgreicher Authentifizierung
   * wird der Zugriffstoken im Session Storage gespeichert und der Benutzer wird zur Startseite ("/") weitergeleitet.
   */
  login(){
    const val = this.loginForm.value;
    if(val.username && val.password){
      this.authservice.login(val.username, val.password).subscribe((res: any) => {
        this.authservice.setSessionStorage((res as Response).access_token);
        this.router.navigateByUrl("/");
      });
    }
  }

  /**
   * Diese Methode wird verwendet, um zu überprüfen, ob der Benutzer aktuell eingeloggt ist.
   * Sie ruft die isLoggedIn()-Methode des AuthenticationService auf und gibt deren Rückgabewert zurück.
   */
  isLoggedIn(){
    return this.authservice.isLoggedIn();
  }

  /**
   * Diese Methode wird aufgerufen, wenn der Benutzer sich ausloggen möchte.
   * Sie ruft die logout()-Methode des AuthenticationService auf und gibt deren Rückgabewert zurück.
   */
  logout(){
    return this.authservice.logout();
  }

  /**
   * Diese Methode wird verwendet, um den aktuellen Benutzer zu erhalten. Sie durchläuft die Liste der Benutzer und
   * sucht nach dem Benutzer mit der gleichen ID wie die ID des aktuellen Benutzers, die mit Hilfe des UserService
   * abgerufen wird. Wenn der Benutzer gefunden wird, wird er der user-Eigenschaft zugewiesen.
   */
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

  /**
   * Diese Methode wird verwendet, um den Namen des aktuellen Benutzers zu erhalten. Sie überprüft, ob ein Benutzer vorhanden
   * ist und setzt dann die current_user_name-Eigenschaft auf den Vor- und Nachnamen des Benutzers.
   */
  getUserName(){
    if(this.user){
      this.current_user_name = this.user.first_name + "";
    }
  }

}
