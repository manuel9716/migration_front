import { NgModule } from '@angular/core'

//Dependencies
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
   
// Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';

//Paquetes adicionales 
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
imports: [
    FlexLayoutModule,
    FormsModule,
    MatToolbarModule, 
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule,

    //Inicial Modules 
    MatInputModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
 ],
 exports: [
    FlexLayoutModule,
    FormsModule,
    MatToolbarModule, 
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule,

   //  Inicial Modules
    MatInputModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
 ]

})
export class 
SharedModulsModule {}