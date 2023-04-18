import { Component, OnInit, OnDestroy, HostBinding } from "@angular/core";
import { fuseAnimations } from "src/app/animations/custom.animation";
import moment from "moment";

//Service
import { VarsService } from "src/app/services/vars.service";
import { InformesService } from "src/app/pages/informes/services/informes.service";

//RXJS
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

//Material
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "app-csv-dialog",
	templateUrl: "./csv-dialog.component.html",
	styleUrls: ["./csv-dialog.component.css"],
	animations: fuseAnimations,
})
export class CsvDialogComponent implements OnInit, OnDestroy {
	@HostBinding("class") classes = "container";
	fechaDesde: object;
	fechaHasta: object;
	loading: boolean;
	canDownload: boolean;
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	user = this._vars.user.source["value"];
	csv: string;

	constructor(
		private _vars: VarsService,
		private _infromesService: InformesService,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.canDownload = false;
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}

	descargar() {
		const file = new File([this.csv], "informe", { type: "text/csv" });
		const fr = new FileReader();
		fr.readAsDataURL(file);

		fr.addEventListener("load", () => {
			let response = fr.result;
			window.open(`${response}`);
		});
	}

	buscar() {
		this.canDownload = false;
		if (this.fechaDesde != null && this.fechaHasta != null) {
			this.loading = true;
			let fechaDesde = moment(this.fechaDesde).format("YYYY-MM-DD");
			let fechaHasta = moment(this.fechaHasta).format("YYYY-MM-DD");
			this._infromesService
				.getDesplazamientosPorCuadrillaSencillo(
					fechaDesde,
					`${fechaHasta} 23:59:59`
				)
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe((response) => {
					if (response != null) {
						let csv = this.jsonToCsv(response);
						this.csv = csv;
						this.loading = false;
						this.canDownload = true;
					} else {
						this.loading = false;
						this.openSnackBar(
							"No se encontraron datos en las fechas ingresadas"
						);
					}
				});
		} else {
			this.openSnackBar(
				"Por favor seleccione datos validos en el campo fechas"
			);
		}
	}

	openSnackBar(message: string) {
		this._snackBar.open(message);
	}

	jsonToCsv(items) {
		const header = Object.keys(items[0]);

		const headerString = header.join(",");

		// handle null or undefined values here
		const replacer = (key, value) => value ?? "";

		const rowItems = items.map((row) =>
			header
				.map((fieldName) => JSON.stringify(row[fieldName], replacer))
				.join(",")
		);
		rowItems.join("\n");
		let finalItems = rowItems.join("\n");

		const csv = [headerString, finalItems].join("\n");
		return csv;
	}
}
