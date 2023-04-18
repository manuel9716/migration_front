import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';

@Component({
   selector: 'create-edit-contacto-dialog',
   templateUrl: './create-edit-contacto-dialog.html',
   animations: fuseAnimations
})
export class CreatEditContactoDialog {

   form: FormGroup;
   user: object = this._vars.user.source['value'];
   loading: boolean;
   error: string;

   constructor(
      private _formBuilder: FormBuilder,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,
      public dialogRef: MatDialogRef<CreatEditContactoDialog>,
      @Inject(MAT_DIALOG_DATA) public data
   ) {

      this.form = this._formBuilder.group({
         nombres: ['', [Validators.required, Validators.maxLength(50)]],
         telefono: ['', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
         telefono2: ['', [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
         observaciones: ['', Validators.maxLength(200)],
      });

      if(this.data.entity){
         this.form.patchValue(this.data.entity);
         Object.keys(this.form.controls).forEach((key) => {this.form.get(key).markAsTouched();});
      }
     
   }

   cancel(): void {
      this.dialogRef.close();
   }

   onSubmit() {
      if (this.form.valid) {

         this.loading = true;
         this.error = null;

         if (this.data.entity) {

            if(this.user['permisos']['servicios']['contactos']['editar']){

               
            this.form.addControl('idcontacto', this._formBuilder.control(this.data.entity['idcontacto']));           
            this._api.editContactoServicio(this.form.value, this.user['token']).subscribe(response => {
               if (response['code'] == 200) {
                  this._snackBar.open('Contacto de servicio editado.', 'Cerrar', { duration: 3000 });
                  this.dialogRef.close(true);
               } else {
                  this.error = response['msg']
               }
               this.loading = false;
            });

            } else {
               this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
               this.cancel();
            }


         } else {

            if(this.user['permisos']['servicios']['contactos']['crear']){

               this.form.addControl('idservicio', this._formBuilder.control(this.data.idservicio));
               this._api.createContactoServicio(this.form.value, this.user['token']).subscribe(response => {
                  if (response['code'] == 200) {
                     this._snackBar.open('Contacto de servicio creado.', 'Cerrar', { duration: 3000 });
                     this.dialogRef.close(true);
                  } else {
                     this.error = response['msg'] 
                  }
                  this.loading = false;
               });

            } else {
               this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
               this.cancel();
            }

         }

      }
   }

}