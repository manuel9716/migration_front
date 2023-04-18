import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fuseAnimations } from 'src/app/animations/custom.animation';

// Material
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Services
import { TransaccionesService } from '../transacciones.service'; 
import { VarsService } from 'src/app/services/vars.service';

// RXJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-list-transacciones',
	templateUrl: './list-transacciones.component.html',
	styleUrls: ['./list-transacciones.component.css'],
	animations: fuseAnimations
})
export class ListTransaccionesComponent implements OnInit, OnDestroy {
	
	user: object = this._vars.user.source['value'];
	loading: boolean;

	filters: object;

	conveniosPago: any[];
	estadosTransaccion: any[];


	//fechapago:2022-05-05
//valor:30000
//numerofactura:555555
//numerocomprobante:GNE0000012
//idestadotransaccion:3
//idconveniopago:3
	
	displayedColumns: string[] = ['idtransaccion', 'identificacion','numerofactura', 'numerocomprobante',  'valor', 'fechapago', 'nombreestadotransaccion', 'nombreconveniopago'];
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	private _unsubscribeAll: Subject<any> = new Subject<any>();
	
	constructor(
		private _transaccionesService: TransaccionesService,
		private _vars: VarsService,
		private _snackBar: MatSnackBar,
		private _router: Router,
	) {
		if (!this.user['permisos']['transacciones']) { this._router.navigate(['/']) }
	}
	
	ngOnInit() {
		this.resetFilters();
		this.getFilterData();
		this.search();
	}


	ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


	getFilterData(){
		this._transaccionesService.listConveniosPago(this.user['token']).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
			if (response['code'] == 200) {
				this.conveniosPago = response['data'];
			} else {
				this._snackBar.open("No se pudo obtener los convenios de pago.", 'Cerrar', { duration: 3000 });
			}
		});

		this._transaccionesService.listEstadosTransacciones(this.user['token']).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
			if (response['code'] == 200) {
				this.estadosTransaccion = response['data'];
			} else {
				this._snackBar.open("No se pudo obtener los estados de transacciones.", 'Cerrar', { duration: 3000 });
			}
		});
	}


	resetFilters(){
		this.filters = {
			identificacion: null,
			numerofactura: null,
			numerocomprobante: null,
			valor: null,
			fechapago: null,
			idconveniospago: [],
			idestadostransaccion: [],
		}
	}
		
	search(){

		this.loading = true;

		let formData = new FormData();		

		if(this.filters['identificacion']){
			formData.append("identificacion", this.filters['identificacion']);
		}

		if(this.filters['numerofactura']){
			formData.append("numerofactura", this.filters['numerofactura']);
		}

		if(this.filters['numerocomprobante']){
			formData.append("numerocomprobante", this.filters['numerocomprobante']);
		}

		if(this.filters['valor']){
			formData.append("valor", this.filters['valor']);
		}

		if(this.filters['fechapago']){			
			formData.append("fechapago", this.filters['fechapago'].toISOString().split('T')[0]);
		}

		if(this.filters['idconveniospago'].length > 0){
			formData.append("idconveniospago", JSON.stringify(this.filters['idconveniospago']));
		}

		if(this.filters['idestadostransaccion'].length > 0){
			formData.append("idestadostransaccion", JSON.stringify(this.filters['idestadostransaccion']));
		}

		
		this._transaccionesService.listTransacciones(formData, this.user['token']).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {			
			if (response['code'] == 200) {
				this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			} else {
				this._snackBar.open("No se pudo obtener las transacciones.", 'Cerrar', { duration: 3000 });
				this._router.navigate(['/'])
			}

			this.loading = false;
		});
	}
	
	
}
