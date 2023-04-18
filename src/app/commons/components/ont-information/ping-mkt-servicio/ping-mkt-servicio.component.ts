import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { PingData } from '../interface/interface';
import { SoporteTecnicoService } from '../services/soporte-tecnico.service';

@Component({
  selector: 'app-ping-mkt-servicio',
  templateUrl: './ping-mkt-servicio.component.html',
  styleUrls: ['./ping-mkt-servicio.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class PingMktServicioComponent{
  public reloadIcon = faRedo;


  constructor( private SoporteTecnicoService: SoporteTecnicoService ) { }

  public loadingPing(): boolean {
    return this.SoporteTecnicoService.loadingMkt;
  }

  public reload(): void {
    if( this.SoporteTecnicoService.loadingMkt ){
      this.SoporteTecnicoService.consultPingMikrotikService();
    }
  }

  public get pingStatus(): PingData {
    return this.SoporteTecnicoService.pingStatus;
  } 
}
