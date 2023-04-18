import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';

import { VarsService } from 'src/app/services/vars.service';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-create-edit-sol-servicio',
	templateUrl: './create-edit-sol-servicio.component.html',
	styleUrls: ['./create-edit-sol-servicio.component.css'],
	animations: fuseAnimations
})
export class CreateEditSolServicioComponent implements OnInit {

	form: FormGroup;

	user: object = this._vars.user.source['value'];;
	error: string;
	load: boolean = true;
	loading: boolean = false;
	servicio: object;
	grupos: object[];
	tipos: object[];
	tiposFiltrados: object[];
	currentGrupo: object;
	currentTipo: object;

	@ViewChild('solServicioStepper',{static: true}) private solicitudServicioStepper: MatStepper;

	constructor(
		private _formBuilder: FormBuilder,
		public _dialog: MatDialog,
		private _vars: VarsService,
		private _api: ApiService,
		private _snackBar: MatSnackBar,
		private _router: Router,
		private _route: ActivatedRoute,
	) {
		if(!this.user['permisos']['servicios']['solicitudes']['crear']){ this._router.navigate(['/']) }
	}

	ngOnInit() {

		this.form = this._formBuilder.group({
			nombrecontacto: ['', [Validators.maxLength(50)]],
			celularcontacto: ['', [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
			idtiposolicitudservicio: ['', [Validators.required]],
			observaciones: ['', Validators.maxLength(300)],
			idservicio: [this._route.snapshot.params.id],
			idnivelsolicitudservicio: [1],
			idestadosolicitudservicio: [1],
			idempleado: [this.user['idtercero']]
		});

		this._api.getEntitiesSolServicio(this._route.snapshot.params.id, this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.servicio = response['data'];
				this.grupos = response['grupos'];
				this.tipos = response['tipos'];
			} else {
				this._snackBar.open("No se pudo cargar el servicio.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/servicios'])
			}
			this.load = false;
		});
	}


	seleccionarGrupo(grupo) {
		this.currentGrupo = grupo;
		this.tiposFiltrados = [];
		this.tipos.forEach(tipo => {
			if (tipo['idgruposolicitudservicio'] == grupo.idgruposolicitudservicio) {
				this.tiposFiltrados.push(tipo);
			}
		});
	}

	seleccionarTipo(tipo) {
		this.currentTipo = tipo;
		this.form.patchValue({ idtiposolicitudservicio: tipo.idtiposolicitudservicio });
	}

	goForward() {
		this.solicitudServicioStepper.next();
	}

	createSolicitud(){
		if(this.form.valid){
			this.loading = true;
			this._api.createSolServicio(this.form.value, this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
					this._snackBar.open("Solicitud de servicio creada.", 'Cerrar', { duration: 3000 });
					this._router.navigate(['/servicio/' + this._route.snapshot.params.id + '/solicitudes'])
				} else {
					this.error = response['msg'];
				}
				this.loading = false;
			});
		}
	}



}
