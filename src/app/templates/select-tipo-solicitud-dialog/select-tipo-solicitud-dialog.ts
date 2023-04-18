import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'select-tipo-solicitud-dialog',
	templateUrl: './select-tipo-solicitud-dialog.html',
	styleUrls: ['select-tipo-solicitud-dialog.css']
})
export class SelectTipoSolicitudDialog implements OnInit {

	formTipos = this.fb.group({});
	formGruposTipos = this.fb.group({});
	grupos: object[] = [];

	constructor(
		public dialogRef: MatDialogRef<SelectTipoSolicitudDialog>,
		@Inject(MAT_DIALOG_DATA) public data,
		private fb: FormBuilder,
	) {

	}

	ngOnInit() {
		this.data['grupos'].forEach(grupo => { grupo['tipos'] = []; });
		this.data['tipos'].forEach(tipo => {
			tipo['status'] = null;
			// Autoselect
			if (this.data['ids'].indexOf(tipo['idtiposolicitudservicio']) != -1) { tipo['status'] = true; }

			let grupo = this.data['grupos'].find(grupo => grupo['idgruposolicitudservicio'] == tipo['idgruposolicitudservicio']);
			grupo['tipos'].push(JSON.parse(JSON.stringify(tipo)));
		});

		// Order
		this.data['grupos'].forEach(grupo => {
			if (grupo['idgruposolicitudservicio'] == 1 || grupo['idgruposolicitudservicio'] == 3 || grupo['idgruposolicitudservicio'] == 8) {
				this.grupos.unshift(grupo);
			} else {
				this.grupos.push(grupo);
			}
		});

		//Sitema para selecionar 

		this.grupos.forEach((grupo) => {

			this.formGruposTipos.addControl(grupo['nombre'], this.fb.control(''))
			let cont=0;
			let dta: [] = grupo["tipos"]
			dta.forEach(tipo => {
				this.formTipos.addControl(tipo['nombre'], this.fb.control(''));
				if(tipo['status']){
					cont++
				}
			});
			if(cont >= dta.length){
				this.formGruposTipos.controls[grupo['nombre']].setValue(true);
			}

		});
		//this.formTipos.addControl('holaMUndo', this.fb.control(''));


	}
	SelectAllGrup(selecChec: string) {	
		if (this.formGruposTipos.controls[selecChec].value == true) {
			this.grupos.forEach((grupo) => {
				//this.formGruposTipos.addControl(grupo['nombre'], this.fb.control(''))
				if (selecChec == grupo['nombre']) {
					let dta: [] = grupo["tipos"]
					dta.forEach(tipo => {
						this.formTipos.controls[tipo['nombre']].setValue(true);
					});
				}
			});
		} else {
			this.grupos.forEach((grupo) => {

				//this.formGruposTipos.addControl(grupo['nombre'], this.fb.control(''))
				if (selecChec == grupo['nombre']) {
					let dta: [] = grupo["tipos"]
					dta.forEach(tipo => {

						this.formTipos.controls[tipo['nombre']].setValue(false);
					});
				}
			});
		}

	}

	cancel(): void {
		let ids = [];
		this.data['grupos'].forEach(grupo => {
			grupo['tipos'].forEach(tipo => {
				if (tipo['status']) { ids.push(tipo['idtiposolicitudservicio']); }
			});
		});
		this.dialogRef.close(ids);
	}

}