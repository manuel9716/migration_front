import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from 'src/app/animations/custom.animation';
import { VarsService } from 'src/app/services/vars.service';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
   selector: 'app-create-edit',
   templateUrl: './create-edit-planes.component.html',
   styleUrls: ['./create-edit-planes.component.css'],
   animations: fuseAnimations
})
export class CreateEditPlanesComponent implements OnInit {

   form: FormGroup;
   user: object = this._vars.user.source['value'];
   error: string;
   loading: boolean = false;
   loader: boolean = false;
   currentIdPlan: number;
   geografias: object[] = this._vars.geografias;
   tiposPlanes: object[] = this._vars.tiposPlanes;
   tiposServicios: object[] = this._vars.tiposServicios;
   tipoTecnologias: object[] = [];

   constructor(
      private _formBuilder: FormBuilder,
      private _api: ApiService,
      private _vars: VarsService,
      private _snackBar: MatSnackBar,
      private _route: ActivatedRoute,
      private _router: Router
   ) {
      this.currentIdPlan = this._route.snapshot.params.id ? this._route.snapshot.params.id : null;

      if ((!this.currentIdPlan && !this.user['permisos']['planes']['crear']) || (this.currentIdPlan && !this.user['permisos']['planes']['editar'])) {
         this._router.navigate(['/']);
      }

   }

   ngOnInit() {

      this.form = this._formBuilder.group({
         estado: [null],
         nombre: [null, [Validators.required, Validators.maxLength(60)]],
         descripcion: [null, Validators.maxLength(200)],
         valorsiniva: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
         iva: [null, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern("^[0-9]*$")]],
         mesespermanencia: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
         idgeografia: [null, Validators.required],
         idtipoplan: [null, Validators.required],
         idtiposervicio: [null, Validators.required],
         idtencologiaplan: [null, Validators.required],
         valorinstalacionclausula: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
         valorinstalacionsinclausula: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
         velmaxdescargambps: [null, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],
         velmaxcargambps: [null, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],
         reuso: [null, Validators.pattern("^[0-9]*$")],
         priatencion: [null, [Validators.min(0), Validators.max(8), Validators.pattern("^[0-9]*$")]],
         priinstalacion: [null, [Validators.min(0), Validators.max(8), Validators.pattern("^[0-9]*$")]],
         prinavegacion: [null, [Validators.min(0), Validators.max(8), Validators.pattern("^[0-9]*$")]],
         ipv4publica: [false],
         ipv6publica: [false],
         aperturapuertos: [false],
         horarioatenctelefonico: [null, Validators.maxLength(50)],
         horarioatencsitio: [null, Validators.maxLength(50)],
      });

      this._api.getTecnologiasPlanes(this.user['token']).subscribe(response => {
         if (response['code'] == 200) {
            this.tipoTecnologias = response['data'];            
         } else {
            this._snackBar.open('Error al obtener las Tecnologias de los planes.', 'Cerrar', { duration: 3000 });
         }
      });


      if (this.currentIdPlan) {
         this.loader = true;
         this._api.getPlan(this.currentIdPlan, this.user['token']).subscribe(response => {
            if (response['code'] == 200) {
               
               this.form.patchValue(response['data']);

               this.form.controls.idtencologiaplan.setValue(response['data'].idtecnologiaplan.idtecnologiaplan);
               Object.keys(this.form.controls).forEach((key) => { this.form.get(key).markAsTouched(); });

               if (!this.user['permisos']['planes']['editar']) {
                  this.form.disable();
               }


               this.loader = false;
            } else {
               this._router.navigate(['/planes'])
            }
         });
      }
   }


   onSubmit() {
      this.error = '';

      if (this.form.valid) {

        
         if (this.currentIdPlan) {

            if (this.user['permisos']['planes']['editar']) {
               this.loading = true;
               this.form.addControl('idplan', this._formBuilder.control(this.currentIdPlan));
               this._api.editPlan(this.form.value, this.user['token']).subscribe(response => {
                  if (response['code'] == 200) {
                     this._snackBar.open('Plan editado', 'Cerrar', { duration: 3000 });
                     this._router.navigate(['/planes'])
                  } else {
                     this.error = response['msg'];
                  }
                  this.loading = false;
               });
            } else {
               this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
            }

         } else {

            if (this.user['permisos']['planes']['crear']) {
               this.loading = true;
               this._api.createPlan(this.form.value, this.user['token']).subscribe(response => {
                  if (response['code'] == 200) {
                     this._snackBar.open('Plan creado', 'Cerrar', { duration: 3000 });
                     this._router.navigate(['/planes'])
                  } else {
                     this.error = response['msg'];
                  }
                  this.loading = false;
               });
            } else {
               this._snackBar.open('No tienes permiso para ejecutar esta acción.', 'Cerrar', { duration: 3000 });
            }

         }
      } else {
         this.error = "Error al enviar el formulario";
      }
   }

}
