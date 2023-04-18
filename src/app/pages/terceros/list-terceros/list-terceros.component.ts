import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { Router } from '@angular/router';

export interface TercerosData {
	idtercero: number;
	numerotercero: number;
	nombres: string;
	apellidos: string;
	identificacion: string;
}

@Component({
	selector: 'app-list-terceros',
	templateUrl: './list-terceros.component.html',
	styleUrls: ['./list-terceros.component.css'],
	animations: fuseAnimations
})
export class ListTercerosComponent implements OnInit {

	user = this._vars.user.source['value'];
	loading: boolean;
	alreadySearch: boolean;
	searchCriteria: object = { criteria: [], value: "", onlyusers: false };

	// Paginator
	pageEvent: PageEvent;
	length: number;

	displayedColumns: string[] = ['numerotercero', 'nombres', 'apellidos', 'identificacion', 'actions'];
	dataSource: MatTableDataSource<TercerosData>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		private _router: Router,
	) {
		if(!this.user['permisos']['terceros']['listar']){ this._router.navigate(['/']) }
	}

	ngOnInit() {
	}

	resetFilters() {
		this.searchCriteria = { criteria: [], value: "", onlyusers: false };
	}

	search(event:PageEvent) {
		if (this.searchCriteria['criteria'].length > 0 || this.searchCriteria['value'].length > 0) {

			this.searchCriteria['page'] = event ? event.pageIndex : 0;
			this.searchCriteria['limit'] = event ? event.pageSize : 10;
			this.loading = true;
			this.alreadySearch = true;

			this._api.searchTerceroByCriteria(this.searchCriteria, this.user['token']).subscribe(response => {
				if (response["code"] == 200) {
					this.dataSource = new MatTableDataSource(response["data"]);
					this.dataSource.sort = this.sort;
					this.length = response["count"];
				} else {
					this._snackBar.open("No se pudo consultar los terceros.", 'Cerrar', { duration: 3000 });
				}
				this.loading = false;
			});
		}

		return event

	}

	editCreateTercero(row){
		this._router.navigate(['/tercero/' + row.idtercero]);
	}

}
