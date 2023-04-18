import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes 
import { CalificarProcesosComponent } from './calificar-procesos.component';

//Modulos Comunes 
import { CalificarLaborDialogModule } from 'src/app/templates/calificar-labor-dialog/calificar-labor-dialog.module';
import { EditarCasoEspecialDialogModule } from 'src/app/templates/editar-caso-especial-dialog/editar-caso-especial-dialog.module';
import { SelectCuadrillaDialogModule } from 'src/app/templates/select-cuadrilla-dialog/select-cuadrilla-dialog.module';
import { EditLaboresaDialogDialogModule } from 'src/app/templates/edit-labores-dialog/edit-labores-dialog.module';
import { EditarLaborDialogModule } from 'src/app/templates/editar-labor-dialog/editar-labor-dialog.module';
import { InfoOperacionServicioDialogModule } from 'src/app/templates/info-operacion-servicio-dialog/info-operacion-servicio-dialog.module';
import { ValiddocumentLarboresDialogModule } from 'src/app/templates/validar-document-labores-dialog/validar-document-labores-dialog.module';
import { EditarDeplazamientoDialogModule } from 'src/app/templates/editar-deplazamiento-dialog/editar-deplazamiento-dialog.module';

// Material 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { EstadosPendienteLaboresDialogModule } from 'src/app/templates/estados-pendiente-labores-dialog/estados-pendiente-labores-dialog.module';


const RutesModule: Route[] = [
  { path: '', component: CalificarProcesosComponent }
];

@NgModule({
  declarations: [CalificarProcesosComponent],
  imports: [ 
    
    //AdditionalModels 
    CommonModule,
    RouterModule.forChild(RutesModule),
    FormsModule,
    FlexModule,
    FlexLayoutModule,

    //MaterialModels
    MatDatepickerModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatToolbarModule, 
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule,
    MatSortModule,
    MatDialogModule,
    MatMenuModule,
        
    //template 
    SelectCuadrillaDialogModule, 
    EditarCasoEspecialDialogModule,  
    CalificarLaborDialogModule,
    InfoOperacionServicioDialogModule,
    EditLaboresaDialogDialogModule,
    ValiddocumentLarboresDialogModule,
    EditarLaborDialogModule,
    EditarDeplazamientoDialogModule,
    EstadosPendienteLaboresDialogModule,
  ],
  entryComponents:[
  ]
})
export class CalificarProcesosModule { }
