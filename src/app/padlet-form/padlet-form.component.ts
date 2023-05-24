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
  padletForm : FormGroup;
  images : FormArray;

  padlet : Padlet = PadletFactory.empty();
  currentUser : User | undefined;
  users : User[] = [];

  errors : { [key : string]: string } = {};

  isUpdatingPadlet : boolean = false;
  loading: boolean = true;

  visabilityDefault : number = 0;

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

  /**
   * Diese Methode wird beim Initialisieren der Komponente aufgerufen. Zuerst werden die Benutzer mithilfe des UserService
   * abgerufen und in der Variable users gespeichert. Dann wird die getCurrentUser()-Methode aufgerufen, um den aktuellen Benutzer
   * zu ermitteln. Anschließend wird die id aus der aktuellen Route extrahiert, um festzustellen, ob das Padlet aktualisiert wird.
   * Wenn eine id vorhanden ist, wird die getSingle()-Methode des PadletBoardService aufgerufen, um das entsprechende
   * Padlet abzurufen. Das abgerufene Padlet wird dann initialisiert und die Ladevariable loading wird auf false gesetzt.
   */
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

  /**
   * Diese Methode durchläuft die Liste der Benutzer (users) und vergleicht die id jedes Benutzers mit der aktuellen Benutzer-ID,
   * die aus dem UserService stammt. Wenn eine Übereinstimmung gefunden wird, wird der entsprechende Benutzer zurückgegeben,
   * andernfalls wird undefined zurückgegeben.
   */
  getCurrentUser(){
    for(let user of this.users){
      if(user.id == this.userservice.getCurrentUserId()){
        return user;
      }
    }
    return undefined;
  }

  /**
   * Diese Methode initialisiert das padletForm-FormGroup basierend auf dem aktuellen Padlet und dem aktuellen Benutzer.
   * Wenn das Padlet aktualisiert wird oder kein aktueller Benutzer vorhanden ist, wird das Formular mit den entsprechenden
   * Werten initialisiert. Andernfalls wird das Formular mit einem leeren Array für die Benutzer initialisiert. Die Methode
   * updateErrorMessages() wird abonniert, um die Fehlermeldungen im Formular zu aktualisieren.
   */
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

  /**
   * Diese Methode erstellt das FormArray images basierend auf den Bildern des Padlets. Wenn das Padlet aktualisiert wird,
   * wird ein leeres Image-Objekt (Image(0, '', '')) am Ende des padlet.images-Arrays hinzugefügt. Dann wird das images-FormArray
   * erstellt, indem es über die padlet.images-Liste iteriert und für jedes Bild ein FormGroup mit den entsprechenden
   * FormControls für id, url und title erstellt.
   */
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

  /**
   * Diese Methode fügt ein neues FormGroup für ein Bild zum images-FormArray hinzu.
   */
  addThumbnailControl(){
    this.images.push(this.fb.group({id:0, url: null, title:null}));
  }

  /**
   * Diese Methode aktualisiert die Fehlermeldungen im Formular. Sie durchläuft die Liste der Fehlermeldungen (PadletFormErrorMessages)
   * und überprüft, ob ein Formularsteuerelement den entsprechenden Fehler aufweist. Wenn ein Fehler vorhanden ist, wird er zur errors-Map hinzugefügt.
   */
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

  /**
   * Diese Methode wird aufgerufen, wenn das Formular abgeschickt wird. Zuerst wird überprüft, ob für angegebene Bilder sowohl
   * eine URL als auch ein Titel angegeben wurden. Wenn nicht, wird eine Fehlermeldung angezeigt. Dann werden leere Einträge
   * im images-FormArray entfernt. Wenn das Padlet neu erstellt wird und ein aktueller Benutzer vorhanden ist, wird der aktuelle
   * Benutzer als Eigentümer hinzugefügt. Andernfalls werden die Benutzer auf undefined gesetzt. Das Padlet-Objekt wird
   * aus den Formularwerten erstellt und entweder über die update()-Methode des PadletBoardService aktualisiert
   * (bei einem vorhandenen Padlet) oder über die create()-Methode des PadletBoardService erstellt (bei einem neuen Padlet).
   * Nachdem das Padlet erstellt oder aktualisiert wurde, wird der Benutzer zur entsprechenden Seite navigiert und eine
   * Erfolgsmeldung angezeigt.
   */
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
    } else if(!this.currentUser) {
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
