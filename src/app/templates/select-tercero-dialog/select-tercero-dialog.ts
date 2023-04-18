import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

export interface TercerosData {
   idtercero: number;
   numerotercero: number;
   nombres: string;
   apellidos: string;
   identificacion: string;
}

@Component({
   selector: 'select-tercero-dialog',
   templateUrl: './select-tercero-dialog.html',
})
export class SelectTerceroDialog implements OnInit {

   user: object = this._vars.user.source['value'];
   loading: boolean;
   alreadySearch: boolean;
   searchCriteria: object = { criteria: [], value: "", onlyusers: false };

   displayedColumns: string[] = ['idtercero', 'numerotercero', 'nombres', 'apellidos', 'identificacion', 'actions'];

   dataSource: MatTableDataSource<TercerosData>;

   @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
   @ViewChild(MatSort,{static: true}) sort: MatSort;

   constructor(
      public dialogRef: MatDialogRef<SelectTerceroDialog>,
      @Inject(MAT_DIALOG_DATA) public data,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,
   ) {
   }

   ngOnInit() {
      if(this.data.onlyEmployees && this.data.onlyEmployeesDefault){
         this.searchCriteria['onlyusers'] = true;
      }
      
   }

   resetFilters() {
      this.searchCriteria = { criteria: [], value: "", onlyusers: false };
      if(this.data.onlyEmployees && this.data.onlyEmployeesDefault){
         this.searchCriteria['onlyusers'] = true;
      }
   }

   search() {
      if (this.searchCriteria['criteria'].length > 0 || this.searchCriteria['value'].length > 0) {
         this.loading = true;
         this.alreadySearch = true;
         this._api.searchTerceroByCriteria(this.searchCriteria, this.user['token']).subscribe(response => {
            if (response["code"] == 200) {
               this.dataSource = new MatTableDataSource(response["data"]);
               this.dataSource.paginator = this.paginator;
               this.dataSource.sort = this.sort;
            } else {
               this.dialogRef.close();
               this._snackBar.open("No se pudo consultar los terceros.", 'Cerrar', { duration: 3000 });
            }
            this.loading = false;
         });
      }

   }

   selectTercero(tercero) {
      this.dialogRef.close(tercero);
   }

}
