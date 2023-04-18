import { Component, OnInit, Input  } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { fuseAnimations } from 'src/app/animations/custom.animation';

import { VarsService } from 'src/app/services/vars.service';

@Component({
  selector: 'app-graficas-retiro',
  templateUrl: './graficas-retiro.component.html',
  styleUrls: ['./graficas-retiro.component.css'],
  animations: fuseAnimations
})
export class GraficasRetiroComponent implements OnInit {



  @Input() datosFiltrados =[];
  @Input() cont;
  @Input() variable;

  //Carga component 



  //Data Procesada Para Graficos 
  dataPie: any[] = [

    {
      "name": "N/A",
      "value": 0
    },
  ];
   //Data Procesada Para Graficos 
  

//Tamano GRaficos 
  viewSTN: any[] = [950, 700];
  viewBaner: any[] = [900, 650];

  //Tamano GRaficos 
  viewSTNPq: any[] = [500, 500];
  viewBanerPq: any[] = [600, 600];
  //----- Load GaficBarHori-------//

  //----Color Theme-----  
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5', '#8c61a8', '#C7B42C',
      '#AAAAAA', '#f18900', '#f7b467', '#5f1800', '#52442b', '#c494a4', '#3e5055', '#ceddcd', '#dd1abd', '#ec8ef5']
  };


  //----- Load Pie Grid Chart-------//

  cardColor: string = '#1e2129';
  //----Load Pie ----//
  // options
  gradientPie: boolean = true;
  showLegendPie: boolean = true;
  showLabelsPie: boolean = true;
  isDoughnutPie: boolean = false;
  legendPositionPie: string = 'right';
  legendTitlePie = '';


  // --- Graf-Bar Single ---
  // options
  showXAxisBarS = true;
  showYAxisBarS = true;
  gradientBarS = false;
  showLegendBarS = false;
  showXAxisLabelBarS = false;
  xAxisLabelBarS = '';
  showYAxisLabelBarS = true;
  yAxisLabelBarS = '# de Retiros';
  legendTitleBarS= '';

  constructor(
    private _vars: VarsService,
    private _fb: FormBuilder,
    public _dialog: MatDialog,

  ) {
  
  }

  onSelect(data): void {
  }

  onActivate(data): void {
  }

  onDeactivate(data): void {
  }

  ngOnInit(): void {
    // this.obtenerDatosBasicos();

    //Object.assign(this.datosFiltrados) ;
    if(this.datosFiltrados){
      Object.assign(this.datosFiltrados);
    }else{
      Object.assign(this.dataPie);
      
    }

    
    // this.data=this.datosFiltrados
    
    
  }

 


  




  
  

}
