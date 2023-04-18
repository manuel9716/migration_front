import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes 
import { ViewSolTerceroComponent } from './view-sol-tercero.component';




//Modulos Comunes 
import { SharedModulsModule } from 'src/app/modules/sharedmoduls.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Material 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
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
import { ChangeStatusSolTerceroDialogModule } from 'src/app/templates/change-status-sol-tercero-dialog/change-status-sol-tercero-dialog.module';



const RutesModule: Route[] = [
  { path: '', component: ViewSolTerceroComponent }
];

@NgModule({
  declarations: [
   ViewSolTerceroComponent
    
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
    MatTabsModule,
    MatSortModule,
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


    //Tempate 
    ChangeStatusSolTerceroDialogModule
   
  ],
  entryComponents:[
   

  ]
})
export class ViewSolTerceroModule { }
