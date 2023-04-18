import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { VarsService } from 'src/app/services/vars.service';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

import { insertValueDialog } from 'src/app/templates/insert-value-dialog/insert-value-dialog';
import { SelectCuadrillaDialog } from 'src/app/templates/select-cuadrilla-dialog/select-cuadrilla-dialog';
import { ListAgendaCuadrillaDialog } from 'src/app/templates/list-agenda-cuadrilla-dialog/list-agenda-cuadrilla-dialog';

import * as moment_ from 'moment';
const moment = moment_;

export interface Materiales {
	idmaterial: number;
	nombre: string;
	descripcion: string;
	unidadmedida: string;
}

@Component({
	selector: 'app-create-edit-op-servicios',
	templateUrl: './create-edit-op-servicios.component.html',
	styleUrls: ['./create-edit-op-servicios.component.css'],
	animations: fuseAnimations
})
export class CreateEditOpServiciosComponent implements OnInit {


	form: FormGroup;
	activateForm: FormGroup;
	user: object = this._vars.user.source['value'];
	load: boolean = true;
	loading: boolean;
	error: string;

	tipos: object[];
	estadosServicios: object[];
	clases: object[] = [];
	materiales: Materiales[] = [];
	labores: object[];
	nivelesSolServicio: object[];
	solicitud: object;
	cuadrillas: object[];
	selectedCuadrilla: object;

	fechainicial: number;
	datePicker = new Date();

	showDividers: boolean = false;
	idSolServicio: number;

	activateError = { msg: null, status: false }


	constructor(
		private _formBuilder: FormBuilder,
		private _vars: VarsService,
		private _api: ApiService,
		private _snackBar: MatSnackBar,
		private _router: Router,
		private _route: ActivatedRoute,
		public _dialog: MatDialog,
	) {
		if (!this.user['permisos']['operaciones']['crear']['crear']) { this._router.navigate(['/']) }
	}

