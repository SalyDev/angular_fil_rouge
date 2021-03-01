import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultRoutingModule } from './layouts/default/default-routing.module';
import { LoginComponent } from './login/login.component';
import { SingleUserComponent } from './users/single-user/single-user.component';

const routes: Routes = [
  { path:'',pathMatch:'full', redirectTo:'login' },
  { path: 'login', component:LoginComponent },
  { path:'apprenants/:id', component:SingleUserComponent },
  { path: 'layout', loadChildren: () => import('./shared/layout.module').then(m => m.LayoutModule) },
  { path: 'gc', loadChildren: () => import('./gc/gc.module').then(m => m.GcModule) },
  { path: 'referentiel', loadChildren: () => import('./referentiel/referentiel.module').then(m => m.ReferentielModule) },
  { path: 'promos', loadChildren: () => import('./promos/promos.module').then(m => m.PromosModule) },
  { path: 'profilsorties', loadChildren: () => import('./profilsorties/profilsorties.module').then(m => m.ProfilsortiesModule) },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: '**', redirectTo:'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }), DefaultRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
