import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilRoutingModule } from './profil-routing.module';
import { ProfilComponent } from './profil.component';
import { SingleProfilComponent } from './single-profil/single-profil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';


@NgModule({
  declarations: [ProfilComponent, SingleProfilComponent],
  imports: [
    CommonModule,
    ProfilRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
  ],
  exports:[
    ProfilComponent,
  ]
})
export class ProfilModule { }
