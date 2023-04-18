import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Componentes 
import { ListMunicipiosComponent } from './list/list-municipios.component';
import { EditMunicipioComponent } from './edit/default/edit-municipio.component';
import { BarriosComponent } from './edit/barrios/barrios.component';
import { PlanesMunicipioComponent } from './edit/planes/planes-municipio.component';

//Modulos Comunes 
import { SelectPlanDialogModule } from 'src/app/templates/select-plan-dialog/select-plan-dialog.module';


// Material 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';


const RutesModule: Route[] = [
	{ path: '', component: ListMunicipiosComponent },
	{ path: ':idmunicipio', component: EditMunicipioComponent },
];

@NgModule({
	declarations: [
		ListMunicipiosComponent, 
		EditMunicipioComponent,
		BarriosComponent, 
		PlanesMunicipioComponent
	],
	imports: [ 
		
		//AdditionalModels 
		CommonModule,
		RouterModule.forChild(RutesModule),
		ReactiveFormsModule,
		FormsModule,
		FlexModule,
		FlexLayoutModule,
		
		//MaterialModels
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
		MatSnackBarModule,
		MatSortModule,
		MatButtonModule,
		MatTabsModule,
		
		
		//template  
		SelectPlanDialogModule,
		
		
	],
	entryComponents:[
		
	]
})
export class ListMunicipiosModule { }
