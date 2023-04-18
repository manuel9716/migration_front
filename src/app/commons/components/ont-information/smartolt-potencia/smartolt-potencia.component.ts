import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SoporteTecnicoService } from '../services/soporte-tecnico.service';

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faUnlink } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-smartolt-potencia',
  templateUrl: './smartolt-potencia.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartoltPotenciaComponent  {

  public powerAlert = faExclamationTriangle;
  public powerOk = faCheckCircle;
  public powerOff = faUnlink;


  constructor( private SoporteTecnicoService: SoporteTecnicoService) { }

  public get loading(): boolean {
    return this.SoporteTecnicoService.loadingSmartolt;
  }

  public get powerTx(): number {
    return this.SoporteTecnicoService.powerOnt.tx;
  }

  public get powerRx(): number {
    return this.SoporteTecnicoService.powerOnt.rx;
  }

  

}
