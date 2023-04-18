import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service'
import { VarsService } from 'src/app/services/vars.service'
import { CreatEditContactoDialog } from 'src/app/templates/create-edit-contacto-dialog/create-edit-contacto-dialog';
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog'
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';


export interface contactos {
	idcontacto: number;
	nombres: string;
	telefono: number;
	telefono2: number;
	observaciones: string;
}

@Component({
	selector: 'app-contactos-servicios',
	templateUrl: './contactos-servicios.component.html',
	styleUrls: ['./contactos-servicios.component.css'],
	animations: fuseAnimations
})

export class ContactosServiciosComponent implements OnInit {

	loading: boolean;
	user: object;
	ContSearch: string;

	displayedColumns: string[] = ['nombres', 'telefono', 'observaciones', 'actions'];
	dataSource: MatTableDataSource<contactos>;
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
		this.user = this._vars.user.source['value'];
		this.getContactos();
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	getContactos() {
		this.loading = true;
		this._api.getContatosServicio(this._route.params['_value']['id'], this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
			}
			this.loading = false;
		});
	}

	createEditContactoDialog(entity) {
		const configs = {
			entity: entity,
			idservicio: this._route.params['_value']['id']
		}

		const dialogRef = this._dialog.open(CreatEditContactoDialog, { width: '50%', data: configs });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getContactos();
			}
		});
	}

	delete(entity) {

		if (this.user['permisos']['servicios']['contactos']['eliminar']) {

			const dialogConfigs = {
				title: "¿Está seguro de eliminar el contacto de servicio?",
				subtitle: entity.nombres,
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			}

			const dialogRef = this._dialog.open(ConfirmsDialog, { width: '40%', hasBackdrop: true, data: dialogConfigs });

			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this._api.deleteContactoServicio(entity.idcontacto, this.user['token']).subscribe(response => {
						if (response["code"] == 200) {
							this.getContactos();
							this._snackBar.open('Contacto de servicio eliminado', 'Cerrar', { duration: 3000 });
						} else {
							this._snackBar.open('No se pudo elimina el contacto de servicio', 'Cerrar', { duration: 3000 });
						}
					});
				}
			});

		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}

}

