import { Component, HostBinding, OnDestroy, OnInit } from "@angular/core";
import { fuseAnimations } from "src/app/animations/custom.animation";
import { FormControl } from "@angular/forms";

import * as _moment from "moment";
import "moment/locale/es-mx";
import { default as _rollupMoment, Moment } from "moment";
_moment.locale("es-mx");
import {
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
const moment = _rollupMoment || _moment;

//Model
import { Service } from "src/app/pages/dashboard/dashboard-ventas/models/servicios";

//Material
import {
	DateAdapter,
	MAT_DATE_FORMATS,
	MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { MatTableDataSource } from "@angular/material/table";

//Services
import { NodeApiService } from "src/app/pages/dashboard/dashboard-ventas/services/node-api.service";
import { VarsService } from "src/app/services/vars.service";

//RXJS
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
	Chart,
	ArcElement,
	LineElement,
	BarElement,
	PointElement,
	BarController,
	BubbleController,
	DoughnutController,
	LineController,
	PieController,
	PolarAreaController,
	RadarController,
	ScatterController,
	CategoryScale,
	LinearScale,
	LogarithmicScale,
	RadialLinearScale,
	TimeScale,
	TimeSeriesScale,
	Decimation,
	Filler,
	Legend,
	Title,
	Tooltip,
	SubTitle,
} from "chart.js";
Chart.register(
	ArcElement,
	LineElement,
	BarElement,
	PointElement,
	BarController,
	BubbleController,
	DoughnutController,
	LineController,
	PieController,
	PolarAreaController,
	RadarController,
	ScatterController,
	CategoryScale,
	LinearScale,
	LogarithmicScale,
	RadialLinearScale,
	TimeScale,
	TimeSeriesScale,
	Decimation,
	Filler,
	Legend,
	Title,
	Tooltip,
	SubTitle
);

export const MY_FORMATS = {
	parse: {
		dateInput: "MM/YYYY",
	},
	display: {
		dateInput: "MM/YYYY",
		monthYearLabel: "MMM YYYY",
		dateA11yLabel: "LL",
		monthYearA11yLabel: "MMMM YYYY",
	},
};
@Component({
	selector: "app-historial-sol-municipio",
	templateUrl: "./historial-sol-municipio.component.html",
	styleUrls: ["./historial-sol-municipio.component.css"],
	animations: fuseAnimations,
	providers: [
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
		},
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	],
})
export class HistorialSolMunicipioComponent implements OnInit, OnDestroy {
	user = this._vars.user.source["value"];
	@HostBinding("class") classes = "container";
	columnDate: any = [];
	date = new FormControl(moment());
	data: any;
	estadosOperacion: string[] = [];
	municipios: string[] = [];
	meses: Array<number> = [];
	stringMeses: Array<string> = [];
	servicios: Array<Service> = [];
	loading: boolean;
	displayedColumns: string[] = [
		"municipio",
		"mes1",
		"mes2",
		"mes3",
		"mes4",
		"mes5",
		"mes6",
		"mes7",
	];
	dataSource: MatTableDataSource<object>;
	alerta: boolean;
	chart: any;
	div: any;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	constructor(
		private nodeApiService: NodeApiService,
		private _vars: VarsService
	) {}

	ngOnInit(): void {
		this.div = document.getElementById("divChart") as HTMLCanvasElement;
		this.div.style.visibility = "hidden";
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}
	chosenYearHandler(normalizedYear: Moment) {
		const ctrlValue = this.date.value;
		ctrlValue.year(normalizedYear.year());
		this.date.setValue(ctrlValue);
	}

	chosenMonthHandler(
		normalizedMonth: Moment,
		datepicker: MatDatepicker<Moment>
	) {
		const ctrlValue = this.date.value;
		ctrlValue.month(normalizedMonth.month());
		this.date.setValue(ctrlValue);
		datepicker.close();
	}

	buscar() {
		if (this.date != null) {
			this.loading = true;
			this.getColumn("B");
		}
	}

	getColumn(column: string) {
		let fechaDesde: Moment, fechaHasta: Moment;
		let firstDay = moment(this.date.value.startOf("month"), "YYYY-MM-DD");
		if (firstDay.month() <= 5) {
			fechaDesde = moment(
				`${firstDay.year() - 1}-${
					firstDay.month() + 7
				}-${firstDay.date()}`,
				"YYYY-MM-DD"
			);
		} else {
			fechaDesde = moment(
				`${firstDay.year()}-${firstDay.month() - 5}-${firstDay.date()}`,
				"YYYY-MM-DD"
			);
		}
		fechaHasta = moment(this.date.value.endOf("month"), "YYYY-MM-DD");
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
		this.createMonths(fechaDesde);
		this.filterEstadosOperacion(servicios);
		this.filterMunicipios(servicios);
		this.createTable(servicios, fechaDesde, fechaHasta);
	}

