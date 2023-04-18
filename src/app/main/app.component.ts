import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { VarsService } from '../services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators'


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	animations: fuseAnimations
})
export class AppComponent implements OnInit {

	loaded: boolean = false;
	user: object;

	constructor(
		private _storage: Storage,
		private _vars: VarsService,
		private _api: ApiService,
		private _router: Router,
		private activatedRoute: ActivatedRoute,
		private titleService: Title,
	) { }

	ngOnInit() {

		this._router.events.pipe(
			filter(event => event instanceof NavigationEnd),
		).subscribe(() => {
			const rt = this.getChild(this.activatedRoute);
			rt.data.subscribe(data => {
				//   this.page404= this.revisarPage404(data.title);
				this.titleService.setTitle(data.title)
			});
		});


		this._vars.user.subscribe(data => this.user = data)
		this._storage.get('bitwanUser').then((val) => {
			if (val) {
				this._api.GetPermisosUsuariosByTercero(val['idtercero'], val['token']).subscribe(response => {
					if (response['code'] == 200) {

						val['permisos'] = this._vars.getPermisos(response['data']['permisos']);
						
						this._vars.setUser(val);
					}
					this.loaded = true;
				});
			} else {
				this.loaded = true;
			}
		});
	}

	getChild(activatedRoute: ActivatedRoute) {
		if (activatedRoute.firstChild) {
			return this.getChild(activatedRoute.firstChild);
		} else {
			return activatedRoute;
		}

	}
}
