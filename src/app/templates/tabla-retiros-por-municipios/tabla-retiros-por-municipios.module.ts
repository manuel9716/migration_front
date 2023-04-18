import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';


//Component 
import { TablaRetirosPorMunicipios } from './tabla-retiros-por-municipios';


//Material 
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    TablaRetirosPorMunicipios
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FlexModule,

    //Material
    MatDialogModule,
    MatButtonModule,
    MatTableModule
    
  ],
  exports: [
    TablaRetirosPorMunicipios
  ],
  entryComponents:[
    TablaRetirosPorMunicipios 
  ],
  
})
export class TablaRetirosPorMunicipiosModule { }
