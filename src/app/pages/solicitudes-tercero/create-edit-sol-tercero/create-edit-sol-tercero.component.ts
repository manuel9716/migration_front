import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateEditTerceroDialog } from 'src/app/templates/create-edit-tercero-dialog/create-edit-tercero-dialog';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { VarsService } from 'src/app/services/vars.service';
import { ApiService } from 'src/app/services/api.service'

export interface solicitudesTercerosData {
	idsolicitudtercero: number,
	observaciones: string,
	nombreestado: string,
	descripcionestado: string,
	nombretipo: string,
	descripciontipo: string,
	nombresempleado: string,
	apellidosempleado: string,
	numeroempleado: number,
	fechacreacion: object,
}

@Component({
	selector: 'app-create-edit-sol-tercero',
	templateUrl: './create-edit-sol-tercero.component.html',
	styleUrls: ['./create-edit-sol-tercero.component.css'],
	animations: fuseAnimations
})
export class CreateEditSolTerceroComponent implements OnInit {

	form: FormGroup;
	addServicioForm: FormGroup;

	currentPlan: object;
	currentTercero: object;
	currentTipoSolicitud: object;
	user: object = this._vars.user.source['value'];
	error: string;
	tiposSolicitudes: object[];
	searchingTercero: boolean;
	loading: boolean;
	services: object[];

	geografias: object[] = this._vars.geografias;
	tiposPlanes: object[] = this._vars.tiposPlanes;
	tiposServicios: object[] = this._vars.tiposServicios;

	paramsIdentificacion:number = this._route.params['_value']['identificacion'];

	@ViewChild('solTerceroStepper',{static: true}) private solicitudTerceroStepper: MatStepper;


	// Solicitudes de tercero
	displayedColumns: string[] = ['nombreestado', 'nombretipo', 'nombresempleado','observaciones', 'fechacreacion'];
	dataSource: MatTableDataSource<solicitudesTercerosData>;
	@ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
	@ViewChild(MatSort,{static: true}) sort: MatSort;


	constructor(
		private _formBuilder: FormBuilder,
		public _dialog: MatDialog,
		private _vars: VarsService,
		private _api: ApiService,
		private _snackBar: MatSnackBar,
		private _router: Router,
		private _route: ActivatedRoute,
	) {
		if(!this.user['permisos']['terceros']['solicitudes']['crear']){ this._router.navigate(['/']) }
	}

	ngOnInit() {
		

		this.form = this._formBuilder.group({
			nombrecontacto: ['', [Validators.maxLength(50)]],
			celularcontacto: ['', [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
			identificaciontercero: ['', [Validators.required, Validators.maxLength(20), Validators.pattern("^[0-9]*$")]],
			idtercero: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
			idtiposolicitudtercero: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
			idestadosolicitudtercero: [1],
			observaciones: ['', Validators.maxLength(300)],
			idempleado: [this.user['idtercero'], []]
		});

		if(this.paramsIdentificacion){
			this.form.controls.identificaciontercero.setValue(this.paramsIdentificacion);
			this.searchTercero();
			this.form.controls.identificaciontercero.disable();
		}

		this._api.getTiposSolTercero(this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.tiposSolicitudes = response['data'];
			} else {
				this._snackBar.open("No se pudo cargar los tipos de solicitud de tercero", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/solicitudes-tercero']);
			}
		});
	}

	changeTipoSol(ev) {
		this.form.patchValue({ idtiposolicitudtercero: ev.value });
		this.tiposSolicitudes.forEach(element => {
			if (element['idtiposolicitudtercero'] == ev.value) {
				this.currentTipoSolicitud = element;
			}
		});
		this.goForward();
	}

	goForward() {
		this.solicitudTerceroStepper.next();
	}

	searchTerceroEnterAction(data) {
		if (this.currentTercero) {
			this.goForward();
		} else {
			this.searchTercero(data)
		}
	}

	searchTercero(e?) {
		if (e) { e.preventDefault() };
		if (this.form.controls['identificaciontercero'].valid) {
			this.searchingTercero = true;
			const json = {
				property: 'identificacion',
				value: this.form.value['identificaciontercero'],
				solicitudestercero: true
			};
			this._api.searchTerceroByProperty(json, this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
					this.currentTercero = response['data'];
					this.form.patchValue({ idtercero: response['data'].idtercero });
					this.dataSource = new MatTableDataSource(response["solicitudestercero"]);
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
				} else {
					this.openCreateEditTerceroDialog()
				}
				this.searchingTercero = false;
			});
		}
	}

	openCreateEditTerceroDialog() {
		const dialogRef = this._dialog.open(CreateEditTerceroDialog, { width: '90%', data: this.form.value, hasBackdrop: true });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.currentTercero = result;
				this.form.patchValue({ idtercero: result['idtercero'] });
				this.dataSource = new MatTableDataSource([]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			}
		});
	}

	onChange(e) {
		let targetElem = document.getElementById('input' + String(e.selectedIndex));
		setTimeout(function waitTargetElem() {
			if (document.body.contains(targetElem)) {
				targetElem.focus();
			} else {
				setTimeout(waitTargetElem, 100);
			}
		}, 100);
	}

	createSolicitud() {
		if (this.form.valid) {
			let json = JSON.parse(JSON.stringify(this.form.value));

			this.loading = true;
			this._api.createSolTercero(json, this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
					this._snackBar.open("Solicitud de tercero creada", 'Cerrar', { duration: 3000 });
					this._router.navigate(['/solicitudes-tercero'])
				} else {
					this.error = response['msg'];
				}
				this.loading = false;
			});
		}
	}

}
