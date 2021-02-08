import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
  { path: '', component: LayoutComponent },
  // { path: 'header', component: HeaderComponent },
  // { path: "main-layout", component:MainLayoutComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
