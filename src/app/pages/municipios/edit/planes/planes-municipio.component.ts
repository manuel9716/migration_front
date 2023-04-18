import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from 'src/app/animations/custom.animation';

// Material
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

// Servcios
import { PlanesService } from 'src/app/pages/planes/planes.service';
import { VarsService } from 'src/app/services/vars.service';

// Dialogs
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog';
import { SelectPlanDialog } from 'src/app/templates/select-plan-dialog/select-plan-dialog';

// RXJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Interfaces
import { PlanesMunicipioInterface } from '../../models/PlanesMunicipioInterface';



@Component({
	selector: 'app-planes-municipio',
	templateUrl: './planes-municipio.component.html',
	styleUrls: ['./planes-municipio.component.css'],
	animations: fuseAnimations
})

export class PlanesMunicipioComponent implements OnInit {

	// $obs
	private $destroy: Subject<boolean> = new Subject<boolean>();
	public user: any;

	planesMunicipio: PlanesMunicipioInterface[];
	loading: boolean = true;
	associating: boolean;

	geografias: any[];
	tiposPlanes: any[];
	tiposServicios: any[];

	@Input() idMunicipio: string;

	displayedColumns: string[] = ['nombre','valorsiniva','iva','idgeografia','idtipoplan','idtiposervicio','velmaxdescargambps','velmaxcargambps', 'actions'];
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	
	constructor(
		private _vars: VarsService,
		private _planesservice: PlanesService,
		private _snackBar: MatSnackBar,
		public _dialog: MatDialog,
	) {
		this._vars.user.pipe(takeUntil(this.$destroy)).subscribe((user:any) => {
			this.user = user
		});
	}
	
	ngOnInit(): void {

		this.geografias = this._vars.geografias;
      	this.tiposPlanes = this._vars.tiposPlanes;
      	this.tiposServicios = this._vars.tiposServicios;
		
		this.getPlanesByMunicipio();
	}


	getPlanesByMunicipio(){

		// Obtener Barrios Del Municipio
		this._planesservice.listPlanesByMunicipios(this.user['token'], this.idMunicipio)
		.pipe(takeUntil(this.$destroy))
		.subscribe(response => {
			if (response['code'] == 200) {

				this.planesMunicipio = response['data'];
				this.dataSource = new MatTableDataSource(this.planesMunicipio);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;

				
			} else {
				this._snackBar.open("No se pudo obtener los departamentos.", 'Cerrar', { duration: 3000 });
			}
			this.loading = false;
		});
	}


	modalAsociarPlan(){

		if (this.user['permisos']['municipios']['planes']['asociar']) {

			let exclude = []; 
			this.planesMunicipio.forEach(pm => {
				exclude.push(pm.idplan);
			});
			
			const dialogRef = this._dialog.open(SelectPlanDialog, { width: '90%', hasBackdrop: true, data: {exclude: exclude} });
			dialogRef.afterClosed().pipe(takeUntil(this.$destroy)).subscribe(
				result => {
					if (result) {
						
						this.associating = true;

						let formData = new FormData();
						formData.append("idplan", result.idplan);
						formData.append("idmunicipio", this.idMunicipio);

						this._planesservice.associateMunicipio(this.user['token'], formData)
						.pipe(takeUntil(this.$destroy))
						.subscribe(
							response => {
								this.getPlanesByMunicipio();
								this._snackBar.open("El plan se asoció al municipio", 'Cerrar', { duration: 3000 });
								this.associating = false;
							},
							error => {
								this._snackBar.open(error.error.msg, 'Cerrar', { duration: 3000 });
								this.associating = false;
							}
						);

					}
				}
			);

		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}

	}


	disassociate(planMunicipio){
		if (this.user['permisos']['municipios']['planes']['desasociar']) {

			const dialogConfigs = {
				title: "¿Está seguro de desasociar el plan del municipio?",
				subtitle: planMunicipio.nombre,
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			}
			
			const dialogRef = this._dialog.open(ConfirmsDialog, {
				width: '40%',
				data: dialogConfigs
			});
			
			dialogRef.afterClosed().subscribe(result => {
				
				if (result) {
					
					planMunicipio['disassociating'] = true;
					
					this._planesservice.desassociateMunicipio(this.user['token'], planMunicipio.idplanmunicipio)
					.pipe(takeUntil(this.$destroy))
					.subscribe(
						response => {				
							this._snackBar.open("Plan Desasociado.", 'Cerrar', { duration: 3000 });
							this.getPlanesByMunicipio();
						},
						error => {
							const msg = error.error.msg == "Database exception" ? "No se puede desasociar el plan porque está siendo usado." : error.error.msg;
							this._snackBar.open(msg, 'Cerrar', { duration: 4000 });
							planMunicipio['disassociating'] = false;
						}
					);
				}
			});

		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
		
	}


	applyFilter(event: Event) {
		const filterValue = event ? (event.target as HTMLInputElement).value : '';
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	
	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.complete();
	}
}
