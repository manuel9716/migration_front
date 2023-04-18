import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { faExclamationTriangle, faHistory, faNetworkWired, faRetweet, faWifi, faServer } from '@fortawesome/free-solid-svg-icons';

import { SoporteTecnicoService } from '../services/soporte-tecnico.service';

@Component({
  selector: 'app-soporte-tecnico-page',
  templateUrl: './soporte-tecnico-page.component.html',
  styleUrls: ['./soporte-tecnico-page.component.css'],
  changeDetection: ChangeDetectionStrategy.Default

})
export class SoporteTecnicoPageComponent implements OnDestroy{

  public connectedIcon  = faNetworkWired;
  public failIcon       = faExclamationTriangle;
  public historyIcon    = faHistory;
  public wifiIcon       = faWifi;
  public statusIcon     = faServer;
  public pingIcon       = faRetweet;


  constructor( private SoporteTecnicoService: SoporteTecnicoService ) { }


  public get loading(): boolean {
    return this.SoporteTecnicoService.globalLoading;
  }

  public get loadingConnectedWifi() : boolean{
    return this.SoporteTecnicoService.loadingConnectedWifi;
  }

  public get loadingSmartolt() : boolean{
    return this.SoporteTecnicoService.loadingSmartolt;
  }

  public get loadingPrtg() : boolean{
    return this.SoporteTecnicoService.loadingPrtg;
  }

  public get loadingPing() : boolean{
    return this.SoporteTecnicoService.loadingMkt;
  }

  public get ontStatus( ) :boolean {
    return this.SoporteTecnicoService.ontStatus;
  }

  public get qConnectedWifi(): number {
    return this.SoporteTecnicoService.connectedWifi.body.length;
  }

  public get detectFailConnectedWifi(): boolean {
    return this.SoporteTecnicoService.connectedWifi.header[0] != 'Error al Consultar ONT' ? true : false;
  }

  public get qConnectedEthernet(): number {
    let count: number = 0
    this.SoporteTecnicoService.connectedEthernet.slice(1).forEach(element => {
      count = element[4] == 'up' ? count + 1 : count;
    });    
    return count;
  }

  public get statusEthernet(): string {
    let status = 'secondary';
    this.SoporteTecnicoService.connectedEthernet.slice(1).forEach(element => {
      if(element[4] == 'up'){
        status = ((parseInt(element[2]) >= 100 && element[3] == 'full') && status != 'warning' ) ? 'success' : 'warning';
      }
    });
    return status;
  }

  public get statusWigfi(): string {
    let aux = this.SoporteTecnicoService.connectedWifi.body;
    let status = '';
    if( aux.length > 0){
      status = 'success';
      aux.forEach( element => {
        if( (parseFloat(element[6]) < -65 && parseFloat(element[6]) >= -75) && status != 'danger')
          status = 'warning';
        else if( parseFloat(element[6]) < -75 )
          status = 'danger';      
      })
    }
    else{
      status = 'secondary';
    }
    return status;
  }

  public get statusPing(): string {
    const status = parseFloat(this.SoporteTecnicoService.pingStatus.avgPing) >= 10 || parseFloat(this.SoporteTecnicoService.pingStatus.pLost) >= 3 ? 'danger' : 'success';
    return status;
  }

  public get statusPrtg(): string {
    let prtg = this.SoporteTecnicoService.statusPrtg.values;

    let status = ( prtg.pingNat < 25 && prtg.pingInt < 150 && 
                  prtg.ppNat < 40 && prtg.ppInt < 40 && prtg.jitterNat < 15)
                  ? 'success' : 'danger';

    return status;
  }


  ngOnDestroy(): void {
    this.SoporteTecnicoService.clearInfo();
  }
}
