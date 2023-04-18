import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { SelectTerceroDialog } from 'src/app/templates/select-tercero-dialog/select-tercero-dialog';

@Component({
	selector: 'app-permisos-tercero',
	templateUrl: './permisos-tercero.component.html',
	styleUrls: ['./permisos-tercero.component.css'],
	animations: fuseAnimations
})
export class PermisosTerceroComponent implements OnInit {

	Object = Object;

	user: object = this._vars.user.source['value'];
	loading: boolean
	haveUser: boolean = true;
	usuario: object;


	traducciones = {
		dashboard: 'Dashboard',

		apps:'Apps',

		servicios: 'Servicios',
		contactos: 'Contactos',
		convenios: 'Convenios',
		excepciones: 'Excepciones',
		solicitudes: 'Solicitudes',
		operaciones: 'Operaciones',
		ip: "Ip",
		puertocaja: "Puerto Caja",
		ncajanap: "N° Caja NAP",
		serialont: "Serial ONT",
		ontid: "ONT ID",
		potcajanap: "Potencia Caja NAP",
		potont: "Portencia ONT",

		all_solicitudes_servicios: 'Solicitudes al servicio (General)',

		terceros: 'Terceros',
		acuerdos: 'Acuerdos',
		cuadrillas: 'Cuadrillas',
		direcciones: 'Direcciones',
		permisos: 'Permisos',
		actividadades: 'Actividadades',

		municipios: 'Municipios',
		informes: 'Informes',

		all_solicitudes_terceros: 'Solicitudes de Terceros (General)',

		agenda: 'Agenda',

		validar_labores: 'Validar Labores',
		labores: 'Labores',
		desplazamientos: 'Desplazamientos',
		casos_especiales: 'Casos Especiales',

		planes: 'Planes',

		retiros: 'Retiros',
		suspensiones: 'Suspensiones',
		convenios_servicios: 'Convenios de Servicios (General)',
		excepciones_servicios: 'Excepciones de Servivios (General)',
		acuerdos_pago_terceros: 'Acuerdos de Pago de Terceros (General)',

		accesos_directos_sidebar: 'Accesos Directos (Sidebar)',
		importar_est_cuenta: 'Importar Estados Cuentas',
		importar_fac_bloque: 'Importar Facturación Bloque',
		servicios_inactivos: 'Servicios Inactivos',
		act_est_activacion: 'Estados Activación Serv',

		facturacion_bloque: "Facturación Bloque",
		estados_cuentas: "Estados Cuentas",

		transacciones: "Transacciones",

		configuraciones: 'Configuraciones',
		estados_sol_terceros: 'Estados sol Terceros',
		tipos_sol_terceros: 'Tipos Sol Terceros',
		tipos_actividadades_sol_tercero: 'Tipos Actividadades Sol Terceros',
		estados_servicios: 'Estados Servicios',
		tipos_servicios: 'Tipos Servicios',
		tipos_sol_servicios: 'Tipos Sol Servicios',
		grupos_sol_servicios: 'Grupos Sol Servicios',
		clasificacion_pqr: 'Clasificación PQR',
		ont:'ONT',

		barrios: 'Barrios',

		flt_estado: 'Filtrar por Estado',
		flt_criterio: 'Filtrar por Criterio',
		flt_estados: 'Filtrar por Estados',
		flt_tipos: 'Filtrar por Tipos',
		flt_niveles: 'Filtrar por Niveles',
		flt_cuadrillas: 'Filtrar por Cuadrillas',
		flt_terceros: 'Filtrar por Tercero',
		flt_geografia: 'Filtrar por Geografía',
		flt_tipo_plan: 'Filtrar por Tipo Plan',
		flt_tipo_servicio: 'Filtrar Tipo Servicio',

		listar: 'Listar',
		ver: 'Ver',
		view_detail: 'Ver Detalle',
		crear: 'Crear',
		crear_hoy: 'Crear Hoy',
		editar: 'Editar',
		eliminar: 'Eliminar',
		calificar: 'Calificar',
		calificar_operaciones: 'Calificar Operaciones',
		calificar_soporte: 'Calificar Soportes',
		editar_cafilifacion: 'Editar calificación',
		importar: 'Importar',
		actualizar: 'Actualizar',
		listar_celulares: 'Listar Celulares',
		crear_celulares: 'Crear Celulares',
		eliminar_celulares: 'Eliminar Celulares',
		establecer_ppal: 'Establecer Principal',
		plan: 'Plan',
		tercero: 'Tercero',
		direccion: 'Dirección',
		activaciones: 'Activaciones',
		finalizar: 'Finalizar',
		cancelar_finalizar: 'Cancelar y finalizar',
		cancelar: 'Cancelar',
		finalizar_grupos: 'Finalizar (Grupos)',
		cancelar_finalizar_grupos: 'Cancelar y finalizar (Grupos)',
		facturacion: 'Facturación',
		inventario: 'Inventario',
		marketing: 'Marketing',
		modificaciones: 'Modificaciones',
		recaudo_cartera: 'Recaudo y cartera',
		servicio_cliente: 'Servicio al cliente',
		soporte_tecnico: 'Soporte técnico',
		ventas: 'Ventas',
		cambiar_estado: 'Cambiar estado',
		programar_cancelar: 'Programar/Cancelar',
		desintalar_equipo: 'Desintalar equipo',
		validarDoc: 'Validar documentos labores',
		generar_reporte: 'Generar reporte',
		asociar: 'Asociar',
		desasociar: 'Desasociar',
		ont_info:'Info ONT',

		vendedor: 'Vendedor',
		validador_preventa: 'Validador Preventa',      
		validador_postventa: 'Validador Postventa',      
	}

