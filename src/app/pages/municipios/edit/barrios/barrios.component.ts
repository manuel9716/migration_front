import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from 'src/app/animations/custom.animation';

// Material
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

// Servcios
import { MunicipiosService } from '../../services/municipios.service';
import { VarsService } from 'src/app/services/vars.service';
// Dialogs
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog';

// RXJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Interfaces
import { BarrioInterface } from '../../models/BarrioInterface';


@Component({
	selector: 'app-barrios',
	templateUrl: './barrios.component.html',
	styleUrls: ['./barrios.component.css'],
	animations: fuseAnimations
})
export class BarriosComponent implements OnInit {

	// $obs
	private $destroy: Subject<boolean> = new Subject<boolean>();
	public user: any;

	barrios: BarrioInterface[];
	currentBarrio: BarrioInterface;

	creating: boolean;
	loading: boolean = true;

	newBarrio: string;
		
	@Input() idMunicipio: string;

	displayedColumns: string[] = ['nombrebarrio', 'actions'];
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	
	constructor(
		private _vars: VarsService,
		private _municipiosservice: MunicipiosService,
		private _snackBar: MatSnackBar,
		public _dialog: MatDialog,
	) {
		this._vars.user.pipe(takeUntil(this.$destroy)).subscribe((user:any) => {
			this.user = user
		});
	}
	
	ngOnInit(): void {
		
		this.getBarriosByMunicipio();
		
	}


	getBarriosByMunicipio(){

		// Obtener Barrios Del Municipio
		this._municipiosservice.getBarriosByMunicipio(this.user['token'], this.idMunicipio)
		.pipe(takeUntil(this.$destroy))
		.subscribe(response => {
			if (response['code'] == 200) {

				this.barrios = response['data'];
				this.dataSource = new MatTableDataSource(this.barrios);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;

				this.currentBarrio = null;
				
			} else {
				this._snackBar.open("No se pudo obtener los departamentos.", 'Cerrar', { duration: 3000 });
			}
			this.loading = false;
		});
	}


	create(nombrebarrio){
		if (this.user['permisos']['municipios']['barrios']['crear']) {

			this.creating = true;
		
			let formData = new FormData();
			formData.append("nombre", nombrebarrio);		
			formData.append("idmunicipio", this.idMunicipio);

			// Obtener Barrios Del Municipio
			this._municipiosservice.createBarrio(this.user['token'], formData)
			.pipe(takeUntil(this.$destroy))
			.subscribe(
				response => {				
					if (response['code'] == 200) {

						this._snackBar.open("Barrio creado.", 'Cerrar', { duration: 3000 });
						this.getBarriosByMunicipio();
						
					}
					this.creating = false;
				},
				error => {
					this._snackBar.open(error.error.msg, 'Cerrar', { duration: 3000 });
					this.creating = false;
				}
			);

		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}


	edit(barrio){

		if (this.user['permisos']['municipios']['barrios']['editar']) {
			this.currentBarrio = barrio;
			this.currentBarrio["editNombre"] = barrio.nombrebarrio;
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}

	}


	update(barrio){

		if (this.user['permisos']['municipios']['barrios']['editar']) {

			let formData = new FormData();
			formData.append("idbarrio", barrio.idbarrio);
			formData.append("nombre", barrio.editNombre);
			
			barrio['updating'] = true;

			this._municipiosservice.editBarrio(this.user['token'], formData)
			.pipe(takeUntil(this.$destroy))
			.subscribe(
				response => {				
					this._snackBar.open("Barrio Editado.", 'Cerrar', { duration: 3000 });
					barrio.nombrebarrio = barrio.editNombre;
					barrio['updating'] = false;
					this.currentBarrio = null;
				},
				error => {
					this._snackBar.open(error.error.msg, 'Cerrar', { duration: 3000 });
					barrio['updating'] = false;
				}
			);

		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
		
	}


	delete(barrio){

		if (this.user['permisos']['municipios']['barrios']['eliminar']) {

			const dialogConfigs = {
				title: "¿Está seguro de eliminar el barrio?",
				subtitle: barrio.nombrebarrio,
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			 }
	
			 const dialogRef = this._dialog.open(ConfirmsDialog, {
				width: '40%',
				data: dialogConfigs
			 });
	
			dialogRef.afterClosed().subscribe(result => {
				
				if (result) {
	
					barrio['deleting'] = true;
					
					this._municipiosservice.deleteBarrio(this.user['token'], barrio.idbarrio)
					.pipe(takeUntil(this.$destroy))
					.subscribe(
						response => {				
							this._snackBar.open("Barrio Eliminado.", 'Cerrar', { duration: 3000 });
							this.getBarriosByMunicipio();
						},
						error => {
							const msg = error.error.msg == "Database exception" ? "No se puede eliminar el barrio porque está siendo usado en al menos una dirección." : error.error.msg;
							this._snackBar.open(msg, 'Cerrar', { duration: 4000 });
							barrio['deleting'] = false;
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
