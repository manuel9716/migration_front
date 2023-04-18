import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Componentes 
import { ViewServicioComponent } from './view-servicio.component';

//Modulos Comunes 
import { SharedModulsModule } from 'src/app/modules/sharedmoduls.module';
import { SolicitudesServiciosModule } from '../solicitudes-servicios/solicitudes-servicios.module';
import { ExcepcionesServiciosModule } from '../excepciones-servicios/excepciones-servicios.module';
import { ConveniosServiciosModule } from '../convenios-servicios/convenios-servicios.module';
import { ContactosServiciosModule } from '../contactos-servicios/contactos-servicios.module';
import { OntInformationModule } from 'src/app/commons/components/ont-information/soporte-tecnico.module';

//Template
import { SelectPlanDialogModule } from 'src/app/templates/select-plan-dialog/select-plan-dialog.module';
import { SelectDireccionDialogModule } from 'src/app/templates/select-direccion-dialog/select-direccion-dialog.module';
import { SelectTerceroDialogModule } from 'src/app/templates/select-tercero-dialog/select-tercero-dialog.module';
import { ConfirmDialogModule } from 'src/app/templates/confirm-dialog/confirm-dialog.module';
import { InfoEstadoActivacionDialogModule } from 'src/app/templates/info-estado-activacion-dialog/info-estado-activacion-dialog.module';
import { EditServicioFieldDialogModule } from 'src/app/templates/edit-servicio-field-dialog/edit-servicio-field-dialog.module';

// Material 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
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
import { SharedComponentsModule } from '../../shared-components/shared-components.module';


const RutesModule: Route[] = [
  { path: '', component: ViewServicioComponent }
];

@NgModule({
  declarations: [
    ViewServicioComponent, 

  ],
  imports: [ 
    
    //AdditionalModels 
    CommonModule,
    RouterModule.forChild(RutesModule),
    FormsModule,
    FlexModule,
    FlexLayoutModule,

    //Material  
    SharedModulsModule,
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
    MatSelectModule,
    MatTabsModule,
    SharedComponentsModule,

    //Modulos 
    ExcepcionesServiciosModule, 
    ConveniosServiciosModule,
    ContactosServiciosModule,
    SolicitudesServiciosModule,
    OntInformationModule,

    //Template
    SelectPlanDialogModule,
    SelectDireccionDialogModule,
    SelectTerceroDialogModule,
    EditServicioFieldDialogModule,
    ConfirmDialogModule,
    InfoEstadoActivacionDialogModule,

    

  ],
  entryComponents:[
    // EntityInformationComponent

  ]
})
export class ViewServicioModule { }
