import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ServiciosData } from '../servicios/list-servicios/list-servicios.component';
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog'

@Component({
	selector: 'app-list-acuerdos-pago-terceros',
	templateUrl: './list-acuerdos-pago-terceros.component.html',
	styleUrls: ['./list-acuerdos-pago-terceros.component.css'],
	animations: fuseAnimations
})
export class ListAcuerdosPagoTercerosComponent implements OnInit {

	user: object = this._vars.user.source['value'];
	loading: boolean;
	acuerdoPagoSearch: string;

	filters: object = {
		identificacion: null
	}

	checkboxMaster: object = {
		status: false,
		disabled: false,
		indeterminate: false,
	}

	displayedColumns: string[] = ['checkboxes', 'fechasolicitud', 'fechapago', 'observaciones', 'nombrestercero', 'identificacion'];
	dataSource: MatTableDataSource<ServiciosData>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		private _router: Router,
		public _dialog: MatDialog,
	) {
		if (!this.user['permisos']['acuerdos_pago_terceros']) { this._router.navigate(['/']) }
	}

	ngOnInit() {
		this.search();
	}

	search() {
		this.loading = true;
		this._api.listAcuerdosPagoTercero(this.filters, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
				this._snackBar.open("No se pudieron cargar los acuerdos de pago de terceros.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/'])
			}
			this.loading = false;
		});
	}

	resetFilters() {
		this.filters = {
			identificacion: null
		}
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	selectMaster(ev) {
		ev.preventDefault();
		if (this.checkboxMaster['status']) {
			this.dataSource.data.forEach(row => { row['selected'] = false; this.checkboxMaster['status'] = false; });
		} else {
			this.dataSource.data.forEach(row => { row['selected'] = true; this.checkboxMaster['status'] = true });
			this._snackBar.open("Se han seleccionado  " + this.dataSource.data.length + " acuerdos de pago.", 'Cerrar', { duration: 3000 });
		}

	}

	deleteSelected() {
		if (this.user['permisos']['acuerdos_pago_terceros']['listar']['eliminar']) {

			let ids = [];
			this.dataSource.data.forEach(row => {
				if (row['selected']) {
					ids.push(row['idacuerdopagotercero']);
				}
			});

			if (ids.length > 0) {

				const dialogConfigs = {
					title: "Eliminar Acuerdos de Pago",
					subtitle: "¿Está seguro de eliminar los " + ids.length + " acuerdos de pagos seleccionados?",
					done: '¡Estoy seguro!',
					cancel: 'Cancelar'
				}

				const dialogRef = this._dialog.open(ConfirmsDialog, {
					width: '40%',
					data: dialogConfigs
				});

				dialogRef.afterClosed().subscribe(result => {
					if (result) {
						let json = { acuerdos: ids };
						this._api.deleteMultipleAcuerdoPagoTercero(json, this.user['token']).subscribe(response => {
							if (response["code"] == 200) {
								this.search();
								this._snackBar.open("Se han eliminado  " + ids.length + " acuerdos de pago.", 'Cerrar', { duration: 3000 });
							} else {
								this._snackBar.open('No se pudieron eliminar los acuerdos de pago.', 'Cerrar', { duration: 3000 });
							}
						});
					}
				});

			}

		}
	}

}
