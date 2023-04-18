import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes 
import { ListAcuerdosPagoTercerosComponent } from './list-acuerdos-pago-terceros.component';

//Modulos Comunes 
import { SharedModulsModule } from 'src/app/modules/sharedmoduls.module';


// Material 
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmDialogModule } from 'src/app/templates/confirm-dialog/confirm-dialog.module';
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
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';


const RutesModule: Route[] = [
  { path: '', component: ListAcuerdosPagoTercerosComponent }
];

@NgModule({
  declarations: [ListAcuerdosPagoTercerosComponent],
  imports: [ 
    
    //AdditionalModels 
    CommonModule,
    RouterModule.forChild(RutesModule),
    SharedModulsModule,
    FlexModule,
    FlexLayoutModule,
    

    //MaterialModels
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
    MatButtonModule,


    //template 
    ConfirmDialogModule
  ]
})
export class ListAcuerdosPagoTercerosModule { }

