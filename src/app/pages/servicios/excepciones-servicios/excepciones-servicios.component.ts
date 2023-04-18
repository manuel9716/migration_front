import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service'
import { VarsService } from 'src/app/services/vars.service'
import { CreateEditExcepcionServicioDialog } from 'src/app/templates/create-edit-excepcion-servicio-dialog/create-edit-excepcion-servicio-dialog';
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog'
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';


export interface contactos {
	idexcepcionservicio: number;
	estado: boolean;
	fechacreacion: object;
	fechafinalizacion: object;
	observaciones: string;
}

@Component({
	selector: 'app-excepciones-servicios',
	templateUrl: './excepciones-servicios.component.html',
	styleUrls: ['./excepciones-servicios.component.css'],
	animations: fuseAnimations
})
export class ExcepcionesServiciosComponent implements OnInit {

	loading: boolean;
	user: object;
	disabledCreate: boolean;
	ExcepSearch: string;

	displayedColumns: string[] = ['estado', 'fechacreacion', 'fechafinalizacion', 'observaciones', 'actions'];
	dataSource: MatTableDataSource<contactos>;
	@ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
	@ViewChild(MatSort,{static: true}) sort: MatSort;

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
		this.getExepciones();
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	getExepciones() {
		this.loading = true;
		this.disabledCreate = false;

		this._api.getExcepcionesServicios(this._route.params['_value']['id'], this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;

				response['data'].forEach(excepcion => {
					if (excepcion.estado) {
						this.disabledCreate = true;
					}
				});

			} else {
				this._snackBar.open('No se pudieron obtener las excepciones del servicio', 'Cerrar', { duration: 3000 });
			}
			this.loading = false;
		});
	}

	createEditExcepcionDialog(entity) {
		const configs = {
			entity: entity,
			idservicio: this._route.params['_value']['id']
		}

		const dialogRef = this._dialog.open(CreateEditExcepcionServicioDialog, { width: '60%', data: configs });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getExepciones();
				this.refreshDataEvent.emit();
			}
		});
	}

	delete(entity) {

		if (this.user['permisos']['servicios']['excepciones']['eliminar']) {
			const dialogConfigs = {
				title: "¿Está seguro de eliminar la excepción del servicio?",
				subtitle: '',
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			}
	
			const dialogRef = this._dialog.open(ConfirmsDialog, { width: '40%', hasBackdrop: true, data: dialogConfigs });
	
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this._api.deleteExcepcionServicio(entity.idexcepcionservicio, this.user['token']).subscribe(response => {
						if (response["code"] == 200) {
							this.getExepciones();
							this.refreshDataEvent.emit();
							this._snackBar.open('Acuerdo de pago de servicio eliminado', 'Cerrar', { duration: 3000 });
						} else {
							this._snackBar.open('No se pudo elimina la excepción del servicio', 'Cerrar', { duration: 3000 });
						}
					});
				}
			});
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}

		
	}

}

