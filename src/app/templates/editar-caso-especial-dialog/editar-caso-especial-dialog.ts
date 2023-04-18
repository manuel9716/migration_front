import { Component, Inject, ViewChild, ElementRef, Renderer2, AfterViewInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

@Component({
   selector: 'editar-caso-especial-dialog',
   templateUrl: './editar-caso-especial-dialog.html',
})
export class EditarCasoEspecialDialog {

   form: FormGroup;
   user: object = this._vars.user.source['value'];
   loading: boolean;

   constructor(
      @Optional() @Inject(MAT_DIALOG_DATA) public data,
      private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<EditarCasoEspecialDialog>,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,

   ) {

      this.form = this._formBuilder.group({
         idcasoespeciales: ['', Validators.required],
         descripcion: ['', [Validators.required]],
         tiempo: ['', [Validators.required]],
      });
      this.form.patchValue(data);
      this.form.controls.descripcion.disable();
   
   }

   onSubmit(){
      if(this.form.valid){
         let json = this.form.value;
         this.loading = true;
         this._api.editCasoEspecial(json, this.user['token']).subscribe(response => {
            if (response['code'] == 200) {
               this._snackBar.open("Caso especial editado.", 'Cerrar', { duration: 3000 });
               this.dialogRef.close(json['tiempo']);
            } else {
               this._snackBar.open("No se pudo editar el caso especial.", 'Cerrar', { duration: 3000 });
            }
            this.loading = false;
         });
      }
   }


   cancel(): void {
      this.dialogRef.close();
   }

}