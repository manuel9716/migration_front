import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes 
import { CreateEditPlanesComponent } from './create-edit-planes.component';



//Modulos Comunes 
import { ReactiveFormsModule } from '@angular/forms';

// Material 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';




const RutesModule: Route[] = [
  { path: '', component: CreateEditPlanesComponent }
];

@NgModule({
  declarations: [CreateEditPlanesComponent],
  imports: [ 
    
    //AdditionalModels 
    CommonModule,
    RouterModule.forChild(RutesModule),
    ReactiveFormsModule,
    FlexModule,
    FlexLayoutModule,
    

    //MaterialModels
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatToolbarModule, 
    MatCardModule,
    MatIconModule,
    MatProgressBarModule, 
    MatButtonModule, 
   
  ],
  entryComponents:[

  ]
})
export class CreateEditPlanesModule { }
