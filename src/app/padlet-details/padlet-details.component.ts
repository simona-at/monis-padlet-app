import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Padlet} from '../shared/padlet';
import {PadletBoardService} from "../shared/padlet-board.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PadletFactory} from "../shared/padlet-factory";

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


  constructor(private pb: PadletBoardService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(){
    const params = this.route.snapshot.params;
    // this.padlet = this.pb.getSingle(params['id']);
    this.pb.getSingle(params['id']).subscribe((p:Padlet) => this.padlet = p);
    console.log("test");
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
    }
  }


}
