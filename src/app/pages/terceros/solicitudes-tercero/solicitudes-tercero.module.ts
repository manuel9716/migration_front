import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Componentes 
import { SolicitudesTerceroComponent } from './solicitudes-tercero.component';
//Modulos Comunes 
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Material 
import { MatInputModule } from '@angular/material/input';
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
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [SolicitudesTerceroComponent],
  imports: [ 
    //AdditionalModels 
    CommonModule,
    FormsModule,
    FlexModule,
    FlexLayoutModule,
    RouterModule,
    
    //MaterialModels
    MatInputModule, 
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
    
    //template 
    
 
  ],
  entryComponents:[

  ],
  exports: [
    CommonModule,
    SolicitudesTerceroComponent
  ]
})
export class SolicitudesTerceroModule { }
