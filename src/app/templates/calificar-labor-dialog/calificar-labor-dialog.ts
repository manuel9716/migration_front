import { Component, Inject, ViewChild, ElementRef, Renderer2, AfterViewInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

@Component({
   selector: 'calificar-labor-dialog',
   templateUrl: './calificar-labor-dialog.html',
})
export class calificarLaborDialog {

   form: FormGroup;
   user: object = this._vars.user.source['value'];
   estadosLabores: object[];
   

   constructor(
      @Optional() @Inject(MAT_DIALOG_DATA) public data,
      private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<calificarLaborDialog>,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,

   ) {

      this.form = this._formBuilder.group({
         idestadolabor: ['', [Validators.required]],
         justificacion: ['', [Validators.maxLength(300)]],
      });


      this._api.getEstadosLabores(this.user['token']).subscribe(response => {
         if (response['code'] == 200) {
            this.estadosLabores = response['data'];
            this.estadosLabores.shift();
            if (data) {
               this.form.controls.justificacion.patchValue(data['justificacion']);
               this.form.controls.idestadolabor.patchValue(this.estadosLabores.find(est => est['idestadolabor'] == data['idestadolabor']));
            }
            
         } else {
            this._snackBar.open('No se pudieron cargar los estados de labores.', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
         }
      });

   }


   cancel(): void {
      this.dialogRef.close();
   }

   onSubmit() {
      if (this.form.valid) {
         let json = JSON.parse(JSON.stringify(this.form.value));
         json['nombreestado'] = json['idestadolabor']['nombre'];
         json['idestadolabor'] = json['idestadolabor']['idestadolabor'];
         this.dialogRef.close(json)
      }
   }

}