import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PromosRoutingModule } from './promos-routing.module';
import { PromosComponent } from './promos.component';
import { NewPromoComponent } from './new-promo/new-promo.component';
import { SinglePromoComponent } from './single-promo/single-promo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [PromosComponent, NewPromoComponent, SinglePromoComponent],
  imports: [
    CommonModule,
    PromosRoutingModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatRadioModule,
  ],
  providers: [DatePipe]
})
export class PromosModule { }
