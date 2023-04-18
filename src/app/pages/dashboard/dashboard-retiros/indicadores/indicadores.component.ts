import { Component, OnInit, Input} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css']
})

export class IndicadoresComponent implements OnInit {
  @Input() flitroFechas=[];

  constructor(private _api: ApiService,private _vars: VarsService,) { }
  user = this._vars.user.source['value'];

  ngOnInit(): void {
  Object.assign(this.flitroFechas);
  }
  cargando= false;
  viewBanerPq: any[] = [600];
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5', '#8c61a8', '#C7B42C',
      '#AAAAAA', '#f18900', '#f7b467', '#5f1800', '#52442b', '#c494a4', '#3e5055', '#ceddcd', '#dd1abd', '#ec8ef5']
  };
  cardColor: string = '#1e2129';
  innerPaddingDataGraf= 1;
  onSelect(data): void {
  }
  // --- xah--- 
  estadisticasGeneralesTiempos = false;
  datosGraficasEstadisticas= this.flitroFechas;

  //Grafico de barras
  // gradientPie: boolean = true;
  // showLegendPie: boolean = true;
  // showLabelsPie: boolean = true;
  // isDoughnutPie: boolean = false;
  legendPositionPie: string = 'right';
  // legendTitlePie = '';


    // --- Graf-Bar Single ---
  // options
  viewSTNPq: any[] = [400];
  showXAxisBarS = true;
  showYAxisBarS = true;
  gradientBarS = false;
  showLegendBarS = false;
  showXAxisLabelBarS = false;
  xAxisLabelBarS = '';
  showYAxisLabelBarS = true;
  yAxisLabelBarS = '# de Días';
  legendTitleBarS= '';
  schemeType= 'linear';
}
