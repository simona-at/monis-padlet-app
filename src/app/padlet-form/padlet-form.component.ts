import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PadletFactory} from "../shared/padlet-factory";
import {Padlet, User} from "../shared/padlet";
import {Image} from "../shared/image";
import {PadletBoardService} from "../shared/padlet-board.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PadletFormErrorMessages} from "./padlet-form-error-messages";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../shared/user.service";
import {AuthenticationService} from "../shared/authentication.service";

@Component({
  selector: 'bs-padlet-form',
  templateUrl: './padlet-form.component.html',
  styles: [
  ]
})
export class PadletFormComponent implements OnInit{

  //set default for visability select field
  visabilityDefault = 0;


  padletForm : FormGroup;
  padlet : Padlet = PadletFactory.empty();
  errors : { [key : string]: string } = {};
  isUpdatingPadlet= false;
  images : FormArray;
  loading: boolean = true;
  currentUser : User | undefined;
  users : User[] = [];

  currentId = this.route.snapshot.params["id"];
  backlink = "/board/"+this.currentId;

  constructor(private fb: FormBuilder,
              private pb: PadletBoardService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr : ToastrService,
              private userservice : UserService,
              public authservice : AuthenticationService) {
    this.padletForm = this.fb.group({});
    this.images = this.fb.array([]);
  }

  ngOnInit(): void {
    this.userservice.fetchUsers().subscribe(res =>{
      this.users = res;
      this.currentUser = this.getCurrentUser();
    });

    const id = this.route.snapshot.params["id"];
    if(id) {
      this.isUpdatingPadlet = true;
      this.pb.getSingle(id).subscribe(
        padlet => {
          this.padlet = padlet;
          this.initPadlet();
          this.loading = false;
        }
      );
    }
    this.initPadlet();
    this.loading = false;
  }

  getCurrentUser(){
    for(let user of this.users){
      if(user.id == this.userservice.getCurrentUserId()){
        return user;
      }
    }
    return undefined;
  }

  initPadlet(){
    this.buildThumbnailsArray();

    if(this.isUpdatingPadlet || !this.currentUser){
      this.padletForm = this.fb.group({
        id : this.padlet.id,
        title: [this.padlet.title, Validators.required],
        description: [this.padlet.description],
        images: this.images,
        is_private : this.padlet.is_private,
        users : [this.padlet.users]
      });
    } else {
      this.padletForm = this.fb.group({
        id: this.padlet.id,
        title: [this.padlet.title, Validators.required],
        description: [this.padlet.description],
        images: this.images,
        is_private: this.padlet.is_private,
        users: [[]]
      });
    }
    this.padletForm.statusChanges.subscribe(() => this.updateErrorMessages());
  }


  buildThumbnailsArray(){
    if(this.isUpdatingPadlet){
      this.padlet.images?.push(new Image(0, '', ''));
    }
    if (this.padlet.images){
      this.images = this.fb.array([]);
      for (let img of this.padlet.images){
        let fg = this.fb.group({
          id: new FormControl(img.id),
          url: new FormControl(img.url),
          title: new FormControl(img.title)
        });
        this.images.push(fg);
      }
    }
  }

  addThumbnailControl(){
    this.images.push(this.fb.group({id:0, url: null, title:null}));
  }

  updateErrorMessages(){
    this.errors = {};
    for (const message of PadletFormErrorMessages) {
      const control = this.padletForm.get(message.forControl);
      if(
        control &&
        control.dirty && //ist es geändert worden?
        control.invalid && //ist es nicht valide? (zb bei email)
        control.errors && //hat es einen error
        control.errors[message.forValidator] &&
        !this.errors[message.forControl]
      ){
        this.errors[message.forControl] = message.text;
      }
    }
  }

  submitForm(){

    for(let image of this.padletForm.value.images){
      if((image.url != "" && image.title == "") ||
        (image.url == "" && image.title != "")){
        this.toastr.error(
          'Bei angegebenen Bilder müssen URL und Titel angegeben werden!',
          'Fehler beim Speichern',
          { timeOut: 3500 }
        );
        return;
      }
    }

    this.padletForm.value.images = this.padletForm.value.images.filter(
      (thumbnail: {url :string}) => thumbnail.url
    );

    if(!this.isUpdatingPadlet && this.currentUser){
      let owner = new User(this.currentUser.id, this.currentUser?.first_name, this.currentUser?.last_name);
      this.padletForm.value.users.push(owner);
    } else{
      this.padletForm.value.users = undefined;
    }
    const padlet : Padlet = PadletFactory.fromObject(this.padletForm.value);

    if(this.isUpdatingPadlet) {
      this.pb.update(padlet).subscribe(res => {
        this.router.navigate(["../../board", padlet.id], {
          relativeTo: this.route
        });
      });
      this.toastr.success('Padlet wurde bearbeitet!');
    }
    else{
      this.pb.create(padlet).subscribe(res =>{
        this.padlet = PadletFactory.empty();
        this.padletForm.reset(PadletFactory.empty());
        this.router.navigate(["../board"], {
          relativeTo: this.route
        });
        this.toastr.success('Padlet wurde erstellt!');
      });
    }
  }

}
