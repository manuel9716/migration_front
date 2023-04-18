import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';

@Component({
	selector: 'change-status-retiro-dialog',
	templateUrl: './change-status-retiro-dialog.html',
	animations: fuseAnimations
})
export class ChangeStatusRetiroDialog {

	form: FormGroup;
	loading: boolean;
	user: object;
	error: string;
	estadosRetiros ;

	constructor(
		private _formBuilder: FormBuilder,
		private _snackBar: MatSnackBar,
		private _api: ApiService,
		private _vars: VarsService,
		public dialogRef: MatDialogRef<ChangeStatusRetiroDialog>,
		@Inject(MAT_DIALOG_DATA) public data
	) {

		this.user = this._vars.user.source['value'];
		this.form = this._formBuilder.group({
			idretiro: [data.idretiro, [Validators.required]],
			idestadoretiro: ['', [Validators.required]],
		});
		this.getEstadosyMotivosRetiros();
	}

	getEstadosyMotivosRetiros(){
		this._api.getEstadosRetiro(this.user['token']).subscribe(response=> this.estadosRetiros=response['data'])
	}

	close(): void {
		this.dialogRef.close();
	}


	// getEstadoRetiro(idEstado) {
	// 	return this.estadosRetiros.find(estado => estado['idestadoretiro'] == idEstado);
	// }


	onSubmit() {

		this.error = null;

		if (this.form.valid) {

			this.loading = true;

			let json = JSON.parse(JSON.stringify(this.form.value));

			this._api.changeEstadoRetiro(this.form.value, this.user['token']).subscribe(response => {
				if (response['code'] == 200) {

					this._snackBar.open('Estado de solicitud cambiado.', 'Cerrar', { duration: 3000 });

					this.dialogRef.close(json['idestadoretiro']);

				} else {
					this.error = "No se pudo cambiar el estado de la solicitud."
				}
				this.loading = false;
			});
		}
	}

}