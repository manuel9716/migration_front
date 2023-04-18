import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SoporteTecnicoService } from '../services/soporte-tecnico.service';
import { faGlobeAmericas, faRedo } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-smartolt-estado-ont',
  templateUrl: './smartolt-estado-ont.component.html',
  changeDetection: ChangeDetectionStrategy.Default

})
export class SmartoltEstadoOntComponent  {
  public onlineIcon = faGlobeAmericas;
  public reloadIcon = faRedo;
  
  constructor( private SoporteTecnicoService: SoporteTecnicoService ) { }

  public get loading(): boolean {    
    return this.SoporteTecnicoService.loadingSmartolt;
  }

  public get ontStatus(): boolean {
    return this.SoporteTecnicoService.ontStatus;
  }

  public get ontTimeOnline(): string {
    return this.SoporteTecnicoService.ontTimeOnline;
  }

  public get ipStatus(): string {
    return this.SoporteTecnicoService.ipStatus;
  }
}
