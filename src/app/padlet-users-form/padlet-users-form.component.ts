import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../shared/authentication.service";
import {UserService} from "../shared/user.service";
import {PadletBoardService} from "../shared/padlet-board.service";
import {Image, Padlet, User} from "../shared/padlet";
import {PadletFactory} from "../shared/padlet-factory";
import {Pivot} from "../shared/pivot";
import {PadletFormErrorMessages} from "../padlet-form/padlet-form-error-messages";

@Component({
  selector: 'bs-padlet-users-form',
  templateUrl: './padlet-users-form.component.html',
  styles: [
  ]
})
export class PadletUsersFormComponent implements OnInit{

  //set default for user_role select field
  roleDefault :string = "viewer";

  currentId = this.route.snapshot.params["id"];
  backlink = "/board/"+this.currentId;

  ownerName = "";
  ownerEmail = "";


  padletUserForm : FormGroup;
  users : FormArray;
  padlet : Padlet = PadletFactory.empty();
  errors : { [key : string]: string } = {};



  constructor(
    private fb : FormBuilder,
    private router : Router,
    private route: ActivatedRoute,
    private pb: PadletBoardService,
    private authService : AuthenticationService,
    public userservice : UserService
  ) {
    this.users = this.fb.array([]);
    this.padletUserForm = this.fb.group({users: this.users});
  }

  ngOnInit():void{
    const id = this.route.snapshot.params["id"];
    if(id) {
      this.pb.getSingle(id).subscribe(
        padlet => {
          this.padlet = padlet;
          this.initUsers();
        }
      );
    }
  }

  initUsers(){
    this.getOwnerName();
    this.getOwnerEmail();

    this.buildUsersArray();
    this.padletUserForm = this.fb.group({
      users : this.users
    });
  }

  buildUsersArray(){
    // this.padlet.users?.push(new User(0, '', '', '', ''));

    if (this.padlet.users){
      // this.users = this.fb.array([]);
      // console.log(this.padlet.users);
      // console.log(this.users);
      let index = 1;



      for (let user of this.padlet.users){

        // let pivot = user.pivot;
        // console.log(pivot);
        //
        // if(pivot){
        //     console.log(pivot.user_role);
        //     // console.log(userrole[0]);
        //   }

          // let pivot = new Pivot('editor');


        if(index != 1){
          let fg = this.fb.group({
            id: new FormControl(user.id),
            email: new FormControl(user.email),
            user_role: new FormControl(user.pivot?.user_role)
          });
          this.users.push(fg);
        }
        index++;

      }

      if(this.padlet.users.length < 2){
        this.addUserControl();
      }
      console.log(index);

    }
  }

  addUserControl(){
    this.users.push(this.fb.group({email: null, user_role:null}));
  }

  // updateErrorMessages(){
  //   this.errors = {};
  //   for (const message of PadletFormErrorMessages) {
  //     const control = this.padletUserForm.get(message.forControl);
  //     if(
  //       control &&
  //       control.dirty && //ist es geändert worden?
  //       control.invalid && //ist es nicht valide? (zb bei email)
  //       control.errors && //hat es einen error
  //       control.errors[message.forValidator] &&
  //       !this.errors[message.forControl]
  //     ){
  //       this.errors[message.forControl] = message.text;
  //     }
  //   }
  // }

  saveUsers(){

  }

  getOwnerName(){
    if(this.padlet.users) {
      let user = this.padlet.users[0];
      if(user) this.ownerName = user.first_name + " " + user.last_name;
    }
  }

  getOwnerEmail(){
    if(this.padlet.users) {
      let user = this.padlet.users[0];
      if(user) this.ownerEmail = user.email + "";
    }
  }
}
