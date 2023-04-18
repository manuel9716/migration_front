import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { InfoOperacionServicioDialog } from 'src/app/templates/info-operacion-servicio-dialog/info-operacion-servicio-dialog'
import { insertValueDialog } from 'src/app/templates/insert-value-dialog/insert-value-dialog';
import { SelectCuadrillaDialog } from 'src/app/templates/select-cuadrilla-dialog/select-cuadrilla-dialog';
import { ListAgendaCuadrillaDialog } from 'src/app/templates/list-agenda-cuadrilla-dialog/list-agenda-cuadrilla-dialog';


import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog';
import { ProgramarRetiroDialog } from 'src/app/templates/programar-retiro-dialog/programar-retiro-dialog';
import { FireBaseGestionSolicitudesApiService } from 'src/app/services/fire-base-gestion-solicitudes-api.service';
import { gestionSolicitudes } from 'src/app/model/Solicitudes/gestion-solicitudes-fb';

export interface ActividadesData {
	idoperacionservicio: number,
	numerocuadrilla: number,
	fechainicial: object,
	fechafinal: object,
	fechacreacion: object,
	nombretipo: string,
	descripciontipo: string,
	nombreclase: string,
	descripcionclase: string,
	nombrescuadrilla: string,
	apellidoscuadrilla: string,
	numerotercero: number,
}

@Component({
	selector: 'app-view-sol-servicio',
	templateUrl: './view-sol-servicio.component.html',
	styleUrls: ['./view-sol-servicio.component.scss'],
	animations: fuseAnimations
})

export class ViewSolServicioComponent implements OnInit {

	user: object = this._vars.user.source['value'];
	loading: boolean;
	solicitud: object;
	operaciones: object;
	loadingOperaciones: boolean;
	breadcrumb: string = 'Solicitud';
	error: string;

	//tercero gestion 
	isGestion: boolean = false;
	nombreGestion: string = '';
	fechaGestion: number = 0;
	arrayGestionSolic = [];

	currentClase: object;
	currentTipo: object;

	fechainicial;
	coordenadas: string;

	cuadrillas: object[];
	selectedCuadrilla: object;

	// Actividades Table
	displayedColumnsAct: string[] = ['nombretipo', 'nombreclase', 'nombrescuadrilla', 'fechacreacion', 'fechafinal', 'observaciones'];
	dataSourceAct: MatTableDataSource<ActividadesData>;
	@ViewChild('paginatorOp', { static: true }) paginatorOp: MatPaginator;
	@ViewChild('sortOp', { static: true }) sortOp: MatSort;


	tipos: object[];
	materiales: object[];
	nivelesSolServicio: object[];
	estadosServicios: object[];
	estadosSolServicios: object[] = [];
	labores: object[];
	clases: object[] = [];
	retiro: object;
	suspension: object;
	estadosRetiros ;
	motivosRetiros ;

	minDateRetiro = new Date();

	minDateSuspencion = new Date();
	minDateSuspencion2: any;

	activateError = { msg: null, status: false }


	clasesOperaciones: object[] = [
		{ id: 1, name: "Cambiar Estado", icon: "fas fa-exchange-alt fa-5x" },
		{ id: 2, name: "Operación", icon: "fas fa-tools fa-5x" },
		{ id: 3, name: "Agendar", icon: "fas fa-calendar-plus fa-5x" },
		{ id: 4, name: "Escalar", icon: "fas fa-level-up-alt fa-5x" },
		{ id: 5, name: "Activaciones", icon: "fas fas fa-ethernet fa-5x" },
		{ id: 6, name: "Finalizar", icon: "fas fa-check-circle fa-5x" },
		{ id: 7, name: "Cancelar y Finalizar", icon: "fas fa-times-circle fa-5x" },
		{ id: 8, name: "Programar Retiro", icon: "fas fa-sign-out-alt fa-5x" },
		{ id: 9, name: "Cancelar Retiro", icon: "fas fa-sign-in-alt fa-5x" },
		{ id: 10, name: "Desinstalar Equipo", icon: "fas fa-unlink fa-5x" },
		{ id: 11, name: "Programar Suspensión", icon: "fas fa-calendar-plus fa-5x" },
		{ id: 12, name: "Cancelar Suspensión", icon: "fas fa-calendar-minus fa-5x" },
	]

