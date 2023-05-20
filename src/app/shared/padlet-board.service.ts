import { Injectable } from '@angular/core';
import {Comment, Image, Like, Padlet, User} from "./padlet";

@Injectable({
  providedIn: 'root'
})
export class PadletBoardService {

  padlets : Padlet[];

  constructor() {

    this.padlets = [
      new Padlet(
        "1",
        'padlet 1',
        false,
        'Beschreibung',
        [new Image(1, 'https://ng-buch.de/cover1.jpg', 'titel')]
      ),
      new Padlet(
        "2",
        'padlet 2',
        false,
        'Beschreibung',
        [new Image(1, 'https://ng-buch.de/cover1.jpg', 'titel')],
        [new User(1, 'Simona', 'Ascher', 'email', 'passwort'), new User(2, 'Michael', 'Keplinger', 'email', 'passwort')] ,
        [new Comment(1, "Kommentar", 2)],
        [new Like(1), new Like(2)]
      ),
      new Padlet(
        "3",
        'padlet 3',
        false,
        'Beschreibung',
        [new Image(1, 'https://ng-buch.de/cover1.jpg', 'titel'), new Image(1, 'https://ng-buch.de/cover2.jpg', 'titel')],
        [new User(1, 'Simona', 'Ascher', 'email', 'passwort')] ,
      ),
      new Padlet(
        "4",
        'padlet 4',
        false,
        'Beschreibung',
        [new Image(1, 'https://ng-buch.de/cover1.jpg', 'titel')],
        [new User(1, 'Simona', 'Ascher', 'email', 'passwort')] ,
      )
    ];
  }

  getAll(){
    return this.padlets;
  }

  getSingle(id: string) : Padlet{
    return <Padlet>this.padlets.find(book => book.id === id)
    //foreach padlet in this.padlets – this.padlet.id === id; return this.padlet; oder so

  }

}
