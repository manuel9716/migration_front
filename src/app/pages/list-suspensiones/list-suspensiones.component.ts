import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ServiciosData } from '../servicios/list-servicios/list-servicios.component';


@Component({
	selector: 'app-list-suspensiones',
	templateUrl: './list-suspensiones.component.html',
	styleUrls: ['./list-suspensiones.component.css'],
	animations: fuseAnimations
})
export class ListSuspensionesComponent implements OnInit {

	user: object = this._vars.user.source['value'];;
	loading: boolean;
	SuspensionSearch: string;

	displayedColumns: string[] = ['fechainicio','fechafin', 'fechacreacion', 'numeroservicio', 'plan', 'nombrestercero', 'municipio'];
	dataSource: MatTableDataSource<ServiciosData>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		private _router: Router,
	) {
		if (!this.user['permisos']['suspensiones']) { this._router.navigate(['/']) }
	}

	ngOnInit() {
		this.loading = true;
		this._api.listSuspensiones(this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
				this._snackBar.open("No se pudieron cargar las suspensiones.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/'])
			}
		});
		this.loading = false;
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

}
