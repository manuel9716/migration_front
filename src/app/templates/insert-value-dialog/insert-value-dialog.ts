import { Component, Inject, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
   selector: 'insert-value-dialog',
   templateUrl: './insert-value-dialog.html',
})
export class insertValueDialog implements AfterViewInit {

   form: FormGroup;
   
   @ViewChild('valueInput',{static: true}) el:ElementRef; 

   constructor(
      private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<insertValueDialog>,
      @Inject(MAT_DIALOG_DATA) public data,
      private rd: Renderer2
   ) {

      this.form = this._formBuilder.group({
         value: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      });
     
   }

   ngAfterViewInit() { 
      this.el.nativeElement.focus();
}

   cancel(): void {
      this.dialogRef.close();
   }

   onSubmit() {
      if (this.form.valid) {
         this.dialogRef.close(this.form.controls['value'].value)
      }
   }

}