	ngOnInit() {

		this.idSolServicio = this._route.snapshot.params.id;

		// this._api.getServicioscuadrillas(this.user['token']).subscribe(response => {

		// 	if (response['code'] == 200) {

		// 		this.cuadrillas = response['data'];

		// 		// let lsCuadrilla = JSON.parse(localStorage.getItem('cuadrilla'));
		// 		// if (lsCuadrilla) {
		// 		// 	this.cuadrillas.forEach(cuadrilla => {
		// 		// 		if (cuadrilla['idservicio'] == lsCuadrilla['idservicio']) {
		// 		// 			this.changeCuadrilla(cuadrilla);
		// 		// 		}
		// 		// 	});
		// 		// }

		// 	} else {
		// 		this._snackBar.open("No se encontraron cuadrillas asociadas a este usuario.", 'Cerrar', { duration: 3000 });
		// 	}
		// });


		this._api.getServCuadrillaByTercero(this.user['idtercero'], this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				if (response['data'].length > 0) {
					this.cuadrillas = response['data'];
					this.changeCuadrilla(this.cuadrillas[0]);
				} else {
					this._snackBar.open("No se encontraron cuadrillas asociadas a este usuario.", 'Cerrar', { duration: 3000 });
					// this._router.navigate(['/solicitud-servicio/ver', this.idSolServicio])
				}
			} else {
				this._snackBar.open("No se pudo obtener las cuadrillas del usuario.", 'Cerrar', { duration: 3000 });
			}
		});


		this._api.checkSolServicioAndEntities(this._route.snapshot.params.id, this.user['token']).subscribe(response => {

			if (response['code'] == 200) {

				this.solicitud = response['solicitud'];

				if (this.solicitud['idestadosolicitudservicio'].idestadosolicitudservicio != 3) {

					let idGrupo = this.solicitud['idtiposolicitudservicio']['idgruposolicitudservicio']['idgruposolicitudservicio'];
		
					// Select Clases
					let gruposPerm = [
						{ idgrupo: 1, perm: 'facturacion' },
						{ idgrupo: 2, perm: 'inventario' },
						{ idgrupo: 3, perm: 'marketing' },
						{ idgrupo: 4, perm: 'modificaciones' },
						{ idgrupo: 5, perm: 'operaciones' },
						{ idgrupo: 6, perm: 'recaudo_cartera' },
						{ idgrupo: 7, perm: 'servicio_cliente' },
						{ idgrupo: 8, perm: 'soporte_tecnico' },
						{ idgrupo: 9, perm: 'ventas' },
					]
					response['clases'].forEach(clase => {
						
						if(clase['idclaseoperacionservicio'] > 4 ){
							if (clase['idclaseoperacionservicio'] == 5 && this.user['permisos']['operaciones']['finalizar_grupos']) {
								gruposPerm.forEach(gp => {
									if(idGrupo == gp['idgrupo'] && this.user['permisos']['operaciones']['finalizar_grupos'][gp['perm']]){
										this.clases.push(clase);
									}
								});
							} else if (clase['idclaseoperacionservicio'] == 9 && this.user['permisos']['operaciones']['cancelar_finalizar_grupos']) {
								gruposPerm.forEach(gp => {
									if(idGrupo == gp['idgrupo'] && this.user['permisos']['operaciones']['cancelar_finalizar_grupos'][gp['perm']]){
										this.clases.push(clase);
									}
								});
							} else if (
								(clase['idclaseoperacionservicio'] == 6 || clase['idclaseoperacionservicio'] == 7 || clase['idclaseoperacionservicio'] == 8) && 
								this.user['permisos']['operaciones']['activaciones'] && 
								this.user['permisos']['operaciones']['activaciones']['activaciones']) {
								this.clases.push(clase);
							}
						} else {
							// Add + clases
							this.clases.push(clase);
						}
					});

					this.tipos = response['tipos'];
					this.materiales = response['materiales'];
					this.nivelesSolServicio = response['nivelessolservicio'];
					this.estadosServicios = response['estadosServicios'];
					this.estadosServicios.splice(0, 3);

					this.form = this._formBuilder.group({
						fechainicial: [new Date().getTime()],
						tempMaterial: [],
						tempLabor: [],
						consumos: [[]],
						labores: [[]],
						coordenadas: [[]],
						observaciones: ['', Validators.maxLength(300)],
						idtipooperacionservicio: ['', [Validators.required]],
						idclaseoperacionservicio: ['', [Validators.required]],
						idserviciocuadrillaagenda: [''],
						idnivelsolicitudservicio: [''],
						idestadoservicio: [''],
						idsolicitudservicio: [this._route.snapshot.params.id],
						sendsmstocuadrilla: [false]

					});

					this._api.getInfoUser().subscribe(infoUser => {
						const coor = [infoUser['latitude'], infoUser['longitude']];
						this.form.controls.coordenadas.patchValue(coor.toString());
					});

				} else {
					this._snackBar.open("No se pueden crear operaciones a una solicitud FINALIZADA", 'Cerrar', { duration: 3000 });
					this._router.navigate(['/solicitud-servicio/ver/' + this._route.snapshot.params.id])
				}
			} else {
				this._snackBar.open("No se pudo cargar la solicitud de servicio.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/servicios'])
			}
			this.load = false;
		});

		this.activateForm = this._formBuilder.group({
			ip: ['', Validators.required],
			octeto1: ['', [Validators.required, Validators.max(255), Validators.pattern("^[0-9]*$")]],
			octeto2: ['', [Validators.required, Validators.max(255), Validators.pattern("^[0-9]*$")]],
			octeto3: ['', [Validators.required, Validators.max(255), Validators.pattern("^[0-9]*$")]],
			octeto4: ['', [Validators.required, Validators.max(255), Validators.pattern("^[0-9]*$")]],
			puertocaja: ['', [Validators.required, Validators.maxLength(3)]],
			ncajanap: ['', [Validators.required, Validators.maxLength(8)]],
			serialont: ['', [Validators.required, Validators.maxLength(16)]],
			ontid: ['', [Validators.required, Validators.maxLength(3)]],
			potcajanap: ['', [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]],
			potont: ['', [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]],
		});

		this.activateForm.controls.ip.disable();


	}


	buildIp() {
		this.activateError = { msg: null, status: false };
		let ip = "";
		ip += this.activateForm.controls.octeto1.value;
		ip += ".";
		ip += this.activateForm.controls.octeto2.value;
		ip += ".";
		ip += this.activateForm.controls.octeto3.value;
		ip += ".";
		ip += this.activateForm.controls.octeto4.value;
		this.activateForm.controls.ip.setValue(ip);
		if (this.activateForm.controls.octeto1.valid && this.activateForm.controls.octeto2.valid && this.activateForm.controls.octeto3.valid && this.activateForm.controls.octeto4.valid) {
			this.validarIp();
		}
	}


	changeCuadrilla(cuadrilla) {
		this.selectedCuadrilla = cuadrilla;
		localStorage.setItem('cuadrilla', JSON.stringify(cuadrilla));
	}


	deleteCuadrilla() {
		this.selectedCuadrilla = null;
		localStorage.setItem('cuadrilla', null);
	}


	changeClase(ev) {

		let idClaseOpServ = ev.value.idclaseoperacionservicio;

		this.form.controls['idserviciocuadrillaagenda'].setValidators(null);
		this.form.controls['idnivelsolicitudservicio'].setValidators(null);
		this.form.controls['idestadoservicio'].setValidators(null);

		this.showDividers = true;

		if (idClaseOpServ == 2 || idClaseOpServ == 3) {
			this.form.controls['idserviciocuadrillaagenda'].setValidators(Validators.required);
		} else if (idClaseOpServ == 4) {
			this.form.controls['idnivelsolicitudservicio'].setValidators(Validators.required);
		} else if (idClaseOpServ == 6 || idClaseOpServ == 7 || idClaseOpServ == 8) {

		} else if (idClaseOpServ == 9) {
			this.form.controls['idestadoservicio'].setValidators(Validators.required);
		} else {
			this.showDividers = false;
		}

		this.form.controls['idserviciocuadrillaagenda'].setValue('');
		this.form.controls['idnivelsolicitudservicio'].setValue('');
		this.form.controls['idestadoservicio'].setValue('');

	}


	selectCuadrillaAgenda() {
		const dialogRef = this._dialog.open(SelectCuadrillaDialog, { width: '60%' });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.form.controls.idserviciocuadrillaagenda.patchValue(result);
			}
		});
	}


	addConsumo(ev) {
		if (ev) {
			let data = {
				title: 'Ingrese cantidad de ' + ev.nombre + ' (' + ev.unidadmedida + ')',
				required: 'La cantidad es requerida.',
				type: 'Cantidad',
			}
			const dialogRef = this._dialog.open(insertValueDialog, { width: '50%', data: data, hasBackdrop: true });
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.form.get('tempMaterial').patchValue(null);
					ev['cantidad'] = result;
					this.form.controls['consumos']['value'].push(ev);
				}
			});
		}

	}


	deleteConsumo(idx) {
		this.form.controls['consumos']['value'].splice(idx, 1)
	}


	addLabor(ev) {
		this.form.get('tempLabor').patchValue(null);
		this.form.controls['labores']['value'].push(ev);
	}


	deleteLabor(idx) {
		this.form.controls['labores']['value'].splice(idx, 1)
	}


	changeEstSol() {
		if (this.form.controls.cambiarestsol.value) {
			this.form.controls.idestadosolicitudservicio.setValidators(null);
			this.form.controls.idestadosolicitudservicio.setValue(null);
		} else {
			this.form.controls.idestadosolicitudservicio.setValidators([Validators.required]);
		}
		this.form.controls.idestadosolicitudservicio.updateValueAndValidity();
	}


	getLaboresByTipoOpServ(ev) {
		this._api.getLaboresByTipoOpServicio(ev.value.idtipooperacionservicio, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.labores = response['data'];
			} else {
				this._snackBar.open("Error al obtener labores del tipo de operación seleccionado.", 'Cerrar', { duration: 3000 });
			}
		});
	}


	crateOperacion() {

		if (this.form.valid) {

			this.loading = true;
			this.error = null;

			let json = JSON.parse(JSON.stringify(this.form.value));
			json['fechafinal'] = new Date().getTime();
			json.idtipooperacionservicio = json.idtipooperacionservicio.idtipooperacionservicio;
			json.idclaseoperacionservicio = json.idclaseoperacionservicio.idclaseoperacionservicio;

			if (json.idserviciocuadrillaagenda) {
				json.idserviciocuadrillaagenda = json.idserviciocuadrillaagenda.idservicio;
			}

			if (json.idnivelsolicitudservicio) {
				json.idnivelsolicitudservicio = json.idnivelsolicitudservicio.idnivelsolicitudservicio;
			}

			if (json.idestadoservicio) {
				json.idestadoservicio = json.idestadoservicio.idestadoservicio;
			}

			json['idserviciocuadrilla'] = this.selectedCuadrilla['idservicio']


			if (json.idclaseoperacionservicio == 6 || json.idclaseoperacionservicio == 7 || json.idclaseoperacionservicio == 8) {
				json['activacion'] = JSON.stringify(this.activateForm.value);
			}
		

			this._api.createOperacionesServicio(json, this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
					this._snackBar.open("Operación solicitud al servicio creada.", 'Cerrar', { duration: 3000 });
					this._router.navigate(['/solicitud-servicio/ver/' + this._route.snapshot.params.id])
				} else {
					this.error = response['msg']
				}
				this.loading = false;
			});


		}


	}


	validarIp() {
		this.activateError = { msg: null, status: false };
		let json = { ip: this.activateForm.controls.ip.value };
		this._api.checkIp(json, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.activateError = { msg: "La ip está disponible", status: true }
			} else {
				this.activateError = { msg: "La ip ya se encuentra en uso", status: false }
			}
		});
	}


	showAgendaCuadrilla() {
		if (this.form.controls.idserviciocuadrillaagenda.value) {
			let data = this.form.controls.idserviciocuadrillaagenda.value;
			this._dialog.open(ListAgendaCuadrillaDialog, { width: '80%', data: data, hasBackdrop: true });
		}

	}




}
