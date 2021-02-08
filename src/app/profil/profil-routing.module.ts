import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilComponent } from './profil.component';
import { SingleProfilComponent } from './single-profil/single-profil.component';

const routes: Routes = [
  // { path: '', component: ProfilComponent },

  {
    path:'profils',
    component:ProfilComponent,
    children:[
      { path:':id', component:SingleProfilComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilRoutingModule { }
