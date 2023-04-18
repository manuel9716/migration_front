import { Component, OnInit, Renderer2 } from "@angular/core";
import { fuseAnimations } from "src/app/animations/custom.animation";
import { Router } from '@angular/router';
// Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// Services
import { VarsService } from 'src/app/services/vars.service';
import { ApiService } from 'src/app/services/api.service';
import { ServiciosService } from 'src/app/commons/sidebar/servicios.service';
import { NgxSpinnerService } from 'ngx-spinner';
import  Swal  from 'sweetalert2';

// Dialogs
import { SelectDateDialog } from "src/app/pages/transacciones/select-date-dialog/select-date-dialog";
import { LoaderFacturacionBloqueDialog } from "src/app/templates/loader-facturacion-bloque/loader-facturacion-bloque-dialog";
// Env
import { environment } from "src/environments/environment";
import { delay } from "rxjs/operators";
import { error } from "console";


@Component({
	selector: "app-sidebar",
	templateUrl: "./sidebar.component.html",
	styleUrls: ["./sidebar.component.css"],
	animations: fuseAnimations
})
export class SidebarComponent implements OnInit {

	loading: boolean = false;
	user: object = this._vars.user.source['value'];
	configuracionesMenu: boolean;	

	constructor(
		public _dialog: MatDialog,
		private _vars: VarsService,
		private renderer: Renderer2,
		private _api: ApiService,
		private _snackBar: MatSnackBar,
		private _router: Router,
		private spinner: NgxSpinnerService,
		private serviciosService: ServiciosService,
		public dialogRef: MatDialogRef<LoaderFacturacionBloqueDialog>,
	) { }

	ngOnInit() {
		if(localStorage.getItem('overActive')=="true"){
			this.isExpanded=false;
			this.overActive ? (this.overActive = false ) : (this.overActive = true);
		}else{
			this.isExpanded=true;
		}

	}

	isExpanded: boolean  ;
	overActive = false;
	mode = "side";

	toggleSidebar() {
		if (this.isExpanded) {
			this.overActive ? (this.overActive = false ) : (this.overActive = true);
			localStorage.setItem('overActive',this.overActive+"");
		} else {
			localStorage.setItem('overActive',this.overActive+"");
			this.isExpanded = true;
		}
	}

	checkOver(status) {
		if (this.overActive) {
			status ? (this.isExpanded = true) : (this.isExpanded = false);
		}
	}

	logout() {
		this._vars.setUser(null);
		this._router.navigate(['/login'])

	}


	uploadFacturacionBloque(ev) {
		if (this.user['permisos']['accesos_directos_sidebar']['importar_fac_bloque']['importar']) {
			if (ev.target.files.length > 0) {
				this.loading = true;
				this._api.importFacturacionBloque(ev.target.files[0], this.user['token']).subscribe(response => {
					this._snackBar.open(response['msg'], 'Cerrar', { duration: 5000 });
					this.loading = false;
				});
			}
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}


	uploadEstadosCuentas(ev) {
		if (this.user['permisos']['accesos_directos_sidebar']['importar_est_cuenta']['importar']) {
			if (ev.target.files.length > 0) {
				this.loading = true;
				this._api.importEstadosCuentas(ev.target.files[0], this.user['token']).subscribe(response => {
					this._snackBar.open(response['msg'], 'Cerrar', { duration: 5000 });
					this.loading = false;
				});
			}
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}


	getInactivos(type) {
		if (this.user['permisos']['accesos_directos_sidebar']['servicios_inactivos']['listar']) {
			this.loading = true;

			let json = {type:type};	

			this._api.getServiciosInactivos(json, this.user['token']).subscribe(response => {
				
				if (response['code'] == 200) {
					let a = document.createElement('a');
					document.body.appendChild(a);
					a.setAttribute('style', 'display: none');
					a.href = environment.apiUrl + (type == 'activos' ? "Activos.txt" : "Deudores.txt");
					a.target = "_blank"
					a.click();
					a.remove();
					this._snackBar.open("Servicios " + type + " listados", 'Cerrar', { duration: 3000 });
				} else {
					this._snackBar.open("No se pudo obtener los servicios " + type + "", 'Cerrar', { duration: 3000 });
				}
				this.loading = false;
			});


		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}

	updateEstadosActivacionServicios() {
		if (this.user['permisos']['accesos_directos_sidebar']['act_est_activacion']['actualizar']) {
			this.loading = true;
			this._api.updateEstadosActivacionServicios(this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
					this._snackBar.open("Estados de activación de servicios actualizados.", 'Cerrar', { duration: 3000 });
				} else {
					this._snackBar.open("No se pudo actualizar los estados de activación de los servicios.", 'Cerrar', { duration: 3000 });
				}
				this.loading = false;
			});
		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
	}

	downloadTransacciones(){

		if (this.user['permisos']['accesos_directos_sidebar']['transacciones']['generar_reporte']) {

			
			const dialogRef = this._dialog.open(SelectDateDialog, {
				width: '40%',
				panelClass: 'align-c',
				data: SelectDateDialog
			});
			
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					
					this.loading = true;
					let formData = new FormData();

					formData.append("date", result);

					this._api.generateTransaccionesByDia(formData, this.user['token']).subscribe(response => {
				
						if (response['code'] == 200) {

							let a = document.createElement('a');
							document.body.appendChild(a);
							a.setAttribute('style', 'display: none');
							a.href = `${environment.apiUrl}Transacciones.txt`;
							a.target = "_blank"
							a.click();
							a.remove();
							this._snackBar.open("Reporte de transacciones generado", 'Cerrar', { duration: 3000 });

						} else {
							this._snackBar.open("No se pudo generar el reporte de transacciones", 'Cerrar', { duration: 3000 });
						}
						this.loading = false;
					});

				}
				this.loading = false;
			});

			

			


		} else {
			this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
		}
		
		
		
	}

	migration(): void {


		this._dialog.open(
			LoaderFacturacionBloqueDialog,
			{disableClose:true}
		)   
		
		this.serviciosService.Migration().subscribe((resp: any) => {  
		  if (resp.status != 200) {
			setTimeout(() => {
			 this._snackBar.open('Migracion completa','cerrar', { duration: 3000 });
			}, 5000);
		  } else {
			this._snackBar.open('Error al hacer la migración.', 'Cerrar', { duration: 3000 });
		  }
		  setTimeout(() => {
			this._dialog.closeAll();
		  }, 7000);
		},error=>{
			this._snackBar.open('Error al hacer la migración.', 'Cerrar', { duration: 3000 });
			this._dialog.closeAll();
		});

	   }
		


}
