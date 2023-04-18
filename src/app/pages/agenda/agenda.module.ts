import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

//Component
import { AgendaComponent } from './agenda.component';

//Dialog 
import { CancelAgendaDialogModule } from 'src/app/templates/cancel-agenda-dialog/cancel-agenda-dialog.module';
import { ConfirmDialogModule } from 'src/app/templates/confirm-dialog/confirm-dialog.module';
import { SelectTerceroDialogModule } from 'src/app/templates/select-tercero-dialog/select-tercero-dialog.module';

//Material 
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';

const RutesModule: Route[] = [
  { path: '', component: AgendaComponent }
];

@NgModule({
  declarations: [AgendaComponent],
  imports: [ 
    //AdditionalModels
    CommonModule,
    RouterModule.forChild(RutesModule),
    FlexLayoutModule,
    FormsModule,
    
    //Template 
    CancelAgendaDialogModule,
    ConfirmDialogModule,
    SelectTerceroDialogModule,
    

    //MaterialModels
    MatSelectModule,
    MatToolbarModule, 
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSortModule,
    MatDialogModule,
  ]
})
export class AgendaModule { }
