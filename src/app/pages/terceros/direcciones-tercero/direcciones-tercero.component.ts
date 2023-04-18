import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ServiciosData } from '../../servicios/list-servicios/list-servicios.component';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog'

import { createEditDireccionTerceroDialog } from 'src/app/templates/create-edit-direccion-tercero-dialog/create-edit-direccion-tercero-dialog';


export interface DireccionesData {
	iddireccion: number;
	descripcion: string;
	barrio: string;
	municipio: string;
	departamento: string;
	whatsapp: string;
	llamada: string;
	celular1: string;
	email1: string;
	estrato: number;
}

@Component({
	selector: 'app-direcciones-tercero',
	templateUrl: './direcciones-tercero.component.html',
	styleUrls: ['./direcciones-tercero.component.css'],
	animations: fuseAnimations
})
export class DireccionesTerceroComponent implements OnInit {

	user: object = this._vars.user.source['value'];
	loading: boolean;
	dirSearch: string;

	displayedColumns: string[] = ['descripcion', 'barrio', 'municipio', 'departamento', 'whatsapp','llamada', 'celular1', 'email1', 'estrato', 'actions'];
	dataSource: MatTableDataSource<DireccionesData>;
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
		this.getDirecciones();
	}

	getDirecciones() {
		this.loading = true;

		this._api.getDireccionesTercero(this._route.params['_value']['id'], this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
				this._snackBar.open("No se pudieron cargar los servicios del tercero.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/']);
			}
			this.loading = false;
		});
	}


	setMainAddress(row) {
		if (!row.principal) {
			if (this.user['permisos']['terceros']['direcciones']['establecer_ppal']) {
				this.loading = true;
				this._api.setDireccionPpal(row.iddireccion, this.user['token']).subscribe(response => {
					if (response["code"] == 200) {
						this.getDirecciones();
						this._snackBar.open("Dirección principal establecida.", 'Cerrar', { duration: 3000 });
					} else {
						this._snackBar.open("No se pudo establecer la dirección principal.", 'Cerrar', { duration: 3000 });
					}
					this.loading = false;
				});
			} else {
				this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
			}
		}
	}


	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}


	createEditDireccion(entity) {
		const configs = {
			entity: entity,
			idtercero: this._route.params['_value']['id']
		}

		const dialogRef = this._dialog.open(createEditDireccionTerceroDialog, { width: '80%', data: configs });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getDirecciones();
			}
		});
	}


	deleteDireccion(direccion){
		if (this.user['permisos']['terceros']['direcciones']['eliminar']) {

			const dialogConfigs = {
				title: "¿Está seguro de eliminar la dirección?",
				subtitle: direccion['descripcion'] + " - " + direccion['barrio'] + " - " + direccion['municipio'] + " - " + direccion['departamento'],
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			 }
	
			 const dialogRef = this._dialog.open(ConfirmsDialog, {
				width: '40%',
				data: dialogConfigs
			 });


			dialogRef.afterClosed().subscribe(result => {
				if (result) {

					this._api.deleteDireccion(direccion['iddireccion'], this.user['token']).subscribe(response => {
						if (response["code"] == 200) {
							this.getDirecciones();
							this._snackBar.open('Dirección eliminada.', 'Cerrar', { duration: 3000 });
						} else if(response["code"] == 401) {
							this._snackBar.open('No se pueden eliminar direcciones relacionadas.', 'Cerrar', { duration: 3000 });
						} else {
							this._snackBar.open('No se pudo eliminar la dirección.', 'Cerrar', { duration: 3000 });
						}
					});

				}
			});
	
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}

}
