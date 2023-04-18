import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { InfoEstadoActivacionDialog } from 'src/app/templates/info-estado-activacion-dialog/info-estado-activacion-dialog';

import { SoporteTecnicoModalComponent } from 'src/app/commons/components/ont-information/soporte-tecnico-modal/soporte-tecnico-modal.component';

export interface ServiciosData {
	idservicio: number,
	numeroservicio: number,
	fechacreacion: object,
	descripciondireccion: string,
	municipio: string,
	nombreestado: string,
	descripcionestado: string,
	nombretipo: string,
	descripciontipo: string,
	idplan: number,
	nombreplan: string,
	descripcionplan: string,
	idtercero: number,
	nombrestercero: string,
	apellidostercero: string,
	numerotercero: number,
	estadoactivacion: boolean
}

@Component({
	selector: 'app-servicios-tercero',
	templateUrl: './servicios-tercero.component.html',
	styleUrls: ['./servicios-tercero.component.css'],
	animations: fuseAnimations
})
export class ServiciosTerceroComponent implements OnInit {

	user: object;
	loading: boolean;
	servSearch: string;

	displayedColumns: string[] = ['numeroservicio', 'nombreestado','estadoactivacion', 'nombreplan', 'ip', 'descripciondireccion', 'municipio', 'fechacreacion', 'actions'];
	dataSource: MatTableDataSource<ServiciosData>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		public _dialog: MatDialog,
		private _snackBar: MatSnackBar,
		private _router: Router,
		private _route: ActivatedRoute,
	) { }

	ngOnInit() {
		this.user = this._vars.user.source['value'];

		this.loading = true;

		let json = {
			idtercero: this._route.params['_value']['id'],
			idtiposervicio: 1
		}

		this._api.getServiciosTercero(json, this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
				this._snackBar.open("No se pudieron cargar los servicios del tercero.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/'])
			}
			this.loading = false;
		});
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	selectServicio(idServicio) {
		this._router.navigate(['/servicio/' + idServicio])
	}

	getInfoEstadoActivacion(servicio){
		this._dialog.open(InfoEstadoActivacionDialog, { width: '80%', data: servicio['idservicio']});
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
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
		
	}

}