	permisos = {
		dashboard: {
			retiros: { ver: null },
			labores: { ver: null },
			ventas: { ver: null },
		},
		apps:{
			ventas: { vendedor: null, validador_preventa: null, validador_postventa: null }
		},
		servicios: {
			listar: { flt_estado: null, flt_criterio: null },
			crear: { crear: null },
			editar: { plan: null, tercero: null, direccion: null, ip: null, puertocaja: null, ncajanap: null, serialont: null, ontid: null, potcajanap: null, potont: null, },
			solicitudes: { listar: null, view_detail: null, crear: null },
			contactos: { listar: null, crear: null, editar: null, eliminar: null },
			convenios: { listar: null, crear: null, editar: null, eliminar: null },
			excepciones: { listar: null, crear: null, editar: null, eliminar: null },
			ont: { ont_info: null },
		},
		operaciones: {
			listar: {listar: null},
			crear: {crear: null},
			finalizar_grupos: {facturacion: null, inventario:null, marketing:null, modificaciones:null, operaciones:null, recaudo_cartera:null, servicio_cliente:null, soporte_tecnico:null, ventas:null},
			cancelar_finalizar_grupos: {facturacion: null, inventario:null, marketing:null, modificaciones:null, operaciones:null, recaudo_cartera:null, servicio_cliente:null, soporte_tecnico:null, ventas:null},
			activaciones: {activaciones: null},
			retiros: {programar_cancelar: null, desintalar_equipo: null},
			suspensiones: {programar_cancelar: null},
		},
		all_solicitudes_servicios: {
			listar: { flt_estados: null, flt_tipos: null, flt_niveles: null },
		},
		terceros: {
			listar: { listar: null },
			crear: { crear: null },
			editar: { editar: null },
			servicios: { listar: null },
			acuerdos: { listar: null, crear: null, crear_hoy: null, editar: null, eliminar: null },
			solicitudes: { listar: null, view_detail: null, crear: null },
			actividadades: { listar: null, crear: null },
			cuadrillas: { listar: null, crear: null, eliminar: null, listar_celulares: null, crear_celulares: null, eliminar_celulares: null },
			direcciones: { listar: null, crear: null, editar: null, establecer_ppal: null, eliminar: null },
			permisos: { listar: null, editar: null },
		},
		all_solicitudes_terceros: {
			listar: { flt_estados: null, flt_tipos: null, flt_criterio: null },
		},
		agenda: {
			listar: { flt_estados: null, flt_cuadrillas: null, flt_terceros: null },
			cancelar: {cancelar: null}
		},
		validar_labores: {
			labores: { listar: null, editar: null, validarDoc:null, calificar_operaciones: null, calificar_soporte: null, editar_cafilifacion: null },
			desplazamientos: { listar: null, editar: null, calificar: null, editar_cafilifacion: null },
			casos_especiales: { listar: null, calificar: null, editar_cafilifacion: null },
		},
		planes: {
			listar: { flt_geografia: null, flt_tipo_plan: null, flt_tipo_servicio: null },
			crear: { crear: null },
			editar: { editar: null },
			eliminar: { eliminar: null },
		},
		retiros: {
			listar: { listar: null, cambiar_estado:null }
			
		},
		suspensiones: {
			listar: { listar: null }
		},
		convenios_servicios: {
			listar: { listar: null, eliminar: null }
		},
		excepciones_servicios: {
			listar: { listar: null, eliminar: null }
		},
		acuerdos_pago_terceros: {
			listar: { listar: null, eliminar: null }
		},
		facturacion_bloque: {
			listar: { listar: null }
		},
		estados_cuentas: {
			listar: { listar: null }
		},
		transacciones: {
			listar: { listar: null }
		},
		municipios: {
			municipios: { listar: null},
			barrios: {listar: null, crear:null, editar:null, eliminar:null},
			planes: {listar: null, asociar:null, desasociar:null},
		},
		informes: {
			desplazamientos: { ver: null},

		},
		
		accesos_directos_sidebar: {
			importar_est_cuenta: { importar: false },
			importar_fac_bloque: { importar: false },
			servicios_inactivos: { listar: false },
			act_est_activacion: { actualizar: false },
			transacciones: { generar_reporte: false },
		},
		configuraciones: {
			estados_sol_terceros: { listar: false },
			tipos_sol_terceros: { listar: false },
			estados_servicios: { listar: false },
			tipos_servicios: { listar: false },
			tipos_actividadades_sol_tercero: { listar: false },
			tipos_sol_servicios: { listar: false },
			grupos_sol_servicios: { listar: false },
			clasificacion_pqr: { listar: false },
		},
	};


	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		private _router: Router,
		private _route: ActivatedRoute,
		public _dialog: MatDialog,
	) { }

	ngOnInit() {

		this.loading = true;

		this._api.GetPermisosUsuariosByTercero(this._route.params['_value']['id'], this.user['token']).subscribe(response => {
			if (response['code'] == 200) {

				this.usuario = response['data'];

				if (this.usuario['permisos']) {
					this.usuario['permisos'] = JSON.parse(this.usuario['permisos']);
				
					this.usuario['permisos'].forEach(el => {
						let split = el.split('.');
						if (this.permisos.hasOwnProperty(split[0])) {
							if (this.permisos[split[0]].hasOwnProperty(split[1])) {
								if (this.permisos[split[0]][split[1]].hasOwnProperty(split[2])) {
									this.permisos[split[0]][split[1]][split[2]] = true;
								}
							}
						}
					});
				}

			} else if (response['code'] == 401) {
				this.haveUser = false;
			} else {
				this._snackBar.open("No se pudieron cargar los persmisos del tercero.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/']);
			}
			this.loading = false;
		});

	}


	copy() {
		const dialogRef = this._dialog.open(SelectTerceroDialog, { width: '80%', data: { onlyEmployees: true } });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {

				let json = {
					idtercerofrom: result['idtercero'],
					idterceroto: this.user['idtercero'],
				}

				this._api.copyPermisosUsuarios(json, this.user['token']).subscribe(response => {
					if (response['code'] == 200) {
						this._snackBar.open("Permisos copiados.", 'Cerrar', { duration: 3000 });
					} else {
						this._snackBar.open("No se pudieron copiar los permisos del tercero.", 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}


	save() {
		if (this.user['permisos']['terceros']['permisos']['editar']) {
			if (this.usuario) {

				this.loading = true;
				let permisos = JSON.parse(JSON.stringify(this.permisos));
				let arr = [];

				Object.keys(permisos).forEach(function (key) {
					Object.keys(permisos[key]).forEach(function (key2) {
						Object.keys(permisos[key][key2]).forEach(function (key3) {
							if (permisos[key][key2][key3]) { arr.push(key + '.' + key2 + '.' + key3); }
						});
					});
				});

				let json = { idusuario: this.usuario['idusuario'], permisos: arr };

				this._api.editPermisosUsuarios(json, this.user['token']).subscribe(response => {
					if (response['code'] == 200) {
						this._snackBar.open("Permisos editados.", 'Cerrar', { duration: 3000 });
					} else {
						this._snackBar.open("No se pudieron editar los permisos del tercero.", 'Cerrar', { duration: 3000 });
					}

					this.loading = false;

				});
			}
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}


}
