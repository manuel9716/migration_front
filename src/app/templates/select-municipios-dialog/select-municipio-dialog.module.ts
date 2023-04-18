import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//Component 
import { SelectMunicipioDialog } from './select-municipio-dialog';


//Material 
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';




@NgModule({
  declarations: [
    SelectMunicipioDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    FlexLayoutModule,

    //Material
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule
  ],
  exports: [
    SelectMunicipioDialog
  ], 
  entryComponents:[
    SelectMunicipioDialog
  ]
  
})
export class SelectMunicipioDialogModule { }
