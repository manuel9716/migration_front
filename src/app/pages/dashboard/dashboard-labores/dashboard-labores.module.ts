import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FiltroLaboresComponent } from './filtro-labores/filtro-labores.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';

//Dialog 

const routes: Routes = [
  { path: '', component: FiltroLaboresComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [ FiltroLaboresComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    FlexLayoutModule,

    //template 
    
    //Material import 
    MatToolbarModule, 
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule, 
    MatProgressBarModule,
    MatButtonModule,
    MatTableModule, 
    MatSortModule,
    MatPaginatorModule, 
    MatTooltipModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatInputModule, 
    MatCheckboxModule,
    MatSlideToggleModule, 
    MatChipsModule
  ]
})
export class DashboardLaboresModule { }
