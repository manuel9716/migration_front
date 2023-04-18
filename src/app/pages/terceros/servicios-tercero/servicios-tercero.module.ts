import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes 
import { ServiciosTerceroComponent } from './servicios-tercero.component';
import { InfoEstadoActivacionDialogModule } from 'src/app/templates/info-estado-activacion-dialog/info-estado-activacion-dialog.module';

//Modulos Comunes 
import { OntInformationModule } from 'src/app/commons/components/ont-information/soporte-tecnico.module';

// Material 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

@NgModule({
  declarations: [ServiciosTerceroComponent],
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
    InfoEstadoActivacionDialogModule,

    OntInformationModule,
 
  ],
  entryComponents:[

  ],
  exports: [
    CommonModule,
    ServiciosTerceroComponent
  ]
})
export class ServiciosTerceroModule { }
