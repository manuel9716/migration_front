import { Component, HostBinding, OnDestroy, OnInit } from "@angular/core";
import { fuseAnimations } from "src/app/animations/custom.animation";

//Model
import { Service } from "src/app/pages/dashboard/dashboard-ventas/models/servicios";

//Material
import { MatTableDataSource } from "@angular/material/table";

//Services
import { NodeApiService } from "src/app/pages/dashboard/dashboard-ventas/services/node-api.service";
import { VarsService } from "src/app/services/vars.service";

//RXJS
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

// Dependencies
import * as _moment from "moment";
import "moment/locale/es-mx";
import { default as _rollupMoment, Moment } from "moment";
_moment.locale("es-mx");
const moment = _rollupMoment || _moment;

@Component({
	selector: "app-ventas-diarias-municipio",
	templateUrl: "./ventas-diarias-municipio.component.html",
	styleUrls: ["./ventas-diarias-municipio.component.css"],
	animations: fuseAnimations,
})
export class VentasDiariasMunicipioComponent implements OnInit, OnDestroy {
	user = this._vars.user.source["value"];
	@HostBinding("class") classes = "container";
	date = moment();
	columnDate: any = [];
	data: any;
	servicios: Array<Service> = [];
	loading: boolean;
	displayedColumns: string[] = [];
	dataSource: MatTableDataSource<object>;
	dateString: Array<string>;
	alerta: boolean;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	constructor(
		private nodeApiService: NodeApiService,
		private _vars: VarsService
	) {}

	ngOnInit(): void {}

	ngOnDestroy(): void {
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}

	buscar() {
		if (this.date != null) {
			this.displayedColumns = ["Municipio"];
			this.loading = true;
			this.getColumn("B");
		}
	}

	getColumn(column: string) {
		let fechaDesde: Moment, fechaHasta: Moment;
		fechaDesde = moment(this.date, "YYYY-MM-DD");
		fechaDesde.subtract(1, "month");
		fechaHasta = moment(this.date, "YYYY-MM-DD");
		this.nodeApiService
			.getConsultaColumnas(column)
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((res) => {
				this.columnDate = res;
				this.filtrarColumna(fechaDesde, fechaHasta);
			});
	}

	filtrarColumna(fechaDesde: Moment, fechaHasta: Moment) {
		let arregloFechas: Array<number> = [];
		let diaA: number = fechaDesde.date();
		let mesA: number = fechaDesde.month();
		let añoA: number = fechaDesde.year();
		let diaB: number = fechaHasta.date();
		let mesB: number = fechaHasta.month();
		let añoB: number = fechaHasta.year();
		let fechaA = new Date(añoA, mesA, diaA);
		let fechaB = new Date(añoB, mesB, diaB);
		for (let row = 1; row < this.columnDate.length; row++) {
			let element = moment(this.columnDate[row].toString(), "DD-MM-YYYY");
			if (element != null) {
				let dia = element.date();
				let mes = element.month();
				let anio = element.year();
				let fechaActual = new Date(anio, mes, dia);
				if (fechaActual >= fechaA && fechaActual <= fechaB) {
					let rowIndex = row + 1;
					arregloFechas.push(rowIndex);
				}
			}
		}
		arregloFechas = arregloFechas.sort(function (a, b) {
			return a - b;
		});
		this.consultarExtremos(arregloFechas, fechaDesde, fechaHasta);
		arregloFechas = [];
	}

	consultarExtremos(
		arregloFechas: any,
		fechaDesde: Moment,
		fechaHasta: Moment
	) {
		let izquierda = arregloFechas[0];
		let derecha = arregloFechas[arregloFechas.length - 1];
		if (izquierda != undefined && derecha != undefined) {
			this.nodeApiService
				.getConsultaDatos(izquierda, derecha)
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe((res) => {
					this.data = res;
					this.mapToService(fechaDesde, fechaHasta);
				});
		} else {
			this.loading = false;
			this.alerta = true;
			this.dataSource = new MatTableDataSource(null);
		}
	}

