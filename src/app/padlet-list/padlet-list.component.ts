import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Padlet, Image, Comment, Like, User } from "../shared/padlet";
import {PadletBoardService} from "../shared/padlet-board.service";

@Component({
  selector: 'bs-padlet-list',
  templateUrl: './padlet-list.component.html',
  styles: [
  ]
})
export class PadletListComponent implements OnInit {

  padlets : Padlet[] = [];

  // @Output() showDetailsEvent = new EventEmitter<Padlet>();

  constructor(private pb: PadletBoardService) {
  }

  ngOnInit(): void {

    this.padlets = this.pb.getAll();

  }

  // showDetails(padlet: Padlet){
  //   this.showDetailsEvent.emit(padlet);
  // }
}
