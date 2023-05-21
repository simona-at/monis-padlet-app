import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PadletFactory} from "../shared/padlet-factory";
import {Padlet} from "../shared/padlet";
import {Image} from "../shared/image";
import {PadletBoardService} from "../shared/padlet-board.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PadletFormErrorMessages} from "./padlet-form-error-messages";
import {ToastrService} from "ngx-toastr";

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

  constructor(private fb: FormBuilder, private pb: PadletBoardService, private route: ActivatedRoute, private router: Router, private toastr : ToastrService) {
    this.padletForm = this.fb.group({});
    this.images = this.fb.array([]);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params["id"];
    if(id) {
      this.isUpdatingPadlet = true;
      this.pb.getSingle(id).subscribe(
        padlet => {
          this.padlet = padlet;
          this.initPadlet();
        }
      );
    }
    this.initPadlet();
  }

  initPadlet(){
    this.buildThumbnailsArray();

    this.padletForm = this.fb.group({
      id : this.padlet.id,
      title: [this.padlet.title, Validators.required],
      description: [this.padlet.description],
      images: this.images,
      is_private : this.padlet.is_private
    });
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
    // else{
    //   console.log("keine bilder");
    // }
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
    this.padletForm.value.images = this.padletForm.value.images.filter(
      (thumbnail: {url :string}) => thumbnail.url
    );

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
      // padlet.user_id = 1;
      // console.log(book);
      this.pb.create(padlet).subscribe(res =>{
        this.padlet = PadletFactory.empty();
        this.padletForm.reset(PadletFactory.empty());
        this.router.navigate(["../board"], {
          relativeTo: this.route
        });
      });
      this.toastr.success('Padlet wurde erstellt!');
    }
  }

}
