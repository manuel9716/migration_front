import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'loader-facturacion-bloque-dialog',
    templateUrl: './loader-facturacion-bloque-dialog.html',
})
export class LoaderFacturacionBloqueDialog {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<LoaderFacturacionBloqueDialog>,
        
    ) {


    }
    closeDialog() {
        this.dialogRef.close('migración completa');
      }
}