import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';

import { SelectPlanDialog } from 'src/app/templates/select-plan-dialog/select-plan-dialog';
import { SelectDireccionDialog } from 'src/app/templates/select-direccion-dialog/select-direccion-dialog';
import { SelectTerceroDialog } from 'src/app/templates/select-tercero-dialog/select-tercero-dialog';
import { EditServicioFieldDialog } from 'src/app/templates/edit-servicio-field-dialog/edit-servicio-field-dialog';
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog';
import { InfoEstadoActivacionDialog } from 'src/app/templates/info-estado-activacion-dialog/info-estado-activacion-dialog';


@Component({
	selector: 'app-view-servicio',
	templateUrl: './view-servicio.component.html',
	styleUrls: ['./view-servicio.component.css'],
	animations: fuseAnimations
})
export class ViewServicioComponent implements OnInit {

	user: object = this._vars.user.source['value'];
	loading: boolean;
	servicio: object;
	retiro: object;
	suspension: object;
	// estado = undefined;
	breadcrumb: string = 'Información';
	selectedTab: number;
	estadosRetiros = [];
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _snackBar: MatSnackBar,
		private _api: ApiService,
		private _vars: VarsService,
		public _dialog: MatDialog,
	) {
		if (!this.user['permisos']['servicios']) { this._router.navigate(['/']) }
	}

	ngOnInit() {
		this.getServicio();
		this._api.getEstadosRetiro(this.user['token']).subscribe(
			response=>{
				this.estadosRetiros= response['data']
			}
		)
	}


	getServicio() {
		let params = {
			idservicio: this._route.snapshot.params.id,
		}

		this._api.getServicio(params, this.user['token']).subscribe(response => {
			if (response["code"] == 200) {
				this.servicio = response['data'][0];
				this.retiro = response['retiro'][0];
				this.suspension = response['suspension'][0];
				// this.estado = response['estado'];
				this.checkTab();

			} else {
				this._snackBar.open("No se pudo cargar la información del servicio", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/servicios']);
			}
		});
	}


	changeTab(ev) {
		if (ev.index == 0) { this.breadcrumb = 'Información' }
		if (ev.index == 1) { this.breadcrumb = 'Contactos' }
		if (ev.index == 2) { this.breadcrumb = 'Convenios' }
		if (ev.index == 3) { this.breadcrumb = 'Excepciones' }
		if (ev.index == 4) { this.breadcrumb = 'Solicitudes' }
	}


	checkTab() {
		if (this._route.snapshot.params.tab == 'solicitudes') {
			this.selectedTab = 1;
		} else if (this._route.snapshot.params.tab == 'contactos') {
			this.selectedTab = 2;
		} else if (this._route.snapshot.params.tab == 'convenios') {
			this.selectedTab = 3;
		} else if (this._route.snapshot.params.tab == 'excepciones') {
			this.selectedTab = 4;
		}
		this.changeTab({ ev: { index: this.selectedTab } })
	}

	getEstadoRetiro(idEstado) {
		return this.estadosRetiros.find(estado => estado['idestadoretiro'] == idEstado);
	}


	refreshDataEvent() {
		this.getServicio();
	}


	editPlan() {
		if (this.user['permisos']['servicios']['editar'] && this.user['permisos']['servicios']['editar']['plan']) {
			const dialogRef = this._dialog.open(SelectPlanDialog, { width: '90%', hasBackdrop: true });
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.editServicio({ idplan: result['idplan'] });
				}
			});
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}


	editTercero() {
		if (this.user['permisos']['servicios']['editar'] && this.user['permisos']['servicios']['editar']['tercero'] && this.user['permisos']['servicios']['editar']['direccion']) {
			const dialogRef = this._dialog.open(SelectTerceroDialog, { width: '80%', data: { onlyEmployees: false } });
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.editDireccion({ idtercero: result['idtercero'] })
				}
			});
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}

	}


	editDireccion(terceroData?) {
		if (this.user['permisos']['servicios']['editar'] && this.user['permisos']['servicios']['editar']['direccion']) {
			let idTercero = terceroData ? terceroData['idtercero'] : this.servicio['idtercero'];
			const dialogRef = this._dialog.open(SelectDireccionDialog, { width: '90%', data: { tercero: { idtercero: idTercero } }, hasBackdrop: true });
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					if (terceroData) {
						terceroData['iddireccion'] = result['iddireccion'];
						this.editServicio(terceroData);
					} else {
						this.editServicio({ iddireccion: result['iddireccion'] });
					}
				}
			});
		} else {
			// this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}

	}

	
	editField(field) {
		if (
			(field == 'ip' && this.user['permisos']['servicios']['editar']['ip']) ||
			(field == 'puertocaja' && this.user['permisos']['servicios']['editar']['puertocaja']) ||
			(field == 'ncajanap' && this.user['permisos']['servicios']['editar']['ncajanap']) ||
			(field == 'serialont' && this.user['permisos']['servicios']['editar']['serialont']) ||
			(field == 'ontid' && this.user['permisos']['servicios']['editar']['ontid']) ||
			(field == 'potcajanap' && this.user['permisos']['servicios']['editar']['potcajanap']) ||
			(field == 'potont' && this.user['permisos']['servicios']['editar']['potont'])
		) {
			const configs = {
				servicio: this.servicio,
				field: field
			}

			const dialogRef = this._dialog.open(EditServicioFieldDialog, { width: '50%', data: configs });
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.getServicio();
					this._snackBar.open("Servicio editado", 'Cerrar', { duration: 3000 });
				}
			});
		}
	}


	deleteField(field) {
		if (
			(field == 'ip' && this.user['permisos']['servicios']['editar']['ip']) ||
			(field == 'puertocaja' && this.user['permisos']['servicios']['editar']['puertocaja']) ||
			(field == 'ncajanap' && this.user['permisos']['servicios']['editar']['ncajanap']) ||
			(field == 'serialont' && this.user['permisos']['servicios']['editar']['serialont']) ||
			(field == 'ontid' && this.user['permisos']['servicios']['editar']['ontid']) ||
			(field == 'potcajanap' && this.user['permisos']['servicios']['editar']['potcajanap']) ||
			(field == 'potont' && this.user['permisos']['servicios']['editar']['potont'])
		) {

			let nameField = "";

			if(field == 'ip'){nameField = "Ip";} 
			else if(field == 'puertocaja'){nameField = "Puerto Caja";}
			else if(field == 'ncajanap'){nameField = "Número Caja Nap";}
			else if(field == 'serialont'){nameField = "Serial ONT";}
			else if(field == 'ontid'){nameField = "ONT ID";}
			else if(field == 'potcajanap'){nameField = "Potencia Caja nap";}
			else if(field == 'potont'){nameField = "Potencia ONT";}

			const dialogConfigs = {
				title: "¿Está seguro de vaciar el campo " + nameField + "?",
				done: '¡Estoy seguro!',
				cancel: 'Cancelar'
			 }
	
			 const dialogRef = this._dialog.open(ConfirmsDialog, {
				width: '50%',
				data: dialogConfigs
			 });

		
			 dialogRef.afterClosed().subscribe(result => {
				if (result) {

					let json = {idservicio:this.servicio['idservicio']};
					json[field] = 'delete';

					this._api.editServicio(json, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							this.getServicio();
							this._snackBar.open("Servicio editado", 'Cerrar', { duration: 3000 });
						} else {
							this._snackBar.open("No se pudo editar el servicio", 'Cerrar', { duration: 3000 });
						}
					});
				}
			 });
		}
	}


	editServicio(json) {
		json['idservicio'] = this.servicio['idservicio'];
		this._api.editServicio(json, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.getServicio();
				this._snackBar.open("Servicio editado", 'Cerrar', { duration: 3000 });
			} else {
				this._snackBar.open("No se puedo editar el servicio", 'Cerrar', { duration: 3000 });
			}
		});
	}

	getInfoEstadoActivacion(){
		this._dialog.open(InfoEstadoActivacionDialog, { width: '80%', data: this.servicio['idservicio']});
	}
}
