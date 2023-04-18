import { Component, ViewChild, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ApiService } from 'src/app/services/api.service';
import { VarsService } from 'src/app/services/vars.service';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DireccionesData {
   iddireccion: number;
   descripcion: string;
   barrio: string;
   municipio: string;
   departamento: string;
   whatsapp: string;
   llamada: string;
   celular1: string;
   email1: string;
   estrato: number;
}


@Component({
   selector: 'select-direccion-dialog',
   templateUrl: './select-direccion-dialog.html',
   animations: fuseAnimations
})
export class SelectDireccionDialog implements OnInit {

   user: object;
   loading: boolean;
   creating: boolean;
   creatingDireccion: boolean;
   tercero: object[];

   departamentos: object[];
   municipios: object[];
   municipiosSelect = [];
   barrios: object[];
   barriosSelect = [];

   displayedColumns: string[] = ['descripcion', 'barrio', 'municipio', 'departamento', 'whatsapp','llamada', 'celular1', 'email1', 'estrato', 'actions'];

   dataSource: MatTableDataSource<DireccionesData>;

   newDireccionForm: FormGroup;


   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
   @ViewChild(MatSort, { static: true }) sort: MatSort;

   constructor(
      public dialogRef: MatDialogRef<SelectDireccionDialog>,
      @Inject(MAT_DIALOG_DATA) public data,
      private _snackBar: MatSnackBar,
      private _formBuilder: FormBuilder,
      private _api: ApiService,
      private _vars: VarsService,
   ) { }

   ngOnInit() {

      this.user = this._vars.user.source['value'];
      this.getDirecciones();

      this.newDireccionForm = this._formBuilder.group({
         descripcion: ['', [Validators.required, Validators.maxLength(120)]],
         email1: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
         email2: ['', [Validators.email, Validators.maxLength(50)]],
         whatsapp: ['', Validators.maxLength(20)],
         llamada: ['', Validators.maxLength(10)],
         celular1: ['', [Validators.required, Validators.maxLength(10)]],
         celular2: ['', Validators.maxLength(10)],
         estrato: ['', Validators.required],
         departamento: ['', Validators.required],
         idmunicipio: ['', Validators.required],
         idbarrio: ['', []]
      });

      this.newDireccionForm.controls.idmunicipio.disable();
      this.newDireccionForm.controls.idbarrio.disable();

      this._api.getDirEntities(this.user['token']).subscribe(response => {
         if (response["code"] == 200) {
            this.departamentos = response['departamentos'];
            this.municipios = response['municipios'];
            this.barrios = response['barrios'];
         } else {
            this.dialogRef.close();
            this._snackBar.open("Error al obtener direcciones de tercero", 'Cerrar', { duration: 3000 });
         }
         this.loading = false;
      });
   }

   changeControl(control, ev) {

      if (control == 'departamento') {
         this.newDireccionForm.controls.idbarrio.disable();

         this.newDireccionForm.controls.idmunicipio.setValue(null);
         this.newDireccionForm.controls.idbarrio.setValue(null);

         this.municipiosSelect = [];
         this.municipios.forEach(m => {
            if (m['iddepartamento'] == ev.value) { this.municipiosSelect.push(m); }
         });

         this.newDireccionForm.controls.idmunicipio.enable();
      }

      if (control == 'municipio') {
         this.newDireccionForm.controls.idbarrio.setValue(null);

         this.barriosSelect = [];
         this.barrios.forEach(b => {
            if (b['idmunicipio'] == ev.value) { this.barriosSelect.push(b); }
         });

         this.newDireccionForm.controls.idbarrio.enable();
      }

   }

   applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
   }

   getDirecciones() {
      this.loading = true;
      this._api.getDireccionesTercero(this.data['tercero']['idtercero'], this.user['token']).subscribe(response => {
         if (response["code"] == 200) {
            this.dataSource = new MatTableDataSource(response["data"]);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
         } else {
            this.dialogRef.close();
            this._snackBar.open("Error al obtener direcciones de tercero", 'Cerrar', { duration: 3000 });
         }
         this.loading = false;
      });
   }

   createDireccion() {
      if (this.newDireccionForm.valid) {

         let json = JSON.parse(JSON.stringify(this.newDireccionForm.value));
         json['idtercero'] = this.data['tercero']['idtercero'];

         this.creating = true;

         this._api.createDireccion(json, this.user['token']).subscribe(response => {

            if (response["code"] == 200) {
               this.getDirecciones();
               this.newDireccionForm.reset();
               this._snackBar.open("Dirección creada", 'Cerrar', { duration: 3000 });
            } else {
               this._snackBar.open("No se pudo crear la dirección", 'Cerrar', { duration: 3000 });
            }
            this.creatingDireccion = false;
            this.creating = false;
         });
      }
   }

   selectDireccion(direccion) {
      this.dialogRef.close(direccion);
   }

}
