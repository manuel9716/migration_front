import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';


import { ApiService } from 'src/app/services/api.service'
import { VarsService } from 'src/app/services/vars.service'
import { createEditAcuerdoTerceroDialog } from 'src/app/templates/create-edit-acuerdo-tercero-dialog/create-edit-acuerdo-tercero-dialog';
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog'
import { ActivatedRoute } from '@angular/router';


export interface AcuerdosTercero {
	idacuerdopagotercero: number;
	estado: boolean;
	fechasolicitud: object;
	fechapago: object;
	observaciones: string;
}

@Component({
	selector: 'app-acuerdos-tercero',
	templateUrl: './acuerdos-tercero.component.html',
	styleUrls: ['./acuerdos-tercero.component.css'],
})

export class AcuerdosTerceroComponent implements OnInit {

	loading: boolean;
	user: object = this._vars.user.source['value'];
	disabledCreate: boolean;
	acuerdosSearch: string;

	displayedColumns: string[] = ['estado', 'fechasolicitud', 'fechapago', 'observaciones', 'actions'];
	dataSource: MatTableDataSource<AcuerdosTercero>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		public _dialog: MatDialog,
		private _snackBar: MatSnackBar,
		private _route: ActivatedRoute,
	) { }

	ngOnInit() {
		this.getAcuerdos();
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	getAcuerdos() {

		this.loading = true;
		this.disabledCreate = false;

		this._api.getAcuerdosPagoTercero(this._route.params['_value']['id'], this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;

				response['data'].forEach(acuerdo => {
					if (acuerdo.estado) {
						this.disabledCreate = true;
					}
				});

			} else {
				this._snackBar.open('No se pudieron obtener los acuerdos de pago del tercero', 'Cerrar', { duration: 3000 });
			}
			this.loading = false;
		});
	}

	createEditAcuerdoDialog(entity) {
		const configs = {
			entity: entity,
			idtercero: this._route.params['_value']['id']
		}

		const dialogRef = this._dialog.open(createEditAcuerdoTerceroDialog, { width: '60%', data: configs });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getAcuerdos();
			}
		});
	}

	delete(entity) {
		if (this.user['permisos']['terceros']['acuerdos']['eliminar']) {
			const dialogConfigs = {
				title: "¿Está seguro de eliminar el acuerdo de pago de tercero?",
				subtitle: '',
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			}

			const dialogRef = this._dialog.open(ConfirmsDialog, { width: '40%', hasBackdrop: true, data: dialogConfigs });

			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this._api.deleteAcuerdoPagoTercero(entity.idacuerdopagotercero, this.user['token']).subscribe(response => {
						if (response["code"] == 200) {
							this.getAcuerdos();
							this._snackBar.open('Acuerdo de pago de tercero eliminado', 'Cerrar', { duration: 3000 });
						} else {
							this._snackBar.open('No se pudo elimina el acuerdo de pago de tercero', 'Cerrar', { duration: 3000 });
						}
					});
				}
			});
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}

}
