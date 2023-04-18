import { Component, OnInit, Input } from '@angular/core';
import { SoporteTecnicoModalComponent } from '../ont-information/soporte-tecnico-modal/soporte-tecnico-modal.component';

// Material
import { MatDialog } from '@angular/material/dialog';

// Services
import { VarsService } from 'src/app/services/vars.service';

@Component({
  selector: 'app-entity-information',
  templateUrl: './entity-information.component.html',
  styleUrls: ['./entity-information.component.css']
})
export class EntityInformationComponent implements OnInit {

  user: object;

  @Input() data: object;
  @Input() view: string;

  constructor(
    public _dialog: MatDialog,
    private _vars: VarsService,
  ) { }

  ngOnInit() {
    this.user = this._vars.user.source['value'];    
  }

  openOntInformation(row){		
    if (this._vars.getProp(this.user['permisos'],"servicios.ont.ont_info")) {   
      if(row.ip && row.idtecnologiaplan == 2){
        this._dialog.open(SoporteTecnicoModalComponent, { width: '80%', data: {
          noService: row.numeroservicio,
          ipService: row.ip,
          city: row.municipio.toUpperCase()
        }});
      }
    }
  }

}
