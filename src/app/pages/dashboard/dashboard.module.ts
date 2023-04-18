import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

// Componentes 
import { DefaultComponent } from './home/default.component';
import { TablaRetirosPorMunicipiosModule } from 'src/app/templates/tabla-retiros-por-municipios/tabla-retiros-por-municipios.module';

//Modulos Comunes 

// Material 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';


const RutesModule: Route[] = [
  { path: '', component: DefaultComponent },
  { path: 'retiros', loadChildren: ()=> import('src/app/pages/dashboard/dashboard-retiros/dashboard-retiros.module').then( m => m.DashboarRetirosdModule )},
  { path: 'labores', loadChildren: () => import('./dashboard-labores/dashboard-labores.module').then(m => m.DashboardLaboresModule) },
  { path: 'ventas', loadChildren: () => import('./dashboard-ventas/dashboard-ventas.module').then(m => m.DashboardVentasModule) },
]; 

@NgModule({
  declarations: [DefaultComponent],
  imports: [ 
    //AdditionalModels 
    CommonModule,
    RouterModule.forChild(RutesModule),
    FlexModule,
    FlexLayoutModule,
    TablaRetirosPorMunicipiosModule,

    //MaterialModels
    MatToolbarModule, 
    MatCardModule,


  ],
  entryComponents:[

  ]
})



export class DashboardModule { }
