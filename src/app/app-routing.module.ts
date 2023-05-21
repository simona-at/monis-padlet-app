import {RouterModule, Routes} from "@angular/router";
import {PadletListComponent} from "./padlet-list/padlet-list.component";
import {PadletDetailsComponent} from "./padlet-details/padlet-details.component";
import {NgModule} from "@angular/core";
import {PadletFormComponent} from "./padlet-form/padlet-form.component";
import {LoginComponent} from "./login/login.component";



const routes : Routes = [
  { path: '', redirectTo: 'board', pathMatch: 'full' },
  { path: 'board', component: PadletListComponent },
  { path: 'board/:id', component: PadletDetailsComponent },
  { path: 'create', component: PadletFormComponent },
  { path: 'edit/:id', component: PadletFormComponent },
  { path: 'login', component: LoginComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule {}
