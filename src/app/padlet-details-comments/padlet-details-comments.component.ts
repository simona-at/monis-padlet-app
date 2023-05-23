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
import {toNumbers} from "@angular/compiler-cli/src/version_helpers";

@Component({
  selector: 'bs-padlet-details-comments',
  templateUrl: './padlet-details-comments.component.html',
  styles: [
  ]
})
export class PadletDetailsCommentsComponent implements OnInit{

  @Input() padlet : Padlet | undefined;
  @Input() commentCount : number | undefined;

  commentForm : FormGroup;
  users : User[]= [];
  renderComments = true;

  constructor(private fb: FormBuilder,
              private pb: PadletBoardService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr : ToastrService,
              public userservice : UserService,
              public authservice : AuthenticationService) {
    this.commentForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.userservice.getAllUsers();
    if(this.padlet) {
      this.commentForm = this.fb.group({
        comment: [this.padlet.comments, Validators.required]
      });
    }
  }

  submitComment(){
    if(this.padlet) {
      const comment: Comment = new Comment(0, this.commentForm.value['comment'], this.userservice.getCurrentUserId(), new Date());
      this.padlet.comments?.push(comment);
      this.pb.comment(this.padlet).subscribe(res => {
        this.commentForm.reset();
        if(this.padlet) {
          if(this.padlet.comments) {
            this.commentCount = this.padlet.comments.length;
          }
          this.router.navigate(["../../board", this.padlet.id], {
            relativeTo: this.route
          });
        }
        this.toastr.success('Kommentar wurde veröffentlicht!');
      });
    }
  }
}
