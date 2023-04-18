import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

import { calificarLaborDialog } from 'src/app/templates/calificar-labor-dialog/calificar-labor-dialog'
import { EditarCasoEspecialDialog } from 'src/app/templates/editar-caso-especial-dialog/editar-caso-especial-dialog';
import { ValidardocumentLarboresDialog } from '../validar-document-labores-dialog/validar-document-labores-dialog';

@Component({
	selector: 'info-operacion-servicio-dialog',
	templateUrl: './info-operacion-servicio-dialog.html',
	styleUrls: ['info-operacion-servicio-dialog.css']
})
export class InfoOperacionServicioDialog implements OnInit, OnDestroy {

	user: object = this._vars.user.source['value'];

	operacion: object[];
	agenda: object[];
	casosEspeciales: object[];
	consumos: object[];
	desplazamiento: object[];
	labores: object[];
	estadosValidcioDocumentos;

	update: boolean;

	constructor(
		public dialogRef: MatDialogRef<InfoOperacionServicioDialog>,
		@Inject(MAT_DIALOG_DATA) public data,
		private _api: ApiService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		public _dialog: MatDialog,
	) {
	}

	ngOnInit() {
		this.getInfoOpServicio();
	}

	ngOnDestroy() {
		this.dialogRef.close(this.update);
	}

