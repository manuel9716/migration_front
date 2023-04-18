import { Component, ViewChild, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';

export interface TercerosData {
   idservicio: number;
   numeroservicio: number;
   nombres: string;
   apellidos: string;
   idtercero: number;
   numerotercero: number;
}
export interface Desplazamiento {
   iddesplazamiento: number;
   kilometros: string;
   tiempo: number;
   municipioinicio: Municipio;
   municipiofin: Municipio;
}

export interface Municipio {
   idmunicipio: number;
   nombre: string;
   iddepartamento: Iddepartamento;
}

export interface Iddepartamento {
   iddepartamento: number;
   nombre: string;
}



@Component({
   selector: 'validar-document-labores-dialog',
   templateUrl: './editar-deplazamiento-dialog.html',

})

export class EditarDeplazamientoDialog implements OnInit {

   user: object;
   loading: boolean = true;
   municipiosInicoSelected = 0;
   municipiosFinalSelected = 0;
   cargando = false;
   estadosDef = [];
   estadosDefPendientes = [];
   desplazamientos: Desplazamiento[] = [];
   municipiosDeInicio: Municipio[] = [];
   municipiosDeFinal: Municipio[] = [];

   constructor(
      public dialogRef: MatDialogRef<EditarDeplazamientoDialog>,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data
   ) {

   }

   ngOnInit() {
      this.user = this._vars.user.source['value'];

      this._api.getDesplazamientos({}, this.user['token']).subscribe(
         (deplazamiento) => {
            //Desplazamientos 
            this.desplazamientos = deplazamiento['data'];



            //obtencion de municipios de inicio y Municios finales
            this.desplazamientos.forEach(deplazamiento => {
               this.municipiosDeInicio.push(deplazamiento.municipioinicio);
               // this.municipiosDeFinal.push(deplazamiento.municipiofin);
            });

            //Eliminar Municipios de inico duplicados 
            this.municipiosDeInicio = this.municipiosDeInicio.filter((valorActual, indiceActual, arreglo) => {
               return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)) === indiceActual
            });
         }
      );
   }

   calcluarMunicipiosFinales(idMunicpioInicial: number) {
      this.cargando = true;
      this.municipiosDeFinal = [];
      this.municipiosFinalSelected = -1;
      this.desplazamientos.forEach(deplazamiento => {
         if (idMunicpioInicial == deplazamiento.municipioinicio.idmunicipio) {
            this.municipiosDeFinal.push(deplazamiento.municipiofin);
         }
      });

      //Eliminar Municipios de Finales duplicados 
      // this.municipiosDeFinal = this.municipiosDeFinal.filter((valorActual, indiceActual, arreglo) => {
      //    return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)) === indiceActual
      // });

      this.cargando = false;
   }


   selectEstado() {

      if (this.municipiosInicoSelected > 0 && this.municipiosFinalSelected > 0) {
         this.cargando = true;

         this.desplazamientos.forEach(despalzamiento => {
            if (despalzamiento.municipioinicio.idmunicipio == this.municipiosInicoSelected && despalzamiento.municipiofin.idmunicipio == this.municipiosFinalSelected) {
               this._api.editarDesplazamientosCuadrilla({ iddesplazamientocuadrilla: this.data['desplzamiento']['iddesplazamientocuadrilla']+"", 
               iddesplazamiento: despalzamiento.iddesplazamiento+"" }, this.user['token']).subscribe((result) => {
                  if (result['code'] == 200) {
                     this._snackBar.open(result['msg'], 'Cerrar', { duration: 3000 });
                     this.dialogRef.close({ code: 200, selec: this.municipiosInicoSelected });
                     this.cargando = false;
                  } else {
                     this._snackBar.open(result['msg'] + ' Error.', 'Cerrar', { duration: 3000 });
                     this.cargando = false;
                  }
                  this.cargando = false;
               });

            } 
         });
      }
   }

}
