import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from '../../services/api.service';
import { VarsService } from "../../services/vars.service";
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { Router } from '@angular/router';


@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.css"],
	animations: fuseAnimations
})

export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	restoreForm: FormGroup;
	loading: boolean = false;
	islogin: boolean = true;
	error: string;

	constructor(
		private _formBuilder: FormBuilder,
		private _api: ApiService,
		private _vars: VarsService,
		private _router: Router
	) { }

	ngOnInit() {
		this.loginForm = this._formBuilder.group({
			alias: ["", [Validators.required]],
			password: ["", Validators.required]
		});
		this.restoreForm = this._formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
		});
	}

	login() {
		this.error = null;
		this.loading = true;
		const json = {
			alias: this.loginForm.controls['alias'].value,
			password: this.loginForm.controls['password'].value,
		}
		this._api.login(json).subscribe(response => {
			if (response["code"] == 200) {
			
				response['data']['permisos'] = this._vars.getPermisos(response['permisos']);
				this._vars.setUser(response["data"]);
				this._router.navigate(['/dashboard'])

			} else {
				this.error = response["msg"];
			}
			this.loading = false;
		});

	}
}
