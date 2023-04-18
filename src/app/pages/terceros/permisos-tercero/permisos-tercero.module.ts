import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes 
import { PermisosTerceroComponent } from './permisos-tercero.component';

//Modulos Comunes 
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Material 
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { MatDividerModule } from '@angular/material/divider';
import { SelectTerceroDialogModule } from 'src/app/templates/select-tercero-dialog/select-tercero-dialog.module';

@NgModule({
  declarations: [PermisosTerceroComponent],
  imports: [ 
    //AdditionalModels 
    CommonModule,
    FormsModule,
    FlexModule,
    FlexLayoutModule,

    //MaterialModels
    MatCheckboxModule,
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
    MatDividerModule,

    //Template
    SelectTerceroDialogModule,

    
  ],
  entryComponents:[

  ],
  exports: [
    CommonModule,
    PermisosTerceroComponent
  ]
})
export class PermisosTerceroModule { }
