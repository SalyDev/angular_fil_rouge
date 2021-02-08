import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferentielRoutingModule } from './referentiel-routing.module';
import { ReferentielComponent } from './referentiel.component';
import { NewReferentielComponent } from './new-referentiel/new-referentiel.component';
import { SingleReferentielComponent } from './single-referentiel/single-referentiel.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipeModule } from '../pipes/pipe.module';
import { ResumePipe } from '../pipes/resume.pipe';


@NgModule({
  declarations: [ReferentielComponent, NewReferentielComponent, SingleReferentielComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ReferentielRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    PipeModule,
  ]
})
export class ReferentielModule { }
