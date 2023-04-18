import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog'
import { CelularesCuadrillaDialog } from './celulares-cuadrilla-dialog/celulares-cuadrilla-dialog'

// RXJS
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ServiciosData {
	idservicio: number,
	numeroservicio: number,
	fechacreacion: object,
}

@Component({
	selector: 'app-cuadrilla-tercero',
	templateUrl: './cuadrilla-tercero.component.html',
	styleUrls: ['./cuadrilla-tercero.component.css'],
	animations: fuseAnimations
})
export class CuadrillaTerceroComponent implements OnInit, OnDestroy {

	user: object;
	loading: boolean;
	cuadrillasSearch: string;

	displayedColumns: string[] = ['numeroservicio', 'fechacreacion', 'actions'];
	dataSource: MatTableDataSource<ServiciosData>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	destroy$: Subject<boolean> = new Subject<boolean>();

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
		this.getCuadrillas();
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	getCuadrillas() {
		this.loading = true;

		let json = {
			idtercero: this._route.params['_value']['id'],
			idtiposervicio: 4
		}

		this._api.getServiciosTercero(json, this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
				this._snackBar.open("No se pudieron cargar las cuadrillas del tercero.", 'Cerrar', { duration: 3000 });
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


	delete(cuadrilla){
		if (this.user['permisos']['terceros']['cuadrillas']['eliminar']) {

			const dialogConfigs = {
				title: "¿Está seguro de eliminar la cuadrila?",
				subtitle: 'Cuadrilla número: ' + cuadrilla['numeroservicio'],
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			 }
	
			 const dialogRef = this._dialog.open(ConfirmsDialog, {
				width: '40%',
				data: dialogConfigs
			 });


			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this._api.deleteServicioCuadrilla(cuadrilla['idservicio'], this.user['token']).subscribe(response => {
						if (response["code"] == 200) {
							this.getCuadrillas();
							this._snackBar.open('Cuadrilla eliminada.', 'Cerrar', { duration: 3000 });
						} else if(response["code"] == 401) {
							this._snackBar.open('No se pueden eliminar cuadrillas relacionadas.', 'Cerrar', { duration: 3000 });
						} else {
							this._snackBar.open('No se pudo eliminar la cuadrilla.', 'Cerrar', { duration: 3000 });
						}
					});

				}
			});
	
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}


	createCuadrilla() {
		if (this.user['permisos']['terceros']['cuadrillas']['crear']) {
			const dialogConfigs = {
				title: "¿Está seguro de crear una cuadrilla?",
				subtitle: "",
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			}
	
			const dialogRef = this._dialog.open(ConfirmsDialog, {
				width: '40%',
				data: dialogConfigs
			});
	
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this._api.createServicioCuadrilla({ idtercero: this._route.params['_value']['id'] }, this.user['token']).subscribe(response => {
						if (response["code"] == 200) {
							this.getCuadrillas();
							this._snackBar.open('Cuadrilla creada.', 'Cerrar', { duration: 3000 });
						} else {
							this._snackBar.open('No se pudo crear la cuadrilla.', 'Cerrar', { duration: 3000 });
						}
					});
				}
			});
		} else {
		this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}


	openCelularesCuadrillaDialog(row){

		if (this.user['permisos']['terceros']['cuadrillas']['listar_celulares']) {
			this._dialog.open(CelularesCuadrillaDialog, {
				width: '60%',
				data: {
					cuadrilla: row,
					user: this.user
				}
			});
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}	
	}

	// selectServicio(idServicio) {
	// 	this._router.navigate(['/servicio/' + idServicio])
	// }

}
