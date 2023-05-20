import { Injectable } from '@angular/core';
import {Comment, Image, Like, Padlet, User} from "./padlet";
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PadletBoardService {

  private api = 'http://padlet.s2010456001.student.kwmhgb.at/api';

  padlets : Padlet[];

  constructor() {

    this.padlets = [
      new Padlet(
        1,
        'padlet 1',
        false,
        new Date(),
        'Beschreibung',
        [new Image(1, 'https://ng-buch.de/cover1.jpg', 'titel')]
      ),
      new Padlet(
        2,
        'padlet 2',
        false,
        new Date(),
        'Beschreibung',
        [new Image(1, 'https://ng-buch.de/cover1.jpg', 'titel')],
        [new User(1, 'Simona', 'Ascher', 'email', 'passwort'), new User(2, 'Michael', 'Keplinger', 'email', 'passwort')] ,
        [new Comment(1, "Kommentar", 2)],
        [new Like(1), new Like(2)]
      ),
      new Padlet(
        3,
        'padlet 3',
        false,
        new Date(),
        'Beschreibung',
        [new Image(1, 'https://ng-buch.de/cover1.jpg', 'titel'), new Image(1, 'https://ng-buch.de/cover2.jpg', 'titel')],
        [new User(1, 'Simona', 'Ascher', 'email', 'passwort')] ,
      ),
      new Padlet(
        4,
        'padlet 4',
        false,
        new Date(),
        'Beschreibung',
        [new Image(1, 'https://ng-buch.de/cover1.jpg', 'titel')],
        [new User(1, 'Simona', 'Ascher', 'email', 'passwort')] ,
      )
    ];
  }

  getAll(){
    return this.padlets;
  }

  getSingle(id: number) : Padlet{
    return <Padlet>this.padlets.find(padlet => padlet.id == id);
    //foreach padlet in this.padlets – this.padlet.id === id; return this.padlet; oder so
  }

}
