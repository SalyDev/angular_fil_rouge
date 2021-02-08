import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DefaultComponent } from './default.component';
import { MaterialModule } from 'src/app/material.module';
import { ProfilModule } from 'src/app/profil/profil.module';
import { LayoutModule } from 'src/app/shared/layout.module';




@NgModule({
  declarations: [DefaultComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    LayoutModule,
    ProfilModule
  ]
})
export class DefaultModule { }
