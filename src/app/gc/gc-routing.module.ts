import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GcComponent } from './gc.component';

const routes: Routes = [{ path: '', component: GcComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GcRoutingModule { }
