import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumePipe } from './resume.pipe';



@NgModule({
  declarations: [ResumePipe],
  imports: [
    CommonModule
  ],
  exports:[
    ResumePipe
  ]
})
export class PipeModule { }
