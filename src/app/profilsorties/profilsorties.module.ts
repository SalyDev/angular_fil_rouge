import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilsortiesRoutingModule } from './profilsorties-routing.module';
import { ProfilsortiesComponent } from './profilsorties.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [ProfilsortiesComponent],
  imports: [
    CommonModule,
    ProfilsortiesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class ProfilsortiesModule { }
