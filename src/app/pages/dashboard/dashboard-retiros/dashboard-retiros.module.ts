//core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

//Component
import { GraficasRetiroComponent } from './graficas-retiro/graficas-retiro.component';
import { FiltroRetiroComponent } from './filtro-retiro/filtro-retiro.component';
import { ViewRetirsoDashboardComponent } from './view-retirso-dashboard/view-retirso-dashboard.component';

import { ChartjsComponent } from './chartjs/chartjs.component';

//Template 
import { SelectMunicipioDialogModule } from 'src/app/templates/select-municipios-dialog/select-municipio-dialog.module';

//Material 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
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
import { MunicipiosVsRetirosComponent } from './municipios-vs-retiros/municipios-vs-retiros.component';
import { IndicadoresComponent } from './indicadores/indicadores.component';
import { UltimosCuatroMesesComponent } from './ultimos-cuatro-meses/ultimos-cuatro-meses.component';

const RutesModule: Route[] = [
  { path: '', component: ViewRetirsoDashboardComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [GraficasRetiroComponent,FiltroRetiroComponent, ViewRetirsoDashboardComponent, MunicipiosVsRetirosComponent, IndicadoresComponent, UltimosCuatroMesesComponent, ChartjsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(RutesModule),
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    FlexLayoutModule,

    //template 
    SelectMunicipioDialogModule,

    //Material
    MatToolbarModule, 
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule, 
    MatProgressBarModule,
    NgxChartsModule, 
    MatButtonModule,
    MatIconModule,
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
export class DashboarRetirosdModule { }
