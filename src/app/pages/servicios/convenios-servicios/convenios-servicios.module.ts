import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes 
import { ConveniosServiciosComponent } from './convenios-servicios.component';

//Modulos Comunes 
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Material 
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
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogModule } from 'src/app/templates/confirm-dialog/confirm-dialog.module';
import { CreateEditConvenioServicioDialogModule } from 'src/app/templates/create-edit-convenio-servicio-dialog/create-edit-convenio-servicio-dialog.module';

@NgModule({
  declarations: [ConveniosServiciosComponent],
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
    MatInputModule,

    //Template 
    ConfirmDialogModule,
    CreateEditConvenioServicioDialogModule,

    
  ],
  entryComponents:[

  ],
  exports: [
    CommonModule,
    ConveniosServiciosComponent
  ]
})
export class ConveniosServiciosModule { }
