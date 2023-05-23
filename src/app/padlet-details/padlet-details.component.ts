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
  editors : User[] = [];
  owner : User | undefined;
  viewers : User[] = [];

  padletHasImages : boolean = true;
  likeable : boolean = true;
  isEditor : boolean = false;
  isViewer : boolean = false;
  isOwner : boolean = false;
  loading : boolean = true;

  textColums : string = "eleven wide column";
  likeBtn : string = "outline";
  ownerName : string = "Anonyme:r Nutzer:in";

  likeCount : number = 0;
  commentCount : number = 0;


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
      this.initPadlet();
      this.loading = false;
      // this.toastr.success('Padlet wurde geladen', '', { timeOut: 1500 });
    });
  }


  initPadlet(){
    this.hasImages();
    this.initLikeBtn();
    this.getEditors();
    this.getViewers();
    if(this.getOwner()){
      this.ownerName = this.owner?.first_name + " " + this.owner?.last_name;
    }
    this.canUserEdit();
    this.initLikesAndComments();
  }


  removePadlet(){
    if( confirm("Soll dieses Padlet wirklich gelöscht werden?")){
      this.pb.remove(this.padlet.id).subscribe((res:any) => {
        this.router.navigate(['../'], {relativeTo: this.route});
        this.toastr.success('Padlet wurde erfolgreich gelöscht');
      });
    }
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

  initLikeBtn(){
    if(this.padlet.likes) {
      if(this.padlet.likes.length > 0){
        for (let like of this.padlet.likes) {
          if (like['user_id'] == this.userservice.getCurrentUserId()) {
            this.likeable = false;
            break;
          }
        }
      }
    }
    if(this.likeable){
      this.likeBtn = "outline";
    } else{
      this.likeBtn = "liked";
    }
  }

  like() {
    if(this.likeable){
      this.likePadlet();
    } else{
      this.dislikePadlet();
    }
  }

  likePadlet(){
    let user_id = this.userservice.getCurrentUserId();
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
    this.pb.dislike(this.padlet, this.userservice.getCurrentUserId()).subscribe(res => {
      this.router.navigate(["../../board", this.padlet.id], {
        relativeTo: this.route
      });
      this.likeBtn = "outline";
      this.likeable = true;
      this.ngOnInit();
    });
  }

  hasImages(){
    if(this.padlet.images) {
      if (this.padlet?.images.length == 0) {
        this.textColums = "wide column";
        this.padletHasImages = false;
      }
      else {
        this.textColums = "nine wide column nine-columns";
        this.padletHasImages = true;
      }
    }
  }

  getEditors(){
    if(this.padlet.users){
      for (let user of this.padlet.users){
        if(user.pivot?.user_role == "editor"){
          this.editors.push(user);
        }
      }
    }
  }

  getViewers(){
    if(this.padlet.users){
      for (let user of this.padlet.users){
        if(user.pivot?.user_role == "viewer"){
          this.viewers.push(user);
        }
      }
    }
  }

  getOwner(){
    if(this.padlet.users){
      for (let user of this.padlet.users){
        if(user.pivot?.user_role == "owner"){
          this.owner = user;
          return true;
        }
      }
    }
    this.owner = undefined;
    return false;
  }

  canUserEdit(){
    const currentUserId = this.userservice.getCurrentUserId();
    if(this.editors.find(item => item.id === currentUserId)) this.isEditor = true;
    if(this.viewers.find(item => item.id === currentUserId)) this.isViewer = true;
    if(this.owner?.id === currentUserId) this.isOwner = true;
  }


}
