import { Component, OnInit, Input } from '@angular/core';
import {Padlet, User} from "../shared/padlet";

@Component({
  selector: '.bs-padlet-list-item',
  templateUrl: './padlet-list-item.component.html',
  styles: [
  ]
})
export class PadletListItemComponent implements OnInit {

  @Input() padlet : Padlet | undefined;

  owner : User | undefined;

  likeCount : number = 0;
  commentCount : number = 0;

  ownerName : string = "Anonyme:r Nutzer:in";

  /**
   * Diese Methode wird beim Initialisieren der Komponente aufgerufen.
   * Sie ruft die Methode initPadlet() auf, um das Padlet zu initialisieren.
   */
  ngOnInit(): void {
    this.initPadlet();
  }

  /**
   * Diese Methode initialisiert das Padlet, indem sie die Methode getOwner() aufruft, um den Besitzer des Padlets zu ermitteln,
   * und den Namen des Besitzers auf den Wert "Anonyme:r Nutzer:in" setzt, falls kein Besitzer gefunden wird.
   * Sie ruft dann die Methode initLikesAndComments() auf, um die Anzahl der Likes und Kommentare für das Padlet zu initialisieren.
   */
  initPadlet(){
    if(this.getOwner()){
      this.ownerName = this.owner?.first_name + " " + this.owner?.last_name;
    }
    this.initLikesAndComments();
  }

  /**
   * Diese Methode initialisiert die Anzahl der Likes und Kommentare für das Padlet, falls das Padlet vorhanden ist.
   * Sie zählt die Anzahl der Likes und Kommentare in den entsprechenden Arrays des Padlets.
   */
  initLikesAndComments(){
    if(this.padlet){
      if(this.padlet.likes) {
        this.likeCount = this.padlet.likes.length;
      }
      if(this.padlet.comments) {
        this.commentCount = this.padlet.comments.length;
      }
    }
  }

  /**
   * Diese Methode sucht den Besitzer des Padlets in der Benutzerliste des Padlets und gibt true zurück, wenn ein Besitzer
   * gefunden wird, andernfalls false. Wenn ein Besitzer gefunden wird, wird das owner-Attribut auf den entsprechenden Benutzer gesetzt.
   */
  getOwner() {
    if (this.padlet) {
      if (this.padlet.users) {
        for (let user of this.padlet.users) {
          if (user.pivot?.user_role == "owner") {
            this.owner = user;
            return true;
          }
        }
      }
    }
    this.owner = undefined;
    return false;
  }
}
