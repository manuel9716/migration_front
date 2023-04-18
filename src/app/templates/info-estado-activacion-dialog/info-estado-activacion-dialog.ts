import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

@Component({
   selector: 'info-estado-activacion-dialog',
   templateUrl: './info-estado-activacion-dialog.html',
   styleUrls: ['info-estado-activacion-dialog.css']
})
export class InfoEstadoActivacionDialog {

   user: object = this._vars.user.source['value'];
   info: object;
   facturaVencida: boolean;
   retiro: boolean;
   suspencion: boolean;

   constructor(
      public dialogRef: MatDialogRef<InfoEstadoActivacionDialog>,
      @Inject(MAT_DIALOG_DATA) public data,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,
   ) {

      this._api.infoEstadoActivacion(data, this.user['token']).subscribe(response => {        
         if (response['code'] == 200) {
            this.info = response;

            let fechaCorte = new Date(this.info['data'].fechacorte.timestamp * 1000);
            let today = new Date();         

            this.info['estadoscuenta'].forEach(ec => {
               
               let fv = new Date(ec.fechavencimiento.timestamp * 1000);

               if (fechaCorte > fv && !ec.estadopago) {
                  ec['facturavencida'] = true;
                  this.facturaVencida = true;
               }
            });

            this.info['retiros'].forEach(ret => {
               let fr = new Date(ret.fecharetiro.timestamp * 1000);
               if (fr <= today) {
                  ret['retiroprogramado'] = true;
                  this.retiro = true;
               }
            });

            this.info['suspensiones'].forEach(sus => {
               let fs = new Date(sus.fechainicio.timestamp * 1000);
               if (fs <= today) {
                  sus['suspendido'] = true;
                  this.suspencion = true;
               }
            });

         } else {
            this._snackBar.open("No se pudo obtener la información.", 'Cerrar', { duration: 3000 });
            this.cancel();
         }
      });
   }

   cancel(): void {
      this.dialogRef.close();
   }

}