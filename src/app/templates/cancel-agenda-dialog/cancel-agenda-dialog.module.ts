import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//Component 
import { CancelAgendaDialog } from './cancel-agenda-dialog';


//Material 
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    CancelAgendaDialog,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    //Material
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatInputModule,
    MatSnackBarModule,
    

    
  ],
  exports: [
    CancelAgendaDialog
  ], 
  entryComponents:[
    CancelAgendaDialog
  ],
  
})
export class CancelAgendaDialogModule { }
