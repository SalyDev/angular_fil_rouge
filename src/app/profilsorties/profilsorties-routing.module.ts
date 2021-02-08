import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilsortiesComponent } from './profilsorties.component';

const routes: Routes = [{ path: '', component: ProfilsortiesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilsortiesRoutingModule { }
