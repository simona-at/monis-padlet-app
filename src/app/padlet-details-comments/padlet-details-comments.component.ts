import {Component, Input, OnInit} from '@angular/core';
import {Comment, Padlet} from "../shared/padlet";
import {User} from "../shared/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PadletBoardService} from "../shared/padlet-board.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../shared/user.service";
import {AuthenticationService} from "../shared/authentication.service";

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

  /**
   * Diese Methode wird beim Initialisieren der Komponente aufgerufen. Zuerst wird die Methode getAllUsers()
   * des UserService aufgerufen, um alle Benutzer abzurufen. Dann wird das commentForm-FormGroup erstellt und mit
   * den vorhandenen Kommentaren des Padlets initialisiert, falls ein Padlet vorhanden ist.
   */
  ngOnInit(): void {
    this.userservice.getAllUsers();
    if(this.padlet) {
      this.commentForm = this.fb.group({
        comment: [this.padlet.comments, Validators.required]
      });
    }
  }

  /**
   * Diese Methode wird aufgerufen, wenn das Kommentarformular abgeschickt wird. Zuerst wird überprüft, ob ein Padlet vorhanden ist.
   * Dann wird ein neues Comment-Objekt mit den Werten aus dem Kommentarformular, der aktuellen Benutzer-ID und dem aktuellen
   * Datum erstellt. Das Kommentar wird dem Padlet hinzugefügt und über die comment()-Methode des PadletBoardService an den Server gesendet.
   * Nachdem das Kommentar erfolgreich veröffentlicht wurde, wird das Kommentarformular zurückgesetzt und der Benutzer zur entsprechenden
   * Seite navigiert. Eine Erfolgsmeldung wird angezeigt.
   */
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
