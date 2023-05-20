import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Padlet} from '../shared/padlet';
import {PadletBoardService} from "../shared/padlet-board.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'bs-padlet-details',
  templateUrl: './padlet-details.component.html',
  styles: [
  ]
})
export class PadletDetailsComponent {

  padlet: Padlet | undefined;

  // @Input() padlet : Padlet | undefined
  // @Output() showListEvent = new EventEmitter<any>();


  constructor(private pb: PadletBoardService, private route: ActivatedRoute) {}

  ngOnInit(){
    const params = this.route.snapshot.params;
    this.padlet = this.pb.getSingle(params['id']);
  }

  // showPadletList(){
  //   this.showListEvent.emit();
  // }


  // getLikes(num:number){
  //
  // }


}
