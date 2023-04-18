import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';


//Component 
import { ConfirmsDialog } from './confirm-dialog';


//Material 
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    ConfirmsDialog
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FlexModule,

    //Material
    MatDialogModule,
    MatButtonModule,
    
  ],
  exports: [
    ConfirmsDialog
  ],
  entryComponents:[
    ConfirmsDialog 
  ],
  
})
export class ConfirmDialogModule { }
