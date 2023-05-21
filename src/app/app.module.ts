import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PadletListComponent } from './padlet-list/padlet-list.component';
import { PadletListItemComponent } from './padlet-list-item/padlet-list-item.component';
import { PadletDetailsComponent } from './padlet-details/padlet-details.component';
import {PadletBoardService} from "./shared/padlet-board.service";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import { PadletFormComponent } from './padlet-form/padlet-form.component';
import { ReactiveFormsModule} from "@angular/forms";
import { PadletDetailsCommentsComponent } from './padlet-details-comments/padlet-details-comments.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    PadletListComponent,
    PadletListItemComponent,
    PadletDetailsComponent,
    PadletFormComponent,
    PadletDetailsCommentsComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule, ToastrModule.forRoot(), ReactiveFormsModule
  ],
  providers: [PadletBoardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
