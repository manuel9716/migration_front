import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
	selector: 'select-date-dialog',
	templateUrl: './select-date-dialog.html',
})
export class SelectDateDialog {
	
	form: FormGroup;
	maxDate: Date = new Date();
	
	constructor(
		private _formBuilder: FormBuilder,
		private _api: ApiService,
		public dialogRef: MatDialogRef<SelectDateDialog>,
		@Inject(MAT_DIALOG_DATA) public data
	) {

		const yesterday = new Date(this.maxDate);
		yesterday.setDate(yesterday.getDate() - 1)
		
		this.form = this._formBuilder.group({
			date: [yesterday, [Validators.required]]
		});
		
				
	}
		

	onSubmit() {
		if (this.form.valid) {
			this.dialogRef.close(this.form.controls['date'].value.toISOString().split('T')[0]);
		}
	}
	
}