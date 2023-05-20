import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PadletListComponent } from './padlet-list/padlet-list.component';
import { PadletListItemComponent } from './padlet-list-item/padlet-list-item.component';
import { PadletDetailsComponent } from './padlet-details/padlet-details.component';
import {PadletBoardService} from "./shared/padlet-board.service";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    PadletListComponent,
    PadletListItemComponent,
    PadletDetailsComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule
  ],
  providers: [PadletBoardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
