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

  currentUser = false;
  currentUserCanView = false;

  current_user_name = "";

  loading = true;


  constructor(private pb: PadletBoardService,
              private toastr: ToastrService,
              private userservice : UserService,
              private authservice : AuthenticationService) {
  }

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
      this.loading = false;
      // this.toastr.success('Padlets wurden erfolgreich geladen',  '', { timeOut: 1500 });
    });
  }

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

  getUserName(){
    if(this.user){
      this.current_user_name = this.user.first_name + "";
    }
  }


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


  numberToString(id: number){
    return String(id);
  }

}
