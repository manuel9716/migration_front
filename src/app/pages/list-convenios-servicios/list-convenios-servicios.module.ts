import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Componentes 
import { ListConveniosServiciosComponent } from './list-convenios-servicios.component';


//Modulos Comunes 
import { SharedModulsModule } from 'src/app/modules/sharedmoduls.module';
import { ConfirmDialogModule } from 'src/app/templates/confirm-dialog/confirm-dialog.module';

import {MatDatepickerModule} from '@angular/material/datepicker';
// Material 
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
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
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



const RutesModule: Route[] = [
  { path: '', component: ListConveniosServiciosComponent }
];

@NgModule({
  declarations: [ListConveniosServiciosComponent],
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
    MatDialogModule,
    MatButtonModule,  

    //Template
    ConfirmDialogModule

      
  ],
  entryComponents:[

  ]
})
export class ListConveniosServiciosModule { }
