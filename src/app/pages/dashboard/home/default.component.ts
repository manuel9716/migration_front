import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { VarsService } from 'src/app/services/vars.service';
// import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
	selector: 'app-default',
	templateUrl: './default.component.html',
	styleUrls: ['./default.component.css'],
	animations: fuseAnimations
})


export class DefaultComponent implements OnInit {
	user = this._vars.user.source['value'];

	constructor(
		private _vars: VarsService,
	) { }

	ngOnInit() {
	}



}
