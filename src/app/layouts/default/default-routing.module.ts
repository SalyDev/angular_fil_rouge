import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from 'src/app/admin/admin.component';
import { CompetencesComponent } from 'src/app/gc/competences/competences.component';
import { GcComponent } from 'src/app/gc/gc.component';
import { NewComptenceComponent } from 'src/app/gc/new-comptence/new-comptence.component';
import { NewGcComponent } from 'src/app/gc/new-gc/new-gc.component';
import { SingleCompetenceComponent } from 'src/app/gc/single-competence/single-competence.component';
import { SingleGcComponent } from 'src/app/gc/single-gc/single-gc.component';
import { NewUserComponent } from 'src/app/users/new-user/new-user.component';
import { ProfilComponent } from 'src/app/profil/profil.component';
import { ProfilsortiesComponent } from 'src/app/profilsorties/profilsorties.component';
import { NewPromoComponent } from 'src/app/promos/new-promo/new-promo.component';
import { PromosComponent } from 'src/app/promos/promos.component';
import { SinglePromoComponent } from 'src/app/promos/single-promo/single-promo.component';
import { NewReferentielComponent } from 'src/app/referentiel/new-referentiel/new-referentiel.component';
import { ReferentielComponent } from 'src/app/referentiel/referentiel.component';
import { SingleReferentielComponent } from 'src/app/referentiel/single-referentiel/single-referentiel.component';
import { SingleUserComponent } from 'src/app/users/single-user/single-user.component';
import { DefaultComponent } from './default.component';
import { UsersComponent } from 'src/app/users/users.component';
import { AuthGuard } from 'src/app/_helpers/AuthGuard';

const routes: Routes = [
  {
    path:'default',
    component:DefaultComponent, canActivate: [AuthGuard],
    children:[
      {
        path:'',
        redirectTo:'profils',
        pathMatch:'full'
      },
      {
      path:'admins',
      component:AdminComponent,
      children:[
        { path:':id', component:SingleUserComponent },
      ]
      },
     
      {
        path:'profils',
        component:ProfilComponent,
      },
      { path:'users', component:UsersComponent },
      { path:'users/new', component: NewUserComponent },
      { path:'users/:id', component: SingleUserComponent },
      { path:'competences', component:CompetencesComponent} ,
      { path:'competences/new', component:NewComptenceComponent },
      { path:'competences/:id', component:SingleCompetenceComponent },
      { path:'groupe_competences', component: GcComponent },
      { path:'groupe_competences/new', component: NewGcComponent },
      { path:'groupe_competences/:id', component:SingleGcComponent },
      { path:'referentiels', component: ReferentielComponent },
      { path:'referentiels/new', component:NewReferentielComponent},
      { path:'referentiels/:id', component:SingleReferentielComponent },
      { path:'promos', component: PromosComponent },
      { path:'promos/new', component: NewPromoComponent },
      { path:'promos/:id', component: SinglePromoComponent },
      { path:'profilsorties', component:ProfilsortiesComponent },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DefaultRoutingModule { }

