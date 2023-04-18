import { Component, OnDestroy, OnInit } from "@angular/core";
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { CsvDialogComponent } from "../shared/csv-dialog/csv-dialog.component";

//Services
import { VarsService } from "src/app/services/vars.service";

//Material
import { MatDialog } from "@angular/material/dialog";

@Component({
	selector: "app-informes",
	templateUrl: "./informes.component.html",
	styleUrls: ["./informes.component.css"],
	animations: fuseAnimations,
})
export class InformesComponent implements OnInit, OnDestroy {
	user = this._vars.user.source["value"];

	constructor(private _vars: VarsService, public dialog: MatDialog) {}

	ngOnInit(): void {}

	ngOnDestroy(): void {}

	openDialog() {
		this.dialog.open(CsvDialogComponent, {
			width: "600px",
		});
	}
}
