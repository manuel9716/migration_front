import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import { fuseAnimations } from "src/app/animations/custom.animation";
import { ApiService } from "src/app/services/api.service";
import { VarsService } from "src/app/services/vars.service";
import {
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
	DateAdapter,
	MAT_DATE_FORMATS,
	MAT_DATE_LOCALE,
} from "@angular/material/core";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from "moment";
// tslint:disable-next-line:no-duplicate-imports
import * as _rollupMoment from "moment";
import { Moment } from "moment";

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
	parse: {
		dateInput: "YYYY/MM",
	},
	display: {
		dateInput: "YYYY/MM",
		monthYearLabel: "MMM YYYY",
		dateA11yLabel: "LL",
		monthYearA11yLabel: "MMMM YYYY",
	},
};

@Component({
	selector: "app-ultimos-cuatro-meses",
	templateUrl: "./ultimos-cuatro-meses.component.html",
	styleUrls: ["./ultimos-cuatro-meses.component.css"],
	animations: fuseAnimations,
	providers: [
		// `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
		// application's root module. We provide it at the component level here, due to limitations of
		// our example generation script.
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
		},

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	],
})
export class UltimosCuatroMesesComponent implements OnInit {
	diccionario = [
		{ name: "estadosolicitud", value: "Estado de solicitud" },
		{ name: "estadoservicio", value: "Estado de servicio" },
		{ name: "municipios", value: "Municipios" },
		{ name: "solicitudcreadapor", value: "Solicitud creado por" },
		{ name: "estadoretiro", value: "Estado retiro" },
		{ name: "motivoretiro", value: "Motivo retiro" },
		{ name: "retirocreadopor", value: "Retiro creado por" },
	];
	cantretiros;
	cantsolicitudes;
	// estadosRetiros = this._vars.estadosRetiros;
	// motivosRetiros = this._vars.motivosRetiros;
	estadosRetiros;
	motivosRetiros;
	cargando = false;
	user = this._vars.user.source["value"];
	variableAnalisis;
	displayedColumns = [];
	variables = [];
	dataSourceR = [];
	datosGenerados = [];
	slectItems = [];
	formConsulta = this._fb.group({
		tipoBusquedaForm: [""],
		date: [moment()],
	});
	noDataDB = false;
	//date = new FormControl(moment());
	setKey = [];
	maxDate: Date;
	minDate: Date;
	constructor(
		private _fb: FormBuilder,
		private _api: ApiService,
		private _vars: VarsService
	) {
		this.maxDate = new Date();
		this.minDate = new Date("2020-01-1");
	}

	ngOnInit(): void {
		this.getEstadosyMotivosRetiros();
		this.ObtenerDatos({});
	}

