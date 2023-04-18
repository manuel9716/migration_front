import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes 
import { CreateEditSolServicioComponent } from './create-edit-sol-servicio.component';



//Modulos Comunes 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Material 
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
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
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';




const RutesModule: Route[] = [
  { path: '', component: CreateEditSolServicioComponent }
];

@NgModule({
  declarations: [CreateEditSolServicioComponent],
  imports: [ 
    
    //AdditionalModels 
    CommonModule,
    RouterModule.forChild(RutesModule),
    ReactiveFormsModule,
    FormsModule,
    FlexModule,
    FlexLayoutModule,


    //MaterialModels
    MatStepperModule, 
    MatListModule,
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
    MatDialogModule,   
  ],
  entryComponents:[

  ]
})
export class CreateEditSolServicioModule { }
