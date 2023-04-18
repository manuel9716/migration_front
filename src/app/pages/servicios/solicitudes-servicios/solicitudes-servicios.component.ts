import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service'
import { VarsService } from 'src/app/services/vars.service'
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog';
import { ProgramarRetiroDialog } from 'src/app/templates/programar-retiro-dialog/programar-retiro-dialog';
import { ProgramarSuspensionDialog } from 'src/app/templates/programar-suspension-dialog/programar-suspension-dialog';


export interface Solicitudes {
	idsolicitudservicio: number;
	nombrecontacto: string;
	telefonocontacto: string;
	fechacreacion: object;
	observaciones: string;
	nombreestado: string;
	descripcionestado: string;
	idtiposolicitudtercero: number;
	nombretipo: string;
	descripciontipo: string;
	nombrenivel: string;
	descripcionnivel: string;
	nombresempleado: string;
	apellidosempleado: string;
	numeroempleado: number;
}

@Component({
	selector: 'app-solicitudes-servicios',
	templateUrl: './solicitudes-servicios.component.html',
	styleUrls: ['./solicitudes-servicios.component.css'],
	animations: fuseAnimations
})

export class SolicitudesServiciosComponent implements OnInit {

	loading: boolean;
	user: object = this._vars.user.source['value'];;
	idServicio: number;
	retiro: object;
	suspension: object;
	wordSearch: string

	displayedColumns: string[] = ['idsolicitudservicio', 'nombrecontacto', 'nombreestado', 'nombretipo', 'nombrenivel', 'nombresempleado','fechamodificacion', 'fechacreacion', 'actions'];
	dataSource: MatTableDataSource<Solicitudes>;
	@ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
	@ViewChild(MatSort,{static: true}) sort: MatSort;

	@Output() refreshDataEvent = new EventEmitter();

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		public _dialog: MatDialog,
		private _snackBar: MatSnackBar,
		private _route: ActivatedRoute,
		private _router: Router

	) { }

	ngOnInit() {
		this.idServicio = this._route.params['_value']['id'];
		this.getSolicitudes();
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	selectSolServicio(idSolServicio) {
		this._router.navigate(['/solicitud-servicio/ver/' + idSolServicio]);
	}

	getSolicitudes() {
		this.loading = true;
		this._api.getSolicitudesServicio(this._route.params['_value']['id'], this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);				
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
				this.retiro = response["retiro"][0] ? response["retiro"][0] : null;
				this.suspension = response["suspension"][0] ? response["suspension"][0] : null;
			} else {
				this._snackBar.open('No se pudieron obtener las solicitudes del servicio', 'Cerrar', { duration: 3000 });
			}
			this.loading = false;
		});
	}

	retiroAction() {
		if (this.retiro) {
			const dialogConfigs = {
				title: "¿Está seguro de cancelar el retiro del servicio?",
				subtitle: "Mensaje de prueba.",
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			}

			const dialogRef = this._dialog.open(ConfirmsDialog, {
				width: '60%',
				data: dialogConfigs
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this._api.deleteRetiro(this.retiro['idretiro'], this.user['token']).subscribe(response => {
						if (response["code"] == 200) {
							this.refreshData();
							this._snackBar.open('Retiro cancelado', 'Cerrar', { duration: 3000 });
						} else {
							this._snackBar.open('No se pudo cancelar el retiro', 'Cerrar', { duration: 3000 });
						}
					});
				}
			});

		} else {
			const dialogRef = this._dialog.open(ProgramarRetiroDialog, { width: '60%', data: null, hasBackdrop: true });
			dialogRef.afterClosed().subscribe(result => {
				result['idservicio'] = this._route.params['_value']['id'];
				this._api.createRetiro(result, this.user['token']).subscribe(response => {
					if (response['code'] == 200) {
						this._snackBar.open('Retiro programado.', 'Cerrar', { duration: 3000 });
						this.refreshData();
					} else {
						this._snackBar.open('No se pudo programar el retiro.', 'Cerrar', { duration: 3000 });
					}
				});
			});
		}
	}

	suspensionAction() {
		if (this.suspension) {
			const dialogConfigs = {
				title: "¿Está seguro de cancelar la suspención del servicio?",
				subtitle: "Mensaje de prueba.",
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			}

			const dialogRef = this._dialog.open(ConfirmsDialog, {
				width: '60%',
				data: dialogConfigs
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this._api.deleteSuspension(this.suspension['idsuspension'], this.user['token']).subscribe(response => {
						if (response["code"] == 200) {
							this.refreshData();
							this._snackBar.open('Suspension cancelada', 'Cerrar', { duration: 3000 });
						} else {
							this._snackBar.open('No se pudo cancelar el suspension', 'Cerrar', { duration: 3000 });
						}
					});
				}
			});

		} else {
			const dialogRef = this._dialog.open(ProgramarSuspensionDialog, { width: '60%', data: null, hasBackdrop: true });
			dialogRef.afterClosed().subscribe(result => {
				result['idservicio'] = this._route.params['_value']['id'];
				this._api.createSuspension(result, this.user['token']).subscribe(response => {
					if (response['code'] == 200) {
						this._snackBar.open('Suspension programada.', 'Cerrar', { duration: 3000 });
						this.refreshData();
					} else {
						this._snackBar.open('No se pudo programar la suspensión.', 'Cerrar', { duration: 3000 });
					}
				});
			});
		}
	}

	refreshData() {
		this.refreshDataEvent.emit();
		this.getSolicitudes();
	}

}


