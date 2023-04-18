import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Route, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule, FlexModule } from "@angular/flex-layout";

//Component
import { InformesComponent } from "src/app/pages/informes/home/informes.component";
import { CsvDialogComponent } from "./shared/csv-dialog/csv-dialog.component";

//Material
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
	MatSnackBarModule,
	MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from "@angular/material/snack-bar";

const RutesModule: Route[] = [{ path: "", component: InformesComponent }];

@NgModule({
	declarations: [InformesComponent, CsvDialogComponent],
	imports: [
		//AdditionalModels
		CommonModule,
		RouterModule.forChild(RutesModule),
		FlexLayoutModule,
		FlexModule,
		FormsModule,
		ReactiveFormsModule,

		//MaterialModels
		MatToolbarModule,
		MatCardModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatSnackBarModule,
	],
	providers: [
		{
			provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
			useValue: { duration: 2000, panelClass : "snackBarClass" },
		},
	],
})
export class InformesModule {}
