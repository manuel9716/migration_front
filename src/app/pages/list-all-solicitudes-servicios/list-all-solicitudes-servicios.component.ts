import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { Router } from '@angular/router';
import { SelectTipoSolicitudDialog } from 'src/app/templates/select-tipo-solicitud-dialog/select-tipo-solicitud-dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServiciosData } from '../servicios/list-servicios/list-servicios.component';
import { FireBaseGestionSolicitudesApiService } from 'src/app/services/fire-base-gestion-solicitudes-api.service';
import { Subscription } from 'rxjs';


import { SoporteTecnicoModalComponent } from 'src/app/commons/components/ont-information/soporte-tecnico-modal/soporte-tecnico-modal.component';
import { log } from 'console';

// export interface TercerosData {
// 	idtercero: number;
// 	numerotercero: number;
// 	nombres: string;
// 	apellidos: string;
// 	identificacion: string;
// }

export interface TercerosData {
	idmunicipio: number;
	nombre: string;
	descripcion: string;
}


@Component({
	selector: 'app-list-all-solicitudes-servicios',
	templateUrl: './list-all-solicitudes-servicios.component.html',
	styleUrls: ['./list-all-solicitudes-servicios.component.css'],
	animations: fuseAnimations
})
export class ListAllSolicitudesServiciosComponent implements OnInit, OnDestroy {

	solicitudesActuales = [];
	fireBasesucripcion: Subscription;
	user = this._vars.user.source['value'];
	loading: boolean;
	formConsulta = this._fb.group(
		{
			estados: ['',],
			estadosservicios: ['',],
			tipos: ['',],
			niveles: ['',],
			municipios:['',],
		}
	)


	filtersData: object = {
		estados: [],
		// tipos: [],
		niveles: [],
		estadosservicios: [],
		municipios:[],
	}

	searchCriteria: object = {
		estados: [],
		estadosservicios: [],
		tipos: [],
		niveles: [],
		municipios:[],

	}

	tiposGrupos: object;


	// Paginator
	pageEvent: PageEvent;
	length: number;

	displayedColumns: string[] = ['idsolicitudservicio', 'nombreestado', 'nombretipo', 'nombrenivel', 'numeroservicio', 'ip', 'nombreestadoservicio', 'nombreplan', 'direccion', 'municipiodireccion', 'nombrestercero', 'fechacreacion', 'fechamodificacion', 'actions'];
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		private _router: Router,
		public _dialog: MatDialog,
		private _fb: FormBuilder,
		private _firebaseDB: FireBaseGestionSolicitudesApiService,

	) {
		if (!this.user['permisos']['all_solicitudes_servicios']) { this._router.navigate(['/']) }
	}

	selecTodoFuntion(formGrup: FormGroup, control: string, items: any[], id: string) {
		let itemsSlect = this._vars.selectTodo(formGrup, control, items, id);
		this.formConsulta.controls[control].setValue(itemsSlect);
		// --- Data
		itemsSlect.pop();
		this.searchCriteria[control] = itemsSlect;
	}
	selecData() {

	}


	ngOnInit() {

		this._api.getEntitiesListSolicitudesServicio(this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.filtersData['estados'] = response['estados'];
				this.filtersData['estadosservicios'] = response['estadosservicios'];
				this.filtersData['niveles'] = response['niveles'];
				// this.filtersData['municipios'].push({
				// 	idmunicipio: 1,
				// 	nombre: 'Municipio1',
				// 	descripcion: 'dtas data ',
				// }
				// );
				// this.filtersData['municipios'].push({
				// 	idmunicipio: 2,
				// 	nombre: 'Municipio2',
				// 	descripcion: 'dtas s data ',
				// }
				// );
				this.filtersData['municipios']=response['municipios'];

				this.tiposGrupos = {
					tipos: response['tipos'],
					grupos: response['grupos']
				}
				// this.filtersData['tipos'] = response['tipos'];

				if (this.user['permisos']['all_solicitudes_servicios']['listar']['flt_estados']) {
					this.searchCriteria['estados'] = [1];
				}
				this.search(null, true);

			} else {
				this._snackBar.open("No se pudieron obtener las entidades de filtros.", 'Cerrar', { duration: 3000 });
			}
		});
		this.fireBasesucripcion = this._firebaseDB.escucharCambiosLista().subscribe(actions => {
				// var arrayGestionSolic = []
			this.solicitudesActuales.forEach(solicitudes => {
				if (solicitudes['idsolicitudservicio'] == actions.payload.val().idsolicitud) {
					this._snackBar.open("La solicitud " + solicitudes['idsolicitudservicio'] + " ha sido " + (actions.type=='child_added' ? "tomada" : "liberada") , 'Cerrar', { duration: 3000 });
					this.search(null, true);
				}
			});
		})

	}

	ngOnDestroy(){
		this.fireBasesucripcion.unsubscribe()
	}

	filterTipos() {

		let data = {
			tipos: this.tiposGrupos['tipos'],
			grupos: this.tiposGrupos['grupos'],
			ids: this.searchCriteria['tipos']
		};

		const dialogRef = this._dialog.open(SelectTipoSolicitudDialog, {
			width: '90%',
			data: data
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.searchCriteria['tipos'] = result
			}
		});
	}


	resetFilters() {
		this.searchCriteria = { estados: [], estadosservicios: [], tipos: [], niveles: [], municipios:[] };
		this.formConsulta.reset();
	}


	search(event?: PageEvent, ls?: boolean) {

		this.loading = true;

		if (ls) {
			if (localStorage.getItem('all-sols-serv')) {
				this.searchCriteria = JSON.parse(localStorage.getItem('all-sols-serv'));
			}
		} else {
			this.searchCriteria['page'] = event ? event.pageIndex : 0;
			this.searchCriteria['limit'] = event ? event.pageSize : 10;
			localStorage.setItem('all-sols-serv', JSON.stringify(this.searchCriteria));
		}

		this._api.getAllSolicitudesServicio(this.searchCriteria, this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.solicitudesActuales = response["data"];
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.sort = this.sort;
				this.length = response["count"];

			} else {
				this._snackBar.open("No se pudo consultar las solicitudes de servicios.", 'Cerrar', { duration: 3000 });
			}
			this.loading = false;
		});

		return event;

	}

	selectSolicitud(solicitud) {
		this._router.navigate(['/solicitud-servicio/ver/' + solicitud.idsolicitudservicio])
	}

	openOntInformation(row){	
		if (this._vars.getProp(this.user['permisos'],"servicios.ont.ont_info")) {
			if(row.ip && row.idtecnologiaplan == 2){
				this._dialog.open(SoporteTecnicoModalComponent, { width: '80%', data: {
					noService: row.numeroservicio,
					ipService: row.ip,
					city: row.municipiodireccion.toUpperCase()
				}});
			}
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}
}
