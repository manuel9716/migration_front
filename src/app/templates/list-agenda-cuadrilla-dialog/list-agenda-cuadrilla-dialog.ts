import { Component, ViewChild, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';


@Component({
   selector: 'list-agenda-cuadrilla-dialog',
   templateUrl: './list-agenda-cuadrilla-dialog.html',
})
export class ListAgendaCuadrillaDialog implements OnInit {

   user: object;
   loading: boolean = true;;

	displayedColumns: string[] = ['estado', 'fechacreado', 'numeroservicio', 'nombretiposolicitud', 'nombrestercero', 'descripciondireccion'];

   dataSource: MatTableDataSource<any>;

   date:any = new Date();

   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
   @ViewChild(MatSort, { static: true }) sort: MatSort;

   constructor(
      public dialogRef: MatDialogRef<ListAgendaCuadrillaDialog>,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data
   ) { }

   ngOnInit() {
      this.user = this._vars.user.source['value'];
      this.search(this.date);
   }


   search(date){
      
      let json = {
         estado: 'pendientes',
         cuadrillas: [this.data['idservicio']]
      }
      
      this._api.getAgendaByCriteria(json, this.user['token']).subscribe(response => {
         if (response["code"] == 200) {
            this.dataSource = new MatTableDataSource(response["data"]);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
         } else {
            this.dialogRef.close();
            this._snackBar.open("No se pudieron consultar las agendas cuadrillas.", 'Cerrar', { duration: 3000 });
         }
         this.loading = false;
      });
   }

}
