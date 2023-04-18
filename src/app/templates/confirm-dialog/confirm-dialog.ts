import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
   selector: 'dialog-overview-example-dialog',
   templateUrl: './confirm-dialog.html',
})
export class ConfirmsDialog {

   constructor(
      public dialogRef: MatDialogRef<ConfirmsDialog>,
      @Inject(MAT_DIALOG_DATA) public data) {
   }

   cancel(): void {
      this.dialogRef.close();
   }

}