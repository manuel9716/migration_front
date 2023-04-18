import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';

@Component({
	selector: 'create-edit-convenio-servicio-dialog',
	templateUrl: './create-edit-convenio-servicio-dialog.html',
	animations: fuseAnimations
})
export class CreateEditConvenioServicioDialog {

	form: FormGroup;
	user: object;
	loading: boolean;
	error: string;

	constructor(
		private _formBuilder: FormBuilder,
		private _api: ApiService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<CreateEditConvenioServicioDialog>,
		@Inject(MAT_DIALOG_DATA) public data
	) {

		this.user = this._vars.user.source['value'];

		this.form = this._formBuilder.group({
			idconvenioservicio: ['', []],
			estado: [true, []],
			observaciones: ['', [Validators.maxLength(300)]],
			idservicio: [this.data.idservicio, []],
		});

		if (this.data.entity) {
			this.form.patchValue(this.data.entity);
			Object.keys(this.form.controls).forEach((key) => { this.form.get(key).markAsTouched(); });
		}

	}

	cancel(): void {
		this.dialogRef.close();
	}

	onSubmit() {
		if (this.form.valid) {

			this.loading = true;
			this.error = null;

			if (this.data.entity) {

				if (this.user['permisos']['servicios']['convenios']['editar']) {
					this._api.editConvenioServicio(this.form.value, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							this._snackBar.open('Convenio de servicio editado.', 'Cerrar', { duration: 3000 });
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

				if (this.user['permisos']['servicios']['convenios']['crear']) {
					this._api.createConvenioServicio(this.form.value, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							this._snackBar.open('Convenio de servicio creado.', 'Cerrar', { duration: 3000 });
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