	createTable(
		servicios: Array<Service>,
		fechaDesde: Moment,
		fechaHasta: Moment
	) {
		let dataSets: Array<object> = [];
		let array: Array<number> = [];
		let objetos: Array<object> = [];
		this.municipios.forEach((mun: string) => {
			let fechaActual: Moment = moment(
				fechaDesde.format("YYYY-MM-DD"),
				"YYYY-MM-DD"
			);
			while (fechaActual <= fechaHasta) {
				let auxFechaDesde = moment(
					fechaActual.startOf("month"),
					"YYYY-MM-DD"
				);
				let auxFechaHasta = moment(
					fechaActual.endOf("month"),
					"YYYY-MM-DD"
				);
				fechaActual.add(1, "M");
				let filtered = this.estadosOperacion
					.map(
						(estado: string) =>
							servicios.filter(
								(servicio) =>
									servicio.municipio === mun &&
									servicio.estadoOperacion === estado &&
									servicio.fechaSolicitud.isBetween(
										auxFechaDesde
											.subtract(1)
											.format("YYYY-MM-DD"),
										auxFechaHasta
											.add(1)
											.format("YYYY-MM-DD")
									)
							).length
					)
					.reduce(
						(previousValue: any, currentValue: any) =>
							previousValue + currentValue,
						0
					);
				array.push(filtered);
			}
			let row = this.createRow(array, mun);
			let objectDataSets = this.createObjectDataSets(array, mun);
			dataSets.push(objectDataSets);
			array = [];
			objetos.push(row);
		});
		this.loading = false;
		objetos.push(this.createRow(this.calculateTotal(objetos), "Total"));
		this.dataSource = new MatTableDataSource(objetos);
		this.graficar(dataSets, this.stringMeses);
	}

	calculateTotal(array: Array<object>): Array<number> {
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

	createRow(array: Array<number>, municipio: string): Object {
		let mun = municipio.toLowerCase();
		let object = {
			municipio: mun.charAt(0).toUpperCase() + mun.slice(1),
			mes1: array[0],
			mes2: array[1],
			mes3: array[2],
			mes4: array[3],
			mes5: array[4],
			mes6: array[5],
			mes7: array[6],
		};
		return object;
	}

	createMonths(fechaDesde: Moment) {
		let fecha: Moment = moment(
			fechaDesde.format("YYYY-MM-DD"),
			"YYYY-MM-DD"
		);
		let meses: Array<number> = [];
		meses.length = 7;
		meses.fill(0);
		let aux = fecha.month();
		meses.forEach((mes: number, index) => {
			meses[index] = aux;
			aux = fecha.add(1, "month").month();
		});
		this.meses = meses;
		this.stringMonth(meses);
	}

	stringMonth(meses: Array<number>) {
		let stringMeses: Array<string> = [];
		let aux: string;
		meses.map((mes) => {
			aux = moment(`2022-${mes + 1}-01`, "YYYY-MM-DD").format("MMMM");
			stringMeses.push(aux.charAt(0).toUpperCase() + aux.slice(1));
		});
		this.stringMeses = stringMeses;
	}
	
	filterEstadosOperacion(arreglo: Array<Service>) {
		let aux: any = [];
		arreglo.forEach((element: any) => {
			aux.push(element.estadoOperacion);
		});
		this.estadosOperacion = aux.filter((item: any, index: any) => {
			return aux.indexOf(item.trim()) === index;
		});
		this.estadosOperacion.sort();
	}

	filterMunicipios(arreglo: Array<Service>) {
		let aux: any = [];
		arreglo.forEach((element: any) => {
			aux.push(element.municipio);
		});
		this.municipios = aux.filter((item: any, index: any) => {
			return aux.indexOf(item.trim()) === index;
		});
		this.municipios.sort();
	}

	createObjectDataSets(array: Array<number>, municipio: string): object {
		let mun = municipio.toLowerCase();
		const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
			16
		)}`;
		let object = {
			label: mun.charAt(0).toUpperCase() + mun.slice(1),
			data: array,
			backgroundColor: [randomColor],
			borderWidth: 2,
			borderColor: [randomColor],
		};
		return object;
	}

	graficar(_datasets: any, _label: Array<string>) {
		if (this.chart) {
			this.chart.destroy();
		}
		this.div.style.visibility = "visible";
		this.chart = new Chart(
			document.getElementById("chart1") as HTMLCanvasElement,
			{
				type: "line",
				data: {
					labels: _label,
					datasets: _datasets,
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							display: true,
							position: "right",
						},
					},
				},
			}
		);
	}

	/* backgroundColor: ['#1f77b4', '#ff9896', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728'], */
}