	mapToService(fechaDesde: Moment, fechaHasta: Moment) {
		let fechaSolicitud: Moment,
			fechaActivacion: string | Moment,
			municipio: string,
			departamento: string,
			estadoOperacion: string,
			estadoRetiro: string;
		let servicios: Array<Service> = [];
		let servicio: Service;
		this.data.map((element: object[]) => {
			if (element[0] != undefined) {
				if (
					element[4] == undefined ||
					element[4].toString() == "" ||
					element[4].toString() == " "
				) {
					estadoOperacion = "SIN ESTADO DE OPERACION";
				} else {
					estadoOperacion = element[4].toString();
				}
				if (
					element[5] == undefined ||
					element[5].toString() == "" ||
					element[5].toString() == " "
				) {
					estadoRetiro = "SIN ESTADO DE RETIRO";
				} else {
					estadoRetiro = element[5].toString();
				}
				if (
					element[3] == undefined ||
					element[3].toString() == "" ||
					element[3].toString() == " "
				) {
					fechaActivacion = "SIN ESTADO DE ACTIVACION";
				} else {
					fechaActivacion = moment(
						element[3].toString(),
						"DD/MM/YYYY"
					).format("YYYY-MM-DD");
				}
				fechaSolicitud = moment(element[0].toString(), "DD/MM/YYYY");
				municipio = element[1].toString();
				departamento = element[2].toString();
				servicio = {
					fechaSolicitud: fechaSolicitud,
					municipio: municipio,
					departamento: departamento,
					fechaActivacion: fechaActivacion,
					estadoOperacion: estadoOperacion,
					estadoRetiro: estadoRetiro,
				};
				servicios.push(servicio);
			}
		});
		let dateArray: Array<Moment> = this.createDate(fechaDesde, fechaHasta);
		let dateString: Array<string> = this.dateToString(dateArray);
		let municipios: Array<string> = this.filterMunicipios(servicios);
		dateString.map((item, index) => {
			this.displayedColumns.push(item);
		});
		this.loading = false;
		this.createTable(servicios, dateArray, dateString, municipios);
	}

	createTable(
		servicios: Array<Service>,
		dateArray: Array<Moment>,
		dateString: Array<string>,
		municipios: Array<string>
	) {
		let array: Array<number> = [];
		let objetos: Array<object> = [];
		let filtered;
		municipios.forEach((mun: string) => {
			dateArray.forEach((date: Moment) => {
				filtered = servicios.filter(
					(servicio) =>
						servicio.municipio === mun &&
						servicio.fechaSolicitud.isSame(date)
				).length;
				array.push(filtered);
			});
			let row = this.createRow(array, mun, dateString);
			array = [];
			objetos.push(row);
		});
		this.loading = false;
		objetos.push(
			this.createRow(
				this.calculateTotalByColumns(objetos),
				"Total",
				dateString
			)
		);
		this.dataSource = new MatTableDataSource(objetos);
		this.dateString = dateString;
	}

	createRow(
		array: Array<number>,
		cadena: string,
		dateString: Array<string>
	): Object {
		let mun = cadena.toLowerCase();
		let object = {};
		object[`Municipio`] = mun.charAt(0).toUpperCase() + mun.slice(1);
		array.forEach((item, index) => {
			object[`${dateString[index+1]}`] = item;
		});
		object["Total"] = this.calculateTotalByRows(array);
		if (object[`Municipio`] === "Total") {
			object["Total"] = object["undefined"]
		}
		return object;
	}

	calculateTotalByRows(array: Array<number>): number {
		let total: number;
		const reduce = array.reduce(
			(previousValue: any, currentValue: any) =>
				previousValue + currentValue,
			0
		);
		total = reduce;
		return total;
	}

	calculateTotalByColumns(array: Array<object>): Array<number> {
		let total: Array<number> = [];
		let clave = Object.keys(array[1]);
		for (let i = 1; i < clave.length; i++) {
			const reduce = array.reduce(
				(previousValue: any, currentValue: any) =>
					previousValue + currentValue[clave[i]],
				0
			);
			total.push(reduce);
		}
		return total;
	}

	createDate(fechaDesde: Moment, fechaHasta: Moment): Array<Moment> {
		let fecha: Moment = moment(
			fechaDesde.format("YYYY-MM-DD"),
			"YYYY-MM-DD"
		);
		let arrayDate: Array<Moment> = [];
		while (fecha.isSameOrBefore(fechaHasta)) {
			let date = moment(fecha.format("YYYY-MM-DD"), "YYYY-MM-DD");
			arrayDate.push(date);
			fecha.add(1, "day");
		}
		return arrayDate;
	}

	dateToString(array: Array<Moment>): Array<string> {
		let stringDate: string;
		let arrayString: Array<string> = [];
		arrayString.push("Total");
		array.map((date) => {
			stringDate = `${date.date()} / ${date.month() + 1}`;
			arrayString.push(stringDate);
		});
		return arrayString;
	}

	filterMunicipios(arreglo: Array<Service>): Array<string> {
		let municipios: Array<string>;
		let aux: any = [];
		arreglo.forEach((element: any) => {
			aux.push(element.municipio);
		});
		municipios = aux.filter((item: any, index: any) => {
			return aux.indexOf(item.trim()) === index;
		});
		return municipios.sort();
	}
}
