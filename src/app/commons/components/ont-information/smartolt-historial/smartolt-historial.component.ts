import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SoporteTecnicoService } from '../services/soporte-tecnico.service';
import { faPlug, faSlash, faUnlink, faCalendar, faLink ,IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { registerHistory } from '../interface/interface';


@Component({
  selector: 'app-smartolt-historial',
  templateUrl: './smartolt-historial.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class SmartoltHistorialComponent {
  public energyIcon       : IconDefinition = faPlug;
  public slashIcon        : IconDefinition = faSlash;
  public powerOffIcon         : IconDefinition = faUnlink;
  public calendarIcon   : IconDefinition = faCalendar;
  public linkIcon         : IconDefinition = faLink;


  constructor( private SoporteTecnicoService: SoporteTecnicoService ) { }

  public get historyONT(): registerHistory[] {
    return this.SoporteTecnicoService.historyONT;
  }

}
