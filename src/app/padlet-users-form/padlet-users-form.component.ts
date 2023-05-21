import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../shared/authentication.service";
import {UserService} from "../shared/user.service";
import {PadletBoardService} from "../shared/padlet-board.service";
import {Image, Padlet, User} from "../shared/padlet";
import {PadletFactory} from "../shared/padlet-factory";

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
    this.padletUserForm = this.fb.group({});
    this.users = this.fb.array([]);
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
      email : ["", [Validators.required, Validators.email]],
      user_role : ["", [Validators.required]]
    });
  }

  buildUsersArray(){
    // this.padlet.users?.push(new User(0, '', '', '', ''));

    if (this.padlet.users){
      this.users = this.fb.array([]);
      console.log(this.padlet.users);
      console.log(this.users);



      for (let user of this.padlet.users){
        let userrole = user.pivot;
        console.log(userrole);

        let fg = this.fb.group({
          id: new FormControl(user.id),
          email: new FormControl(user.email),
          user_role: new FormControl(user.pivot)
        });
        this.users.push(fg);
      }
    }
  }

  addUserControl(){
    this.users.push(this.fb.group({id:0, url: null, title:null}));
  }

  saveUsers(){

  }

  getOwnerName(){
    if(this.padlet.users) {
      let user = this.padlet.users[0];
      this.ownerName = user.first_name + " " + user.last_name;
    }
  }

  getOwnerEmail(){
    if(this.padlet.users) {
      let user = this.padlet.users[0];
      this.ownerEmail = user.email + "";
    }
  }
}
