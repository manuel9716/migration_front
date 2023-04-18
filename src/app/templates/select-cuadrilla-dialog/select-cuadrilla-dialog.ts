import { Component, ViewChild, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

export interface TercerosData {
   idservicio: number;
   numeroservicio: number;
   nombres: string;
   apellidos: string;
   idtercero: number;
   numerotercero: number;
}


@Component({
   selector: 'select-cuadrilla-dialog',
   templateUrl: './select-cuadrilla-dialog.html',
})
export class SelectCuadrillaDialog implements OnInit {

   user: object;
   loading: boolean = true;;
   cuadrillaSearch: string;
  
   displayedColumns: string[] = ['numeroservicio', 'nombres', 'actions'];

   dataSource: MatTableDataSource<TercerosData>;

   @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
   @ViewChild(MatSort,{static: true}) sort: MatSort;

   constructor(
      public dialogRef: MatDialogRef<SelectCuadrillaDialog>,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,
   ) { }

   ngOnInit() {
      this.user = this._vars.user.source['value'];

      this._api.getServicioscuadrillas(this.user['token']).subscribe(response => {
         if (response["code"] == 200) {
            this.dataSource = new MatTableDataSource(response["data"]);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
         } else {
            this.dialogRef.close();
            this._snackBar.open("No se pudieron consultar las cuadrillas.", 'Cerrar', { duration: 3000 });
         }
         this.loading = false;
      });
   }


   selectCuadrilla(cuadrilla) {
      this.dialogRef.close(cuadrilla);
   }

   applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
