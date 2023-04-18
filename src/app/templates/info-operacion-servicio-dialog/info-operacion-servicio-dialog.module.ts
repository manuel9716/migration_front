import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//Component 
import { InfoOperacionServicioDialog } from './info-operacion-servicio-dialog';


//Material 
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CalificarLaborDialogModule } from '../calificar-labor-dialog/calificar-labor-dialog.module';
import { EditarCasoEspecialDialogModule } from '../editar-caso-especial-dialog/editar-caso-especial-dialog.module';




@NgModule({
  declarations: [
    InfoOperacionServicioDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    FlexLayoutModule,

    //Material
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule,
    MatSnackBarModule,

    //Template 
    CalificarLaborDialogModule,
    EditarCasoEspecialDialogModule,

  ],
  exports: [
    InfoOperacionServicioDialog
  ],
  entryComponents:[
    InfoOperacionServicioDialog
  ]
  
})
export class InfoOperacionServicioDialogModule { }
