import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//Component 
import { EditarDeplazamientoDialog } from './editar-deplazamiento-dialog';


//Material 
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    EditarDeplazamientoDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlexModule,
    FlexLayoutModule, 
    //Material
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    // MatInputModule,
    // MatTableModule, 
    MatIconModule, 
    // MatProgressBarModule, 
    MatProgressSpinnerModule,
    MatTooltipModule, 
    // MatPaginatorModule, 
    MatSnackBarModule,
    // MatSortModule,
    // MatSnackBarModule,
    MatSelectModule,
  ],
  exports: [
    EditarDeplazamientoDialog
  ],  
  entryComponents:[
    EditarDeplazamientoDialog
  ]

  
})
export class EditarDeplazamientoDialogModule { }
