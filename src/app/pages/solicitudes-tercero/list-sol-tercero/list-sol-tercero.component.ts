import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ApiService } from 'src/app/services/api.service'
import { VarsService } from 'src/app/services/vars.service'
import { Router } from '@angular/router';

export interface solicitudTerceroData {
	idsolicitudtercero: number,
	nombrecontacto: string,
	telefonocontacto: string,
	fechacreacion: object,
	idtercero: number,
	nombresterceros: string,
	apellidosterceros: string,
	nombreestado: string,
	descripcionestado: string,
	nombretipo: string,
	descripciontipo: string
}

@Component({
	selector: 'app-list-sol-tercero',
	templateUrl: './list-sol-tercero.component.html',
	styleUrls: ['./list-sol-tercero.component.css'],
	animations: fuseAnimations
})
export class ListSolTerceroComponent implements OnInit {

	user: object = this._vars.user.source['value'];
	loading: boolean;
	breadcrumb: string = 'Solicitudes tercero > Listar';
	estados: object[];
	tipos: object[];
	alreadySearch: boolean

	filterSearch = {
		estados: [],
		tipos: [],
		criteria: [],
		value: ''
	}


	displayedColumns: string[] = ['idsolicitudtercero', 'nombrecontacto', 'nombresterceros', 'nombretipo', 'nombreestado', 'actions'];
	dataSource: MatTableDataSource<solicitudTerceroData>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	// Paginator
	pageEvent: PageEvent;
	length: number;


	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		private _router: Router,
		private _snackBar: MatSnackBar,
	) {
		if(!this.user['permisos']['all_solicitudes_terceros']){ this._router.navigate(['/']) }
	}

	ngOnInit() {

		this._api.getEstadosTiposSolTercero(this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.estados = response['estados']
				this.tipos = response['tipos']
			} else {
				this._snackBar.open("No se pudieron cargar los tipos y estados de solicitudes de terceros.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/'])
			}
		});
	}

	getSolicitudes(event:PageEvent) {

		let filters = this.filterSearch;
		filters['page'] = event ? event.pageIndex : 0;
		filters['limit'] = event ? event.pageSize : 10;

		this.loading = true;

		this._api.getSolicitudesTerceroByCriteria(filters, this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.sort = this.sort;
				this.length = response["count"];
			} else {
				this._snackBar.open("No se pudieron cargar las solicitudes de terceros.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/'])
			}
			this.alreadySearch = true;
			this.loading = false;
		});

		return event;
	}

	search() {
		if (this.filterSearch.estados.length > 0 || this.filterSearch.tipos.length > 0 || (this.filterSearch.criteria.length > 0 && this.filterSearch.value.length > 0)) {
			this.getSolicitudes(null);
		} else {
			this._snackBar.open("No se ingresaron filtros de búsqueda.", 'Cerrar', { duration: 3000 });
		}
	}

	resetFilters() {
		this.filterSearch = { estados: [], tipos: [], criteria: [], value: '' }
	}

	changeTab(ev) {
		if (ev.index == 0) { this.breadcrumb = 'Solicitudes tercero > Listar' }
		if (ev.index == 1) { this.breadcrumb = 'Solicitudes tercero > Tipos solicitudes tercero > Listar' }
		if (ev.index == 2) { this.breadcrumb = 'Solicitudes tercero > Estados solicitudes tercero > Listar' }
	}

	selectSolicitud(idSolicitud) {
		this._router.navigate(['/solicitud-tercero/view/' + idSolicitud])
	}

}
