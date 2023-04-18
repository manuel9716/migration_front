import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

@Component({
   selector: 'dialog-overview-example-dialog',
   templateUrl: './tabla-retiros-por-municipios.html',
})
export class TablaRetirosPorMunicipios {
   //displayedColumns= ['id', 'nMunicipio', 'values'];
   user: object = this._vars.user.source['value']
   // estadosRetiros = this._vars.estadosRetiros;
   // motivosRetiros = this._vars.motivosRetiros;
   estadosRetiros ;
   motivosRetiros ;
   variableAnalisis;
   displayedColumns = [];
   variables = [];
   dataSourceR: {
      id: number,
      nMunicipio: string,
      values: [
         {
            id: number,
            value: number
         }
      ],
   }[] = [];
   constructor(
      private _vars: VarsService,
      public dialogRef: MatDialogRef<TablaRetirosPorMunicipios>,
      @Inject(MAT_DIALOG_DATA) public data,
      private _api: ApiService
      ) {
      this. getEstadosyMotivosRetiros();
      this.variableAnalisis = data.pop();
      var set: Set<string> = data.pop();

      set.forEach(variable => {
         this.variables.push(variable)
      });
      this.displayedColumns.unshift(' ')
      this.dataSourceR = data;
      data.forEach(e => {
         this.displayedColumns.push(e.nMunicipio)
      });
   }
   getEstadosyMotivosRetiros() {
      this._api.getEstadosRetiro(this.user['token']).subscribe(response => this.estadosRetiros = response['data'])
      this._api.getMotivosRetiro(this.user['token']).subscribe(response => this.motivosRetiros = response['data'])
   }
   
   obtenervalue(i, elementID) {
      var data;
      this.dataSourceR[i].values.forEach(element => {
         if (element.id == elementID + 1) {
            data = element.value
         }
      });
      if (data) {
         return data
      }
      return '-'
   }


   cancel(): void {
      this.dialogRef.close();
   }

}