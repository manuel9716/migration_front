import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { ChangeStatusSolTerceroDialog } from 'src/app/templates/change-status-sol-tercero-dialog/change-status-sol-tercero-dialog'

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

export interface ActividadesData {
	idactividadsoltercero: number,
	fechacreacion: object,
	observaciones: string,
	nombretipo: string,
	descripciontipo: string,
	nombresempleado: string,
	apellidosempleado: string,
	numeroempleado: string,
}

@Component({
	selector: 'app-view-sol-tercero',
	templateUrl: './view-sol-tercero.component.html',
	styleUrls: ['./view-sol-tercero.component.css'],
	animations: fuseAnimations
})

export class ViewSolTerceroComponent implements OnInit {

	newActTerceroForm: FormGroup;

	user: object = this._vars.user.source['value'];;
	loading: boolean;
	solicitud: object;
	actividades: object;
	loadingActividades: boolean;
	breadcrumb: string = 'Solicitud';
	currentAction: string = 'list';
	tiposActividades: object[];

	// Actividades Table
	displayedColumnsAct: string[] = ['fechacreacion', 'nombretipo', 'observaciones', 'empleado'];
	dataSourceAct: MatTableDataSource<ActividadesData>;
	@ViewChild('paginatorOp',{static: true}) paginatorOp: MatPaginator;
	@ViewChild('sortOp',{static: true}) sortOp: MatSort;

	@ViewChild('newActTercero',{static: true}) private newActTerceroStepper: MatStepper;
	error: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		public _dialog: MatDialog,
		private _formBuilder: FormBuilder,
		private _snackBar: MatSnackBar,
		private _api: ApiService,
		private _vars: VarsService,
	) {
		if(!this.user['permisos']['terceros']['solicitudes']['view_detail']){ this._router.navigate(['/']) }
	}

	ngOnInit() {

		this._api.getSolicitudTercero(this._route.snapshot.params.id, this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.solicitud = response['data'];
				this.getActTerceros();
			} else {
				this._snackBar.open("No se pudo cargar la información de la solicitud", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/solicitudes-tercero']);
			}
		});

		this._api.getTiposActTercero(this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.tiposActividades = response['data'];
				this.tiposActividades.shift();
			} else {
				this._snackBar.open("No se pudieron cargar los tipos de actividades", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/solicitudes-tercero']);
			}
		});

		this.newActTerceroForm = this._formBuilder.group({
			idtipoactividadtercero: ['', [Validators.required]],
			observaciones: ['', Validators.maxLength(300)],
			idempleado: [null],
			idsolicitudtercero: [null]
		});
	}


	getActTerceros() {
		this.loadingActividades = true;
		this._api.getActividadesSolTercero(this.solicitud['idsolicitudtercero'], this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSourceAct = new MatTableDataSource(response['data']);
				this.dataSourceAct.paginator = this.paginatorOp;
				this.dataSourceAct.sort = this.sortOp;
			} else {
				this._snackBar.open("No se pudieron cargar las activiades de la solicitud", 'Cerrar', { duration: 3000 });
			}
			this.loadingActividades = false;
		});
	}

	applyFilter(filterValue: string) {
		this.dataSourceAct.filter = filterValue.trim().toLowerCase();
		if (this.dataSourceAct.paginator) {
			this.dataSourceAct.paginator.firstPage();
		}
	}


	changeTab(ev) {
		if (ev.index == 0) { this.breadcrumb = 'Solicitud' }
		if (ev.index == 1) { this.breadcrumb = 'Actividades' }
	}

	cambiarEstado() {
		const dialogRef = this._dialog.open(ChangeStatusSolTerceroDialog, { width: '60%', data: this.solicitud, hasBackdrop: true });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.solicitud['idestadosolicitudtercero'] = result;
				this.getActTerceros();
			}
		});
	}


	closeCreate() {
		this.currentAction = 'list';
		this.newActTerceroForm.reset();
		this.error = null;
	}

	registrarActividad() {
		if (this.user['permisos']['terceros']['actividadades']['crear']) {
			if (this.newActTerceroForm.valid) {
				this.loading = true;
	
				this.newActTerceroForm.patchValue({
					idempleado: this.user['idtercero'],
					idsolicitudtercero: this.solicitud['idsolicitudtercero']
				});
	
				this._api.createActSolTercero(this.newActTerceroForm.value, this.user['token']).subscribe(response => {
					if (response['code'] == 200) {
						this._snackBar.open("Actividad registrada.", 'Cerrar', { duration: 3000 });
						this.getActTerceros();
						this.closeCreate();
					} else {
						this.error = "No se pudo registrar la actividad."
					}
					this.loading = false;
				});
			}
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
			this.currentAction = 'list';
		}
	}



}
