import { Component, ViewChild, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';
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
   selector: 'estados-pendiente-labores-dialog',
   templateUrl: './estados-pendiente-labores-dialog.html',
})
export class EstadosPendienteLaboresDialog implements OnInit {

   user: object;
   loading: boolean = true;
   estadoSelected = 0;
   estadoSelectedPendiente = [];
   cargando = false;
   estadosDef = [];
   estadosDefPendientes = [];

   constructor(
      public dialogRef: MatDialogRef<EstadosPendienteLaboresDialog>,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data
   ) {

   }

   ngOnInit() {
      this.cargando = true;
      this.user = this._vars.user.source['value'];
      this.data['estados'].forEach((estado, index) => {
         if (index <= 2) {
            this.estadosDef.push(estado);
         } else {
            this.estadosDefPendientes.push(estado)
         }

      });

      this._api.getEstadosLaborePenidentes(this.user['token'], this.data['labor']['idlaborop']).subscribe(
         (respont) => {
            if (respont['code'] == 200 && respont['data'].length) {
               respont['data'].forEach(estadoPendiente => {
                  this.estadoSelectedPendiente.push(estadoPendiente);
               });;
            }
            this.cargando = false;

         }
      );
   }


   async selectEstado() {

      if (this.estadoSelected > 0) {
         this.cargando = true;

         this._api.editarEstadosValidacionDocumentoLabores(this.user['token'], { idlaborop: this.data['labor']['idlaborop'], idestadodocumento: this.estadoSelected, idestadospendientes: this.estadoSelectedPendiente }).subscribe(
            (resultado) => {
               if (resultado['code'] == 200) {
                  this._snackBar.open(resultado['msg'], 'Cerrar', { duration: 3000 });
                  this.dialogRef.close({ code: 200, selec: this.estadoSelected });
                  this.cargando = false;

               } else {
                  this._snackBar.open(resultado['msg'] + ' Error.', 'Cerrar', { duration: 3000 });
                  this.cargando = false;
               }

            }
         );
      }
   }

}
