import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//Component 
import { EditarCasoEspecialDialog } from './editar-caso-especial-dialog';


//Material 
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    EditarCasoEspecialDialog
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
    MatInputModule,
    MatSnackBarModule,
      
  ],
  exports: [
    EditarCasoEspecialDialog
  ],
  entryComponents:[
    EditarCasoEspecialDialog
  ]
  
})
export class EditarCasoEspecialDialogModule { }
