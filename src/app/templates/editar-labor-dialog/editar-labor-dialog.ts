import { Component, Inject, ViewChild, ElementRef, Renderer2, AfterViewInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

@Component({
   selector: 'editar-labor-dialog',
   templateUrl: './editar-labor-dialog.html',
})
export class EditarLaborDialog {
   
   form: FormGroup;
   user: object = this._vars.user.source['value'];
   labores: object[];
   loading: boolean = true;;
   
   
   constructor(
      @Optional() @Inject(MAT_DIALOG_DATA) public data,
      private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<EditarLaborDialog>,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,
	  ){
		
		this.form = this._formBuilder.group({
			idlabor: ['', [Validators.required]],
			idlaborop: ['', [Validators.required]],
		});
		
		this._api.getLaboresByTipoOpServicio(1,this.user['token']).subscribe(response => {
			if (response['code'] == 200) {
				this.labores = response['data'];
				if (data) {
					this.form.patchValue(this.data);
				}
			} else {
				this._snackBar.open('No se pudieron cargar las de labores.', 'Cerrar', { duration: 3000 });
				this.dialogRef.close(true);
			}
			this.loading = false;
		});
		
	}
	
	
	cancel(): void {
		this.dialogRef.close();
	}
	
	
	onSubmit() {
		if (this.form.valid) {
			this.loading = true;
			let json = JSON.parse(JSON.stringify(this.form.value));

			this._api.editLaboresOp(json,this.user['token']).subscribe(response => {
				if (response['code'] == 200) {
					this._snackBar.open('Labor editada.', 'Cerrar', { duration: 3000 });
					this.dialogRef.close(true);
				} else {
					this._snackBar.open('No se puedo editar la labor.', 'Cerrar', { duration: 3000 });
					this.dialogRef.close();
				}
					this.loading = false;
			});
		}
	}
	
}