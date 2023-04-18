import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { TablaRetirosPorMunicipios } from 'src/app/templates/tabla-retiros-por-municipios/tabla-retiros-por-municipios';

@Component({
  selector: 'app-municipios-vs-retiros',
  templateUrl: './municipios-vs-retiros.component.html',
  styleUrls: ['./municipios-vs-retiros.component.css'],
  animations: fuseAnimations
})

export class MunicipiosVsRetirosComponent implements OnInit {
  user = this._vars.user.source['value'];
  formConsulta = this._fb.group(
    {
      tipoBusquedaForm: ['',],
      cargaMunicipios: [''],
      varibleTablaRetirosVSMunicipios: [''],

    }
  )
  cargando = false;
  dataPie;
  municipiosselect=[];
  itemsvsVariable;
  cuentaMunicipiosVsVariable;
  estadosRetiros = [];
  motivosRetiros = [];
  filtrosPor = [
    { value: 5, descripcion: 'Motivo Retiro' },
    { value: 6, descripcion: 'Estado Retiro' },
  ];
  constructor(private _fb: FormBuilder, private _api: ApiService, private _vars: VarsService, public _dialog: MatDialog,) {

  }
	getEstadosyMotivosRetiros(){
		this._api.getEstadosRetiro(this.user['token']).subscribe(response=> this.estadosRetiros=response['data'])
		this._api.getMotivosRetiro(this.user['token']).subscribe(response=> this.motivosRetiros=response['data'])
	}
  ngOnInit(): void {
    this.getEstadosyMotivosRetiros();
    this.formConsulta.controls.tipoBusquedaForm.setValue(5);
    this.municipiosporMotivoRetiroYEstadoderetiro({ "data": "idmotivo" });
  }


  municipiosporMotivoRetiroYEstadoderetiro(req) {
    this.cargando = true;
    this.dataPie = [];
    this._api.getFiltroMunicipiosRetirosDashboard(this.user["token"], req).subscribe((respont) => {
      var responData = respont["data"];
      this.municipiosselect = [];
      var nombresPropiedades = Object.getOwnPropertyNames(responData);
      for (let i = 0; i < nombresPropiedades.length; i++) {
        const nombreMunicipio = nombresPropiedades[i];
        var item = {
          nombre: nombreMunicipio,
          nIndex: i
        }
        this.municipiosselect.push(item)
      }

      this.itemsvsVariable = Object.values(responData);
      this.formConsulta.controls.cargaMunicipios.setValue(0);
      this.selectMunicipioRetiro();
      this.cargando = false;
    });


  }

  selectMunicipioRetiro() {
    if ((this.formConsulta.controls.cargaMunicipios.value != "" || this.formConsulta.controls.cargaMunicipios.value == 0) && this.formConsulta.controls.tipoBusquedaForm.value == 5) {

      var indexData = Number.parseInt(this.formConsulta.controls.cargaMunicipios.value);
      var objeto: {} = this.itemsvsVariable[indexData];
      var finalData = [];
      var item: {};

      //Procesamiento de datos
      var cantidades: number[] = Object.values(objeto);
      var ids: any[] = Object.getOwnPropertyNames(objeto);
      this.cuentaMunicipiosVsVariable = 0;
      for (let i = 0; i < cantidades.length; i++) {
        item = {
          name: this.motivosRetiros[ids[i] - 1].nombre,
          value: cantidades[i],
        }
        this.cuentaMunicipiosVsVariable = this.cuentaMunicipiosVsVariable + cantidades[i];

        finalData.push(item)
      }
      this.dataPie = finalData;

    }
    if ((this.formConsulta.controls.cargaMunicipios.value != "" || this.formConsulta.controls.cargaMunicipios.value == 0) && this.formConsulta.controls.tipoBusquedaForm.value == 6) {

      var indexData = Number.parseInt(this.formConsulta.controls.cargaMunicipios.value);
      var objeto: {} = this.itemsvsVariable[indexData];
      var finalData = [];
      var item: {};

      //Procesamiento de datos
      var cantidades: number[] = Object.values(objeto);
      var ids: any[] = Object.getOwnPropertyNames(objeto);
      this.cuentaMunicipiosVsVariable = 0;
      for (let i = 0; i < cantidades.length; i++) {
        item = {
          name: this.estadosRetiros[ids[i] - 1].nombre,
          value: cantidades[i],
        }
        this.cuentaMunicipiosVsVariable = this.cuentaMunicipiosVsVariable + cantidades[i];
        finalData.push(item)
      }
      this.dataPie = finalData;
    }

  }
  visualizarTablaRetirosVsMunicipios() {
    var variables = new Set();
    var data = [];
    for (let i = 0; i < this.itemsvsVariable.length; i++) {
      var elem =

      {
        id: i,
        nMunicipio: this.municipiosselect[i].nombre,
        values: [],
      }

      var itemsValues = Object.values(this.itemsvsVariable[i])
      var idsDeValues: any = Object.getOwnPropertyNames(this.itemsvsVariable[i])


      for (let j = 0; j < itemsValues.length; j++) {
        variables.add(idsDeValues[j] - 1);
        const itemValue = {
          id: idsDeValues[j],
          value: itemsValues[j]
        };
        elem.values.push(itemValue);
      }
      data.push(elem)
    }
    data.push(variables);
    this.formConsulta.controls.tipoBusquedaForm.value == 5 ? data.push('Motivo') : this.formConsulta.controls.tipoBusquedaForm.value == 6 ? data.push('Estado') : null;
    // data.pop();


    const dialogRef = this._dialog.open(TablaRetirosPorMunicipios, {

      width: '90%',
      data: data,
      // data2: this.municipiosselect,
    });
  }
  graficar() {

    //Municipios vs Motivo retiro
    if (this.formConsulta.controls.tipoBusquedaForm.value == 5) {
      this.municipiosporMotivoRetiroYEstadoderetiro({ "data": "idmotivo" });

    }
    if (this.formConsulta.controls.tipoBusquedaForm.value == 6) {
      this.municipiosporMotivoRetiroYEstadoderetiro({ "data": "idestado" });
    }

  }
}
