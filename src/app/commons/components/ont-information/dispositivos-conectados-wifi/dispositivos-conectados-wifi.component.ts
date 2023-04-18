import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SoporteTecnicoService } from '../services/soporte-tecnico.service';
import { faWifi } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-dispositivos-conectados-wifi',
  templateUrl: './dispositivos-conectados-wifi.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DispositivosConectadosWifiComponent {
  public wifiIcon = faWifi;

  constructor( private SoporteTecnicoService: SoporteTecnicoService) { }

  public get loadingConnectedWifi() : boolean{
    return this.SoporteTecnicoService.loadingConnectedWifi;
  }

  public get headerTable(): string[] {
    return this.SoporteTecnicoService.connectedWifi.header;
  }
  public get infoConected(): string[] {    
    return this.SoporteTecnicoService.connectedWifi.body;
  }

  public get hasConnectedDevices(): boolean {    
    return this.SoporteTecnicoService.connectedWifi.body.length > 0 ? true : false;
  }

  public get detectFail(): boolean {
    return this.SoporteTecnicoService.connectedWifi.body[0] != 'Error al Consultar ONT' ? true : false
  }

  public convertToFloat( num: string): number {    
    return parseFloat(num);
  }

  
}
