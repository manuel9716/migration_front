import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from 'src/app/services/api.service'
import { VarsService } from 'src/app/services/vars.service'

import { CreateEditConvenioServicioDialog } from 'src/app/templates/create-edit-convenio-servicio-dialog/create-edit-convenio-servicio-dialog';
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog'
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';


export interface contactos {
	idconvenioservicio: number;
	estado: boolean;
	observaciones: string;
	fechacreacion: object;
}

@Component({
	selector: 'app-convenios-servicios',
	templateUrl: './convenios-servicios.component.html',
	styleUrls: ['./convenios-servicios.component.css'],
	animations: fuseAnimations
})
export class ConveniosServiciosComponent implements OnInit {

	loading: boolean;
	user: object;
	ConvSearch:string;

	disabledCreate: boolean;

	displayedColumns: string[] = ['estado', 'observaciones', 'fechacreacion', 'actions'];
	dataSource: MatTableDataSource<contactos>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	@Output() refreshDataEvent = new EventEmitter();

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		public _dialog: MatDialog,
		private _snackBar: MatSnackBar,
		private _route: ActivatedRoute,
	) { }

	ngOnInit() {
		this.user = this._vars.user.source['value'];
		this.getConvenios();
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	getConvenios() {
		this.loading = true;
		this.disabledCreate = false;

		this._api.getConveniosServicio(this._route.params['_value']['id'], this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;

				response['data'].forEach(conv => {
					if (conv.estado) {
						this.disabledCreate = true;
					}
				});

			} else {
				this._snackBar.open('No se pudieron obtener los convenios del servicio', 'Cerrar', { duration: 3000 });
			}
			this.loading = false;
		});
	}

	createEditConvenioDialog(entity) {
		const configs = {
			entity: entity,
			idservicio: this._route.params['_value']['id']
		}

		const dialogRef = this._dialog.open(CreateEditConvenioServicioDialog, { width: '50%', data: configs });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getConvenios();
				this.refreshDataEvent.emit();
			}
		});
	}

	delete(entity) {

		if (this.user['permisos']['servicios']['convenios']['eliminar']) {

			const dialogConfigs = {
				title: "¿Está seguro de eliminar el convenio de servicio?",
				subtitle: entity.observaciones,
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			}
	
			const dialogRef = this._dialog.open(ConfirmsDialog, { width: '40%', hasBackdrop: true, data: dialogConfigs });
	
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this._api.deleteConvenioServicio(entity.idconvenioservicio, this.user['token']).subscribe(response => {
						if (response["code"] == 200) {
							this.getConvenios();
							this._snackBar.open('Convenio de servicio eliminado', 'Cerrar', { duration: 3000 });
							this.refreshDataEvent.emit();
						} else {
							this._snackBar.open('No se pudo elimina el convenio de servicio', 'Cerrar', { duration: 3000 });
						}
					});
				}
			});

		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}

		
	}

}

