import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { MaterialModule } from '../material.module';
import { HeaderComponent } from './header/header.component';
import { BrowserModule } from '@angular/platform-browser';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FooterComponent } from './footer/footer.component';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [LayoutComponent,HeaderComponent,SidenavComponent, FooterComponent],
  imports: [
    LayoutRoutingModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports:[
      HeaderComponent,
      SidenavComponent,
      FooterComponent
  ]
})
export class LayoutModule { }
