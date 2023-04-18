import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { VarsService } from 'src/app/services/vars.service';

@Component({
  selector: 'app-dashboard-ventas',
  templateUrl: './dashboard-ventas.component.html',
  styleUrls: ['./dashboard-ventas.component.css'],
  animations: fuseAnimations
})
export class DashboardVentasComponent implements OnInit {

  user = this._vars.user.source['value'];

	constructor(
		private _vars: VarsService,
	) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    
  }

}
