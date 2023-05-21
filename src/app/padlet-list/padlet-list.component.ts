import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Padlet, Image, Comment, Like, User } from "../shared/padlet";
import {PadletBoardService} from "../shared/padlet-board.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'bs-padlet-list',
  templateUrl: './padlet-list.component.html',
  styles: [
  ]
})
export class PadletListComponent implements OnInit {

  padlets : Padlet[] = [];

  // @Output() showDetailsEvent = new EventEmitter<Padlet>();

  constructor(private pb: PadletBoardService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.pb.getAll().subscribe(res => this.padlets = res);
    // this.toastr.success('Padlets wurden erfolgreich geladen');
  }


  numberToString(id: number){
    return String(id);
  }
}
