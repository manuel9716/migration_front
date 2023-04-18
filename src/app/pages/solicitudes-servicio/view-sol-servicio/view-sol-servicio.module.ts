import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes 
import { ViewSolServicioComponent } from './view-sol-servicio.component';



//Modulos Comunes 
import { SharedModulsModule } from 'src/app/modules/sharedmoduls.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material 
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogModule } from 'src/app/templates/confirm-dialog/confirm-dialog.module';
import { ProgramarRetiroDialogModule } from 'src/app/templates/programar-retiro-dialog/programar-retiro-dialog.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';




const RutesModule: Route[] = [
  { path: '', component: ViewSolServicioComponent }
];

@NgModule({
  declarations: [ViewSolServicioComponent],
  imports: [ 
    
    //AdditionalModels 
    CommonModule,
    RouterModule.forChild(RutesModule),
    SharedModulsModule,
    ReactiveFormsModule,
    FormsModule,
    FlexModule,
    FlexLayoutModule,

    //MaterialModels
    MatSelectModule,
    MatCheckboxModule,
    MatStepperModule, 
    MatDatepickerModule,
    MatSortModule, 
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
    MatButtonModule,

    //Template
    ConfirmDialogModule,
    ProgramarRetiroDialogModule,

  ],
  entryComponents:[

  ]
})
export class ViewSolServicioModule { }
