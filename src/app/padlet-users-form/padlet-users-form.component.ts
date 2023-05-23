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
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'bs-padlet-users-form',
  templateUrl: './padlet-users-form.component.html',
  styles: [
  ]
})
export class PadletUsersFormComponent implements OnInit{

  //set default for user_role select field
  // roleDefault :string = "viewer";

  currentId = this.route.snapshot.params["id"];
  backlink = "/board/"+this.currentId;

  ownerName : string = "";
  ownerEmail : string = "";

  loading : boolean = true;


  padletUserForm : FormGroup;
  users : FormArray;
  padlet : Padlet = PadletFactory.empty();
  errors : { [key : string]: string } = {};

  allUsers : User[] = [];
  allUsersEmails : String[] = [];

  constructor(
    private fb : FormBuilder,
    private router : Router,
    private route: ActivatedRoute,
    private pb: PadletBoardService,
    private authService : AuthenticationService,
    private toastr : ToastrService,
    public userservice : UserService
  ) {
    this.users = this.fb.array([]);
    this.padletUserForm = this.fb.group({users: this.users});
  }

  ngOnInit():void{
    this.userservice.fetchUsers().subscribe(res =>{
      this.allUsers = res;
      this.getAllUsersEmails();
    });
    const id = this.route.snapshot.params["id"];
    if(id) {
      this.pb.getSingle(id).subscribe(
        padlet => {
          this.padlet = padlet;
          this.initUsers();
          this.loading = false;
        }
      );
    }
  }

  getAllUsersEmails(){
    if(this.allUsers){
      for(let user of this.allUsers){
        if(user.email) {
          this.allUsersEmails.push(user.email);
        }
      }
    }
  }



  initUsers(){
    this.getOwnerName();
    this.getOwnerEmail();

    this.buildUsersArray();

    this.padletUserForm = this.fb.group({
      users : this.users
    });
    this.padletUserForm.statusChanges.subscribe(() => this.updateErrorMessages());
  }

  buildUsersArray(){
    if (this.padlet.users){
      let index = 1;
      for (let user of this.padlet.users){
        if(index != 1){
          let fg = this.fb.group({
            email: new FormControl(user.email, [Validators.required]),
            user_role: new FormControl(user.pivot?.user_role, [Validators.required])
          });
          this.users.push(fg);
        }
        index++;
      }
      if(this.padlet.users.length < 2){
        this.addUserControl();
      }
    }
  }

  addUserControl(){
    this.users.push(this.fb.group({email: null, user_role:null}));
  }

  updateErrorMessages(){
    // console.log("Is form invalid? " + this.padletUserForm.invalid);
    this.errors = {};
    for (const message of PadletFormErrorMessages) {
      const control = this.padletUserForm.get(message.forControl);
      if(
        control &&
        control.dirty &&
        control.invalid &&
        control.errors &&
        control.errors[message.forValidator] &&
        !this.errors[message.forControl]
      ){
        this.errors[message.forControl] = message.text;
      }
    }
  }

  saveUsers(){
    for(let newUser of this.padletUserForm.value.users){
      if(newUser.email == null || newUser.user_role == null){
        this.toastr.error(
          'Es muss eine gültige E-Mail-Adresse und eine Rolle eingegeben werden!',
          'Fehler beim Speichern',
          { timeOut: 3500 }
        );
        return;
      }
      else if(newUser.email == this.ownerEmail){
        this.toastr.error(
          'Der:die Nutzer:in der angegebenen E-Mail-Adresse ist Eigentümer:in des Padlets!',
          'Fehler beim Speichern',
          { timeOut: 3500 }
        );
        return;
      }
      else if(!this.allUsersEmails.find(element => element == newUser.email)){
        this.toastr.error(
          'Es wurde kein:e Nutzer:in mit dieser E-Mail-Adresse gefunden!',
          'Fehler beim Speichern',
          { timeOut: 3500 });
        return;
      }
    }

    let users = [];
    for(let newUser of this.padletUserForm.value.users){
      const user_email = newUser.email;
      const user_role = newUser.user_role;
      const pivot = new Pivot(user_role);
      const user : User = new User(0, "", "", user_email, user_role, pivot);
      users.push(user);
    }

    let padlet : Padlet = new Padlet(
      this.currentId,
      this.padlet.title,
      this.padlet.is_private,
      this.padlet.created_at,
      this.padlet.description,
      this.padlet.images,
      users
    );

    this.pb.update(padlet).subscribe(res => {
      this.router.navigate(["../../board", this.currentId], {
        relativeTo: this.route
      });
      this.toastr.success('Nutzer:innen wurden bearbeitet!');
    });
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
