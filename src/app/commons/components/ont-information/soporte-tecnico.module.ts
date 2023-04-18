import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatTabsModule } from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


import { SmartoltPotenciaComponent } from './smartolt-potencia/smartolt-potencia.component';
import { SoporteTecnicoPageComponent } from './soporte-tecnico-page/soporte-tecnico-page.component';
import { PrtgComponent } from './prtg/prtg.component';
import { DispositivosConectadosComponent } from './dispositivos-conectados/dispositivos-conectados.component';
import { SoporteTecnicoModalComponent } from './soporte-tecnico-modal/soporte-tecnico-modal.component';
import { LoadingComponent } from './loading/loading.component';
import { SmartoltHistorialComponent } from './smartolt-historial/smartolt-historial.component';
import { DispositivosConectadosEthernetComponent } from './dispositivos-conectados-ethernet/dispositivos-conectados-ethernet.component';
import { SmartoltEstadoOntComponent } from './smartolt-estado-ont/smartolt-estado-ont.component';
import { DispositivosConectadosWifiComponent } from './dispositivos-conectados-wifi/dispositivos-conectados-wifi.component';
import { PingMktServicioComponent } from './ping-mkt-servicio/ping-mkt-servicio.component';

@NgModule({
  declarations: [
    SmartoltPotenciaComponent,
    SoporteTecnicoPageComponent,
    PrtgComponent,
    DispositivosConectadosComponent,
    SoporteTecnicoModalComponent,
    LoadingComponent,
    SmartoltHistorialComponent,
    DispositivosConectadosEthernetComponent,
    SmartoltEstadoOntComponent,
    DispositivosConectadosWifiComponent,
    PingMktServicioComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FontAwesomeModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports:[
    SoporteTecnicoPageComponent,
  ]

})
export class OntInformationModule { }
