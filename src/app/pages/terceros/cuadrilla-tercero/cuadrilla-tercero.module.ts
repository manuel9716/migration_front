import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes 
import { CuadrillaTerceroComponent } from './cuadrilla-tercero.component';
import { ConfirmDialogModule } from 'src/app/templates/confirm-dialog/confirm-dialog.module';

// Dialogs
import { CelularesCuadrillaDialog } from './celulares-cuadrilla-dialog/celulares-cuadrilla-dialog';

//Modulos Comunes 
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
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
import { MatDialogModule } from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';


// Material 

@NgModule({
  declarations: [
    CuadrillaTerceroComponent,
    CelularesCuadrillaDialog
  ],
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
    MatDialogModule,
    MatChipsModule,

    //Template 
    ConfirmDialogModule
  ],
  entryComponents:[
    CelularesCuadrillaDialog
  ],
  exports: [
    CommonModule,
    CuadrillaTerceroComponent
  ]
})
export class CuadrillaTerceroModule { }
