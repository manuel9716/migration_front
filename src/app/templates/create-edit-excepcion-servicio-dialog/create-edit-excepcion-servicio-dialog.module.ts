
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//Component 
import { CreateEditExcepcionServicioDialog } from './create-edit-excepcion-servicio-dialog';


//Material 
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';




@NgModule({
  declarations: [
    CreateEditExcepcionServicioDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    FlexLayoutModule,

    //Material
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatProgressBarModule,
    
    
  ],
  exports: [
    CreateEditExcepcionServicioDialog
  ],  
  entryComponents:[
    CreateEditExcepcionServicioDialog
  ]
  
})
export class CreateEditExcepcionServicioDialogModule { }
