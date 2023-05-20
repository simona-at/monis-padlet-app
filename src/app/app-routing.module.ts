import {RouterModule, Routes} from "@angular/router";
import {PadletListComponent} from "./padlet-list/padlet-list.component";
import {PadletDetailsComponent} from "./padlet-details/padlet-details.component";
import {NgModule} from "@angular/core";


const routes : Routes = [
  { path: '', redirectTo: 'board', pathMatch: 'full' },
  { path: 'board', component: PadletListComponent },
  { path: 'board/:id', component: PadletDetailsComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule {}
