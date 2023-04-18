import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
   selector: 'programar-suspension-dialog',
   templateUrl: './programar-suspension-dialog.html',
})
export class ProgramarSuspensionDialog {

   form: FormGroup;
   minDate = new Date();
   minDate2: any;

   @Output() dateChange:EventEmitter< MatDatepickerInputEvent< any>>;

   constructor(
      private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<ProgramarSuspensionDialog>,
      @Inject(MAT_DIALOG_DATA) public data,
   ) {

      this.minDate.setDate(this.minDate.getDate() + 1);

      this.form = this._formBuilder.group({
         fechainicio: ['', [Validators.required]],
         fechafin: ['', [Validators.required]],
      });
     
   }

   getMinDate2(date: any) {  
      this.minDate2 = new Date(date.value);
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