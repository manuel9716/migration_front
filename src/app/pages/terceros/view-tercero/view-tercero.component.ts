import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
	selector: 'app-view-tercero',
	templateUrl: './view-tercero.component.html',
	styleUrls: ['./view-tercero.component.css'],
	animations: fuseAnimations
})
export class ViewTerceroComponent implements OnInit {

	form: FormGroup;
	user: object = this._vars.user.source['value'];
	idTercero: number;

	areas: object[];
	cargos: object[];
	tiposdocumentos: object[];
	tiposterceros: object[];

	loading: boolean;
	load: boolean = true;
	error: string;
	tercero: object;
	breadcrumb: string;
	selectedTab: number;

	tiposTer: object[];
	cargosTer: object[];

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _snackBar: MatSnackBar,
		private _api: ApiService,
		private _vars: VarsService,
		private _formBuilder: FormBuilder,
	) {
		this.idTercero = this._route.snapshot.params.id;
		if (!this.idTercero && !this.user['permisos']['terceros']['crear']) { this._router.navigate(['/']) }
	}

	ngOnInit() {

		this.breadcrumb = this.idTercero ? 'Editar' : 'Crear';

		this._api.getEntitiesTerceros(this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.areas = response['areas'];
				this.cargos = response['cargos'];
				this.tiposdocumentos = response['tiposdocumentos'];
				this.tiposterceros = response['tiposterceros'];
			} else {
				this._snackBar.open('No se pudieron cargar las entidades de terceros', 'Cerrar', { duration: 3000 });
				this._router.navigate(['/terceros']);
			}
		});


		this.form = this._formBuilder.group({
			idtercero: [''],
			numerotercero: [''],
			nombres: ['', [Validators.required, Validators.maxLength(100)]],
			apellidos: ['', Validators.maxLength(100)],
			idtipodocumento: ['', [Validators.required]],
			identificacion: ['', [Validators.required, Validators.maxLength(20), Validators.pattern("^[0-9]*$")]],
			sexo: [''],
			fnacimiento: [''],

			facagrupada: [false],
			idarea: ['', [Validators.required]],
			idtiposterceros: [[]],
			idcargos: [[]],

			creado: [''],
			editado: [''],
		});


		if (this.idTercero) {
			this._api.viewTercero(this._route.snapshot.params.id, this.user['token']).subscribe(response => {
				if (response["code"] == 200) {

					this.tercero = response['data'];
					this.tiposTer = response['tipos'];
					this.cargosTer = response['cargos'];

					response['data'].nombrearea = response['data'].idarea.nombre;
					response['data'].idarea = response['data'].idarea.idarea;
					response['data'].nombretipodocumento = response['data'].idtipodocumento.nombre;
					response['data'].idtipodocumento = response['data'].idtipodocumento.idtipo;
					response['data'].creado = new Date(response['data'].creado.timestamp * 1000).toLocaleString();
					if (response['data'].fnacimiento) { response['data'].fnacimiento = new Date(response['data'].fnacimiento.timestamp * 1000); }
					if (response['data'].editado) { response['data'].editado = new Date(response['data'].editado.timestamp * 1000).toLocaleString(); }
					response['data']['idcargos'] = [];
					response['data']['idtiposterceros'] = [];

					this.tiposTer.forEach(tt => {
						response['data']['idtiposterceros'].push(JSON.parse(JSON.stringify(tt['idtipo'])));
					});

					this.cargosTer.forEach(ct => {
						response['data']['idcargos'].push(JSON.parse(JSON.stringify(ct['idcargo'])));
					});

					this.form.patchValue(response['data']);
					this.form.controls.idtercero.disable();
					this.form.controls.numerotercero.disable();
					this.form.controls.creado.disable();
					this.form.controls.editado.disable();

					if (!this.user['permisos']['terceros']['editar']) { this.form.disable() }

					this.load = false;
					this.checkTab();

				} else {
					this._snackBar.open("No se pudo cargar la información del tercero", 'Cerrar', { duration: 3000 });
					this._router.navigate(['/']);
				}
			});
		} else {
			this.load = false;
		}

	}


	changeTab(ev) {
		// if (ev.index == 0) { this.breadcrumb = 'Información' }
		if (ev.index == 0) { this.breadcrumb = this.idTercero ? 'Editar' : 'Crear' }
		if (ev.index == 1) { this.breadcrumb = 'Servicios' }
		if (ev.index == 2) { this.breadcrumb = 'Acuerdos pago' }
		if (ev.index == 3) { this.breadcrumb = 'Solicitudes' }
		if (ev.index == 4) { this.breadcrumb = 'Cuadrillas' }
		if (ev.index == 5) { this.breadcrumb = 'Direcciones' }
		if (ev.index == 6) { this.breadcrumb = 'Permisos' }
		this.selectedTab = ev.index;
	}


	checkTab() {
		if (this._route.snapshot.params.tab == 'servicios') {
			this.selectedTab = 1;
		} else if (this._route.snapshot.params.tab == 'acuerdos') {
			this.selectedTab = 2;
		} else if (this._route.snapshot.params.tab == 'solicitudes') {
			this.selectedTab = 3;
		} else if (this._route.snapshot.params.tab == 'cuadrillas') {
			this.selectedTab = 4;
		} else if (this._route.snapshot.params.tab == 'direcciones') {
			this.selectedTab = 5;
		} else if (this._route.snapshot.params.tab == 'permisos') {
			this.selectedTab = 6;
		}
		this.changeTab({ index: this.selectedTab })
	}


	onSubmit() {

		if (this.form.valid) {

			this.loading = true;
			this.error = null;

			let json = JSON.parse(JSON.stringify(this.form.value));

			if (this.idTercero) {
				// EDITAR
				if (this.user['permisos']['terceros']['editar']) {

					json['idtercero'] = this.idTercero;

					// Obtener los cargos a crear
					json['idcargos'].forEach(newCar => {
						let isNew = true;
						this.cargosTer.forEach(oldCar => {
							if (newCar == oldCar['idcargo']) { isNew = false; }
						});
						if (isNew) { this.cargosTer.push({ idcargo: newCar, action: "create" }) }
					});

					// Obtener los cargos a eliminar
					this.cargosTer.forEach(oldCar => {
						let toDelete = true;
						json['idcargos'].forEach(newCar => {
							if (oldCar['idcargo'] == newCar) { toDelete = false; }
						});
						if (toDelete) { oldCar['action'] = "delete"; }
					});

					// Obtener los tipos de tercero a crear
					json['idtiposterceros'].forEach(newTip => {
						let isNew = true;
						this.tiposTer.forEach(oldTip => {
							if (newTip == oldTip['idtipo']) { isNew = false; }
						});
						if (isNew) { this.tiposTer.push({ idtipo: newTip, action: "create" }) }
					});

					// Obtener los tipos de tercero a eliminar
					this.tiposTer.forEach(oldTip => {
						let toDelete = true;
						json['idtiposterceros'].forEach(newTip => {
							if (oldTip['idtipo'] == newTip) { toDelete = false; }
						});
						if (toDelete) { oldTip['action'] = "delete"; }
					});

					json['idtiposterceros'] = this.tiposTer;
					json['idcargos'] = this.cargosTer;

					this._api.editTercero(json, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							this._snackBar.open("Tercero editado", 'Cerrar', { duration: 3000 });
							this._router.navigateByUrl('/terceros', { skipLocationChange: true }).then(() => {
								this._router.navigate(['tercero/' + this.idTercero]);
							});

						} else {
							this.error = response['msg'];
						}
						this.loading = false;
					});

				} else {
					this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
				}
			} else {
				// CREAR
				if (this.user['permisos']['terceros']['crear']) {
					this._api.createTercero(json, this.user['token']).subscribe(response => {
						if (response['code'] == 200) {
							this._snackBar.open("Tercero creado", 'Cerrar', { duration: 3000 });
							this._router.navigate(['tercero/' + response['data'].idtercero])
						} else {
							this.error = response['msg'];
						}
						this.loading = false;
					});
				} else {
					this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
				}
			}
		}

	}


	cancel() {
		this._router.navigate(['terceros']);
	}

}
