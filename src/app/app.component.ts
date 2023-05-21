import { Component } from '@angular/core';
import {Padlet} from "./shared/padlet";
import {AuthenticationService} from "./shared/authentication.service";

@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  // listOn = true;
  // detailsOn = false;
  title = 'padlet';

  padlet : Padlet | undefined;

  constructor(private authservice: AuthenticationService) {}

  isLoggedIn() : boolean{
    return this.authservice.isLoggedIn();
  }

  getLoginLabel() : string{
    return this.isLoggedIn() ? "Logout" : "Login";
  }

  logout(){
    this.authservice.logout();
  }

}
