import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Componentes 
import { ListServiciosComponent } from './list-servicios.component';



//Modulos Comunes 
import { OntInformationModule } from 'src/app/commons/components/ont-information/soporte-tecnico.module';

// Material 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
import { InfoEstadoActivacionDialogModule } from 'src/app/templates/info-estado-activacion-dialog/info-estado-activacion-dialog.module';






const RutesModule: Route[] = [
  { path: '', component: ListServiciosComponent }
];

@NgModule({
  declarations: [ListServiciosComponent],
  imports: [ 
    
    //AdditionalModels 
    CommonModule,
    RouterModule.forChild(RutesModule),
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    FlexLayoutModule,

    OntInformationModule,

    //MaterialModels
    MatInputModule,
    MatSelectModule,
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
  
    //template 
    InfoEstadoActivacionDialogModule
   
  ],
  entryComponents:[

  ]
})
export class ListServiciosModule { }
