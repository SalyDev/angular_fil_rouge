import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { MaterialModule } from '../material.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [AdminComponent, AdminLayoutComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports:[
    AdminLayoutComponent,
    AdminComponent,
  ]
})
export class AdminModule { }
