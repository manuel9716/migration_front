import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service'
import { VarsService } from 'src/app/services/vars.service'
import { CreateEditDialog } from 'src/app/templates/create-edit-dialog/create-edit-dialog';
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog'

export interface tipoSolicitudTerceroData {
	idtiposolicitudtercero: number;
	nombre: string;
	descripcion: string;
}

@Component({
	selector: 'app-tipos-sol-tercero',
	templateUrl: './tipos-sol-tercero.component.html',
	styleUrls: ['./tipos-sol-tercero.component.css']
})
export class TiposSolTerceroComponent implements OnInit {

	loading: boolean;
	displayedColumns: string[] = ['nombre', 'descripcion', 'actions'];
	user: object;
	dataSource: MatTableDataSource<tipoSolicitudTerceroData>;

	tscSearch:string;

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		public _dialog: MatDialog,
		private _snackBar: MatSnackBar
	) { }

	ngOnInit() {
		this.user = this._vars.user.source['value'];
		this.getTipos();
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	getTipos() {
		this.loading = true;
		this._api.getTiposSolTercero(this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
				this._snackBar.open("No se pudo listar los tipos.", 'Cerrar', {duration: 3000});	
			}
			this.loading = false;
		});
	}

	createEditDialog(entity) {
		const dialogConfigs = {
			title: entity ? 'Editar tipo de solicitud de tercero' : 'Crear tipo de solicitud de tercero',
			entity: entity,
			token: this.user['token'],
			nameEntity: 'TipoSolTercero',
			nameIdEntity: 'idtiposolicitudtercero'
		}

		const dialogRef = this._dialog.open(CreateEditDialog, { width: '50%', data: dialogConfigs });

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this._snackBar.open("Tipo de solicitud de tercero " + (entity ? 'editado' : 'creado'), 'Cerrar', { duration: 3000 });
				this.getTipos();
			}
		});
	}

	delete(entity) {
		const dialogConfigs = {
			title: "¿Está seguro de eliminar el tipo de solicitud de tercero?",
			subtitle: entity.nombre,
			done: '¡Estoy seguro!',
			cancel: 'Cancelar'
		}

		const dialogRef = this._dialog.open(ConfirmsDialog, { width: '40%', data: dialogConfigs });

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this._api.deleteTipoSolTercero(entity.idtiposolicitudtercero, this.user['token']).subscribe(response => {
					if (response["code"] == 200) {
						this.getTipos();
						this._snackBar.open(response['msg'], 'Cerrar', { duration: 3000 });
					} else {
						this._snackBar.open(response['msg'], 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}

}
