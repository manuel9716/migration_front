import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';

// Material
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Servcios
import { VarsService } from 'src/app/services/vars.service';
import { MunicipiosService } from '../services/municipios.service';

// RXJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-list-municipios',
	templateUrl: './list-municipios.component.html',
	styleUrls: ['./list-municipios.component.css'],
	animations: fuseAnimations
})
export class ListMunicipiosComponent implements OnInit, OnDestroy {

	// $obs
	private $destroy: Subject<boolean> = new Subject<boolean>();
	public user: any;

	departamentos: any;
	municipios: any;
	currentIdDepartamento: number;
	loading: boolean;

	displayedColumns: string[] = ['idmunicipio', 'nombre', 'actions'];
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _vars: VarsService,
		private _router: Router,
		private _route: ActivatedRoute,
		private _municipiosservice: MunicipiosService,
		private _snackBar: MatSnackBar,
	) {
		this._vars.user.pipe(takeUntil(this.$destroy)).subscribe((user:any) => {

			if(user){
				
				// Verificar Permisos
				if(!this._vars.getProp(user['permisos'], 'municipios.municipios')){
					this._router.navigate(['/'])
				}
					
				this.user = user
			}
		});

	}

	ngOnInit() {

		// Buscar Municipios si la ruta tiene idDepartamento en su QueryParams
		this._route.queryParams
		.pipe(takeUntil(this.$destroy))
		.subscribe(params => {			
			if(params['idDepartamento']){						
				this.obtenerMunicipiosDeDepartamento(params['idDepartamento']);
				this.currentIdDepartamento = parseInt(params['idDepartamento']);
			}
		});
		

		// Obtener Departamentos
		this._municipiosservice.listDepartamentos(this.user['token'])
		.pipe(takeUntil(this.$destroy))
		.subscribe(response => {
			if (response['code'] == 200) {
				this.departamentos = response['data'];
			} else {
				this._snackBar.open("No se pudo obtener los departamentos.", 'Cerrar', { duration: 3000 });
			}
		});
			
	}


	// Obtener municipios de departamento

	obtenerMunicipiosDeDepartamento(idDepartamento){		
		this.loading = true;
		this.currentIdDepartamento = idDepartamento;
		
		this._municipiosservice.listMunicipiosByDepartamento(this.user['token'], idDepartamento).pipe(takeUntil(this.$destroy)).subscribe(response => {
			if (response['code'] == 200) {
				this.municipios = response['data'];
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
				this._snackBar.open("No se pudo obtener los municipios.", 'Cerrar', { duration: 3000 });
			}
			this.loading = false;
		});

	}


	selectMunicipio(idMunicipio){

		if( this._vars.getProp(this.user['permisos'], 'municipios.barrios') || 
			this._vars.getProp(this.user['permisos'], 'municipios.planes')
		){
			this._router.navigate(['municipios', idMunicipio]);
		}

	}


	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.complete();
	}


}
