import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';

@Component({
	selector: 'create-edit-direccion-tercero-dialog',
	templateUrl: './create-edit-direccion-tercero-dialog.html',
	animations: fuseAnimations
})
export class createEditDireccionTerceroDialog implements OnInit {

	form: FormGroup;
	user: object = this._vars.user.source['value'];
	loading: boolean;
	load: boolean = true;
	error: string;
	departamentos: object[];
	municipios: object[];
	municipiosSelect = [];
	barrios: object[];
	barriosSelect = [];

	constructor(
		private _formBuilder: FormBuilder,
		private _api: ApiService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<createEditDireccionTerceroDialog>,
		@Inject(MAT_DIALOG_DATA) public data
	) { }


	ngOnInit() {

		this.form = this._formBuilder.group({
			iddireccion: [''],
			descripcion: ['', [Validators.required, Validators.maxLength(120)]],
			email1: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
			email2: ['', [Validators.email, Validators.maxLength(50)]],
			whatsapp: ['', Validators.maxLength(20)],
			llamada: ['', Validators.maxLength(10)],
			celular1: ['', [Validators.required, Validators.maxLength(10)]],
			celular2: ['', Validators.maxLength(10)],
			estrato: ['', Validators.required],
			departamento: ['', Validators.required],
			idmunicipio: ['', Validators.required],
			idbarrio: ['', [Validators.required]]
		});


		this._api.getDirEntities(this.user['token']).subscribe(response => {
			if (response["code"] == 200) {

				this.departamentos = response['departamentos'];
				this.municipios = response['municipios'];
				this.barrios = response['barrios'];

				if (this.data.entity) {
					this._api.viewDireccion(this.data.entity.iddireccion, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							response['data'].departamento = response['data'].idmunicipio.iddepartamento.iddepartamento;
							response['data'].idmunicipio = response['data'].idmunicipio.idmunicipio;
							response['data'].idtercero = response['data'].idtercero.idtercero;
							this.changeControl('departamento', response['data'].departamento);
							this.changeControl('municipio', response['data'].idmunicipio);
							response['data'].idbarrio = response['data'].idbarrio ? response['data'].idbarrio.idbarrio : null;
							this.form.patchValue(response['data']);
						} else {
							this.dialogRef.close();
							this._snackBar.open("Error al procesar la solicitud.", 'Cerrar', { duration: 3000 });
						}
						this.load = false;
					});
				} else {
					this.form.controls.idmunicipio.disable();
					this.form.controls.idbarrio.disable();
					this.load = false;
				}

			} else {
				this.dialogRef.close();
				this._snackBar.open("Error al procesar la solicitud.", 'Cerrar', { duration: 3000 });
			}
		});
	}


	changeControl(control, value) {
		if (control == 'departamento') {
			this.form.controls.idbarrio.disable();
			this.form.controls.idmunicipio.setValue(null);
			this.form.controls.idbarrio.setValue(null);

			this.municipiosSelect = [];
			this.municipios.forEach(m => {
				if (m['iddepartamento'] == value) { this.municipiosSelect.push(m); }
			});
			this.form.controls.idmunicipio.enable();
		}

		if (control == 'municipio') {
			this.form.controls.idbarrio.setValue(null);
			this.barriosSelect = [];
			this.barrios.forEach(b => {
				if (b['idmunicipio'] == value) { this.barriosSelect.push(b); }
			});
			this.form.controls.idbarrio.enable();
		}

	}


	cancel(): void {
		this.dialogRef.close();
	}


	onSubmit() {
		if (this.form.valid) {

			this.loading = true;
			this.error = null;
			let json = JSON.parse(JSON.stringify(this.form.value));
			json['idtercero'] = this.data.idtercero;

			if (this.data.entity) {
				if (this.user['permisos']['terceros']['direcciones']['editar']) {
					this._api.editDireccion(json, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							this._snackBar.open('Dirección editada.', 'Cerrar', { duration: 3000 });
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
				if (this.user['permisos']['terceros']['direcciones']['crear']) {
					this._api.createDireccion(json, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							this._snackBar.open('Dirección creada.', 'Cerrar', { duration: 3000 });
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