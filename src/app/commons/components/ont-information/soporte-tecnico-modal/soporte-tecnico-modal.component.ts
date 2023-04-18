import { Component, Inject, OnInit } from '@angular/core';

import { SoporteTecnicoService } from '../services/soporte-tecnico.service';

import {MAT_DIALOG_DATA} from '@angular/material/dialog';



@Component({
	selector: 'app-soporte-tecnico-modal',
	templateUrl: './soporte-tecnico-modal.component.html',
	styleUrls: ['./soporte-tecnico-modal.component.css']
})
export class SoporteTecnicoModalComponent implements OnInit {
	
	
	constructor( 
		private SoporteTecnicoService: SoporteTecnicoService,
		@Inject(MAT_DIALOG_DATA) public data
	) { }
	
	ngOnInit(){
		this.SoporteTecnicoService.getOnuFullStatusInfoComplete( this.data.noService, this.data.ipService, this.data.city );
		this.SoporteTecnicoService.getPrtgStatus( this.data.city )
		
	}
}
