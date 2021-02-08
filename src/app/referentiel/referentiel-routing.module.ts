import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferentielComponent } from './referentiel.component';

const routes: Routes = [{ path: '', component: ReferentielComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferentielRoutingModule { }
