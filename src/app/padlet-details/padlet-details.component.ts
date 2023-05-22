import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Padlet, User} from '../shared/padlet';
import {Like} from '../shared/like';
import {Comment} from '../shared/comment';
import {PadletBoardService} from "../shared/padlet-board.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PadletFactory} from "../shared/padlet-factory";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PadletFormErrorMessages} from "../padlet-form/padlet-form-error-messages";
import {AuthenticationService} from "../shared/authentication.service";
import {UserService} from "../shared/user.service";

@Component({
  selector: 'bs-padlet-details',
  templateUrl: './padlet-details.component.html',
  styles: [
  ]
})
export class PadletDetailsComponent {
  padlet: Padlet = PadletFactory.empty();
  users : User[]= [];
  likeBtn = "not_liked";
  editors : User[] = [];
  isEditor = false;
  isOwner = false;
  owner: User | undefined;
  likeable = true;



  padletHasImages = true;

  textColums = "eight wide column";


  constructor(private fb: FormBuilder,
              private pb: PadletBoardService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr : ToastrService,
              public authservice : AuthenticationService,
              private userservice: UserService
  ) {}

  ngOnInit(){

    const params = this.route.snapshot.params;
    this.pb.getSingle(params['id']).subscribe((p:Padlet) => {
      this.padlet = p;
      this.hasImages();
      this.initLikeBtn();
      this.getEditors();
      this.getOwner();
      this.canUserEdit();
    });

    if(this.padlet.likes) {
      if(this.padlet.likes.length > 0){
        for (let like of this.padlet.likes) {
          if (like['user_id'] == this.getCurrentUserId()) {
            this.likeBtn = "liked";
            break;
          }
        }
      }
    }
  }

  removePadlet(){
    if( confirm("Soll dieses Padlet wirklich gelöscht werden?")){
      this.pb.remove(this.padlet.id).subscribe((res:any) => {
        this.router.navigate(['../'], {relativeTo: this.route});
        this.toastr.success('Padlet wurde erfolgreich gelöscht');
      });

    }
  }


  getCurrentUserId() : number{
    return this.userservice.getCurrentUserId();
  }


  initLikeBtn(){
    if(this.padlet.likes) {
      if(this.padlet.likes.length > 0){
        for (let like of this.padlet.likes) {
          if (like['user_id'] == this.getCurrentUserId()) {
            this.likeable = false;
            break;
          }
        }
      }
    }
    if(this.likeable){
      this.likeBtn = "not_liked";
    } else{
      this.likeBtn = "liked";
    }
  }

  like() {
    if(this.likeable){
      this.likePadlet();
      // this.likeBtn = "not_liked";
    } else{
      this.dislikePadlet();
      // this.likeBtn = "liked";
    }
  }

  likePadlet(){
    let user_id = this.getCurrentUserId();
    const like = new Like(user_id);
    this.padlet.likes?.push(like);

    this.pb.like(this.padlet).subscribe(res => {
      this.router.navigate(["../../board", this.padlet.id], {
        relativeTo: this.route
      });
      this.likeBtn = "liked";
      this.likeable = false;
      this.ngOnInit();
    });

  }

  dislikePadlet(){
    this.pb.dislike(this.padlet, this.getCurrentUserId()).subscribe(res => {
      this.router.navigate(["../../board", this.padlet.id], {
        relativeTo: this.route
      });
      this.likeBtn = "not_liked";
      this.likeable = true;
      this.ngOnInit();
    });
  }

  hasImages(){
    if(this.padlet.images) {
      if (this.padlet?.images.length == 0) {
        this.textColums = "thirteen wide column widthimportant";
        this.padletHasImages = false;
      }
      else {
        this.textColums = "eight wide column";
        this.padletHasImages = true;
      }
    }
  }

  getEditors(){
    if(this.padlet.users){
      for (let user of this.padlet.users){
        if(user.pivot?.user_role == "owner" || user.pivot?.user_role == "editor"){
          this.editors.push(user);
        }
      }
    }
  }

  getOwner(){
    if(this.padlet.users){
      for (let user of this.padlet.users){
        if(user.pivot?.user_role == "owner"){
          this.owner = user;
        }
      }
    }
  }

  canUserEdit(){
    const currentUserId = this.userservice.getCurrentUserId();
    if(this.editors.find(item => item.id === currentUserId)) this.isEditor = true;
    if(this.owner?.id === currentUserId) this.isOwner = true;
  }


}
