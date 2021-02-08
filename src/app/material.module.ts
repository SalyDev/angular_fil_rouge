import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatDividerModule} from '@angular/material/divider'; 
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion'; 
import { MatSortModule } from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog'; 
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import {MatRadioModule} from '@angular/material/radio';
import {MatChipsModule} from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FileInputConfig, MaterialFileInputModule } from 'ngx-material-file-input';
import {ScrollingModule} from '@angular/cdk/scrolling';



const importations = [
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatMenuModule,
    MatListModule,
    MatExpansionModule,
    MatSortModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatChipsModule,
    MatAutocompleteModule,
    MaterialFileInputModule,
    ScrollingModule
];


@NgModule({
    imports:importations,
    exports:importations
  })
export class MaterialModule {}