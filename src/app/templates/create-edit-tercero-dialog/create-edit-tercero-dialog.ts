import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';

@Component({
   selector: 'create-edit-tercero-dialog',
   templateUrl: './create-edit-tercero-dialog.html',
   animations: fuseAnimations
})
export class CreateEditTerceroDialog {

   form: FormGroup;
   loading: boolean;
   load: boolean = true;
   user: object;
   error: string;

   // areas: object[];
   // cargos: object[];
   tiposdocumentos: object[];
   // tiposterceros: object[];

   constructor(
      private _formBuilder: FormBuilder,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,
      public dialogRef: MatDialogRef<CreateEditTerceroDialog>,
      @Inject(MAT_DIALOG_DATA) public data
   ) {

      this.form = this._formBuilder.group({
         nombres: [this.data.nombrecontacto ? this.data.nombrecontacto : '', [Validators.required, Validators.maxLength(40)]],
         apellidos: ['' , Validators.maxLength(40)],

         idtipodocumento: [null, [Validators.required]],
         // identificacion: [this.data.identificaciontercero ? this.data.identificaciontercero : '', [Validators.required, Validators.maxLength(20), Validators.pattern("^[0-9]*$")]],
         identificacion: [{value: this.data.identificaciontercero ? this.data.identificaciontercero : '', disabled: true}, [Validators.required, Validators.maxLength(20), Validators.pattern("^[0-9]*$")]],

         // email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
         // celular: [this.data.celularcontacto ? this.data.celularcontacto : '', [Validators.maxLength(11), Validators.pattern("^[0-9]*$")]],
         
         sexo: [null, []],
         fnacimiento: [null, []],
         
         idarea: [34],
         idtiposterceros: [[2]],
   
      });

      this.form.getRawValue();

   

      this.user = this._vars.user.source['value'];

      this._api.getEntitiesTerceros(this.user['token']).subscribe(response => {
         if (response['code'] == 200) {
            // this.areas = response['areas'];
            // this.cargos = response['cargos'];
            this.tiposdocumentos = response['tiposdocumentos'];
            // this.tiposterceros = response['tiposterceros'];
         } else {
            this._snackBar.open('No se pudieron cargar las entidades de terceros','Cerrar',{duration: 3000});
            this.cancel();
         }
         this.load = false;
      });


   }


   cancel(): void {
      this.dialogRef.close();
   }

   onSubmit() {

      if (this.form.valid) {

         let json = this.form.value;
         json.identificacion = this.data.identificaciontercero ? this.data.identificaciontercero : '';

         this.loading = true;

         this._api.createTercero(this.form.value, this.user['token']).subscribe(response => {
            if (response['code'] == 200) {
               this.dialogRef.close(response['data']);
            } else {
               this.error = response['msg'];
            }
            this.loading = false;
         });

      }
   }

}