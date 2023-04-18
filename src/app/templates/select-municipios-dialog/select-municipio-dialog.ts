import { ReturnStatement } from '@angular/compiler';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

@Component({
	selector: 'select-municipio-dialog',
	templateUrl: './select-municipio-dialog.html',
	styleUrls: ['select-municipio-dialog.css']
})
export class SelectMunicipioDialog implements OnInit {
	user
	// grupos: object[] = [];
	cargaMunicipios: object[]= [];
	muncipiosSeleccionados = [];
	formMunicipios = this._fb.group(
		{
			departamentos: ['', ],
		  	municipios : ['', ],
		}
	  );
	caragando = false;
	isldataMuniCargados=true;
	constructor(
		public dialogRef: MatDialogRef<SelectMunicipioDialog>,
		@Inject(MAT_DIALOG_DATA) public data,
		private _api :ApiService,
		private _vars: VarsService,
		private _fb: FormBuilder,

	) {

	}

	ngOnInit() {
		this.user = this._vars.user.source['value'];
		// this.data['grupos'].forEach(grupo => { grupo['tipos'] = []; });
		// this.data['tipos'].forEach(tipo => {
		// 	tipo['status'] = null;
		// 	// Autoselect
		// 	if (this.data['ids'].indexOf(tipo['idtiposolicitudservicio']) != -1) { tipo['status'] = true; }

		// 	let grupo = this.data['grupos'].find(grupo => grupo['idgruposolicitudservicio'] == tipo['idgruposolicitudservicio']);
		// 	grupo['tipos'].push(JSON.parse(JSON.stringify(tipo)));
		// });

		// // Order
		// this.data['grupos'].forEach(grupo => {
		// 	if (grupo['idgruposolicitudservicio'] == 1 || grupo['idgruposolicitudservicio'] == 3 || grupo['idgruposolicitudservicio'] == 8) {
		// 		this.grupos.unshift(grupo);
		// 	} else {
		// 		this.grupos.push(grupo);
		// 	}
		// });

	}

	selectionChangeID($event: EventEmitter<MatSelectChange>){
		this.obtenerMunicipios($event['value'])

	}
	obtenerMunicipios(idMunicipio: string){		
		this._api.municipiosOtener(this.user['token'], idMunicipio).subscribe((response)=>{
			if(response['code']){
				this.cargaMunicipios= response['data'];
				
			}
		});	
	}
	

	agregar(): void {

		if(this.formMunicipios.controls.municipios.value){
			for (let i = 0; i < this.formMunicipios.controls.municipios.value.length; i++) {
				const element = this.formMunicipios.controls.municipios.value[i];
				let sw: Boolean=this.validarMunicipiosagregados(element);
				if(!sw){
					this.muncipiosSeleccionados.push(element)		
				}
			}
			this.formMunicipios.reset();
			this.cargaMunicipios = [];
		} else{
			alert('Selecione Municipios')
		}
	}

	validarMunicipiosagregados(element1): boolean{
		var sw= false
		for (let j = 0; j < this.muncipiosSeleccionados.length; j++) {
			const element2 = this.muncipiosSeleccionados[j];
			if(element2["idmunicipio"]==element1["idmunicipio"]){
				sw= true
			}	
		}

		return sw;
	}
	enviarFiltro(){
		// var envio =[]
		// for (let i = 0; i < this.muncipiosSeleccionados.length; i++) {
		// 	const element = this.muncipiosSeleccionados[i];
		// 	envio.push(element['idmunicipio'])
		// }
		if(this.muncipiosSeleccionados.length>0){
			this.dialogRef.close(this.muncipiosSeleccionados);

		} else{
			this.dialogRef.close();
		}

	}
	

}