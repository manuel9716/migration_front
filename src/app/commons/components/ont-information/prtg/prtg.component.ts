import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SoporteTecnicoService } from '../services/soporte-tecnico.service';
import { PrtgInterface } from '../interface/interface';
import { faLink, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-prtg',
  templateUrl: './prtg.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrtgComponent {
  public statusOk = faLink;
  public statusAlert = faExclamationTriangle;

  constructor( private SoporteTecnicoService: SoporteTecnicoService) { }

  public get loadingPrtg() : boolean{
    return this.SoporteTecnicoService.loadingPrtg;
  }

  public get prtgStatus(): PrtgInterface {    
    return this.SoporteTecnicoService.statusPrtg;
  }


}
