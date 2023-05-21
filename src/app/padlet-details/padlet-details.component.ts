import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Padlet} from '../shared/padlet';
import {Like} from '../shared/like';
import {Comment} from '../shared/comment';
import {PadletBoardService} from "../shared/padlet-board.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PadletFactory} from "../shared/padlet-factory";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PadletFormErrorMessages} from "../padlet-form/padlet-form-error-messages";

@Component({
  selector: 'bs-padlet-details',
  templateUrl: './padlet-details.component.html',
  styles: [
  ]
})
export class PadletDetailsComponent {

  // commentForm : FormGroup;
  padlet: Padlet = PadletFactory.empty();
  // errors : { [key : string]: string } = {};
  likeBtn = "not_liked";



  constructor(private fb: FormBuilder, private pb: PadletBoardService, private route: ActivatedRoute, private router: Router, private toastr : ToastrService) {
    // this.commentForm = this.fb.group({});
  }

  ngOnInit(){
    const params = this.route.snapshot.params;
    this.pb.getSingle(params['id']).subscribe((p:Padlet) => this.padlet = p);

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

    // this.commentForm = this.fb.group({
    //   comment: [this.padlet.comments, Validators.required]
    // });

  }

  removePadlet(){
    if( confirm("Soll dieses Padlet wirklich gelöscht werden?")){
      this.pb.remove(this.padlet.id).subscribe((res:any) => this.router.navigate(['../'], {relativeTo: this.route}));
      this.toastr.success('Padlet wurde erfolgreich gelöscht');
    }
  }


  getCurrentUserId(){
    return 4;
  }


  like() {
    let likeable = true;
    if(this.padlet.likes) {
      if(this.padlet.likes.length > 0){
        for (let like of this.padlet.likes) {
          if (like['user_id'] == this.getCurrentUserId()) {
            likeable = false;
            break;
          }
        }
      }
    }

    if(likeable){
      this.likePadlet();
    } else{
      this.dislikePadlet();
    }
  }

  likePadlet(){

    console.log(this.padlet.likes);

    let user_id = this.getCurrentUserId();
    const like = new Like(user_id);
    this.padlet.likes?.push(like);

    console.log(this.padlet.likes);

    this.pb.like(this.padlet).subscribe(res => {
      this.router.navigate(["../../board", this.padlet.id], {
        relativeTo: this.route
      });
    });
    console.log(this.padlet.likes);

    this.likeBtn = "liked";
  }

  dislikePadlet(){
    console.log(this.padlet.likes);

    this.pb.dislike(this.padlet, this.getCurrentUserId()).subscribe(res => {
      this.router.navigate(["../../board", this.padlet.id], {
        relativeTo: this.route
      });
    });
    this.likeBtn = "not_liked";

    console.log(this.padlet.likes);

  }


  // submitComment(){
  //   const comment : Comment = new Comment(0, this.commentForm.value['comment'], this.getCurrentUserId());
  //   this.padlet.comments?.push(comment);
  //   this.pb.comment(this.padlet).subscribe(res => {
  //     this.commentForm.reset();
  //     this.router.navigate(["../../board", this.padlet.id], {
  //       relativeTo: this.route
  //     });
  //   });
  //   this.toastr.success('Kommentar wurde veröffentlicht!');
  // }

}
