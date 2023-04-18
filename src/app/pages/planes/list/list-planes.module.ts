import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { Route, RouterModule } from '@angular/router';
import { ListPlanesComponent } from './list-planes.component'

//Models 
import { FormsModule } from '@angular/forms';

//Dialog
import { ConfirmDialogModule } from 'src/app/templates/confirm-dialog/confirm-dialog.module';

//Material
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';




const RutesModule: Route[] = [
    { path: '', component: ListPlanesComponent }
];

@NgModule({
    declarations: [
        ListPlanesComponent,

    ],
    imports     : [
        //AdditionalModude
        RouterModule.forChild(RutesModule),
        CommonModule,
        FormsModule,
        FlexModule,
        FlexLayoutModule,
        
        
        // MaterialModude +,
        MatInputModule,
        MatSelectModule,
        MatToolbarModule, 
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatButtonModule,
        
        //Tempate
        ConfirmDialogModule,
        
    ],
    entryComponents: [
    
    ],

})

export class ListPlanesModule
{
}
