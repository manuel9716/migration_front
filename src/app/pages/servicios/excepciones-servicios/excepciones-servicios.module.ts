import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Componentes 
import { ExcepcionesServiciosComponent } from './excepciones-servicios.component';

//Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogModule } from 'src/app/templates/confirm-dialog/confirm-dialog.module';
import { CreateEditExcepcionServicioDialogModule } from 'src/app/templates/create-edit-excepcion-servicio-dialog/create-edit-excepcion-servicio-dialog.module';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [ExcepcionesServiciosComponent],
  imports: [ 
    //AdditionalModels 
    CommonModule,
    FormsModule,
    FlexModule,
    FlexLayoutModule,

    
    //MaterialModels
    MatToolbarModule, 
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,

    //Template
    ConfirmDialogModule,
    CreateEditExcepcionServicioDialogModule,
    
  ],
  entryComponents:[

  ],
  exports: [
    CommonModule,
    ExcepcionesServiciosComponent
  ]
})
export class ExcepcionesServiciosModule { }
