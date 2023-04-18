import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modulos de matrial 
import { MaterialModude } from '../modules/material.module';

// Dialogs
import { SearchTopMenuDialog } from '../templates/search-topbar-dialog/search-topbar-dialog';
import { CreateEditDialog } from '../templates/create-edit-dialog/create-edit-dialog';
import { insertValueDialog } from '../templates/insert-value-dialog/insert-value-dialog';
import { ListAgendaCuadrillaDialog } from '../templates/list-agenda-cuadrilla-dialog/list-agenda-cuadrilla-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    SearchTopMenuDialog,
    CreateEditDialog,
    insertValueDialog,
    ListAgendaCuadrillaDialog,
  ],
  imports: [
    CommonModule,
    MaterialModude,
    ReactiveFormsModule,
    FormsModule,
    MatProgressBarModule,
    MatTooltipModule

  ],
  exports :[
    SearchTopMenuDialog,
    CreateEditDialog,
    insertValueDialog,
    ListAgendaCuadrillaDialog,

  ],
  entryComponents: [
    SearchTopMenuDialog,
    CreateEditDialog,
    insertValueDialog,
    ListAgendaCuadrillaDialog,

  ]
  

})
export class TemplatesModule { }
