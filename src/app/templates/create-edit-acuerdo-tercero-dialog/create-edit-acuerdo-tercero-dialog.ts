import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';

@Component({
	selector: 'create-edit-acuerdo-tercero-dialog',
	templateUrl: './create-edit-acuerdo-tercero-dialog.html',
	animations: fuseAnimations
})
export class createEditAcuerdoTerceroDialog {

	form: FormGroup;
	user: object;
	loading: boolean;
	error: string;
	acuerdoPago: object;
	today = new Date();


	constructor(
		private _formBuilder: FormBuilder,
		private _api: ApiService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<createEditAcuerdoTerceroDialog>,
		@Inject(MAT_DIALOG_DATA) public data
	) {

		this.user = this._vars.user.source['value'];
		this.today.setHours(0, 0, 0, 0);

		this.form = this._formBuilder.group({
			idacuerdopagotercero: ['', []],
			estado: [true, []],
			fechapago: [(new Date()).toISOString(), [Validators.required]],
			observaciones: ['', [Validators.maxLength(300)]],
			idtercero: [this.data.idtercero, []],
		});

		if(this.user['permisos']['terceros']['acuerdos']['crear_hoy'] && !this.user['permisos']['terceros']['acuerdos']['crear']){
			this.form.controls.fechapago.disable();
		}

		if (this.data.entity) {
			this.acuerdoPago = JSON.parse(JSON.stringify(this.data.entity))
			this.acuerdoPago['fechapago'] = new Date(this.acuerdoPago['fechapago'].timestamp * 1000).toISOString();
			this.form.patchValue(this.acuerdoPago);
			this.form.controls.fechapago.disable();

			if (new Date(this.form.controls['fechapago'].value) < this.today) {
				this.form.controls.estado.disable();
			}
		}

	}


	cancel(): void {
		this.dialogRef.close();
	}

	onSubmit() {
		if (this.form.valid) {

			this.loading = true;
			this.error = null;

			if (this.acuerdoPago) {
				if (this.user['permisos']['terceros']['acuerdos']['editar']) {
					this._api.editAcuerdoPagoTercero(this.form.value, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							this._snackBar.open('Acuerdo de pago de tercero editado.', 'Cerrar', { duration: 3000 });
							this.dialogRef.close(true);
						} else {
							this.error = response['msg']
						}
						this.loading = false;
					});
				} else {
					this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
					this.cancel();
				}
			} else {
				if (this.user['permisos']['terceros']['acuerdos']['crear'] || this.user['permisos']['terceros']['acuerdos']['crear_hoy']) {

					let json = JSON.parse(JSON.stringify(this.form.value));
					if(this.user['permisos']['terceros']['acuerdos']['crear_hoy'] && !this.user['permisos']['terceros']['acuerdos']['crear']){
						json['fechapago'] = (new Date()).toISOString();
					}
					
					this._api.createAcuerdoPagoTercero(json, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							this._snackBar.open('Acuerdo de pago de tercero creado.', 'Cerrar', { duration: 3000 });
							this.dialogRef.close(true);
						} else {
							this.error = response['msg']
						}
						this.loading = false;
					});
				} else {
					this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
					this.cancel();
				}
			}

		}
	}

}