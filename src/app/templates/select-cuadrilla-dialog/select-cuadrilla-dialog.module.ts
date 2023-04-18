import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//Component 
import { SelectCuadrillaDialog } from './select-cuadrilla-dialog';


//Material 
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    SelectCuadrillaDialog
  ],
  imports: [
    CommonModule,
    FormsModule,

    //Material
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatTableModule, 
    MatIconModule, 
    MatProgressBarModule, 
    MatTooltipModule, 
    MatPaginatorModule, 
    MatSnackBarModule,
    MatSortModule,
    MatSnackBarModule,
  ],
  exports: [
    SelectCuadrillaDialog
  ],  
  entryComponents:[
    SelectCuadrillaDialog
  ]

  
})
export class SelectCuadrillaDialogModule { }
