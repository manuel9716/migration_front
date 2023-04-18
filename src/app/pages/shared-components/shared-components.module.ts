import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

//Componets
import { EntityInformationComponent } from 'src/app/commons/components/entity-information/entity-information.component';
import { EstadosSolTerceroComponent } from '../../pages/solicitudes-tercero/estados-sol-tercero/estados-sol-tercero.component';
import { TiposSolTerceroComponent } from '../../pages/solicitudes-tercero/tipos-sol-tercero/tipos-sol-tercero.component';
import { CreateEditOpServiciosComponent } from '../../pages/operaciones-servicio/create-edit-op-servicios/create-edit-op-servicios.component';

// Modulos Material 
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





@NgModule({
  declarations: [
    EntityInformationComponent, 
    CreateEditOpServiciosComponent,
    EstadosSolTerceroComponent,
    TiposSolTerceroComponent,
    
  ],
  imports: [
    CommonModule,     
    FormsModule,
    FlexModule,
    FlexLayoutModule,

    
    //Matrial 
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
    
    
  ],
  exports: [
    CommonModule,
    EntityInformationComponent, 
    CreateEditOpServiciosComponent,
    EstadosSolTerceroComponent,
    TiposSolTerceroComponent,

    
  ]
})
export class SharedComponentsModule { }
