import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SoporteTecnicoService } from '../services/soporte-tecnico.service';
import { faNetworkWired, faSlash } from '@fortawesome/free-solid-svg-icons';

import { connectedEthernetOnt } from '../interface/interface';

@Component({
  selector: 'app-dispositivos-conectados-ethernet',
  templateUrl: './dispositivos-conectados-ethernet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DispositivosConectadosEthernetComponent  {

  public connectedIcon = faNetworkWired;
  public slashesIcon = faSlash;
 

  constructor( private SoporteTecnicoService: SoporteTecnicoService ) { }

  public get loadingSmartolt() : boolean{
    return this.SoporteTecnicoService.loadingSmartolt;
  }

  public get connectedEthernetHeader(): string[] {
    return this.SoporteTecnicoService.connectedEthernet[0];
  }

  public get connectedEthernetBody(): connectedEthernetOnt[] {

    let aux: string[][] = this.SoporteTecnicoService.connectedEthernet.slice(1);
    let connectedEthernet: connectedEthernetOnt[] = aux.map(item => {
      return {
        'port'        : item[0],
        'type'        : item[1],
        'speed'       : item[2],
        'duplex'      : item[3],
        'status'       : item[4],
        'statusRing'  : item[5]
        }
      }
    )

    return connectedEthernet;
  }

  public convertToInt( num: string): number {        
    return parseInt(num);
  }


}
