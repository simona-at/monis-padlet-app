import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Padlet} from '../shared/padlet';
import {Like} from '../shared/like';
import {PadletBoardService} from "../shared/padlet-board.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PadletFactory} from "../shared/padlet-factory";
import {ToastrService} from "ngx-toastr";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'bs-padlet-details',
  templateUrl: './padlet-details.component.html',
  styles: [
  ]
})
export class PadletDetailsComponent {

  padlet: Padlet = PadletFactory.empty();

  // @Input() padlet : Padlet | undefined
  // @Output() showListEvent = new EventEmitter<any>();


  constructor(private pb: PadletBoardService, private route: ActivatedRoute, private router: Router, private toastr : ToastrService) {}

  ngOnInit(){
    const params = this.route.snapshot.params;
    // this.padlet = this.pb.getSingle(params['id']);
    this.pb.getSingle(params['id']).subscribe((p:Padlet) => this.padlet = p);
  }

  // showPadletList(){
  //   this.showListEvent.emit();
  // }


  // getLikes(num:number){
  //
  // }


  removePadlet(){
    if( confirm("Soll dieses Padlet wirklich gelöscht werden?")){
      this.pb.remove(this.padlet.id).subscribe((res:any) => this.router.navigate(['../'], {relativeTo: this.route}));
      this.toastr.success('Padlet wurde erfolgreich gelöscht');
    }
  }


  getCurrentUserId(){
    return 2;
  }


  like() {
    let likeable = true;

    // console.log(this.padlet.likes)
    if(this.padlet.likes) {
      if(this.padlet.likes.length > 0){
        // console.log("hier sind mehr als 0 Likes");
        for (let like of this.padlet.likes) {
          // console.log(like);
          if (like['user_id'] == this.getCurrentUserId()) {
            likeable = false;
            break;
            // console.log("ich hab bereits geliked?!");
            // this.dislikePadlet();
          }
          // else {
          //   // console.log("ich hab noch nicht geliked :)");
          //   // this.likePadlet();
          // }
        }
      }
      // else {
      //   likeable = true;
      // }
    }

    if(likeable){
      this.likePadlet();
      // console.log("hier wird geliked");
    } else{
      this.dislikePadlet();
      // console.log("hier wird gedisliked");
    }

  }

  likePadlet(){
    let user_id = this.getCurrentUserId();
    let like = new Like(user_id);
    this.padlet.likes?.push(like);

    this.pb.like(this.padlet).subscribe(res => {
      this.router.navigate(["../../board", this.padlet.id], {
        relativeTo: this.route
      });
    });
  }

  dislikePadlet(){
    // let user_id = ;
    // // let like = new Like(user_id);
    //
    // let dislikeArray: Like[] = [];
    // console.log(dislikeArray);
    //
    // let dislike = new Like(user_id);
    // dislikeArray.push(dislike);
    //
    // console.log(dislikeArray);

    this.pb.dislike(this.padlet, this.getCurrentUserId()).subscribe(res => {
      this.router.navigate(["../../board", this.padlet.id], {
        relativeTo: this.route
      });
    });
  }


  // like() {
  //   console.log(this.padlet.likes);
  //   if (this.padlet.likes) {
  //     for (let like of this.padlet.likes) {
  //       if (like['user_id'] != this.getCurrentUserId()) {
  //         console.log("ich hab bereits geliked?!");
  //         // this.dislikePadlet();
  //       } else {
  //         console.log("ich hab noch nicht geliked :)");
  //         // this.likePadlet();
  //       }
  //     }
  //   } else {
  //     this.likePadlet();
  //   }
  // }
  //
  // likePadlet(){
  //   let like = new Like(this.getCurrentUserId());
  //   this.padlet.likes?.push(like);
  //   this.pb.like(this.padlet).subscribe(res => {
  //     this.router.navigate(["../../board", this.padlet.id], {
  //       relativeTo: this.route
  //     });
  //   });
  // }


    // get id from current user
    // push user_id into likes-array from this.padlet
    // give this.padlet to this.pb.likes()


    // commentPadlet() {
    //   this.pb.comment(this.padlet).subscribe(res => {
    //     this.router.navigate(["../../board", this.padlet.id], {
    //       relativeTo: this.route
    //     });
    //   });
    // }




}
