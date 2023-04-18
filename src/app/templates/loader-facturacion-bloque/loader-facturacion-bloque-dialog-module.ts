import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Component 
import { LoaderFacturacionBloqueDialog } from './loader-facturacion-bloque-dialog';

//Material 
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    LoaderFacturacionBloqueDialog
  ],
  imports: [
    CommonModule,
       
    //Material
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  
  exports: [
    LoaderFacturacionBloqueDialog
  ],  
  entryComponents:[
    LoaderFacturacionBloqueDialog
  ]

  
})
export class LoaderFacturacionBloqueDialogModule { }
