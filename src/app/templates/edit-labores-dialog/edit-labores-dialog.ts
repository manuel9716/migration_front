import { Component, ViewChild, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef,   } from '@angular/material/dialog';
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
   selector: 'edit-labores-dialog',
   templateUrl: './edit-labores-dialog.html',
})
export class EditLaboresDialog implements OnInit {

   user: object;
   loading: boolean = true;

   constructor(
      public dialogRef: MatDialogRef<EditLaboresDialog>,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data
   ) { 

   }

   ngOnInit() {
      this.user = this._vars.user.source['value'];      
   }


   selectCuadrilla(cuadrilla) {
      this.dialogRef.close(cuadrilla);
      this._snackBar.open('open',);
   }

}
