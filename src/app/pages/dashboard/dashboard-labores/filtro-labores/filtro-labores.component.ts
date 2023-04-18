//Core
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import * as moment from 'moment';
//Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
//Services
import { ServiciosData } from 'src/app/pages/servicios/list-servicios/list-servicios.component';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
//Modesl

//Dialogs
import { SelectCuadrillaDialog } from 'src/app/templates/select-cuadrilla-dialog/select-cuadrilla-dialog';


import * as c3 from 'c3';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
	selector: 'app-filtro-labores',
	templateUrl: './filtro-labores.component.html',
	styleUrls: ['./filtro-labores.component.css'],
	animations: fuseAnimations
})
export class FiltroLaboresComponent implements OnInit {

	user = this._vars.user.source['value'];
	

	displayedColumns: string[] = ["action", 'Día', 'Tiempo / Minimo', 'Acum / (Mins)', 'Meta / día'];
	dataSource: MatTableDataSource<ServiciosData>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	// fORMULARIOS DE FILTROS
	formLaboresFiltrosCuadrilla = this._fb.group(
		{
			//Datos Nuevos
			fechaInicial: [new Date(new Date().getFullYear(), new Date().getMonth(), 1),],
			fechaFinal: [new Date(),],
			cuadrilla: ['',],
			validacion: [false,],

		}
	)

	cusdrillaselect;
	loading= false;

	dailyGoal: number = 420;
	totalTiempo: number = 0;
	labores = [];
	chart: any;


	constructor(
		private _vars: VarsService,
		private _fb: FormBuilder,
		public _dialog: MatDialog,
		private _api: ApiService,
		private _snackBar: MatSnackBar,
		private _router: Router,
	) {

		if (this.user['permisos']['dashboard'] == undefined || !this.user['permisos']['dashboard']['labores']) {
			this._router.navigate(['/'])
		}
		// this.generarPdf();
	}

	ngOnInit(): void {

		this.buscarDatosDB();

	}


	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	public borrarFiltro(): void {
		this.dataSource = null;
		this.formLaboresFiltrosCuadrilla.reset();
		this.formLaboresFiltrosCuadrilla.controls.fechaInicial.setValue('');
		this.formLaboresFiltrosCuadrilla.controls.fechaFinal.setValue('');
		this.formLaboresFiltrosCuadrilla.controls.cuadrilla.setValue('');
		this.formLaboresFiltrosCuadrilla.controls.validacion.setValue('');
	}


	ObtenrCuadrilla() {
		const dialogRef = this._dialog.open(SelectCuadrillaDialog, { width: '80%' });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.cusdrillaselect = result;
				this.formLaboresFiltrosCuadrilla.controls.cuadrilla.setValue(result.idservicio);
				if (this.formLaboresFiltrosCuadrilla.controls.fechaInicial.value != "" && this.formLaboresFiltrosCuadrilla.controls.fechaFinal.value != "") {
					this.buscarDatosDB();
				}
			}
		});


	}


	buscarDatosDB() {

		this.loading = true;
		
		var consulata = {
			finicial:moment( this.formLaboresFiltrosCuadrilla.controls.fechaInicial.value). format("YYYY-MM-DD"),
			ffinal: moment (this.formLaboresFiltrosCuadrilla.controls.fechaFinal.value).format("YYYY-MM-DD"),
			idcuadrilla: this.formLaboresFiltrosCuadrilla.controls.cuadrilla.value,
			validaciondocumento: this.formLaboresFiltrosCuadrilla.controls.validacion.value
		}
		

		//var consulata = {finicial:"2020-01-01",ffinal:"2021-05-21",idcuadrilla:8632,validaciondocumento:true}

		

		this._api.dashboardbycuadrilla(this.user["token"], consulata).subscribe((respont) => {
			if (respont['code'] == 200) {
				this.labores = [];
				let dbData = respont['data'];
				let keys = Object.keys(dbData);	
				for(let i=0; i< keys.length; i++){
					this.labores.push({
						date:  keys[i],
						sum: dbData[keys[i]]['suma'],
						cant: dbData[keys[i]]['cantidad'],
						status: true
					})
				}	
				this.prepareData();	
				
				this.dataSource= new MatTableDataSource(this.labores);
				this.dataSource.paginator= this.paginator;
				this.dataSource.sort= this.sort;	

				if(this.labores.length==0){
					this._snackBar.open(" No hay labores registradas en el periodo digitado.", 'Cerrar', { duration: 3000 });
				}
			} else {
				

			}
			this.loading = false;
		});
	}

	prepareData(){				
		let acum = 0;
		let goal = 0;
		this.totalTiempo = 0;
		this.labores.forEach(lab => {
			lab['acum'] = null;
			lab['goal'] = null;
			if(lab['status']){
				acum += lab['sum'];
				goal += this.dailyGoal;
				lab['acum'] = acum;
				lab['goal'] = goal;
				this.totalTiempo += lab['sum'];
			}
		});

		//Graficar

		setTimeout(() => {
			this.graph();
		}, 0);
	}

	graph(){		
		let data: any[] = [
			['x'],
            ['Acum(Mins)'],
            ['Meta/Día']
		]

		this.labores.forEach(lab => {
			if(lab['status']){
				data[0].push(lab['date']);
				data[1].push(lab['acum']);
				data[2].push(lab['goal']);
			}
		});
		
		this.chart = c3.generate({
			bindto: '#chart',
			data: {
				x: 'x',
				columns: data,
				type: 'line',
				labels: true,
				empty: { label: {text: "Loading..."}}
			},
			axis: {
				x: {
					type: 'timeseries',
					tick: {
						format: '%d-%b-%Y',
						fit: true,
						rotate: 90,
               			multiline: true,						
						culling:false
					}
				},
				y:{
					label: {
						text: 'Minutos',
						position: 'outer-middle'
					},
				}
			},
			color: {
				pattern: ['#3880ff', '#DA2000']
			},
			resize:{
				auto: true
			},			
			
		});
		
	}


	generarPdf(){
		// Extraemos el
		this.loading= true
		const DATA = document.getElementById('zonImprimir');
		const doc = new jsPDF('p', 'pt', 'legal');
		const options = {
		  background: 'white',
		  scale: 1
		};
		html2canvas(DATA, options).then((canvas) => {
			this.loading= false
			const img = canvas.toDataURL('image/PNG');
			// Add image Canvas to PDF
			const bufferX = 15;
			const bufferY = 15;
			const imgProps = (doc as any).getImageProperties(img);
			const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
			const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
			doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
			doc.save(`${this.cusdrillaselect.numeroservicio}__${moment (this.formLaboresFiltrosCuadrilla.controls.fechaInicial.value).format("YYYY-MM-DD")}_${moment (this.formLaboresFiltrosCuadrilla.controls.fechaFinal.value).format("YYYY-MM-DD")}${this.formLaboresFiltrosCuadrilla.controls.validacion.value?"__convalidacion":"__sinvalidacion"}.pdf`);
		  	return doc;
			
		})
		
	}
}
