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

  currentUser = false;

  currentUserCanView = false;

  // @Output() showDetailsEvent = new EventEmitter<Padlet>();

  constructor(private pb: PadletBoardService,
              private toastr: ToastrService,
              private userservice : UserService,
              private authservice : AuthenticationService) {
  }

  ngOnInit(): void {
    if(this.authservice.isLoggedIn()) this.currentUser = true;

    this.pb.getAll().subscribe(res => {
      this.padlets = res;
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
      // this.toastr.success('Padlets wurden erfolgreich geladen');
    });
  }


  numberToString(id: number){
    return String(id);
  }


  canView(){


  }


}
