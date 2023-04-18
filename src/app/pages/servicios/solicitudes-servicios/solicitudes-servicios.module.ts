import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Componentes 
import { SolicitudesServiciosComponent } from './solicitudes-servicios.component';

//Modulos Comunes 
import { ConfirmDialogModule } from 'src/app/templates/confirm-dialog/confirm-dialog.module';
import { ProgramarRetiroDialogModule } from 'src/app/templates/programar-retiro-dialog/programar-retiro-dialog.module';
import { ProgramarSuspensionDialogModule } from 'src/app/templates/programar-suspension-dialog/programar-suspension-dialog.module';

// Material 
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [SolicitudesServiciosComponent],
  imports: [ 
    //AdditionalModels 
    CommonModule,
    RouterModule,
    FormsModule,
    FlexModule,
    FlexLayoutModule,
    
    // Material,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSortModule,
    MatButtonModule,
    MatInputModule, 
    
    //Template
    ConfirmDialogModule,
    ProgramarRetiroDialogModule,
    ProgramarSuspensionDialogModule,
    
  ],
  entryComponents:[

  ],
  exports: [
    CommonModule,
    SolicitudesServiciosComponent
  ]
})
export class SolicitudesServiciosModule { }
