import {Component, Input, OnInit} from '@angular/core';
import {Comment, Padlet} from "../shared/padlet";
import {User} from "../shared/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PadletBoardService} from "../shared/padlet-board.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {PadletFactory} from "../shared/padlet-factory";
import {UserService} from "../shared/user.service";
import {AuthenticationService} from "../shared/authentication.service";

@Component({
  selector: 'bs-padlet-details-comments',
  templateUrl: './padlet-details-comments.component.html',
  styles: [
  ]
})
export class PadletDetailsCommentsComponent implements OnInit{

  @Input() padlet : Padlet | undefined

  commentForm : FormGroup;
  users : User[]= [];
  renderComments = true;

  constructor(private fb: FormBuilder,
              private pb: PadletBoardService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr : ToastrService,
              private userservice : UserService,
              private authservice : AuthenticationService) {
    this.commentForm = this.fb.group({});
  }

  ngOnInit(): void {

    this.getUsersNames();

    if(this.padlet) {
      this.commentForm = this.fb.group({
        comment: [this.padlet.comments, Validators.required]
      });
    }

    // console.log(this.padlet?.comments)
    //
    // if(this.padlet?.comments && this.padlet?.comments.length != 0) this.renderComments = true;
    // else this.renderComments = false;
  }

  getCurrentUserId(){
    console.log(this.authservice.getCurrentUser());
    return 4;
  }


  getUsersNames(){
    this.userservice.getAllUsers().subscribe(res => this.users = res);

    // if(this.padlet?.comments){
    //   console.log(this.padlet)
    //   for(let comment of this.padlet.comments){
    //     this.comments.push(comment);
    //     console.log(comment);
    //     this.renderComments = true;
    //
    //   }
    // } else{
    //   this.renderComments = false;
    // }

  }



  submitComment(){
    if(this.padlet) {
      const comment: Comment = new Comment(0, this.commentForm.value['comment'], this.getCurrentUserId(), new Date());
      this.padlet.comments?.push(comment);
      this.pb.comment(this.padlet).subscribe(res => {
        this.commentForm.reset();
        if(this.padlet) {
          this.router.navigate(["../../board", this.padlet.id], {
            relativeTo: this.route
          });
        }
      });
      this.toastr.success('Kommentar wurde veröffentlicht!');
    }
  }
}
