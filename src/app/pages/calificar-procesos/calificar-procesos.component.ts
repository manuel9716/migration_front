import { Component, OnInit, ViewChild } from '@angular/core';;
import { fuseAnimations } from 'src/app/animations/custom.animation';

//Template 
import { SelectCuadrillaDialog } from 'src/app/templates/select-cuadrilla-dialog/select-cuadrilla-dialog'
import { calificarLaborDialog } from 'src/app/templates/calificar-labor-dialog/calificar-labor-dialog'
import { InfoOperacionServicioDialog } from 'src/app/templates/info-operacion-servicio-dialog/info-operacion-servicio-dialog';
import { EditarCasoEspecialDialog } from 'src/app/templates/editar-caso-especial-dialog/editar-caso-especial-dialog';
import { EditarLaborDialog } from 'src/app/templates/editar-labor-dialog/editar-labor-dialog';


import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { EditLaboresDialog } from 'src/app/templates/edit-labores-dialog/edit-labores-dialog';
import { ValidardocumentLarboresDialog } from 'src/app/templates/validar-document-labores-dialog/validar-document-labores-dialog';
import { EditarDeplazamientoDialog } from 'src/app/templates/editar-deplazamiento-dialog/editar-deplazamiento-dialog';
import { EstadosPendienteLaboresDialog } from 'src/app/templates/estados-pendiente-labores-dialog/estados-pendiente-labores-dialog';


export interface LaboresData {
	idlaborop: number,
	justificacion: string,
	fechacreacion: object,
	idlabor: number,
	idoperacionservicio: number,
	nombreestado: string,
	idestadolabor: number,
	nombrelabor: string,
	nombretipooperacion: string,
	idservicio: number,
	numeroservicio: number
}

export interface DesplazamientosData {
	iddesplazamientocuadrilla: number,
	fechacreacion: object,
	justificacion: string,
	kilometros: number,
	tiempo: number,
	nombremunicipioinicio: string,
	nombremunicipiofin: string,
	nombreestado: string,
	idestadolabor: number,
	idoperacionservicio: number,
	idservicio: number,
	numeroservicio: number
}

export interface CasosEspecialesData {
	idcasoespeciales: number,
	descripcion: string,
	tiempo: number,
	fechacreacion: object,
	justificacion: string,
	nombreestado: string,
	idestadolabor: number,
	idoperacionservicio: number,
	idservicio: number,
	numeroservicio: number
}

@Component({
	selector: 'app-calificar-procesos',
	templateUrl: './calificar-procesos.component.html',
	styleUrls: ['./calificar-procesos.component.css'],
	animations: fuseAnimations
})
export class CalificarProcesosComponent implements OnInit {

	user: object = this._vars.user.source['value'];

	filters: object = {
		idestadodocumento: [],
		idCuadrilla: null,
		fecha: null,
		estadolabor: [1],
		categorialabor: [],
		numeroservicio: null,
	}

	loading: boolean = true;
	currentTab: number = 0;

	tabs: object[] = [];
	estadosLabores: object[];
	estadosValidcioDocumentos : object[];
	estadosValidcioDocumentosForm : object[]= [];


	alreadySearchLabores: boolean;
	alreadySearchDesplazamientos: boolean;
	alreadySearchCasosEspeciales: boolean;

	// LABORES
	displayedColumnsLabores: string[] = ['nombrelabor', 'tiempolabor', 'nombreestado', 'nombretipooperacion', 'idoperacionservicio', 'numeroservicio', 'categorialabor', 'fechamodificacion', 'validaciondocumento','action'];
	dataSourceLabores: MatTableDataSource<LaboresData>;
	@ViewChild('table1', { read: MatSort, static: true }) sort1: MatSort;
	@ViewChild('paginatorLabor', { static: true }) paginatorLabor: MatPaginator;
	// @ViewChild('sortLabor', { static: true }) sortLabor: MatSort;


	//DESPLAZAMIENTOS
	displayedColumnsDesplazamientos: string[] = ['nombremunicipioinicio', 'nombreestado', 'idoperacionservicio', 'numeroservicio', 'fechacreacion', 'action'];
	dataSourceDesplazamientos: MatTableDataSource<DesplazamientosData>;
	@ViewChild('table2', { read: MatSort, static: true }) sort2: MatSort;
	@ViewChild('paginatorDesplazamiento', { static: true }) paginatorDesplazamiento: MatPaginator;
	// @ViewChild('sortDesplazamiento', { static: true }) sortDesplazamiento: MatSort;

