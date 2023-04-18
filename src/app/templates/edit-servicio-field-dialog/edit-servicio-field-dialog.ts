import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';

@Component({
   selector: 'edit-servicio-field-dialog',
   templateUrl: './edit-servicio-field-dialog.html',
   animations: fuseAnimations
})
export class EditServicioFieldDialog {

   form: FormGroup;
   activateError = { msg: null, status: false };
   user: object = this._vars.user.source['value'];
   loading: boolean;

   constructor(
      @Inject(MAT_DIALOG_DATA) public data,
      public dialogRef: MatDialogRef<EditServicioFieldDialog>,
      private _formBuilder: FormBuilder,
      private _api: ApiService,
      private _vars: VarsService,
   ) { 

      this.form = this._formBuilder.group({
         idservicio: [this.data.servicio.idservicio, [Validators.required]],
         ip: [null],
         octeto1: [null],
         octeto2: [null],
         octeto3: [null],
         octeto4: [null],
         puertocaja: [null],
         ncajanap: [null],
         serialont: [null],
         ontid: [null],
         potcajanap: [null],
         potont: [null],
      });

      if (data['field'] == 'ip') {
         this.form.controls.ip.disable();
         this.form.controls.octeto1.setValidators([Validators.required, Validators.max(255), Validators.pattern("^[0-9]*$")]);
         this.form.controls.octeto2.setValidators([Validators.required, Validators.max(255), Validators.pattern("^[0-9]*$")]);
         this.form.controls.octeto3.setValidators([Validators.required, Validators.max(255), Validators.pattern("^[0-9]*$")]);
         this.form.controls.octeto4.setValidators([Validators.required, Validators.max(255), Validators.pattern("^[0-9]*$")]);
      }

      if (data['field'] == 'puertocaja') {
         this.form.controls.puertocaja.setValidators([Validators.required, Validators.maxLength(3)])
      }

      if (data['field'] == 'ncajanap') {
         this.form.controls.ncajanap.setValidators([Validators.required, Validators.maxLength(8)])
      }

      if (data['field'] == 'serialont') {
         this.form.controls.serialont.setValidators([Validators.required, Validators.maxLength(16)])
      }

      if (data['field'] == 'ontid') {
         this.form.controls.ontid.setValidators([Validators.required, Validators.maxLength(3)])
      }
      if (data['field'] == 'potcajanap') {
         this.form.controls.potcajanap.setValidators([Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")])
      }
      if (data['field'] == 'potont') {
         this.form.controls.potont.setValidators([Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")])
      }

   }

   buildIp() {
      this.activateError = { msg: null, status: false };
      let ip = "";
      ip += this.form.controls.octeto1.value;
      ip += ".";
      ip += this.form.controls.octeto2.value;
      ip += ".";
      ip += this.form.controls.octeto3.value;
      ip += ".";
      ip += this.form.controls.octeto4.value;
      this.form.controls.ip.setValue(ip);
      if (this.form.controls.octeto1.valid && this.form.controls.octeto2.valid && this.form.controls.octeto3.valid && this.form.controls.octeto4.valid) {
         this.validarIp();
      }
   }

   validarIp() {
      this.activateError = { msg: null, status: false };
      let json = { ip: this.form.controls.ip.value };
      this._api.checkIp(json, this.user['token']).subscribe(response => {
         if (response['code'] == 200) {
            this.activateError = { msg: "La ip está disponible", status: true }
         } else {
            this.activateError = { msg: "La ip ya se encuentra en uso", status: false }
         }
      });
   }

   cancel(): void {
      this.dialogRef.close();
   }

   onSubmit() {
      if (this.form.valid) {

         this.activateError = { msg: null, status: false };

         let json = JSON.parse(JSON.stringify(this.form.value));

         if(this.data['field'] == 'ip'){
            json['ip'] = json.octeto1 + "." + json.octeto2 + "." + json.octeto3 + "." + json.octeto4;
         }

         this.loading = true;

         this._api.editServicio(json, this.user['token']).subscribe(response => {
            if (response['code'] == 200) {
               this.dialogRef.close(true);
            } else {
               this.activateError = { msg: response['msg'], status: false };
            }
            this.loading = false;
         });

      }
   }

}