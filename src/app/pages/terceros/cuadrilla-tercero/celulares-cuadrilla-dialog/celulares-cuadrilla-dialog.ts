import { Component, Inject } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

// Material
import {MatChipInputEvent} from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';

// Services
import { ApiService } from 'src/app/services/api.service';

// RXJS
import { takeUntil } from 'rxjs/operators';

// Dialogs
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog';

export interface CelularesCuadrillaInterface {
	idcelularcuadrilla: number;
	celular: number;
	idserviciocuadrilla: number;
	numeroserviciocuadrilla: number;
}

@Component({
	selector: 'celulares-cuadrilla-dialog',
	templateUrl: './celulares-cuadrilla-dialog.html',
})
export class CelularesCuadrillaDialog {
	
	loading: boolean = true;

	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	celularesCuadrilla: CelularesCuadrillaInterface[] = [];
	
	constructor(
		private _api: ApiService,
		private _snackBar: MatSnackBar,
		public _dialog: MatDialog,
		public dialogRef: MatDialogRef<CelularesCuadrillaDialog>,
		@Inject(MAT_DIALOG_DATA) public data

	) {

		this.getCelularesCuadrilla();
	}


	getCelularesCuadrilla(){
		this.loading = true;
		let formData = new FormData();
		formData.append("numerocuadrilla", this.data.cuadrilla.numeroservicio)
		this._api.listCelularesCuadrilla(formData, this.data.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.celularesCuadrilla = response['data'];
			} else {
				this._snackBar.open("No se pudo listar los celulares de la cuadrilla", 'Cerrar', { duration: 3000 });
			}
			this.loading = false;
		});
	}

	add(event: MatChipInputEvent): void {

		if (this.data.user['permisos']['terceros']['cuadrillas']['crear_celulares']) {

			const input = event.input;
			const value = event.value;
		
			// Add our fruit
			if ((value || '').trim()) {

				let celular = value.trim();
				
				if (celular.length != 10) {
					this._snackBar.open("El número celular debe contener 10 caracteres", 'Cerrar', { duration: 3000 });
					return;
				}
					
				this.loading = true;
				let formData = new FormData();
				formData.append("celular", celular)
				formData.append("idcuadrillatercero", this.data.cuadrilla.idservicio)
				this._api.createCelularesCuadrilla(formData, this.data.user['token']).subscribe(
					response => {
						if (response['code'] == 200) {
							this.getCelularesCuadrilla();
							// Reset the input value
							if (input) { input.value = ''; input.focus();}
						} else {
							this._snackBar.open("No se pudo asociar el celular a la cuadrilla", 'Cerrar', { duration: 3000 });
						}
						this.loading = false;
					},
					err => {
						if(err.status == 400){
							this._snackBar.open(err.error.msg, 'Cerrar', { duration: 3000 });
						}
						this.loading = false;
					}
				);
				
			}
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}			
	}


	
	remove(celuCuadrilla: CelularesCuadrillaInterface): void {

		if (this.data.user['permisos']['terceros']['cuadrillas']['eliminar_celulares']) {

			const dialogConfigs = {
				title: "¿Está seguro de eliminar celular de cuadrilla?",
				subtitle: celuCuadrilla.celular,
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			}
	
			const dialogRef = this._dialog.open(ConfirmsDialog, {
				width: '40%',
				data: dialogConfigs
			});
	
			dialogRef.afterClosed().subscribe(result => {
				if(result){
					this.loading = true;
					this._api.deleteCelularesCuadrilla(celuCuadrilla.idcelularcuadrilla, this.data.user['token']).subscribe(
						response => {
							if (response['code'] == 200) {
								this.getCelularesCuadrilla();
							} else {
								this._snackBar.open("No se pudo asociar el celular a la cuadrilla", 'Cerrar', { duration: 3000 });
							}
							this.loading = false;
						},
						err => {
							if(err.status == 400){
								this._snackBar.open(err.error.msg, 'Cerrar', { duration: 3000 });
							}
							this.loading = false;
						}
					);
				}			
			});

		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}

	
	cancel(): void {
		this.dialogRef.close();
	}

	create(number){

	}

	delete(row){

	}
	
	
}