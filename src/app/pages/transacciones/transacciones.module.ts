import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { Route, RouterModule } from '@angular/router';

// Components
import { ListTransaccionesComponent } from './list-transacciones/list-transacciones.component';

//Models 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Dependencies
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';

//Dialog
import { ConfirmDialogModule } from 'src/app/templates/confirm-dialog/confirm-dialog.module';
import { SelectDateDialog } from './select-date-dialog/select-date-dialog';

//Material
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';


const RutesModule: Route[] = [
    { path: '', component: ListTransaccionesComponent }
];

@NgModule({
    declarations: [
        ListTransaccionesComponent,
        SelectDateDialog
    ],
    imports: [

        //AdditionalModude
        RouterModule.forChild(RutesModule),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexModule,
        FlexLayoutModule,
        
        // MaterialModude +,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatToolbarModule, 
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatDialogModule,
        
        //Tempate
        ConfirmDialogModule,
          
    ],
    entryComponents: [
       
    ],

})

export class TransaccionesModule
{
}
