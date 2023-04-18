import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//Component 
import { InfoEstadoActivacionDialog } from './info-estado-activacion-dialog';


//Material 
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';





@NgModule({
  declarations: [
    InfoEstadoActivacionDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    FlexLayoutModule,

    //Material
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule, 
    MatButtonModule,
    
  ],
  exports: [
    InfoEstadoActivacionDialog
  ],
  entryComponents:[
    InfoEstadoActivacionDialog
  ]
  
})
export class InfoEstadoActivacionDialogModule { }