	//CASOS ESPECIALES
	displayedColumnsCasosEspeciales: string[] = ['descripcion', 'tiempo', 'nombreestado', 'idoperacionservicio', 'numeroservicio', 'fechacreacion'];
	dataSourceCasosEspeciales: MatTableDataSource<CasosEspecialesData>;
	@ViewChild('table3', { read: MatSort, static: true }) sort3: MatSort;
	@ViewChild('paginatorCasos', { static: true }) paginatorCasos: MatPaginator;
	// @ViewChild('sortCasos', { static: true }) sortCasos: MatSort;

	// @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	// @ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		public _dialog: MatDialog,
		private _snackBar: MatSnackBar,
		private _router: Router,

	) {
		if (!this.user['permisos']['validar_labores']) { this._router.navigate(['/']) }
	}

	changeTab(ev) {
		this.currentTab = ev.index;
		this.loading = false;
	}

	ngOnInit() {

		this._api.getEstadosLabores(this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.estadosLabores = response['data'];
			} else {
				this._snackBar.open('No se pudieron cargar los estados de labores.', 'Cerrar', { duration: 3000 });
			}
			this.loading = false;
		});

		this.tabs= [
			{ name: 'Labores', permiso: 'labores' },
			{ name: 'Desplazamientos', permiso: 'desplazamientos' },
			{ name: 'Casos Especiales', permiso: 'casos_especiales' },
		]

		this._api.getListEstadosValidacionDocumentoLabores(this.user['token']).subscribe(
			response=>{
				if (response['code'] == 200) {
					this.estadosValidcioDocumentos = response['data'];
					this.estadosValidcioDocumentos.forEach((estado, index) => {
						if (index<=2){
							this.estadosValidcioDocumentosForm.push(estado);
						}
					});
					
				} else {
					this._snackBar.open('No se pudieron cargar los estados de validación de documentos.', 'Cerrar', { duration: 3000 });
				}
				this.loading = false;
			}
		)
		// tabs.forEach(tab => {
		// 	if (this.user['permisos']['validar_labores'][tab['permiso']] && this.user['permisos']['validar_labores'][tab['permiso']]['listar']) {
		// 		this.tabs.push(tab);
		// 	}
		// });

	}
	// EstadosPendienteLaboresDialog
	obtenerestadoDoc(id: number){
		var estadNombre= 'Null'
		this.estadosValidcioDocumentos.forEach(estado => {
			if (estado['idestadodocumento']==id){
				estadNombre=estado['nombre']
			}
		});
		return  estadNombre

	}

	calificar(item: object) {

		// if (item['idestadolabor'] == 1 || (item['idestadolabor'] > 1 && this.user['permisos']['validar_labores']['labores']['editar_cafilifacion'])) {

		// LABORES
		if (item.hasOwnProperty('idlaborop')) {

			if ((item['idestadolabor'] == 1 || (item['idestadolabor'] > 1 && this.user['permisos']['validar_labores']['labores']['editar_cafilifacion']))) {

				if ((this.user['permisos']['validar_labores']['labores']['calificar_operaciones'] && item['categorialabor'] == 'Operaciones') ||
					(this.user['permisos']['validar_labores']['labores']['calificar_soporte'] && item['categorialabor'] == 'Soporte')) {

					const dialogRef = this._dialog.open(calificarLaborDialog, { width: '50%', data: item });
					dialogRef.afterClosed().subscribe(result => {
						if (result) {
							item['idestadolabor'] = result.idestadolabor;
							item['justificacion'] = result.justificacion;
							this._api.qualifyLaboresOp(item, this.user['token']).subscribe(response => {
								if (response['code'] == 200) {
									this._snackBar.open("Labor calificada.", 'Cerrar', { duration: 3000 });
									this.search();
								} else {
									this._snackBar.open("No se pudo calificar la labor.", 'Cerrar', { duration: 3000 });
								}
							});
						}
					});
				} else {
					this._snackBar.open('No tienes permiso para calificar labores de esta categoría.', 'Cerrar', { duration: 3000 });
				}
			} else {
				this._snackBar.open('No tienes permiso para editar calificaciones.', 'Cerrar', { duration: 3000 });
			}
		}

		// DESPLAZAMIENTOS
		if (item.hasOwnProperty('iddesplazamientocuadrilla')) {

			if ((item['idestadolabor'] == 1 || (item['idestadolabor'] > 1 && this.user['permisos']['validar_labores']['desplazamientos']['editar_cafilifacion']))) {

				if (this.user['permisos']['validar_labores']['desplazamientos']['calificar']) {

					const dialogRef = this._dialog.open(calificarLaborDialog, { width: '50%', data: item });
					dialogRef.afterClosed().subscribe(result => {
						if (result) {
							item['idestadolabor'] = result.idestadolabor;
							item['justificacion'] = result.justificacion;
							this._api.qualifyDesplazamientoCuadrilla(item, this.user['token']).subscribe(response => {
								if (response['code'] == 200) {
									this._snackBar.open("Desplazamiento calificado.", 'Cerrar', { duration: 3000 });
									this.search();
								} else {
									this._snackBar.open("No se pudo calificar el desplazamiento.", 'Cerrar', { duration: 3000 });
								}
							});
						}
					});

				} else {
					this._snackBar.open('No tienes permiso para calificar desplazamientos.', 'Cerrar', { duration: 3000 });
				}
			} else {
				this._snackBar.open('No tienes permiso para editar calificaciones.', 'Cerrar', { duration: 3000 });
			}
		}

		// CASOS ESPECIALES
		if (item.hasOwnProperty('idcasoespeciales')) {

			if ((item['idestadolabor'] == 1 || (item['idestadolabor'] > 1 && this.user['permisos']['validar_labores']['casos_especiales']['editar_cafilifacion']))) {

				if (this.user['permisos']['validar_labores']['casos_especiales']['calificar']) {

					const dialogRef = this._dialog.open(calificarLaborDialog, { width: '50%', data: item });
					dialogRef.afterClosed().subscribe(result => {
						if (result) {
							item['idestadolabor'] = result.idestadolabor;
							item['justificacion'] = result.justificacion;
							this._api.qualifyCasoEpecial(item, this.user['token']).subscribe(response => {
								if (response['code'] == 200) {
									this._snackBar.open("Caso especial calificado.", 'Cerrar', { duration: 3000 });
									this.search();
								} else {
									this._snackBar.open("No se pudo calificar el caso especial.", 'Cerrar', { duration: 3000 });
								}
							});
						}
					});
				} else {
					this._snackBar.open('No tienes permiso para calificar casos especiales.', 'Cerrar', { duration: 3000 });
				}
			} else {
				this._snackBar.open('No tienes permiso para editar calificaciones.', 'Cerrar', { duration: 3000 });
			}
		}


		// dialogRef.afterClosed().subscribe(result => {
		// 	if (result) {

		// 		item['idestadolabor'] = result.idestadolabor;
		// 		item['justificacion'] = result.justificacion;

		// 		if (item.hasOwnProperty('idlaborop')) {
		// 			if (this.user['permisos']['validar_labores']['labores']['calificar']) {
		// 				this._api.qualifyLaboresOp(item, this.user['token']).subscribe(response => {
		// 					if (response['code'] == 200) {
		// 						this._snackBar.open("Labor calificada.", 'Cerrar', { duration: 3000 });
		// 						this.search();
		// 					} else {
		// 						this._snackBar.open("No se pudo calificar la labor.", 'Cerrar', { duration: 3000 });
		// 					}
		// 				});
		// 			} else {
		// 				this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		// 			}
		// 		}

		// 		if (item.hasOwnProperty('iddesplazamientocuadrilla')) {
		// 			if (this.user['permisos']['validar_labores']['desplazamientos']['calificar']) {
		// 				this._api.qualifyDesplazamientoCuadrilla(item, this.user['token']).subscribe(response => {
		// 					if (response['code'] == 200) {
		// 						this._snackBar.open("Desplazamiento calificado.", 'Cerrar', { duration: 3000 });
		// 						this.search();
		// 					} else {
		// 						this._snackBar.open("No se pudo calificar el desplazamiento.", 'Cerrar', { duration: 3000 });
		// 					}
		// 				});
		// 			} else {
		// 				this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		// 			}
		// 		}

		// 		if (item.hasOwnProperty('idcasoespeciales')) {
		// 			if (this.user['permisos']['validar_labores']['casos_especiales']['calificar']) {
		// 				this._api.qualifyCasoEpecial(item, this.user['token']).subscribe(response => {
		// 					if (response['code'] == 200) {
		// 						this._snackBar.open("Caso especial calificado.", 'Cerrar', { duration: 3000 });
		// 						this.search();
		// 					} else {
		// 						this._snackBar.open("No se pudo calificar el caso especial.", 'Cerrar', { duration: 3000 });
		// 					}
		// 				});
		// 			} else {
		// 				this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		// 			}
		// 		}
		// 	}
		// });


	}

	resetFilters() {
		this.filters = {
			idestadodocumento: [],
			idCuadrilla: null,
			fecha: null,
			estadolabor: [1],
			categorialabor: [],
			numeroservicio: null,
		}
	}

	search() {

		this.loading = true;

		let filters = JSON.parse(JSON.stringify(this.filters));
		filters['idCuadrilla'] = filters['idCuadrilla'].idservicio;


		if (filters.fecha) {
			let d = new Date(filters.fecha);
			filters.fecha = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
		}

		// if (this.tabs[this.currentTab]['permiso']  == 'labores') {
		if (this.user['permisos']['validar_labores']['labores']['listar']) {
			this._api.getLaboresOpByCuadrilla(filters, this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
					this.dataSourceLabores = new MatTableDataSource(response["data"]);
					this.dataSourceLabores.paginator = this.paginatorLabor;
					this.dataSourceLabores.sort = this.sort1;
				} else {
					this._snackBar.open("No se pudieron obtener las labores.", 'Cerrar', { duration: 3000 });
				}
				this.alreadySearchLabores = true;
				this.loading = false;
			});
		}


		// if (this.tabs[this.currentTab]['permiso']  == 'desplazamientos') {
		if (this.user['permisos']['validar_labores']['desplazamientos']['listar']) {
			this._api.getDesplazamientosByCuadrilla(filters, this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
					this.dataSourceDesplazamientos = new MatTableDataSource(response["data"]);
					this.dataSourceDesplazamientos.paginator = this.paginatorDesplazamiento;
					this.dataSourceDesplazamientos.sort = this.sort2;
				} else {
					this._snackBar.open("No se pudieron obtener los desplazamientos.", 'Cerrar', { duration: 3000 });
				}
				this.alreadySearchDesplazamientos = true;
				this.loading = false;
			});
		}


		// if (this.tabs[this.currentTab]['permiso']  == 'casos_especiales') {
		if (this.user['permisos']['validar_labores']['casos_especiales']['listar']) {
			this._api.getCasosEspecialesByCuadrilla(filters, this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
					this.dataSourceCasosEspeciales = new MatTableDataSource(response["data"]);
					this.dataSourceCasosEspeciales.paginator = this.paginatorCasos;
					this.dataSourceCasosEspeciales.sort = this.sort3;
				} else {
					this._snackBar.open("No se pudieron obtener los casos especiales.", 'Cerrar', { duration: 3000 });
				}
				this.alreadySearchCasosEspeciales = true;
				this.loading = false;
			});
		}

	}

	selectCuadrilla() {
		const dialogRef = this._dialog.open(SelectCuadrillaDialog, { width: '80%' });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.filters['idCuadrilla'] = result;
				this.search();
			}
		});
	}

	editarDesplazamientos(desplazamientoActual) {
		const dialogRef = this._dialog.open(EditarDeplazamientoDialog,{data:{desplzamiento: desplazamientoActual }, width: '40%' });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				// this.filters['idCuadrilla'] = result;
				this.search();
			}
		});
	}
	mostrarDetallesPendientesLabor(desplazamientoActual) {
		const dialogRef = this._dialog.open(EstadosPendienteLaboresDialog,{data:{estados: this.estadosValidcioDocumentos, labor: desplazamientoActual}, width: '25%' });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				// this.filters['idCuadrilla'] = result;
				this.search();
			}
		});
	}

	editarLabor() {
		const dialogRef = this._dialog.open(EditLaboresDialog, { 
			width: '40%',
			data: {labores: ['op1', 'op2', 'op3','op4', 'op5', 'op6'], }
	 });

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.filters['idCuadrilla'] = result;
				this.search();
			}
		});
	}

	validarEstadoDocumento(laborInst) {
		const dialogRef = this._dialog.open(ValidardocumentLarboresDialog, { 
			width: '40%',
			data: {estados: this.estadosValidcioDocumentos, labor: laborInst}
	 });

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				// this.filters['idCuadrilla'] = result;
				this.search();
			}
		});
	}

	viewDetails(row) {
		const dialogRef = this._dialog.open(InfoOperacionServicioDialog, { width: '80%', data: row['idoperacionservicio'] });
		dialogRef.afterClosed().subscribe(result => {
			if (result) { this.search(); }
		});
	}

	editCasoEspecial(item: object) {
		const dialogRef = this._dialog.open(EditarCasoEspecialDialog, { width: '50%', data: item });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				item['tiempo'] = result;
			}
		});
	}

	editLabor(item: object){
		
		if(this.user['permisos']['validar_labores']['labores']['editar'] || item['idestadolabor'] == 1){
			const dialogRef = this._dialog.open(EditarLaborDialog, { width: '60%', data: item });
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.search()
				}
			});
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}

}
