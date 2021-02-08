import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GcRoutingModule } from './gc-routing.module';
import { GcComponent } from './gc.component';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewGcComponent } from './new-gc/new-gc.component';
import { SingleGcComponent } from './single-gc/single-gc.component';
import { CompetencesComponent } from './competences/competences.component';
import { PipeModule } from '../pipes/pipe.module';
import { NewComptenceComponent } from './new-comptence/new-comptence.component';
import { SingleCompetenceComponent } from './single-competence/single-competence.component';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [GcComponent, NewGcComponent, SingleGcComponent, CompetencesComponent, NewComptenceComponent, SingleCompetenceComponent],
  imports: [
    CommonModule,
    GcRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule
  ]
})
export class GcModule { }
