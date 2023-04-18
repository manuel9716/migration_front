import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes 
import { CreateEditSolTerceroComponent } from './create-edit-sol-tercero.component';


//Modulos Comunes 
import { SharedModulsModule } from 'src/app/modules/sharedmoduls.module';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';


// Material 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { CreateEditTerceroDialogModule } from 'src/app/templates/create-edit-tercero-dialog/create-edit-tercero-dialog.module';



const RutesModule: Route[] = [
  { path: '', component: CreateEditSolTerceroComponent }
];

@NgModule({
  declarations: [
    CreateEditSolTerceroComponent
  ],
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
    MatInputModule,
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

   
  ],
  entryComponents:[
   

  ]
})
export class CreateEditSolTerceroModule { }
