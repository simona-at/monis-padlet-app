import { Component, OnInit } from '@angular/core';
import { Padlet, Image, Comment, Like, User } from "../shared/padlet";

@Component({
  selector: 'bs-padlet-list',
  templateUrl: './padlet-list.component.html',
  styles: [
  ]
})
export class PadletListComponent implements OnInit {

  padlets : Padlet[] = [];

  ngOnInit(): void {

    this.padlets = [
      new Padlet(
        1,
        'ein Titel',
        false,
        'Beschreibung',
        [new Image(1, 'https://ng-buch.de/cover1.jpg', 'titel')]
      ),
      new Padlet(
        1,
        'ein Titel',
        false,
        'Beschreibung',
        [new Image(1, 'https://ng-buch.de/cover1.jpg', 'titel')],
        [new User(1, 'Simona', 'Ascher', 'email', 'passwort'), new User(2, 'Michael', 'Keplinger', 'email', 'passwort')] ,
        [new Comment(1, "Kommentar", 2)],
        [new Like(1), new Like(2)]
      ),
      new Padlet(
        1,
        'ein Titel',
        false,
        'Beschreibung',
        [new Image(1, 'https://ng-buch.de/cover1.jpg', 'titel')],
        [new User(1, 'Simona', 'Ascher', 'email', 'passwort')] ,
      ),
      new Padlet(
        1,
        'ein Titel',
        false,
        'Beschreibung',
        [new Image(1, 'https://ng-buch.de/cover1.jpg', 'titel')],
        [new User(1, 'Simona', 'Ascher', 'email', 'passwort')] ,
      )
    ];

    console.log(this.padlets);
  }
}
