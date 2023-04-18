import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes 
import { ListAllSolicitudesServiciosComponent } from './list-all-solicitudes-servicios.component';


//Modulos Comunes 
import { SelectTipoSolicitudDialogModule } from 'src/app/templates/select-tipo-solicitud-dialog/select-tipo-solicitud-dialog.module';
import { OntInformationModule } from 'src/app/commons/components/ont-information/soporte-tecnico.module';


// Material 
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
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';


const RutesModule: Route[] = [
  { path: '', component: ListAllSolicitudesServiciosComponent }
];

@NgModule({
  declarations: [ListAllSolicitudesServiciosComponent],
  imports: [ 
    
    //AdditionalModels 
    CommonModule,
    RouterModule.forChild(RutesModule),
    FlexModule,
    FlexLayoutModule,
    ReactiveFormsModule,
   
    

    //MaterialModels
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
    MatMenuModule,
    

    //template
    SelectTipoSolicitudDialogModule,

    OntInformationModule
  ]
})
export class ListAllSolicitudesServiciosModule { }
