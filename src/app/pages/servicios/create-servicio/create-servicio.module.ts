import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes 
  import { CreateServicioComponent } from './create-servicio.component';




//Modulos Comunes 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Material 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
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
import { SelectPlanDialogModule } from 'src/app/templates/select-plan-dialog/select-plan-dialog.module';
import { SelectDireccionDialogModule } from 'src/app/templates/select-direccion-dialog/select-direccion-dialog.module';
import { CreateEditTerceroDialogModule } from 'src/app/templates/create-edit-tercero-dialog/create-edit-tercero-dialog.module';






const RutesModule: Route[] = [
  { path: '', component: CreateServicioComponent }
];

@NgModule({
  declarations: [CreateServicioComponent],
  imports: [ 
    
    //AdditionalModels 
    CommonModule,
    RouterModule.forChild(RutesModule),
    ReactiveFormsModule,
    FormsModule,
    FlexModule,
    FlexLayoutModule,


    //MaterialModels
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
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

    //Template 
    CreateEditTerceroDialogModule, 
    SelectDireccionDialogModule,
    SelectPlanDialogModule,
  
    
   
  ],
  entryComponents:[

  ]
})
export class CreateServicioModule { }
