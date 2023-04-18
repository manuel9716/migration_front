import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';

// Material
import { MatSnackBar } from '@angular/material/snack-bar';

// Servicios
import { VarsService } from 'src/app/services/vars.service';
import { MunicipiosService } from '../../services/municipios.service';

// RXJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Interfaces
import { MunicipioInterface } from '../../models/MunicipioInterface';

@Component({
	selector: 'app-edit-municipio',
	templateUrl: './edit-municipio.component.html',
	styleUrls: ['./edit-municipio.component.css'],
	animations: fuseAnimations
})
export class EditMunicipioComponent implements OnInit, OnDestroy {

	// $obs
	private $destroy: Subject<boolean> = new Subject<boolean>();

	public user: any;
	
	idMunicipio: string;
	municipio: MunicipioInterface;
	
	constructor(
		private _route: ActivatedRoute,
		private _vars: VarsService,
		private _municipiosservice: MunicipiosService,
		private _snackBar: MatSnackBar,
		private _router: Router,
	) {

		this._vars.user.pipe(takeUntil(this.$destroy)).subscribe((user:any) => {
			
			// Verificar Permisos
			if(user){
				if( !this._vars.getProp(user['permisos'], 'municipios.barrios') && 
					!this._vars.getProp(user['permisos'], 'municipios.planes')
				)
				{
					this._router.navigate(['/municipios'])
				}
				this.user = user;
			} 
		});

		this.idMunicipio = this._route.snapshot.params.idmunicipio;
	}
	
	ngOnInit(): void {
		
		this._municipiosservice.getMunicipiosById(this.user['token'], this.idMunicipio).pipe(takeUntil(this.$destroy)).subscribe(response => {
			if (response['code'] == 200) {
				
				this.municipio = response['data'];
			} else {
				this._snackBar.open("No se pudo obtener el municipio.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['municipios'])
			}
		});
		
	}


	back(){
		this._router.navigate(['/municipios'], {queryParams: {"idDepartamento": this.municipio.iddepartamento}});
	}

	
	ngOnDestroy(): void {
		this.$destroy.next();
		this.$destroy.complete();
	}
	
}
