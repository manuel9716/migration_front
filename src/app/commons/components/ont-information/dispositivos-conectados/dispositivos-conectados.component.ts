import { Component } from '@angular/core';
import { faNetworkWired, faWifi } from '@fortawesome/free-solid-svg-icons';
import { SoporteTecnicoService } from '../services/soporte-tecnico.service';

@Component({
  selector: 'app-dispositivos-conectados',
  templateUrl: './dispositivos-conectados.component.html',
})
export class DispositivosConectadosComponent{

  public connectedIcon = faNetworkWired;
  public wifiIcon = faWifi

  constructor( private SoporteTecnicoService: SoporteTecnicoService ) { }

  public get loadingWifi () : boolean{
    return this.SoporteTecnicoService.loadingConnectedWifi;
  }

}
