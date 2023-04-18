import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
   selector: 'create-edit-dialog',
   templateUrl: './create-edit-dialog.html',
})
export class CreateEditDialog {

   form: FormGroup;
   loading: boolean = false;

   constructor(
      private _formBuilder: FormBuilder,
      private _api: ApiService,
      public dialogRef: MatDialogRef<CreateEditDialog>,
      @Inject(MAT_DIALOG_DATA) public data
   ) {

      this.form = this._formBuilder.group({
         nombre: ['', [Validators.required, Validators.maxLength(50)]],
         descripcion: ['', Validators.maxLength(200)],
      });

      if(this.data.entity){
         this.form.patchValue(data.entity);
         Object.keys(this.form.controls).forEach((key) => {this.form.get(key).markAsTouched();});
      }
     
   }

   cancel(): void {
      this.dialogRef.close();
   }

   onSubmit() {
      if (this.form.valid) {

         this.loading = true;

         if (this.data.entity) {

            this.form.addControl(this.data.nameIdEntity, this._formBuilder.control(this.data.entity[this.data.nameIdEntity]));
            this._api['edit' + this.data.nameEntity](this.form.value, this.data.token).subscribe(response => {
               if (response['code'] == 200) {
                  this.dialogRef.close(true);
               }
               this.loading = false;
            });

         } else {
            this._api['create' + this.data.nameEntity](this.form.value, this.data.token).subscribe(response => {
               if (response['code'] == 200) {
                  this.dialogRef.close(true);
               }
               this.loading = false;
            });

         }

      }
   }

}