	// FORMS
	cambiarEstadoForm: FormGroup = this._formBuilder.group({
		idestadosolicitudservicio: ['', [Validators.required]],
		observaciones: ['', Validators.maxLength(450)],
	});

	operacionForm: FormGroup = this._formBuilder.group({
		tempMaterial: [],
		tempLabor: [],
		consumos: [[]],
		labores: [[]],
		observaciones: ['', Validators.maxLength(450)],
	});

	agendaForm: FormGroup = this._formBuilder.group({
		idserviciocuadrillaagenda: ['', [Validators.required]],
		observaciones: ['', Validators.maxLength(450)],
		sendsmstocuadrilla: [false]
	});

	escalarForm: FormGroup = this._formBuilder.group({
		idnivelsolicitudservicio: ['', [Validators.required]],
		observaciones: ['', Validators.maxLength(450)],
	});

	activacionesForm: FormGroup = this._formBuilder.group({
		idtipoactivacion: ['', [Validators.required]],
		observaciones: ['', Validators.maxLength(450)],

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

	finalizarForm: FormGroup = this._formBuilder.group({
		observaciones: ['', Validators.maxLength(450)],
		changestatusserv: [false],
	});

	cancelarFinalizarForm: FormGroup = this._formBuilder.group({
		idestadoservicio: ['', [Validators.required]],
		observaciones: ['', Validators.maxLength(450)],
	});

	programarRetiroForm: FormGroup = this._formBuilder.group({
		fecharetiro: ['', [Validators.required]],
		idmotivoretiro: ['', [Validators.required]],
		observaciones: ['', [Validators.maxLength(450)]],
	});

	cancelarRetiroForm: FormGroup = this._formBuilder.group({
		idretiro: ['', [Validators.required]],
		observaciones: ['', Validators.maxLength(450)],
	});

	desinstalarEquipoForm: FormGroup = this._formBuilder.group({
		idretiro: ['', [Validators.required]],
		idestadiretiro: ['', [Validators.required]],
		observaciones: ['', Validators.maxLength(450)],
	});

	programarSuspencionForm: FormGroup = this._formBuilder.group({
		fechainiciosuspension: ['', [Validators.required]],
		fechafinsuspension: ['', [Validators.required]],
		observaciones: ['', [Validators.maxLength(450)]],
	});

	cancelarSuspencionForm: FormGroup = this._formBuilder.group({
		idsuspension: ['', [Validators.required]],
		observaciones: ['', Validators.maxLength(450)],
	});


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		public _dialog: MatDialog,
		private _snackBar: MatSnackBar,
		private _api: ApiService,
		private _vars: VarsService,
		private _formBuilder: FormBuilder,
		private _firebaseDB: FireBaseGestionSolicitudesApiService,
	) {
		if (!this.user['permisos']['servicios']['solicitudes']['view_detail']) { this._router.navigate(['/']) }
	}
	getEstadosyMotivosRetiros(){
		this._api.getEstadosRetiro(this.user['token']).subscribe(response=> this.estadosRetiros=response['data'])
		this._api.getMotivosRetiro(this.user['token']).subscribe(response=> this.motivosRetiros=response['data'])
	}

	ngOnInit() {

		this.getEstadosyMotivosRetiros();
		this.activacionesForm.controls.ip.disable();

		this.minDateSuspencion.setDate(this.minDateSuspencion.getDate() + 1);

		this.getSolAndEnt();

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

		this._api.getInfoUser().subscribe(infoUser => {
			const coor = [(infoUser['latitude'] ? infoUser['latitude'] : 0), (infoUser['longitude'] ? infoUser['longitude'] : 0)];
			this.coordenadas = coor.toString();
		});


		this._firebaseDB.escucharCambiosGestiionSolicitudes()
			.subscribe(actions => {
				this.arrayGestionSolic = []
				this.getSolAndEnt();
				actions.forEach(action => {
					this.arrayGestionSolic.push({
						key: action.key,
						idSolictud: action.payload.val().idsolicitud
					});
				});
			})

	}


	getSolAndEnt() {
		this.loading = true;
		this._api.checkSolServicioAndEntities(this._route.snapshot.params.id, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.solicitud = response['solicitud'];

				this.retiro = response["retiro"][0] ? response["retiro"][0] : null;
				
				this.suspension = response["suspension"][0] ? response["suspension"][0] : null;

				let idGrupo = this.solicitud['idtiposolicitudservicio']['idgruposolicitudservicio']['idgruposolicitudservicio'];
				let idTipoSolicitud = this.solicitud['idtiposolicitudservicio']['idtiposolicitudservicio'];

				// this.solicitud["idtercerogestion"] ? : ;
				if (this.solicitud["idtercerogestion"]) {
					//this.color="accent"
					this.isGestion = true;
					var nombre = this.solicitud['idtercerogestion']["nombres"]
					var apellido = this.solicitud['idtercerogestion']["apellidos"]
					this.nombreGestion = nombre + ' ' + apellido
					this.fechaGestion = this.solicitud['fechagestion']['timestamp'] * 1000

				} else {
					this.isGestion = false;
					//this.color="primary";
				}


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

				// clasesOperaciones: object[] = [
				// 	{ id: 1, name: "Cambiar Estado", icon: "fas fa-exchange-alt fa-5x" },
				// 	{ id: 2, name: "Operación", icon: "fas fa-tools fa-5x" },
				// 	{ id: 3, name: "Agendar", icon: "fas fa-calendar-plus fa-5x" },
				// 	{ id: 4, name: "Escalar", icon: "fas fa-level-up-alt fa-5x" },
				// 	{ id: 5, name: "Activaciones", icon: "fas fas fa-ethernet fa-5x" },
				// 	{ id: 6, name: "Finalizar", icon: "fas fa-check-circle fa-5x" },
				// 	{ id: 7, name: "Cancelar y Finalizar", icon: "fas fa-times-circle fa-5x" },
				// 	{ id: 8, name: "Programar Retiro", icon: "fas fa-sign-out-alt fa-5x" },
				// 	{ id: 9, name: "Cancelar Retiro", icon: "fas fa-sign-in-alt fa-5x" },
				// 	{ id: 10, name: "Desinstalar Equipo", icon: "fas fa-unlink fa-5x" },
				// 	{ id: 11, name: "Programar Suspensión", icon: "fa-calendar-plus fa-5x" },
				// 	{ id: 12, name: "Cancelar Suspensión", icon: "fa-calendar-minus fa-5x" },
				// ]

				this.clases = [];

				this.clasesOperaciones.forEach(clase => {

					if (clase['id'] == 5 || clase['id'] == 6 || clase['id'] == 7 || clase['id'] == 8 || clase['id'] == 9 || clase['id'] == 10 || clase['id'] == 11 || clase['id'] == 12) {

						if (clase['id'] == 6 && this.user['permisos']['operaciones']['finalizar_grupos']) {
							gruposPerm.forEach(gp => {
								if (idGrupo == gp['idgrupo'] && this.user['permisos']['operaciones']['finalizar_grupos'][gp['perm']]) {
									this.clases.push(clase);
								}
							});
						} else if (clase['id'] == 7 && idTipoSolicitud == 38 && this.user['permisos']['operaciones']['cancelar_finalizar_grupos']) {
							gruposPerm.forEach(gp => {
								if (idGrupo == gp['idgrupo'] && this.user['permisos']['operaciones']['cancelar_finalizar_grupos'][gp['perm']]) {
									this.clases.push(clase);
								}
							});
						} else if (clase['id'] == 5 && idTipoSolicitud == 38 && this.user['permisos']['operaciones']['activaciones'] && this.user['permisos']['operaciones']['activaciones']['activaciones']) {
							this.clases.push(clase);
						} else if (clase['id'] == 8 && idTipoSolicitud == 23 && this.user['permisos']['operaciones']['retiros'] && this.user['permisos']['operaciones']['retiros']['programar_cancelar'] && !this.retiro) {
							this.clases.push(clase);
						} else if (clase['id'] == 9 && idTipoSolicitud == 23 && this.user['permisos']['operaciones']['retiros'] && this.user['permisos']['operaciones']['retiros']['programar_cancelar'] && this.retiro) {
							this.clases.push(clase);
						} else if (clase['id'] == 10 && idTipoSolicitud == 23 && this.user['permisos']['operaciones']['retiros'] && this.user['permisos']['operaciones']['retiros']['desintalar_equipo'] && this.retiro) {
							this.clases.push(clase);
						} else if (clase['id'] == 11 && idTipoSolicitud == 22 && this.user['permisos']['operaciones']['suspensiones'] && this.user['permisos']['operaciones']['suspensiones']['programar_cancelar'] && !this.suspension) {
							this.clases.push(clase);
						} else if (clase['id'] == 12 && idTipoSolicitud == 22 && this.user['permisos']['operaciones']['suspensiones'] && this.user['permisos']['operaciones']['suspensiones']['programar_cancelar'] && this.suspension) {
							this.clases.push(clase);
						}
					} else {
						// Add + clases
						this.clases.push(clase);
					}

					// if(clase['idclaseoperacionservicio'] > 4 ){
					// 	if (clase['idclaseoperacionservicio'] == 5 && this.user['permisos']['operaciones']['finalizar_grupos']) {
					// 		gruposPerm.forEach(gp => {
					// 			if(idGrupo == gp['idgrupo'] && this.user['permisos']['operaciones']['finalizar_grupos'][gp['perm']]){
					// 				this.clases.push(clase);
					// 			}
					// 		});
					// 	} else if (clase['idclaseoperacionservicio'] == 9 && this.user['permisos']['operaciones']['cancelar_finalizar_grupos']) {
					// 		gruposPerm.forEach(gp => {
					// 			if(idGrupo == gp['idgrupo'] && this.user['permisos']['operaciones']['cancelar_finalizar_grupos'][gp['perm']]){
					// 				this.clases.push(clase);
					// 			}
					// 		});
					// 	} else if (
					// 		(clase['idclaseoperacionservicio'] == 6 || clase['idclaseoperacionservicio'] == 7 || clase['idclaseoperacionservicio'] == 8) && 
					// 		this.user['permisos']['operaciones']['activaciones'] && 
					// 		this.user['permisos']['operaciones']['activaciones']['activaciones']) {
					// 		this.clases.push(clase);
					// 	}
					// } else {
					// 	// Add + clases
					// 	this.clases.push(clase);
					// }
				});



				this.tipos = response['tipos'];
				this.materiales = response['materiales'];
				this.nivelesSolServicio = response['nivelessolservicio'];
				this.estadosServicios = response['estadosServicios'];
				this.estadosServicios.splice(0, 3);

				response['estadossolservicios'].forEach(estadoSolServ => {
					if (estadoSolServ['idestadosolicitudservicio'] != 1 &&
						estadoSolServ['idestadosolicitudservicio'] != 2 &&
						estadoSolServ['idestadosolicitudservicio'] != 3 &&
						estadoSolServ['idestadosolicitudservicio'] != 4 &&
						estadoSolServ['idestadosolicitudservicio'] != 5) {
						this.estadosSolServicios.push(estadoSolServ);
					}
				});

				this.getOpSolServicio();
			} else {
				this._snackBar.open("No se pudo cargar la solicitud de servicio.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/servicios'])
			}
			this.loading = false;
		});
	}

