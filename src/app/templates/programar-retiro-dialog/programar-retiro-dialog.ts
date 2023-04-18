import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
   selector: 'programar-retiro-dialog',
   templateUrl: './programar-retiro-dialog.html',
})
export class ProgramarRetiroDialog {

   form: FormGroup;
   minDate = new Date();
  

   constructor(
      private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<ProgramarRetiroDialog>,
      @Inject(MAT_DIALOG_DATA) public data,
   ) {

      this.form = this._formBuilder.group({
         fecharetiro: ['', [Validators.required]],
         observaciones: ['', [Validators.maxLength(300)]],
      });

      // this.minDate.setDate(this.minDate.getDate() + 1);
     
   }

   cancel(): void {
      this.dialogRef.close();
   }

   onSubmit() {
      if (this.form.valid) {
         this.dialogRef.close(this.form.value)
      }
   }

}