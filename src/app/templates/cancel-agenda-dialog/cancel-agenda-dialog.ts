import { Component, Inject, Optional, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

@Component({
   selector: 'cancel-agenda-dialog',
   templateUrl: './cancel-agenda-dialog.html',
})

export class CancelAgendaDialog implements OnInit {

   form: FormGroup;
   user: object = this._vars.user.source['value'];
   loading: boolean;

   constructor(
      @Optional() @Inject(MAT_DIALOG_DATA) public data,
      private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<CancelAgendaDialog>,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,

   ) { }

   ngOnInit() {
      this.form = this._formBuilder.group({
         idagenda: [this.data['idagenda']],
         idsolicitudservicio: [this.data['idsolicitudservicio']],
         observaciones: ['', [Validators.required, Validators.maxLength(450)]],
         idserviciocuadrilla: [this.data['idcuadrilla']],
         idclaseoperacionservicio: [15],
         fechainicial: [new Date().getTime()],
         fechafinal: [new Date().getTime()],
         idtipooperacionservicio: [3],
         coordenadas: [[]]
      });

      this._api.getInfoUser().subscribe(infoUser => {
         const coor = [infoUser['latitude'], infoUser['longitude']];
         this.form.controls.coordenadas.patchValue(coor.toString());
      });
   }


   onSubmit() {
      if (this.form.valid) {
         this.loading = true;
         // this._api.cancelAgenda(this.form.value, this.user['token']).subscribe(response => {
         //    if (response['code'] == 200) {
         //       this.dialogRef.close(true);
         //       this._snackBar.open("Agenda cancelada.", 'Cerrar', { duration: 3000 });
         //    } else {
         //       this.cancel();
         //       this._snackBar.open(response['msg'], 'Cerrar', { duration: 3000 });
         //    }
         //    this.loading = false;
         // });
         this._api.createOperacionesServicio(this.form.value, this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
               this.dialogRef.close(true);
               this._snackBar.open("Agenda cancelada.", 'Cerrar', { duration: 3000 });
				} else {
               this.cancel();
               this._snackBar.open(response['msg'], 'Cerrar', { duration: 3000 });
				}
				this.loading = false;
			});
      }  
   }


   cancel(): void {
      this.dialogRef.close();
   }

}