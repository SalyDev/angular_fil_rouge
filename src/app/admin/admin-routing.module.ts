import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

import { AdminComponent } from './admin.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'admin-layout', component: AdminLayoutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
