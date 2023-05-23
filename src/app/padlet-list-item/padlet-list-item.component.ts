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

  ownerName : string = "Anonyme:r Nutzer:in";

  likeCount : number = 0;
  commentCount : number = 0;

  ngOnInit(): void {
    this.initPadlet();
  }

  initPadlet(){
    if(this.getOwner()){
      this.ownerName = this.owner?.first_name + " " + this.owner?.last_name;
    }
    this.initLikesAndComments();
  }

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
