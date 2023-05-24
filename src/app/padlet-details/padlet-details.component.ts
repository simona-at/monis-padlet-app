import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Padlet, User} from '../shared/padlet';
import {Like} from '../shared/like';
import {PadletBoardService} from "../shared/padlet-board.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PadletFactory} from "../shared/padlet-factory";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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

  likeCount : number = 0;
  commentCount : number = 0;

  textColums : string = "eleven wide column";
  likeBtn : string = "outline";
  ownerName : string = "Anonyme:r Nutzer:in";

  constructor(private fb: FormBuilder,
              private pb: PadletBoardService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr : ToastrService,
              public authservice : AuthenticationService,
              private userservice: UserService
  ) {}

  /**
   * Diese Methode wird beim Initialisieren der Komponente aufgerufen. Zuerst werden die Parameter aus der aktuellen Route
   * abgerufen, um die ID des Padlets zu erhalten. Dann wird die getSingle()-Methode des PadletBoardService aufgerufen,
   * um das entsprechende Padlet abzurufen. Sobald das Padlet erhalten wurde, werden verschiedene Initialisierungsmethoden
   * aufgerufen, um die Eigenschaften des Padlets und die Benutzerrollen zu setzen.
   */
  ngOnInit(){
    const params = this.route.snapshot.params;
    this.pb.getSingle(params['id']).subscribe((p:Padlet) => {
      this.padlet = p;
      this.initPadlet();
      this.loading = false;
    });
  }


  /**
   * Diese Methode wird verwendet, um verschiedene Eigenschaften des Padlets zu initialisieren. Sie ruft die folgenden Methoden auf:
   * hasImages() (um zu überprüfen, ob das Padlet Bilder enthält), initLikeBtn() (um den Zustand des Like-Buttons zu setzen),
   * getEditors() (um die Benutzer mit der Editor-Rolle zu erhalten), getViewers() (um die Benutzer mit der Viewer-Rolle zu erhalten),
   * getOwner() (um den Besitzer des Padlets zu erhalten) und canUserEdit() (um zu überprüfen, ob der aktuelle Benutzer eine Bearbeitungsrolle hat).
   * Sie ruft auch die Methode initLikesAndComments() auf, um die Anzahl der Likes und Kommentare des Padlets zu initialisieren.
   */
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

  /**
   * Diese Methode wird aufgerufen, wenn das Padlet gelöscht werden soll. Zuerst wird eine Bestätigungsdialogbox angezeigt.
   * Wenn der Benutzer die Löschung bestätigt, wird die remove()-Methode des PadletBoardService aufgerufen, um das Padlet
   * vom Server zu entfernen. Nachdem das Padlet erfolgreich gelöscht wurde, wird der Benutzer zur Übersichtsseite navigiert
   * und eine Erfolgsmeldung wird angezeigt.
   */
  removePadlet(){
    if( confirm("Soll dieses Padlet wirklich gelöscht werden?")){
      this.pb.remove(this.padlet.id).subscribe((res:any) => {
        this.router.navigate(['../'], {relativeTo: this.route});
        this.toastr.success('Padlet wurde erfolgreich gelöscht');
      });
    }
  }

  /**
   * Diese Methode wird verwendet, um die Anzahl der Likes und Kommentare des Padlets zu initialisieren.
   * Sie überprüft, ob das Padlet Likes und Kommentare enthält, und setzt dann die entsprechenden Zähler.
   */
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

  /**
   * Diese Methode wird verwendet, um den Zustand des Like-Buttons zu setzen. Sie überprüft, ob das Padlet Likes enthält und
   * ob der aktuelle Benutzer bereits ein Like abgegeben hat. Basierend auf diesen Informationen wird der Zustand des Like-Buttons festgelegt.
   */
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

  /**
   * Diese Methode wird aufgerufen, wenn der Like-Button geklickt wird. Abhängig vom aktuellen Zustand des Like-Buttons
   * wird entweder die Methode likePadlet() oder dislikePadlet() aufgerufen.
   */
  like() {
    if(this.likeable){
      this.likePadlet();
    } else{
      this.dislikePadlet();
    }
  }

  /**
   * Diese Methode wird aufgerufen, wenn der Benutzer das Padlet liken möchte. Sie erstellt ein neues Like-Objekt mit der
   * Benutzer-ID und fügt es dem Padlet hinzu. Dann wird die like()-Methode des PadletBoardService aufgerufen,
   * um das Like an den Server zu senden. Nachdem das Like erfolgreich gesendet wurde, wird der Benutzer zur entsprechenden
   * Seite navigiert, der Zustand des Like-Buttons wird aktualisiert und die Methode ngOnInit() wird erneut aufgerufen,
   * um die Anzahl der Likes und Kommentare zu aktualisieren.
   */
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

  /**
   * Diese Methode wird aufgerufen, wenn der Benutzer das Like für das Padlet entfernen möchte. Sie ruft die dislike()-Methode
   * des PadletBoardService auf, um das Like vom Server zu entfernen. Nachdem das Like erfolgreich entfernt wurde, wird
   * der Benutzer zur entsprechenden Seite navigiert, der Zustand des Like-Buttons wird aktualisiert und die Methode ngOnInit()
   * wird erneut aufgerufen, um die Anzahl der Likes und Kommentare zu aktualisieren.
   */
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

  /**
   * Diese Methode wird verwendet, um zu überprüfen, ob das Padlet Bilder enthält. Sie überprüft die Anzahl der Bilder
   * im Padlet und setzt entsprechende Eigenschaften, um das Layout anzupassen.
   */
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

  /**
   * Diese Methode wird verwendet, um die Benutzer mit der Editor-Rolle des Padlets zu erhalten. Sie durchläuft die Liste
   * der Benutzer des Padlets und fügt die Benutzer mit der Editor-Rolle der editors-Liste hinzu.
   */
  getEditors(){
    if(this.padlet.users){
      for (let user of this.padlet.users){
        if(user.pivot?.user_role == "editor"){
          this.editors.push(user);
        }
      }
    }
  }

  /**
   * Diese Methode wird verwendet, um die Benutzer mit der Viewer-Rolle des Padlets zu erhalten. Sie durchläuft die Liste
   * der Benutzer des Padlets und fügt die Benutzer mit der Viewer-Rolle der viewers-Liste hinzu.
   */
  getViewers(){
    if(this.padlet.users){
      for (let user of this.padlet.users){
        if(user.pivot?.user_role == "viewer"){
          this.viewers.push(user);
        }
      }
    }
  }

  /**
   * Diese Methode wird verwendet, um den Besitzer des Padlets zu erhalten. Sie durchläuft die Liste der Benutzer des
   * Padlets und sucht nach dem Benutzer mit der Besitzer-Rolle. Wenn der Besitzer gefunden wird, wird er der owner-Eigenschaft
   * zugewiesen und die Methode gibt true zurück. Andernfalls wird die owner-Eigenschaft auf undefined gesetzt und die
   * Methode gibt false zurück.
   */
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

  /**
   * Diese Methode wird verwendet, um zu überprüfen, ob der aktuelle Benutzer eine Bearbeitungsrolle für das Padlet hat.
   * Sie vergleicht die Benutzer-ID des aktuellen Benutzers mit den IDs der Editor- und Viewer-Benutzer des Padlets und
   * setzt entsprechende Eigenschaften (isEditor, isViewer, isOwner) basierend auf den Ergebnissen.
   */
  canUserEdit(){
    const currentUserId = this.userservice.getCurrentUserId();
    if(this.editors.find(item => item.id === currentUserId)) this.isEditor = true;
    if(this.viewers.find(item => item.id === currentUserId)) this.isViewer = true;
    if(this.owner?.id === currentUserId) this.isOwner = true;
  }

}
