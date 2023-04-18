import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { Router } from '@angular/router';
import { InfoEstadoActivacionDialog } from 'src/app/templates/info-estado-activacion-dialog/info-estado-activacion-dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SoporteTecnicoModalComponent } from 'src/app/commons/components/ont-information/soporte-tecnico-modal/soporte-tecnico-modal.component';
import { log } from 'console';

export interface ServiciosData {
	idservicio: number,
	numeroservicio: number,
	fechacreacion: object,
	descripciondireccion: string,
	barrio: string,
	municipio: string,
	departamento: string,
	nombreestado: string,
	descripcionestado: string,
	nombretipo: string,
	descripciontipo: string,
	idplan: number,
	nombreplan: string,
	descripcionplan: string,
	idtercero: number,
	identificacion: number,
	nombrestercero: string,
	apellidostercero: string,
	numerotercero: number,
	estadoactivacion: boolean;
}

@Component({
	selector: 'app-list-servicios',
	templateUrl: './list-servicios.component.html',
	styleUrls: ['./list-servicios.component.css'],
	animations: fuseAnimations
})
export class ListServiciosComponent implements OnInit {


	user: object = this._vars.user.source['value'];
	loading: boolean;
	alreadySearch: boolean
	estadosServicios: object[];
	criterios: object[] = [
		{
			ideCriterio:'nservicio',
			nombre:'N° servicio',
			descripcion:'',
		},
		{
			ideCriterio:'identificacion',
			nombre:'Identificación',
			descripcion:'',
		},
		{
			ideCriterio:'ip',
			nombre:'IP',
			descripcion:'',
		},
		{
			ideCriterio:'ntercero',
			nombre:'N° tercero',
			descripcion:'',
		},
		{
			ideCriterio:'nombres',
			nombre:'Nombres',
			descripcion:'',
		},
		{
			ideCriterio:'apellidos',
			nombre:'Apellidos',
			descripcion:'',
		},
		{
			ideCriterio:'municipio',
			nombre:'Municipio',
			descripcion:'',
		}
	]


	formFiltros = this._fb.group({
		status: [],
		criteria: [],
		value: ''

	})
	filterSearch = {
		status: [],
		criteria: [],
		value: ''
	}

	filterSearchParams = {
		idestadoservicio: [],
		idtiposervicio: [],
		idplan: [],
		idtercero: [],
	}

	// Paginator
	pageEvent: PageEvent;
	length: number;

	// displayedColumns: string[] = ['numero', 'estado', 'tipo', 'plan', 'tercero', 'fechacreacion', 'actions'];
	displayedColumns: string[] = ['numeroservicio', 'nombreestado', 'estadoactivacion', 'nombreplan', 'ip', 'descripciondireccion', 'municipio', 'fechacreacion', 'nombrestercero', 'identificacion', 'actions'];
	dataSource: MatTableDataSource<ServiciosData>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;


	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		public _dialog: MatDialog,
		private _snackBar: MatSnackBar,
		private _router: Router,
		private _fb: FormBuilder,
	) {
		if (!this.user['permisos']['servicios']['listar']) { this._router.navigate(['/']) }
	}

	ngOnInit() {
		this._api.getEstadosServicios(this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.estadosServicios = response['data'];
			} else {
				this._snackBar.open("No se pudieron cargar los estados de servicios.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/'])
			}
		});
	}


	selectTodo(formGrup: FormGroup, control: string, items: any[], id: string) {
		let itemsSlect = this._vars.selectTodo(formGrup, control, items, id);
		itemsSlect.pop();
		this.formFiltros.controls[control].setValue(itemsSlect);
		this.filterSearch[control]= itemsSlect
		
	}
	getServicios(event?: PageEvent) {
		let filters = this.filterSearch;
		filters['page'] = event ? event.pageIndex : 0;
		filters['limit'] = event ? event.pageSize : 10;

		this.loading = true;

		this._api.searchServicioByCriteria(filters, this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.sort = this.sort;
				this.length = response["count"];
			} else {
				this._snackBar.open("No se pudieron cargar los servicios.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/'])
			}
			this.alreadySearch = true;
			this.loading = false;
		});

		return event
	}


	search() {
		if (this.filterSearch.status.length > 0 || (this.filterSearch.criteria.length > 0 && this.filterSearch.value.length > 0)) {
			this.getServicios();
		} else {
			this._snackBar.open("No se ingresaron filtros de búsqueda.", 'Cerrar', { duration: 3000 });
		}
	}

	resetFilters() {
		this.filterSearch = { status: [], criteria: [], value: '' }
	}


	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	selectServicio(idServicio) {
		this._router.navigate(['/servicio/' + idServicio])
	}

	getInfoEstadoActivacion(servicio) {
		this._dialog.open(InfoEstadoActivacionDialog, { width: '80%', data: servicio['idservicio'] });
	}

	openOntInformation(row){	
		
		if (this.user['permisos']['servicios']['ont']['ont_info']) {
			if(row.ip && row.idtecnologiaplan == 2){
				this._dialog.open(SoporteTecnicoModalComponent, { width: '80%', data: {
					noService: row.numeroservicio,
					ipService: row.ip,
					city: row.municipio.toUpperCase()
				}});
			}
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
		
	}

}
