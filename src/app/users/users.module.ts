import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResetInfosComponent } from './reset-infos/reset-infos.component';


@NgModule({
  declarations: [UsersComponent, ResetInfosComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class UsersModule { }
