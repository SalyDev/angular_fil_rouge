import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminComponent } from './admin/admin.component';
// import { ApprenantComponent } from './apprenant/apprenant.component';
// import { CmComponent } from './cm/cm.component';
// import { FormateurComponent } from './formateur/formateur.component';
import { DefaultRoutingModule } from './layouts/default/default-routing.module';
import { DefaultComponent } from './layouts/default/default.component';
import { LoginComponent } from './login/login.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { ProfilComponent } from './profil/profil.component';
import { ProfilModule } from './profil/profil.module';
import { SingleProfilComponent } from './profil/single-profil/single-profil.component';
import { SingleUserComponent } from './users/single-user/single-user.component';
import { AuthGuard } from './_helpers/AuthGuard';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path:'',pathMatch:'full', redirectTo:'login' },
  { path: 'login', component:LoginComponent },
  // { path: 'users', component: UsersComponent },
  // { path:'users/new', component: NewUserComponent },
  { path:'admins',canActivate: [AuthGuard],loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path:'apprenants/:id', component:SingleUserComponent },
  // { path: 'apprenants', loadChildren: () => import('./apprenant/apprenant.module').then(m => m.ApprenantModule) },
  // { path:'admin/admin-layout', component:AdminLayoutComponent},
  // { path:'admins/:id', component:SingleUserComponent },
  // { path: 'formateurs', loadChildren: () => import('./formateur/formateur.module').then(m => m.FormateurModule) },
  // { path:'formateurs/:id', component:SingleUserComponent },
  // { path: 'cms', loadChildren: () => import('./cm/cm.module').then(m => m.CmModule) },
  // { path:'cms/:id', component:SingleUserComponent },
  { path: 'layout', loadChildren: () => import('./shared/layout.module').then(m => m.LayoutModule) },
  // { path: 'profils', loadChildren: () => import('./profil/profil.module').then(m => m.ProfilModule) },
  // { path: 'profils/new', component:ProfilNewComponent },
  // { path:'profils/:id', component:SingleProfilComponent },
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
