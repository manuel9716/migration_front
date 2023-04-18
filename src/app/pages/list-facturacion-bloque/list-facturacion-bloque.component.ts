import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';

@Component({
	selector: 'app-list-facturacion-bloque',
	templateUrl: './list-facturacion-bloque.component.html',
	styleUrls: ['./list-facturacion-bloque.component.css'],
	animations: fuseAnimations
})
export class ListFacturacionBloqueComponent implements OnInit {

	user: object = this._vars.user.source['value'];
	loading: boolean;
	filters: object = {
		identificacion: null,
		numeroservicio: null
	}

	displayedColumns: string[] = ['identificacion', 'idinventario', 'saldo', 'numeroservicio'];
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		private _router: Router,
	) {
		if (!this.user['permisos']['facturacion_bloque']) { this._router.navigate(['/']) }
	}

	ngOnInit() {

	}


	search(){
		this.loading = true;
		this._api.listFacturacionBloque(this.filters, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
				this._snackBar.open("No se pudo obtener la facturación en bloque.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/'])
			}
			this.loading = false;
		});
	}


	resetFilters(){
		this.filters = {identificacion: null, numeroservicio: null}
	}

}
