import {Component, Input, OnInit} from '@angular/core';
import {Comment, Padlet} from "../shared/padlet";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PadletBoardService} from "../shared/padlet-board.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {PadletFactory} from "../shared/padlet-factory";

@Component({
  selector: 'bs-padlet-details-comments',
  templateUrl: './padlet-details-comments.component.html',
  styles: [
  ]
})
export class PadletDetailsCommentsComponent implements OnInit{

  @Input() padlet : Padlet | undefined



  commentForm : FormGroup;
  // padlet = PadletFactory.empty();
  // errors : { [key : string]: string } = {};


  constructor(private fb: FormBuilder, private pb: PadletBoardService, private route: ActivatedRoute, private router: Router, private toastr : ToastrService) {
    this.commentForm = this.fb.group({});
  }

  ngOnInit(): void {
    if(this.padlet) {
      this.commentForm = this.fb.group({
        comment: [this.padlet.comments, Validators.required]
      });
    }
  }

  getCurrentUserId(){
    return 4;
  }

  submitComment(){
    if(this.padlet) {
      const comment: Comment = new Comment(0, this.commentForm.value['comment'], this.getCurrentUserId());
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