	// OTHERS
	getOpSolServicio() {
		this.loadingOperaciones = true;
		this._api.getOperacionesServicio(this.solicitud['idsolicitudservicio'], this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSourceAct = new MatTableDataSource(response['data']);
				this.dataSourceAct.paginator = this.paginatorOp;
				this.dataSourceAct.sort = this.sortOp;
			} else {
				this._snackBar.open("No se pudieron cargar las operaciones de la solicitud", 'Cerrar', { duration: 3000 });
			}
			this.loadingOperaciones = false;
		});
	}

	viewDetails(row) {
		this._dialog.open(InfoOperacionServicioDialog, { width: '80%', data: row['idoperacionservicio'] });
	}

	applyFilter(filterValue: string) {
		this.dataSourceAct.filter = filterValue.trim().toLowerCase();
		if (this.dataSourceAct.paginator) {
			this.dataSourceAct.paginator.firstPage();
		}
	}

	selectTipo(tipo) {
		this.currentClase = tipo;
		this.fechainicial = new Date().getTime();
	}

	changeCuadrilla(cuadrilla) {
		this.selectedCuadrilla = cuadrilla;
		localStorage.setItem('cuadrilla', JSON.stringify(cuadrilla));
	}

	deleteCuadrilla() {
		this.selectedCuadrilla = null;
		localStorage.setItem('cuadrilla', null);
	}

	// END OTHERS



	// AGENDA
	selectCuadrillaAgenda() {
		const dialogRef = this._dialog.open(SelectCuadrillaDialog, { width: '60%' });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.agendaForm.controls.idserviciocuadrillaagenda.patchValue(result);
			}
		});
	}

	showAgendaCuadrilla() {
		if (this.agendaForm.controls.idserviciocuadrillaagenda.value) {
			let data = this.agendaForm.controls.idserviciocuadrillaagenda.value;
			this._dialog.open(ListAgendaCuadrillaDialog, { width: '80%', data: data, hasBackdrop: true });
		}

	}
	// END AGENDA



	// ACTIVACION
	buildIp() {
		this.activateError = { msg: null, status: false };
		let ip = "";
		ip += this.activacionesForm.controls.octeto1.value;
		ip += ".";
		ip += this.activacionesForm.controls.octeto2.value;
		ip += ".";
		ip += this.activacionesForm.controls.octeto3.value;
		ip += ".";
		ip += this.activacionesForm.controls.octeto4.value;
		this.activacionesForm.controls.ip.setValue(ip);
		if (this.activacionesForm.controls.octeto1.valid && this.activacionesForm.controls.octeto2.valid && this.activacionesForm.controls.octeto3.valid && this.activacionesForm.controls.octeto4.valid) {
			this.validarIp();
		}
	}

	validarIp() {
		this.activateError = { msg: null, status: false };
		let json = { ip: this.activacionesForm.controls.ip.value };
		this._api.checkIp(json, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.activateError = { msg: "La ip está disponible", status: true }
			} else {
				this.activateError = { msg: "La ip ya se encuentra en uso", status: false }
			}
		});
	}
	// END ACTIVACION



	// OPERATIONS
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
					this.operacionForm.get('tempMaterial').patchValue(null);
					ev['cantidad'] = result;
					this.operacionForm.controls['consumos']['value'].push(ev);
				}
			});
		}

	}

	deleteConsumo(idx) {
		this.operacionForm.controls['consumos']['value'].splice(idx, 1)
	}

	addLabor(ev) {
		this.operacionForm.get('tempLabor').patchValue(null);
		this.operacionForm.controls['labores']['value'].push(ev);
	}

	deleteLabor(idx) {
		this.operacionForm.controls['labores']['value'].splice(idx, 1)
	}

	changeTipo(tipo) {
		this.currentTipo = tipo;
		this._api.getLaboresByTipoOpServicio(tipo.idtipooperacionservicio, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.labores = response['data'];
			} else {
				this._snackBar.open("Error al obtener labores del tipo de operación seleccionado.", 'Cerrar', { duration: 3000 });
			}
		});
	}
	// END OPERATIONS


	// RETIROS
	retiroAction() {
		if (this.user['permisos']['operaciones']['retiros']['programar_cancelar']) {
			if (this.retiro) {
				const dialogConfigs = {
					title: "¿Está seguro de cancelar el retiro del servicio?",
					subtitle: "Mensaje de prueba.",
					done: '¡Estoy seguro!',
					cancel: 'Cancelar'
				}

				const dialogRef = this._dialog.open(ConfirmsDialog, {
					width: '60%',
					data: dialogConfigs
				});

				dialogRef.afterClosed().subscribe(result => {
					if (result) {
						this._api.deleteRetiro(this.retiro['idretiro'], this.user['token']).subscribe(response => {
							if (response["code"] == 200) {
								this.getSolAndEnt();
								this.currentClase = null;
								this.currentTipo = null;
								this._snackBar.open('Retiro cancelado', 'Cerrar', { duration: 3000 });
							} else {
								this._snackBar.open('No se pudo cancelar el retiro', 'Cerrar', { duration: 3000 });
							}
						});
					}
				});

			} else {
				const dialogRef = this._dialog.open(ProgramarRetiroDialog, { width: '60%', data: null, hasBackdrop: true });
				dialogRef.afterClosed().subscribe(result => {
					result['idservicio'] = this._route.params['_value']['id'];
					this._api.createRetiro(result, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							this._snackBar.open('Retiro programado.', 'Cerrar', { duration: 3000 });
							this.getSolAndEnt();
							this.currentClase = null;
							this.currentTipo = null;
						} else {
							this._snackBar.open('No se pudo programar el retiro.', 'Cerrar', { duration: 3000 });
						}
					});
				});
			}
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}

	}

	// getEstadoRetiro(idEstado) {
	// 	return this.estadosRetiros.find(estado => estado['idestadoretiro'] == idEstado);
	// }
	// END RETIROS


	// SUSPENSIONES
	getMinDate2(date: any) {
		this.minDateSuspencion2 = new Date(date.value);
	}
	// END SUSPENSIONES


	// CREATE
	createOp() {
		let json;

		if (this.currentClase['id'] == 1) {
			json = JSON.parse(JSON.stringify(this.cambiarEstadoForm.value));
			json['idclaseoperacionservicio'] = 11;
			json['idestadosolicitudservicio'] = json['idestadosolicitudservicio']['idestadosolicitudservicio']
			this.cambiarEstadoForm.reset();
		} else if (this.currentClase['id'] == 2) {
			json = JSON.parse(JSON.stringify(this.operacionForm.value));
			json['idclaseoperacionservicio'] = 1;
			this.operacionForm.reset();
		} else if (this.currentClase['id'] == 3) {
			json = JSON.parse(JSON.stringify(this.agendaForm.value));
			json['idclaseoperacionservicio'] = 2;
			json['idserviciocuadrillaagenda'] = json['idserviciocuadrillaagenda']['idservicio'];
			this.agendaForm.reset();
		} else if (this.currentClase['id'] == 4) {
			json = JSON.parse(JSON.stringify(this.escalarForm.value));
			json['idclaseoperacionservicio'] = 4;
			json['idnivelsolicitudservicio'] = json['idnivelsolicitudservicio']['idnivelsolicitudservicio'];
			this.escalarForm.reset();
		} else if (this.currentClase['id'] == 5) {
			json = JSON.parse(JSON.stringify(this.activacionesForm.value));
			json['idclaseoperacionservicio'] = json['idtipoactivacion'];
			this.activacionesForm.reset();
		} else if (this.currentClase['id'] == 6) {
			json = JSON.parse(JSON.stringify(this.finalizarForm.value));
			json['idclaseoperacionservicio'] = 5;
			this.finalizarForm.reset();
		} else if (this.currentClase['id'] == 7) {
			json = JSON.parse(JSON.stringify(this.cancelarFinalizarForm.value));
			json['idclaseoperacionservicio'] = 9;
			json['idestadoservicio'] = json['idestadoservicio']['idestadoservicio'];
			this.cancelarFinalizarForm.reset();
		} else if (this.currentClase['id'] == 8) {
			json = JSON.parse(JSON.stringify(this.programarRetiroForm.value));
			json['idclaseoperacionservicio'] = 12;
			this.programarRetiroForm.reset();
		} else if (this.currentClase['id'] == 9) {
			this.cancelarRetiroForm.controls.idretiro.setValue(this.retiro['idretiro']);
			json = JSON.parse(JSON.stringify(this.cancelarRetiroForm.value));
			json['idclaseoperacionservicio'] = 13;
			this.cancelarRetiroForm.reset();
		} else if (this.currentClase['id'] == 10) {
			this.desinstalarEquipoForm.controls.idretiro.setValue(this.retiro['idretiro']);
			json = JSON.parse(JSON.stringify(this.desinstalarEquipoForm.value));
			json['idclaseoperacionservicio'] = 14;
			this.desinstalarEquipoForm.reset();
		} else if (this.currentClase['id'] == 11) {
			json = JSON.parse(JSON.stringify(this.programarSuspencionForm.value));
			json['idclaseoperacionservicio'] = 16;
			this.programarSuspencionForm.reset();
		} else if (this.currentClase['id'] == 12) {
			this.cancelarSuspencionForm.controls.idsuspension.setValue(this.suspension['idsuspension']);
			json = JSON.parse(JSON.stringify(this.cancelarSuspencionForm.value));
			json['idclaseoperacionservicio'] = 17;
			this.cancelarSuspencionForm.reset();
		}



		json['idserviciocuadrilla'] = this.selectedCuadrilla['idservicio']
		json['fechainicial'] = this.fechainicial;
		json['fechafinal'] = new Date().getTime();
		json['idtipooperacionservicio'] = this.currentTipo['idtipooperacionservicio'];
		json['idsolicitudservicio'] = this._route.snapshot.params.id;
		json['coordenadas'] = this.coordenadas;

		this.loading = true;
		this._api.createOperacionesServicio(json, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this._snackBar.open("Operación solicitud al servicio creada.", 'Cerrar', { duration: 3000 });
				this.getSolAndEnt();
				this.currentClase = null;
				this.currentTipo = null;
			} else {
				this.error = response['msg']
			}
			this.loading = false;
		});

	}

	//Sitema tercero en  gestión
	iniciarGestion() {
		var gestiioSoloc: gestionSolicitudes = {
			idsolicitud: this.solicitud['idsolicitudservicio'],
			// idtercero: this.user['idtercero'],
			// nombres: this.user['nombres'],
			// fechaCambio: new Date().getTime()
		}
		this.loading = true;
		this._api.tomarGestionSolicitudes(this.user['token'], { "idsolicitudservicio": this.solicitud['idsolicitudservicio'], "idtercero": this.user['idtercero'] }).subscribe(
			(respont) => {
				if (respont["code"] == 200
					|| (respont["code"] == 400
						&& respont["msg"] == "No se puede tomar una solicitud en gestión."
						//&& this.user['idtercero'] == solicitud?.idtercerogestion
					)) {
					// TODO: aqui va algo 
					this._firebaseDB.guardaRegistroGestionSolicitudes(gestiioSoloc)
					this._snackBar.open(respont["msg"] + 'Configurando...', 'Cerrar', { duration: 2000 });
					//this.loading = false;
					this.getSolAndEnt();
				} else {
					//this._snackBar.open(this.solicitud?.nombrestercerogestion + "" + this.solicitud?.apellidostercerogestion+ " esta gestionando esta solicitud", 'Cerrar', { duration: 3000 });
					this._snackBar.open(respont["msg"], 'Cerrar', { duration: 3000 });

				}
				this.loading = false;

			}
		)
	}
	finalizarGestio() {
		this.loading = true;

		this._api.terminarGestionSolicitudes(this.user['token'], { "idsolicitudservicio": this.solicitud["idsolicitudservicio"] }).subscribe(
			(respont) => {
				if (respont["code"] == 200) {
					this.arrayGestionSolic.forEach(solict => {
						if (solict['idSolictud'] == this.solicitud["idsolicitudservicio"]) {
							this._firebaseDB.removerRegistroGestionSolicitudes(solict['key']);
						}
					});
				}
				this._snackBar.open(respont["msg"] + 'Configurando...', 'Cerrar', { duration: 2000 });
				this.getSolAndEnt();
			}
		);
	}
	//End Sitema  tercero en  gestión


}
