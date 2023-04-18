import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';

@Component({
   selector: 'change-status-sol-tercero-dialog',
   templateUrl: './change-status-sol-tercero-dialog.html',
   animations: fuseAnimations
})
export class ChangeStatusSolTerceroDialog {

   form: FormGroup;
   loaded: boolean = false;
   loading: boolean;
   user: object;
   estadosSolicitud;
   error: string;

   constructor(
      private _formBuilder: FormBuilder,
      private _snackBar: MatSnackBar,
      private _api: ApiService,
      private _vars: VarsService,
      public dialogRef: MatDialogRef<ChangeStatusSolTerceroDialog>,
      @Inject(MAT_DIALOG_DATA) public data
   ) {

      this.user = this._vars.user.source['value'];

      this._api.getEstadosSolTercero(this.user['token']).subscribe(response => {
         if (response['code'] == 200) {

            this.estadosSolicitud = response['data'];

            this.form = this._formBuilder.group({
               idestadosolicitudtercero: [data.idestadosolicitudtercero.idestadosolicitudtercero, [Validators.required]],
               observaciones: ['', [Validators.required, Validators.maxLength(300)]],
               idsolicitudtercero: [data['idsolicitudtercero'], []],
               idempleado: [this.user['idtercero'], []],
            });

         } else {
            this.dialogRef.close();
            this._snackBar.open('No se pudieron cargar los estados de solicitud de tercero', 'Cerrar', { duration: 3000 });
         }
         this.loaded = true;
      });
   }

   close(): void {
      this.dialogRef.close();
   }

   onSubmit() {

      this.error = null;

      if (this.form.valid) {

         if(this.form.value.idestadosolicitudtercero != this.data.idestadosolicitudtercero.idestadosolicitudtercero){

            this.loading = true;
            
            this._api.changeStatusSolTercero(this.form.value, this.user['token']).subscribe(response => {
               if (response['code'] == 200) {
                  
                  this._snackBar.open('Estado de solicitud cambiado.', 'Cerrar', { duration: 3000 });

                  this.estadosSolicitud.forEach(estado => {
                     if(estado.idestadosolicitudtercero == this.form.value.idestadosolicitudtercero){
                        this.dialogRef.close(estado);                
                     }
                  });
                  
               } else {
                  this.error = "No se pudo cambiar el estado de la solicitud."
               }
               this.loading = false;
            });
            
         } else {
            this.error = "No se cambió el estado."
         }
      }
   }

}