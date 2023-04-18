import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';

@Component({
	selector: 'create-edit-excepcion-servicio-dialog',
	templateUrl: './create-edit-excepcion-servicio-dialog.html',
	animations: fuseAnimations
})
export class CreateEditExcepcionServicioDialog {

	form: FormGroup;
	user: object;
	loading: boolean;
	error: string;
	excepcionServicio: object;
	today: Date = new Date();

	minDate: Date = new Date();

	constructor(
		private _formBuilder: FormBuilder,
		private _api: ApiService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<CreateEditExcepcionServicioDialog>,
		@Inject(MAT_DIALOG_DATA) public data
	) {

		this.user = this._vars.user.source['value'];
		// this.minDate.setDate(this.minDate.getDate() + 1);

		this.form = this._formBuilder.group({
			idexcepcionservicio: ['', []],
			estado: [true, []],
			fechafinalizacion: [(new Date()).toISOString(), [Validators.required]],
			observaciones: ['', [Validators.maxLength(300)]],
			idservicio: [this.data.idservicio, []],
		});

		if (this.data.entity) {
			this.excepcionServicio = JSON.parse(JSON.stringify(this.data.entity));
			this.excepcionServicio['fechafinalizacion'] = new Date(this.excepcionServicio['fechafinalizacion'].timestamp * 1000).toISOString();
			this.form.patchValue(this.excepcionServicio);
			// Object.keys(this.form.controls).forEach((key) => {this.form.get(key).markAsTouched();});
			this.form.controls.fechafinalizacion.disable();

			if (new Date(this.form.controls['fechafinalizacion'].value) < this.today) {
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

			if (this.excepcionServicio) {
				if (this.user['permisos']['servicios']['excepciones']['editar']) {
					this._api.editExcepcionServicio(this.form.value, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							this._snackBar.open('Excepción de servicio editada.', 'Cerrar', { duration: 3000 });
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
				
				if (this.user['permisos']['servicios']['excepciones']['crear']) {
					this._api.createExcepcionServicio(this.form.value, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							this._snackBar.open('Excepción de servicio creada.', 'Cerrar', { duration: 3000 });
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