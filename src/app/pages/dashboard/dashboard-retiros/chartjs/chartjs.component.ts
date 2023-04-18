import { Component, OnInit } from "@angular/core";

import {Chart, ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle}  from "chart.js";
Chart.register(ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle);
// import 'chartjs-adapter-moment';

@Component({
	selector: "app-chartjs",
	templateUrl: "./chartjs.component.html",
	styleUrls: ["./chartjs.component.css"],
})
export class ChartjsComponent implements OnInit {

	chart: any;
    isBar: boolean = true;

	constructor() {}

	ngOnInit(): void {
		this.graph();
	}

	graph() {

        // Reset canvas
		if (this.chart) {
			this.chart.destroy();
		}

		this.chart = new Chart(document.getElementById("chart1") as HTMLCanvasElement,{
				type: (this.isBar ? 'bar' : 'pie'),
				data: {
					labels: ["Python", "Java", "Javascript", "C#", "Php", "C++", "Ruby"],
					datasets: [
						{
							label: "Lenguajes de programacion mas usados.",
							data: [ 2595, 2142, 826, 762, 737, 631, 153],
                            backgroundColor: ['#1f77b4', '#ff9896', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728'],
							borderWidth: 1,
						},
					],
				},
				options: {
					responsive: true,
				},
			}
		);
	}
}
