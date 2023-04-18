import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ConfirmsDialog } from 'src/app/templates/confirm-dialog/confirm-dialog'
import { Router } from '@angular/router';

export interface PlanesData {
   idplan: number,
   nombre: string,
   estado: boolean,
   valorsiniva: number,
   iva: number,
   idgeografia: number,
   idtipoplan: number,
   idtiposervicio: number,
   velmaxdescargambps: any,
   velmaxcargambps: any,
}

@Component({
   selector: 'app-list-planes',
   templateUrl: './list-planes.component.html',
   styleUrls: ['./list-planes.component.css'],
   animations: fuseAnimations
})
export class ListPlanesComponent implements OnInit {

   user: object = this._vars.user.source['value'];;
   loading: boolean;

   filterSearchParams = {
      idgeografia: [],
      idtipoplan: [],
      idtiposervicio: [],
   }

   planSearch: string;

   geografias: object[] = this._vars.geografias;;
   tiposPlanes: object[] = this._vars.tiposPlanes;;
   tiposServicios: object[] = this._vars.tiposServicios;;

   displayedColumns: string[] = ['estado', 'nombre', 'valorsiniva', 'iva', 'idgeografia', 'idtipoplan', 'idtiposervicio','idtecnologiaplan','velmaxdescargambps','velmaxcargambps', 'actions'];
   dataSource: MatTableDataSource<PlanesData>;
   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
   @ViewChild(MatSort, { static: true }) sort: MatSort;

   constructor(
      private _api: ApiService,
      private _vars: VarsService,
      public _dialog: MatDialog,
      private _snackBar: MatSnackBar,
      private _router: Router
   ) {
      if (!this.user['permisos']['planes']['listar']) { this._router.navigate(['/']) }
   }

   ngOnInit() {
      this.getPlanes(null);
   }


   getPlanes(filters) {
      this.loading = true;
      this._api.getPlanes(filters, this.user['token']).subscribe(response => {
         if (response["code"] == 200) {
            this.dataSource = new MatTableDataSource(response["data"]);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
         } else {
            this._snackBar.open("No se pudieron cargar los planes.", 'Cerrar', { duration: 3000 });
            this._router.navigate(['/'])
         }
         this.loading = false;
      });
   }

   deletePlan(plan) {

      if (this.user['permisos']['planes']['eliminar']) {
         const dialogConfigs = {
            title: "¿Está seguro de eliminar el plan?",
            subtitle: plan.nombre,
            done: '¡Estoy seguro!',
            cancel: 'Cancelar'
         }

         const dialogRef = this._dialog.open(ConfirmsDialog, {
            width: '40%',
            data: dialogConfigs
         });

         dialogRef.afterClosed().subscribe(result => {
            if (result) {
               this._api.deletePlan(plan.idplan, this.user['token']).subscribe(response => {
                  if (response["code"] == 200) {
                     this.getPlanes(null);
                     this._snackBar.open('Plan eliminado', 'Cerrar', { duration: 3000 });
                  } else {
                     this._snackBar.open('No se pudo elimina el plan', 'Cerrar', { duration: 3000 });
                  }
               });
            }
         });
      } else {
         this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
      }

   }


   applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
         this.dataSource.paginator.firstPage();
      }
   }

   filterSearch() {
      this.getPlanes(this.filterSearchParams);
   }

}
