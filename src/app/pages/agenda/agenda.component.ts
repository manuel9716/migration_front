import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

//Template
import { SelectTerceroDialog } from '../../templates/select-tercero-dialog/select-tercero-dialog';
import { ConfirmsDialog } from '../../templates/confirm-dialog/confirm-dialog';
import { CancelAgendaDialog } from '../../templates/cancel-agenda-dialog/cancel-agenda-dialog';


@Component({
	selector: 'app-agenda',
	templateUrl: './agenda.component.html',
	styleUrls: ['./agenda.component.css'],
	animations: fuseAnimations
})
export class AgendaComponent implements OnInit {


	user: object = this._vars.user.source['value'];
	cuadrillas: object[];
	loading: boolean;

	filters: object = {
		estado: 'pendientes',
		cuadrillas: [],
		tercero: {}
	};

	displayedColumns: string[] = ['estado', 'fechacreado', 'fechaagenda', 'numerocuadrilla', 'numeroservicio', 'nombretiposolicitud', 'nombreplan', 'nombrestercero', 'descripciondireccion', 'actions'];
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _snackBar: MatSnackBar,
		private _api: ApiService,
		private _vars: VarsService,
		public _dialog: MatDialog,
	) {
		if (!this.user['permisos']['agenda']) { this._router.navigate(['/']) }
	}

	ngOnInit() {
		this._api.getServicioscuadrillas(this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.cuadrillas = response['data'];
				this.search();
			} else {
				this._snackBar.open("No se encontraron cuadrillas.", 'Cerrar', { duration: 3000 });
			}
		});
	}


	selectTercero() {
		const dialogRef = this._dialog.open(SelectTerceroDialog, { width: '80%', data: { onlyEmployees: false } });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.filters['tercero'] = result;
			}
		});
	}


	search() {

		let json = JSON.parse(JSON.stringify(this.filters));

		if (json['tercero']['idtercero']) {
			json['tercero'] = json['tercero']['idtercero'];
		} else {
			json['tercero'] = null;
		}

		this.loading = true;

		this._api.getAgendaByCriteria(json, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
				this._snackBar.open("No se pudieron obtener las agendas.", 'Cerrar', { duration: 3000 });
			}
			this.loading = false;
		});
	}


	resetFilters() {
		this.filters = {
			estado: 'todas',
			cuadrillas: [],
			tercero: {}
		};
	}

	cancelAgenda(agenda) {

		if (this.user['permisos']['agenda']['cancelar']) {

			this._api.getServCuadrillaByTercero(this.user['idtercero'], this.user['token']).subscribe(response => {
				if (response['code'] == 200) {

					if (response['data'].length > 0) {

						const dialogConfigs = {
							title: "¿Está seguro cancelar esta agenda?",
							// subtitle: "Cuadrilla: " + agenda['nombrescuadrilla'] + " " + agenda['apellidoscuadrilla'] + ", Solicitud: " + agenda['nombretiposolicitud'],
							subtitle: "Cuadrilla: " + agenda['nombrescuadrilla'] + " " + agenda['apellidoscuadrilla'],
							done: '¡Estoy seguro!',
							cancel: 'Cancelar'
						}

						const dialogRef = this._dialog.open(ConfirmsDialog, {
							width: '40%',
							data: dialogConfigs
						});
						dialogRef.afterClosed().subscribe(result => {
							if (result) {

								const dialogRef2 = this._dialog.open(CancelAgendaDialog, {
									width: '40%',
									data: {
										idagenda: agenda['idagenda'],
										idcuadrilla: response['data'][0]['idservicio'],
										idsolicitudservicio: agenda['idsolicitudservicio']
									}
								});
								dialogRef2.afterClosed().subscribe(result2 => {
									if (result2) {
										this.search();
									}
								});

							}
						});

					} else {
						this._snackBar.open("No se encontraron cuadrillas asociadas a este usuario.", 'Cerrar', { duration: 3000 });
					}
				} else {
					this._snackBar.open("No se pudo obtener las cuadrillas del usuario.", 'Cerrar', { duration: 3000 });
				}
				agenda['loading'] = false
			});
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}

	}

}