	getInfoOpServicio() {
		this._api.infoOperacionesServicio(this.data, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.operacion = response['data'];
				this.agenda = (response['agenda'].length > 0) ? response['agenda'][0] : null;
				this.casosEspeciales = response['casosEspeciales'];
				this.consumos = response['consumos'];
				this.desplazamiento = (response['desplazamientos'].length > 0) ? response['desplazamientos'][0] : null;
				this.labores = response['labores'];
				this.operacion['totalLabores'] = 0;

				this.labores.forEach((lab, idx) => {
					lab['promedio'] = (Math.round(parseFloat(lab['promedio']) * 100) / 100);
					this.operacion['totalLabores'] += lab['promedio'];
					if (idx > 0) { this.operacion['totalLabores'] -= 7; }
				});
				this._api.getListEstadosValidacionDocumentoLabores(this.user['token']).subscribe(
					response => {
						if (response['code'] == 200) {
							this.estadosValidcioDocumentos = response['data'];
						} else {
							this._snackBar.open('No se pudieron cargar los estados de validación de documentos.', 'Cerrar', { duration: 3000 });
						}
					}
				)

			} else {
				this._snackBar.open("No se pudo obtener la operación.", 'Cerrar', { duration: 3000 });
				this.cancel();
			}
		});
	}

	obtenerestadoDoc(id: number) {
		var estadNombre = 'Null'
		this.estadosValidcioDocumentos.forEach(estado => {
			if (estado['idestadodocumento'] == id) {
				estadNombre = estado['nombre']
			}
		});
		return estadNombre

	}

	cancel(): void {
		this.dialogRef.close(this.update);
	}

	goToCoor() {
		window.open('https://www.google.com/maps/?q=' + this.operacion['coordenadas'], "_blank");
	}

	validarDocumentso(item: object) {
		const dialogRef = this._dialog.open(ValidardocumentLarboresDialog, { width: '50%', data: {estados: this.estadosValidcioDocumentos, labor: item} });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				if (result.code==200) {
					// this.labores=item['idestadodocumento'];
					this.labores.forEach((laborClico, index)=> {
						if(laborClico['idlaborop']==item['idlaborop']){
							this.labores[index]['idestadodocumento']=result.selec
						}
					});
					this.update = true;
				}
			}
		});
	}


	calificar(item: object) {

		// LABORES
		if (item.hasOwnProperty('idlaborop')) {

			if ((item['idestadolabor'] == 1 || (item['idestadolabor'] > 1 && this.user['permisos']['validar_labores']['labores']['editar_cafilifacion']))) {

				if ((this.user['permisos']['validar_labores']['labores']['calificar_operaciones'] && item['categorialabor'] == 'Operaciones') ||
					(this.user['permisos']['validar_labores']['labores']['calificar_soporte'] && item['categorialabor'] == 'Soporte')) {

					const dialogRef = this._dialog.open(calificarLaborDialog, { width: '50%', data: item });
					dialogRef.afterClosed().subscribe(result => {
						if (result) {
							item['idestadolabor'] = result.idestadolabor;
							item['justificacion'] = result.justificacion;
							item['nombreestado'] = result.nombreestado;
							this._api.qualifyLaboresOp(item, this.user['token']).subscribe(response => {
								if (response['code'] == 200) {
									this.update = true;
									this._snackBar.open("Labor calificada.", 'Cerrar', { duration: 3000 });
								} else {
									this._snackBar.open("No se pudo calificar la labor.", 'Cerrar', { duration: 3000 });
								}
							});
						}
					});
				} else {
					this._snackBar.open('No tienes permiso para calificar labores de esta categoría.', 'Cerrar', { duration: 3000 });
				}
			} else {
				this._snackBar.open('No tienes permiso para editar calificaciones.', 'Cerrar', { duration: 3000 });
			}
		}

		// DESPLAZAMIENTOS
		if (item.hasOwnProperty('iddesplazamientocuadrilla')) {

			if ((item['idestadolabor'] == 1 || (item['idestadolabor'] > 1 && this.user['permisos']['validar_labores']['desplazamientos']['editar_cafilifacion']))) {

				if (this.user['permisos']['validar_labores']['desplazamientos']['calificar']) {

					const dialogRef = this._dialog.open(calificarLaborDialog, { width: '50%', data: item });
					dialogRef.afterClosed().subscribe(result => {
						if (result) {
							item['idestadolabor'] = result.idestadolabor;
							item['justificacion'] = result.justificacion;
							item['nombreestado'] = result.nombreestado;
							this._api.qualifyDesplazamientoCuadrilla(item, this.user['token']).subscribe(response => {
								if (response['code'] == 200) {
									this.update = true;
									this._snackBar.open("Desplazamiento calificado.", 'Cerrar', { duration: 3000 });
								} else {
									this._snackBar.open("No se pudo calificar el desplazamiento.", 'Cerrar', { duration: 3000 });
								}
							});
						}
					});

				} else {
					this._snackBar.open('No tienes permiso para calificar desplazamientos.', 'Cerrar', { duration: 3000 });
				}
			} else {
				this._snackBar.open('No tienes permiso para editar calificaciones.', 'Cerrar', { duration: 3000 });
			}
		}

		// CASOS ESPECIALES
		if (item.hasOwnProperty('idcasoespeciales')) {

			if ((item['idestadolabor'] == 1 || (item['idestadolabor'] > 1 && this.user['permisos']['validar_labores']['casos_especiales']['editar_cafilifacion']))) {

				if (this.user['permisos']['validar_labores']['casos_especiales']['calificar']) {

					const dialogRef = this._dialog.open(calificarLaborDialog, { width: '50%', data: item });
					dialogRef.afterClosed().subscribe(result => {
						if (result) {
							item['idestadolabor'] = result.idestadolabor;
							item['justificacion'] = result.justificacion;
							item['nombreestado'] = result.nombreestado;
							this._api.qualifyCasoEpecial(item, this.user['token']).subscribe(response => {
								if (response['code'] == 200) {
									this.update = true;
									this._snackBar.open("Caso especial calificado.", 'Cerrar', { duration: 3000 });
								} else {
									this._snackBar.open("No se pudo calificar el caso especial.", 'Cerrar', { duration: 3000 });
								}
							});
						}
					});
				} else {
					this._snackBar.open('No tienes permiso para calificar casos especiales.', 'Cerrar', { duration: 3000 });
				}
			} else {
				this._snackBar.open('No tienes permiso para editar calificaciones.', 'Cerrar', { duration: 3000 });
			}
		}
	}

	editCasoEspecial(item: object) {
		const dialogRef = this._dialog.open(EditarCasoEspecialDialog, { width: '50%', data: item });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				item['tiempo'] = result;
				this.update = true;
			}
		});
	}


}