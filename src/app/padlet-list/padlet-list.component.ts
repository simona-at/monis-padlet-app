import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Padlet, Image, Comment, Like, User } from "../shared/padlet";
import {PadletBoardService} from "../shared/padlet-board.service";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../shared/user.service";
import {AuthenticationService} from "../shared/authentication.service";

@Component({
  selector: 'bs-padlet-list',
  templateUrl: './padlet-list.component.html',
  styles: [
  ]
})
export class PadletListComponent implements OnInit {
  padlets : Padlet[] = [];
  privatePadlets : Padlet[] = [];
  publicPadlets : Padlet[] = [];

  users : User[] = [];
  user : User | undefined;

  loading : boolean = true;
  currentUser : boolean = false;
  currentUserCanView : boolean = false;

  privatePadletsCount : number = 0;
  publicPadletsCount : number = 0;

  current_user_name : string = "";

  constructor(private pb: PadletBoardService,
              private toastr: ToastrService,
              private userservice : UserService,
              public authservice : AuthenticationService) {
  }

  /**
   * Diese Methode wird beim Initialisieren der Komponente aufgerufen. Sie überprüft, ob der Benutzer eingeloggt ist,
   * indem sie die Methode isLoggedIn() des AuthenticationService aufruft. Sie ruft dann die Methode fetchUsers() des
   * UserService auf, um alle Benutzer abzurufen und speichert sie in der Variable users. Anschließend ruft sie die Methoden
   * getCurrentUser(), um den aktuellen Benutzer zu ermitteln, und getUserName(), um den Namen des aktuellen Benutzers
   * festzulegen. Schließlich ruft sie die Methode getAll() des PadletBoardService auf, um alle Padlets abzurufen und
   * speichert sie in der Variable padlets. Sie ruft dann die Methoden initPadletList() und getPadletCounts() auf, um die
   * Liste der Padlets zu initialisieren und die Anzahl der öffentlichen und privaten Padlets zu ermitteln.
   */
  ngOnInit(): void {
    if(this.authservice.isLoggedIn()) this.currentUser = true;
    this.userservice.fetchUsers().subscribe(res =>{
      this.users = res;
      this.getCurrentUser();
      this.getUserName();
    });
    this.pb.getAll().subscribe(res => {
      this.padlets = res;
      this.initPadletList();
      this.getPadletCounts();
      this.loading = false;
    });
  }

  /**
   * Diese Methode sucht den aktuellen Benutzer in der Liste der Benutzer (users) anhand der Benutzer-ID, die aus
   * dem UserService stammt. Sie speichert den gefundenen Benutzer in der Variable user.
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
   * Diese Methode setzt den Namen des aktuellen Benutzers (user.first_name) in der Variable current_user_name.
   */
  getUserName(){
    if(this.user){
      this.current_user_name = this.user.first_name + "";
    }
  }

  /**
   * Diese Methode durchläuft die Liste der Padlets (padlets) und unterscheidet zwischen privaten und öffentlichen Padlets.
   * Sie überprüft, ob der aktuelle Benutzer Zugriff auf ein privates Padlet hat, indem sie über die Benutzerliste des
   * Padlets iteriert. Wenn der Benutzer Zugriff hat, wird das Padlet zur Liste privatePadlets hinzugefügt, andernfalls zur Liste publicPadlets.
   */
  initPadletList(){
    if(this.padlets){
      for(let padlet of this.padlets){
        if(padlet.is_private){
          if(padlet.users){
            for(let user of padlet.users){
              if(user.id == this.userservice.getCurrentUserId()){
                this.privatePadlets.push(padlet);
                break;
              }
            }
          }
        } else {
          this.publicPadlets.push(padlet);
        }
      }
    }
  }

  /**
   * Diese Methode zählt die Anzahl der öffentlichen und privaten Padlets und speichert die Ergebnisse in den Variablen
   * publicPadletsCount und privatePadletsCount.
   */
  getPadletCounts(){
    if(this.publicPadlets) {
      this.publicPadletsCount = this.publicPadlets.length;
    }
    if(this.privatePadlets) {
      this.privatePadletsCount = this.privatePadlets.length;
    }
  }

  /**
   * Diese Methode konvertiert eine Zahl (ID) in einen Zeichenkettenwert, indem sie die Funktion String() aufruft und das Ergebnis zurückgibt.
   * @param id
   */
  numberToString(id: number){
    return String(id);
  }

}