	getTotal(element): number {
		var returSuma = 0;
		if (
			this.variables[this.formConsulta.controls.tipoBusquedaForm.value]
				?.value
		) {
			this.variables[
				this.formConsulta.controls.tipoBusquedaForm.value
			].value.forEach((datoVariable) => {
				if (element == datoVariable.name) {
					datoVariable.value.forEach((estdos) => {
						returSuma = returSuma + estdos.value;
					});
				}
			});
		}
		return returSuma;
	}
	getEstadosyMotivosRetiros() {
		this._api
			.getEstadosRetiro(this.user["token"])
			.subscribe((response) => (this.estadosRetiros = response["data"]));
		this._api
			.getMotivosRetiro(this.user["token"])
			.subscribe((response) => (this.motivosRetiros = response["data"]));
	}
	async ObtenerDatos(req) {
		this.variables = [];
		this.datosGenerados = [];
		this.dataSourceR = [];
		this.cantretiros = 0;
		this.cantsolicitudes = 0;

		var consulta = req;
		this.cargando = true;
		this._api
			.getFiltroUltimos4mesesRetirosDashboard(
				this.user["token"],
				consulta
			)
			.subscribe((respont) => {
				var dataRecp: [] = respont["data"];

				//validar datos Consulta
				if (Object.keys(respont["data"]["estadoretiro"]).length > 0) {
					this.noDataDB = false;
					this.cantretiros = respont["cantretiros"];
					this.cantsolicitudes = respont["cantsolicitudes"];
					Object.getOwnPropertyNames(dataRecp).forEach(
						(name, index) => {
							var item = {
								name: name,
								value: index,
							};
							this.slectItems.push(item);
						}
					);
					Object.values(dataRecp).forEach((variable, i) => {
						var item = {
							name: this.slectItems[i].name,
							value: [],
						};
						Object.getOwnPropertyNames(variable).forEach(
							(valuMes, j) => {
								var data = Object.values(variable)[j];
								var fecha = new Date(valuMes + "-25");
								var it = {
									name: fecha
										.toLocaleDateString("es-ES", {
											year: "numeric",
											month: "long",
										})
										.toLocaleUpperCase(),
									fecha: fecha.getTime(),
									value: [],
								};
								Object.getOwnPropertyNames(data).forEach(
									(variaPropia, k) => {
										var arrayINt: any =
											Object.values(data)[k];
										var variable: any;
										variable = {
											name: variaPropia,
											value: arrayINt,
										};
										if (variaPropia != "length") {
											it.value.push(variable);
										}
									}
								);
								item.value.push(it);
							}
						);
						this.variables.push(item);
					});
				} else {
					this.noDataDB = true;
				}

				if (this.variables.length > 0) {
					this.select(0);
					this.formConsulta.controls.tipoBusquedaForm.setValue(0);
				}
				this.cargando = false;
			});
	}

	select(val) {
		var setnombes = new Set();
		this.variables[val].value.sort(function (a, b) {
			if (a.fecha < b.fecha) {
				return 1;
			}
			if (a.fecha > b.fecha) {
				return -1;
			}
			// a must be equal to b
			return 0;
		});
		this.datosGenerados = this.variables[val].value;
		this.dataSourceR = this.datosGenerados;
		this.displayedColumns = [];
		this.displayedColumns.unshift(" ");
		this.datosGenerados.forEach((elem) => {
			elem.value.forEach((as) => {
				setnombes.add(as.name);
			});
			this.displayedColumns.push(elem.name);
		});
		this.setKey = [];
		setnombes.forEach((element) => {
			this.setKey.push(element);
		});
	}

	obtnerdato(data: [], comparacion: string) {
		var datossalida;
		if (data) {
			data.forEach((variableRecp: any) => {
				if (variableRecp?.name == comparacion) {
					datossalida = variableRecp.value;
				}
			});
		}
		if (datossalida) {
			return datossalida;
		}
		return "-";
	}

	traducir(palabar): string {
		var strinResultado: string;
		this.diccionario.forEach((palabraDiccionario) => {
			if (palabraDiccionario.name == palabar) {
				strinResultado = palabraDiccionario.value;
			}
		});
		if (strinResultado) {
			return strinResultado;
		}
		return palabar;
	}

	chosenYearHandler(normalizedYear: Moment) {
		const ctrlValue = this.formConsulta.controls.date.value;
		ctrlValue.year(normalizedYear.year());
		//this.formConsulta.controls.date.setValue(ctrlValue);
	}

	chosenMonthHandler(
		normalizedMonth: Moment,
		datepicker: MatDatepicker<Moment>
	) {
		const ctrlValue = this.formConsulta.controls.date.value;
		ctrlValue.year(normalizedMonth.year());
		ctrlValue.month(normalizedMonth.month());
		this.formConsulta.controls.date.setValue(ctrlValue);
		datepicker.close();
		this.ObtenerDatos({
			date: this.convertirFecha(this.formConsulta.controls.date.value),
		});
	}
	convertirFecha(fechaValue) {
		if (fechaValue) {
			let d = new Date(fechaValue);
			return (
				d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
			);
		}
		return "";
	}
}
