import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

import { Router } from '@angular/router';
import { SelectPlanDialog } from 'src/app/templates/select-plan-dialog/select-plan-dialog';
import { SelectDireccionDialog } from 'src/app/templates/select-direccion-dialog/select-direccion-dialog';
import { CreateEditTerceroDialog } from 'src/app/templates/create-edit-tercero-dialog/create-edit-tercero-dialog';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { VarsService } from 'src/app/services/vars.service';
import { ApiService } from 'src/app/services/api.service'

// adds Services
export interface ServiciosData {
	idplan: number;
	nombreplan: string;
	iddireccion: number;
	descripciondireccion: string;
	nombrecontacto: string;
	celularcontacto: number;
}

// Old Services
export interface Servicios2Data {
	idservicio: number,
	numeroservicio: string,
	fechacreacion: object,
	descripciondireccion: string;
	nombremunicipio: string;
	nombrebarrio: string;
	nombredepartamento: string;
	nombreestado: string,
	descripcionestado: string,
	nombretipo: string,
	descripciontipo: string,
	idplan: number,
	nombreplan: string,
	descripcionplan: string
}

@Component({
	selector: 'app-create-servicio',
	templateUrl: './create-servicio.component.html',
	styleUrls: ['./create-servicio.component.css'],
	animations: fuseAnimations
})


export class CreateServicioComponent implements OnInit {

	form: FormGroup;
	addServicioForm: FormGroup;

	currentPlan: object;
	currentTercero: object;
	currentTipoSolicitud: object;
	user: object = this._vars.user.source['value'];
	error: string;
	// tiposSolicitudes: object[];
	searchingTercero: boolean;
	loading: boolean;
	services: object[];

	geografias: object[];
	tiposPlanes: object[];
	tiposServicios: object[];

	@ViewChild('servicioStepper',{static: true}) private solicitudTerceroStepper: MatStepper;
	@ViewChild('addServicioStepper',{static: true}) private addServicioStepper: MatStepper;

	// Add Services
	displayedColumns: string[] = ['plan', 'direccion', 'contacto', 'actions'];
	dataSource: MatTableDataSource<ServiciosData>;
	@ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
	@ViewChild(MatSort,{static: true}) sort: MatSort;

	//Old Services
	displayedColumns2: string[] = ['numeroservicio', 'nombreestado', 'nombreplan', 'descripciondireccion', 'nombremunicipio', 'fechacreacion'];
	dataSource2: MatTableDataSource<Servicios2Data>;
	@ViewChild(MatPaginator,{static: true}) paginator2: MatPaginator;
	@ViewChild(MatSort,{static: true}) sort2: MatSort;

	constructor(
		private _formBuilder: FormBuilder,
		public _dialog: MatDialog,
		private _vars: VarsService,
		private _api: ApiService,
		private _snackBar: MatSnackBar,
		private _router: Router
	) {
		if(!(this.user['permisos']['servicios'] && this.user['permisos']['servicios']['crear'])){ this._router.navigate(['/']) }
	}

	ngOnInit() {

		this.geografias = this._vars.geografias;
		this.tiposPlanes = this._vars.tiposPlanes;
		this.tiposServicios = this._vars.tiposServicios;

		this.form = this._formBuilder.group({
			// nombrecontacto: ['', [Validators.required, Validators.maxLength(50)]],
			// celularcontacto: ['', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
			identificaciontercero: ['', [Validators.required, Validators.maxLength(20), Validators.pattern("^[0-9]*$")]],
			idtercero: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
			idtiposervicio: [1],
			idestadoservicio: [1],
			observaciones: ['', Validators.maxLength(300)],
			servicios: [null, [Validators.required]],
			idempleado: [this.user['idtercero'], []]
		});


		this.addServicioForm = this._formBuilder.group({
			idplan: [null, [Validators.required]],
			iddireccion: [null, [Validators.required]],
			nombrecontacto: ['', [Validators.required, Validators.maxLength(50)]],
			celularcontacto: ['', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
		})

		this.dataSource = new MatTableDataSource([]);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;

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

	eventHandler(){
		if(this.form.controls.idtercero.value){
			this.form.controls.idtercero.setValue(null);
			this.dataSource2 = null;
			this.dataSource2.paginator = null;
			this.dataSource2.sort = null;
		}
		
	}


	searchTercero(e) {
		if (e) { e.preventDefault() };
		if (this.form.controls['identificaciontercero'].valid) {
			this.searchingTercero = true;
			const json = {
				property: 'identificacion',
				value: this.form.value['identificaciontercero'],
				serviciostercero: true
			};
			this._api.searchTerceroByProperty(json, this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
					this.currentTercero = response['data'];
					this.form.patchValue({ idtercero: response['data'].idtercero });
					this.dataSource2 = new MatTableDataSource(response["serviciostercero"]);
					this.dataSource2.paginator = this.paginator2;
					this.dataSource2.sort = this.sort2;
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
			}
		});
	}

	selectPlan() {
		const dialogRef = this._dialog.open(SelectPlanDialog, { width: '90%', hasBackdrop: true });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.addServicioForm.controls['idplan'].setValue(result);
				this.addServicioStepper.next();
			}
		});
	}

	selectDireccion() {
		
		const dialogRef = this._dialog.open(SelectDireccionDialog, { width: '90%', data: { tercero: this.currentTercero }, hasBackdrop: true });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.addServicioForm.controls['iddireccion'].setValue(result);
				this.addServicioStepper.next();
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

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	deleteService(i) {
		let items = this.dataSource.data;
		items.splice(i, 1);
		this.form.patchValue({ servicios: items });
		this.dataSource = new MatTableDataSource(items);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	addServicio() {

		if (this.addServicioForm.valid) {
			let newService: ServiciosData = {
				idplan: this.addServicioForm.value['idplan'].idplan,
				nombreplan: this.addServicioForm.value['idplan'].nombre,
				iddireccion: this.addServicioForm.value['iddireccion'].iddireccion,
				descripciondireccion: this.addServicioForm.value['iddireccion'].descripcion + ' ('+ this.addServicioForm.value.iddireccion.barrio + " - " + this.addServicioForm.value.iddireccion.municipio + ' - ' + this.addServicioForm.value.iddireccion.departamento + ')',
				nombrecontacto: this.addServicioForm.value['nombrecontacto'],
				celularcontacto: this.addServicioForm.value['celularcontacto'],
			}
			let items = this.dataSource.data;
			items.push(newService);

			this.form.patchValue({ servicios: items });
			this.dataSource = new MatTableDataSource(items);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
			this.addServicioStepper.reset();
			this.addServicioForm.reset();
		}
	}

	createSolicitud() {
		if (this.form.valid) {

			this.loading = true;
			this._api.createServicio(this.form.value, this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
					this._snackBar.open((this.form.value.servicios.length > 1) ? 'Servicios creados' : 'Servicio creado', 'Cerrar', { duration: 3000 });
					this._router.navigate(['/servicios']);
				} else {
					this.error = response['msg'];
				}
				this.loading = false;
			});
		}
	}


}
