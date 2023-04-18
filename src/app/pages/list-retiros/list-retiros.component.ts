import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ServiciosData } from '../servicios/list-servicios/list-servicios.component';

import { ChangeStatusRetiroDialog } from '../../templates/change-status-retiro-dialog/change-status-retiro-dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-list-retiros',
	templateUrl: './list-retiros.component.html',
	styleUrls: ['./list-retiros.component.css'],
	animations: fuseAnimations
})
export class ListRetirosComponent implements OnInit {

	user: object = this._vars.user.source['value'];
	loading: boolean;
	formFiltros=  this._fb.group({
		fecharetiro: [],
		idestadoretiro: [],
		idmotivoretiro: [],
		municipios: [],

	})
	filters: object;
	estadosRetiros=[];
	motivosRetiros ;
	municipios=[];
	retiroSearch: string;

	displayedColumns: string[] = ['idestado', 'idmotivo', 'fecharetiro', 'fechacreacion',
	'numeroservicio', 'plan', 'nombrestercero', 'municipio', 'observaciones', 'actions'];
	dataSource: MatTableDataSource<ServiciosData>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _api: ApiService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		private _router: Router,
		public _dialog: MatDialog,
		private _fb: FormBuilder,

	) {
		if (!this.user['permisos']['retiros']) { this._router.navigate(['/']) }
	}

	ngOnInit() {
		this._api.datatoFilteroRetiro(this.user['token']).subscribe((respont)=>{
			this.municipios=respont['municipios'];
			
			this.estadosRetiros=respont['estadosretiros'];
			this.motivosRetiros=respont['motivosretiros'];
		});
		this.resetFilters();
	}

	resetFilters() {
		this.filters = {
			fecharetiro: null,
			idestadoretiro: [],
			idmotivoretiro: [],
			idmuicipio: [],
		}
	}
	selectTodo(formGrup: FormGroup, control: string, items: any[], id: string) {
		let itemsSlect = this._vars.selectTodo(formGrup, control, items, id);
		this.formFiltros.controls[control].setValue(itemsSlect);
	  }

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	getEstadoRetiro(idEstado) {
		return this.estadosRetiros.find(estado => estado['idestadoretiro'] == idEstado);
	}

	getMotivoRetiro(idMotivo) {
		return this.motivosRetiros.find(motivo => motivo['idmotivoretiro'] == idMotivo);
	}

	search() {
		
		this.loading = true;
		let json = JSON.parse(JSON.stringify(this.filters));
		if (json['fecharetiro']) { json['fecharetiro'] = json['fecharetiro'].substring(0, 10); }
		this._api.listRetiros(json, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
				this._snackBar.open("No se pudieron cargar los retiros.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/'])
			}
			this.loading = false;
		});
	}

	cambiarEstado(retiro) {
		if (this.user['permisos']['retiros']['listar']['cambiar_estado']) {
			const dialogRef = this._dialog.open(ChangeStatusRetiroDialog, { width: '60%', data: retiro });
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					retiro['idestadoretiro'] = result;
					this.estadosRetiros.find(estado=> {
						if (estado['idestadoretiro']==result){
							retiro['nombreestadoretiro']= estado.nombre
						}
					});
					 
				}
			});
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}

	}


}
