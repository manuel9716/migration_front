import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { Router, ActivatedRoute } from '@angular/router';

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
	selector: 'app-solicitudes-tercero',
	templateUrl: './solicitudes-tercero.component.html',
	styleUrls: ['./solicitudes-tercero.component.css']
})
export class SolicitudesTerceroComponent implements OnInit {

	user: object;
	loading: boolean;
	solSearch: string;

	displayedColumns: string[] = ['idsolicitudtercero', 'nombrecontacto', 'nombretipo', 'nombreestado', 'actions'];
	dataSource: MatTableDataSource<solicitudTerceroData>;
	@ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
	@ViewChild(MatSort,{static: true}) sort: MatSort;

	@Input() userData: object;

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		public _dialog: MatDialog,
		private _snackBar: MatSnackBar,
		private _router: Router,
		private _route: ActivatedRoute,
	) { }

	ngOnInit() {
		this.user = this._vars.user.source['value'];

		this.loading = true;

		this._api.getSolicitudesByTercero(this._route.params['_value']['id'], this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
				this._snackBar.open("No se pudieron cargar las solicitudes del tercero.", 'Cerrar', { duration: 3000 });
			}
			this.loading = false;
		});
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	selectSolicitud(idSolicitud) {
		this._router.navigate(['/solicitud-tercero/view/' + idSolicitud])
	}

}
