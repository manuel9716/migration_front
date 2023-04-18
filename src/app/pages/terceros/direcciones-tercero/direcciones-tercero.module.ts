import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes
import { DireccionesTerceroComponent } from './direcciones-tercero.component';

//Modulos Comunes
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Material
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateEditDireccionTerceroDialogModule } from 'src/app/templates/create-edit-direccion-tercero-dialog/create-edit-direccion-tercero-dialog.module';


@NgModule({
  declarations: [DireccionesTerceroComponent],
  imports: [
    //AdditionalModels
    CommonModule,
    FormsModule,
    FlexModule,
    FlexLayoutModule,

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
    MatDialogModule,

    //template
    CreateEditDireccionTerceroDialogModule
  ],
  entryComponents:[

  ],
  exports: [
    CommonModule,
    DireccionesTerceroComponent
  ]
})
export class DireccionesTerceroModule { }
