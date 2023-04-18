import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//Component 
import { SelectTipoSolicitudDialog } from './select-tipo-solicitud-dialog';


//Material 
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';




@NgModule({
  declarations: [
    SelectTipoSolicitudDialog
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
  ],
  exports: [
    SelectTipoSolicitudDialog
  ], 
  entryComponents:[
    SelectTipoSolicitudDialog
  ]
  
})
export class SelectTipoSolicitudDialogModule { }
