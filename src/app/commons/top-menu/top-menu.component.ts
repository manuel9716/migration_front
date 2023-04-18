import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchTopMenuDialog } from 'src/app/templates/search-topbar-dialog/search-topbar-dialog';
import { VarsService } from '../../services/vars.service'
import { ApiService } from '../../services/api.service'
import { fuseAnimations } from 'src/app/animations/custom.animation';

@Component({
	selector: 'app-top-menu',
	templateUrl: './top-menu.component.html',
	styleUrls: ['./top-menu.component.css'],
	animations: fuseAnimations
})

export class TopMenuComponent implements OnInit {

	@ViewChild("searchTextInput") searchTextField: ElementRef;

	loading: boolean = false;
	user: object = this._vars.user.source['value'];
	searchPlaceholder: string = "Seleccione parametros de búsqueda...";
	searchStatus: boolean = false;
	searchText: any;
	searchConfig = {
		entity: null,
		property: null,
		value: null,
		exactly: true

	};

	terceroProperties = [
		{ name: "idtercero", alias: "ID" },
		{ name: "numerotercero", alias: "número" },
		{ name: "nombres", alias: "nombres" },
		{ name: "apellidos", alias: "apellidos" },
		{ name: "identificacion", alias: "identificación" },
		{ name: "email", alias: "email" },
	]

	constructor(
		public dialog: MatDialog,
		private _vars: VarsService,
		private renderer: Renderer2,
		private _api: ApiService,
		private _snackBar: MatSnackBar
	) { }

	ngOnInit() {

	}

	setSearchParams(entity, property) {
		this.searchPlaceholder = "Buscar por " + property.alias + " de " + entity + "...";
		this.searchConfig.entity = entity;
		this.searchConfig.property = property.name;
		setTimeout(() => { this.renderer.selectRootElement('#searchTextInput').focus(); }, 100);

	}


	search() {
		if (this.searchConfig.entity && this.searchConfig.property && this.searchConfig.value) {

			this.loading = true;

			this._api.topBarSearch(this.searchConfig, this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
					this.dialog.open(SearchTopMenuDialog, {
						width: '80%',
						data: { searchConfig: this.searchConfig, results: response['data'] }
					});
				} else {
					this._snackBar.open("No se pudo hacer la búsqueda por " + this.searchConfig.entity, 'Cerrar', { duration: 3000 });
				}
				this.loading = false;
			});

		}
	}


	logout() {
		this._vars.setUser(null);
	}


	uploadFacturacionBloque(ev) {
		if (ev.target.files.length > 0) {
			this.loading = true;
			this._api.importFacturacionBloque(ev.target.files[0], this.user['token']).subscribe(response => {
				this._snackBar.open(response['msg'], 'Cerrar', { duration: 5000 });
				this.loading = false;
			});
		}
	}


	uploadEstadosCuentas(ev) {
		if (ev.target.files.length > 0) {
			this.loading = true;
			this._api.importEstadosCuentas(ev.target.files[0], this.user['token']).subscribe(response => {
				this._snackBar.open(response['msg'], 'Cerrar', { duration: 5000 });
				this.loading = false;
			});
		}
	}


	getInactivos() {
		// this.loading = true;
		// this._api.getServiciosInactivos(this.user['token']).subscribe(response => {
		// 	if (response['code'] == 200) {
		// 		let a = document.createElement('a');
		// 		document.body.appendChild(a);
		// 		a.setAttribute('style', 'display: none');
		// 		a.href = "http://localhost/bitwan/api2.0/public/Deudores.txt";
		// 		a.target = "_blank"
		// 		a.click();
		// 		a.remove();
		// 		this._snackBar.open("Servicios inactivos listados", 'Cerrar', { duration: 3000 });
		// 	} else {
		// 		this._snackBar.open("No se pudo obtener los servicios inactivos", 'Cerrar', { duration: 3000 });
		// 	}
		// 	this.loading = false;
		// });

	}



}

