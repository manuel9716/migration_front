import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

export interface PlanesData {
	idplan: number;
	nombre: string;
	valorsiniva: number;
	iva: number;
	mesespermanencia: number;
	idgeografia: number;
	idtipoplan: number;
	idtiposervicio: number;
	valorinstalacionclausula: number;
	valorinstalacionsinclausula: number;
	velmaxdescargambps: number;
	velmaxcargambps: number;
	reuso: number;
	ipv4publica: boolean;
	ipv6publica: boolean;
	aperturapuertos: boolean;
}


@Component({
   selector: 'select-plan-dialog',
   templateUrl: './select-plan-dialog.html',
})
export class SelectPlanDialog implements OnInit {

   user: object;
   loading: boolean;

   geografias: object[];
   tiposPlanes: object[];
   tiposServicios: object[];
   planSearch: string;
   
   displayedColumns: string[] = ['nombre', 'valorsiniva', 'iva', 'mesespermanencia', 'idgeografia', 'idtipoplan', 'idtiposervicio', 'valorinstalacionclausula', 'valorinstalacionsinclausula', 'velmaxdescargambps', 'velmaxcargambps', 'reuso', 'ipv4publica', 'ipv6publica', 'aperturapuertos', 'actions'];

	dataSource: MatTableDataSource<PlanesData>;
 
	@ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
	@ViewChild(MatSort,{static: true}) sort: MatSort;
 
   constructor(
      @Inject(MAT_DIALOG_DATA) public data,
      public dialogRef: MatDialogRef<SelectPlanDialog>,
      private _snackBar: MatSnackBar,
      private _api: ApiService,
      private _vars: VarsService,
   ) { } 

   ngOnInit() {
      this.user = this._vars.user.source['value'];
      this.geografias = this._vars.geografias;
      this.tiposPlanes = this._vars.tiposPlanes;
      this.tiposServicios = this._vars.tiposServicios;
      this.getPlanes();
   }

   applyFilter(filterValue: string) {
     this.dataSource.filter = filterValue.trim().toLowerCase();
   }


   getPlanes(){

      this.loading = true;

      this._api.getFullPlanes(null, this.user['token']).subscribe(response => {
         if (response["code"] == 200) {

            // Excluidos
            if(this.data && this.data['exclude']){
               response["data"] = response["data"].filter(plan => !this.data['exclude'].includes(plan.idplan))
            }
                       
            this.dataSource = new MatTableDataSource(response["data"]);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
         } else {
            this.dialogRef.close();
            this._snackBar.open("Error al obtener listado de planes", 'Cerrar', {duration: 3000});
         }
         this.loading = false;
      });
   }

   selectPlan(plan){
      this.dialogRef.close(plan);
   }

}
