import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes 
import { ViewTerceroComponent } from './view-tercero.component';

//Modulos Comunes 
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Modelos 
import { SolicitudesTerceroModule } from '../solicitudes-tercero/solicitudes-tercero.module';
import { ServiciosTerceroModule } from '../servicios-tercero/servicios-tercero.module';
import { PermisosTerceroModule } from '../permisos-tercero/permisos-tercero.module';
import { DireccionesTerceroModule } from '../direcciones-tercero/direcciones-tercero.module';
import { CuadrillaTerceroModule } from '../cuadrilla-tercero/cuadrilla-tercero.module';
import { AcuerdosTerceroModule } from '../acuerdos-tercero/acuerdos-tercero.module';

// Material 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

const RutesModule: Route[] = [
  { path: '', component: ViewTerceroComponent }
];

@NgModule({
  declarations: [
    ViewTerceroComponent, 
    
    // // Adicionales Components 
    // ServiciosTerceroComponent,
    // AcuerdosTerceroComponent,
    //SolicitudesTerceroComponent,
    // CuadrillaTerceroComponent,
    // DireccionesTerceroComponent, 
    // PermisosTerceroComponent

  ],
  imports: [ 
    
    //AdditionalModels 
    CommonModule,
    RouterModule.forChild(RutesModule),
    SharedComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    FlexModule,
    FlexLayoutModule,

    // Modulos personalizados 
    ServiciosTerceroModule,
    AcuerdosTerceroModule,
    SolicitudesTerceroModule,
    CuadrillaTerceroModule,
    DireccionesTerceroModule, 
    PermisosTerceroModule,


    //MaterialModels
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatDatepickerModule,
    MatSlideToggleModule,
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

    // Template 

  ],
  entryComponents:[
    

  ]
})

export class ViewTerceroModule { }
